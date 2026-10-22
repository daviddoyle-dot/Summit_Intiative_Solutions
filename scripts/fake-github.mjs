// A tiny stand-in for the parts of the GitHub API that the blog editor uses, so publishing
// can be tested end to end without touching the real repository.
//
//   node scripts/fake-github.mjs            (listens on port 4010)
//
// Then run the site with:
//   GITHUB_API_URL=http://localhost:4010 BLOG_GITHUB_TOKEN=test-token \
//   BLOG_GITHUB_REPO=test/site BLOG_GITHUB_BRANCH=main npm run dev
//
// It starts out holding a copy of content/posts. Test helpers:
//   GET  /__state          what the "repository" currently holds
//   GET  /__file?path=...  the raw bytes of one file
//   POST /__race           make the next publish hit a "someone else pushed" conflict, once
import http from "node:http";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const PORT = Number(process.env.PORT ?? 4010);
const TOKEN = "test-token";
const sha1 = (...parts) => crypto.createHash("sha1").update(Buffer.concat(parts.map((p) => Buffer.from(p)))).digest("hex");
const blobSha = (data) => sha1(`blob ${data.length}\0`, data);

const blobs = new Map(); // sha -> Buffer
const trees = new Map(); // sha -> Map(path -> blobSha)
const commits = new Map(); // sha -> { tree, parents, message }
let head;
let raceNext = false;
let commitCount = 0;

function putBlob(data) {
  const sha = blobSha(data);
  blobs.set(sha, data);
  return sha;
}

function makeTree(files) {
  const sha = sha1(JSON.stringify([...files].sort()));
  trees.set(sha, files);
  return sha;
}

function makeCommit(tree, parents, message) {
  const sha = sha1(JSON.stringify({ tree, parents, message, n: ++commitCount }));
  commits.set(sha, { tree, parents, message });
  return sha;
}

// Seed with the repository's current posts.
{
  const files = new Map();
  const dir = path.join(process.cwd(), "content", "posts");
  for (const name of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
    files.set(`content/posts/${name}`, putBlob(fs.readFileSync(path.join(dir, name))));
  }
  head = makeCommit(makeTree(files), [], "seed");
}

const currentFiles = () => trees.get(commits.get(head).tree);

function send(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const route = url.pathname;

  // Test helpers (no auth).
  if (route === "/__state") {
    return send(res, 200, {
      head,
      commits: commits.size,
      files: [...currentFiles()].map(([p, sha]) => ({ path: p, sha, size: blobs.get(sha).length })),
    });
  }
  if (route === "/__file") {
    const sha = currentFiles().get(url.searchParams.get("path"));
    if (!sha) return send(res, 404, { message: "Not Found" });
    res.writeHead(200);
    return res.end(blobs.get(sha));
  }
  if (route === "/__race" && req.method === "POST") {
    raceNext = true;
    return send(res, 200, { ok: true });
  }

  if (req.headers.authorization !== `Bearer ${TOKEN}`) {
    return send(res, 401, { message: "Bad credentials" });
  }

  const m = route.match(/^\/repos\/[^/]+\/[^/]+\/(.*)$/);
  if (!m) return send(res, 404, { message: "Not Found" });
  const rest = m[1];

  try {
    // ---- Contents API ---------------------------------------------------------------------
    if (rest.startsWith("contents/")) {
      const filePath = decodeURIComponent(rest.slice("contents/".length));
      const files = currentFiles();

      if (req.method === "GET") {
        const sha = files.get(filePath);
        if (sha) {
          const data = blobs.get(sha);
          return send(res, 200, {
            name: path.basename(filePath), path: filePath, sha, size: data.length, type: "file",
            encoding: "base64", content: data.toString("base64").replace(/(.{60})/g, "$1\n"),
          });
        }
        const children = [...files].filter(([p]) => p.startsWith(filePath + "/") && !p.slice(filePath.length + 1).includes("/"));
        if (children.length === 0) return send(res, 404, { message: "Not Found" });
        return send(res, 200, children.map(([p, s]) => ({ name: path.basename(p), path: p, sha: s, type: "file" })));
      }

      if (req.method === "DELETE") {
        const body = await readJson(req);
        const sha = files.get(filePath);
        if (!sha) return send(res, 404, { message: "Not Found" });
        if (body.sha !== sha) return send(res, 409, { message: "sha does not match" });
        const next = new Map(files);
        next.delete(filePath);
        head = makeCommit(makeTree(next), [head], body.message);
        return send(res, 200, { commit: { sha: head } });
      }
    }

    // ---- Git data API ---------------------------------------------------------------------
    if (rest.startsWith("git/ref/heads/") && req.method === "GET") {
      return send(res, 200, { ref: "refs/heads/main", object: { sha: head, type: "commit" } });
    }
    if (rest.startsWith("git/commits/") && req.method === "GET") {
      const commit = commits.get(rest.slice("git/commits/".length));
      if (!commit) return send(res, 404, { message: "Not Found" });
      return send(res, 200, { sha: rest.slice("git/commits/".length), tree: { sha: commit.tree } });
    }
    if (rest === "git/blobs" && req.method === "POST") {
      const body = await readJson(req);
      const data = body.encoding === "base64" ? Buffer.from(body.content, "base64") : Buffer.from(body.content);
      return send(res, 201, { sha: putBlob(data) });
    }
    if (rest === "git/trees" && req.method === "POST") {
      const body = await readJson(req);
      const base = trees.get(body.base_tree);
      if (!base) return send(res, 422, { message: "base_tree not found" });
      const next = new Map(base);
      for (const entry of body.tree) {
        if (entry.sha === null) next.delete(entry.path);
        else if (typeof entry.content === "string") next.set(entry.path, putBlob(Buffer.from(entry.content)));
        else if (blobs.has(entry.sha)) next.set(entry.path, entry.sha);
        else return send(res, 422, { message: `blob ${entry.sha} not found` });
      }
      return send(res, 201, { sha: makeTree(next) });
    }
    if (rest === "git/commits" && req.method === "POST") {
      const body = await readJson(req);
      return send(res, 201, { sha: makeCommit(body.tree, body.parents, body.message) });
    }
    if (rest.startsWith("git/refs/heads/") && req.method === "PATCH") {
      const body = await readJson(req);
      if (raceNext) {
        raceNext = false;
        head = makeCommit(commits.get(head).tree, [head], "someone else pushed"); // moves the branch
        return send(res, 422, { message: "Update is not a fast forward" });
      }
      if (commits.get(body.sha)?.parents[0] !== head) {
        return send(res, 422, { message: "Update is not a fast forward" });
      }
      head = body.sha;
      return send(res, 200, { ref: "refs/heads/main", object: { sha: head } });
    }

    return send(res, 404, { message: "Not Found" });
  } catch (error) {
    console.error(error);
    return send(res, 500, { message: String(error) });
  }
});

server.listen(PORT, () => console.log(`fake GitHub listening on http://localhost:${PORT}`));
