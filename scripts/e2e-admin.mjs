// End-to-end check of the blog editor's server side. Starts a fake GitHub and the site,
// then exercises sign-in, publishing, images, conflicts, and the security rules.
//
//   node scripts/e2e-admin.mjs
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const SITE = "http://localhost:3300";
const GH = "http://localhost:4010";
const PASSWORD = "correct-horse-battery-staple-9";
const env = {
  ...process.env,
  ADMIN_PASSWORD: PASSWORD,
  ADMIN_SESSION_SECRET: "0123456789abcdef0123456789abcdef",
  GITHUB_API_URL: GH,
  BLOG_GITHUB_TOKEN: "test-token",
  BLOG_GITHUB_REPO: "test/site",
  BLOG_GITHUB_BRANCH: "main",
};

const children = [];
const start = (cmd, args, extraEnv = {}) => {
  const child = spawn(cmd, args, { env: { ...env, ...extraEnv }, stdio: ["ignore", "pipe", "pipe"] });
  child.output = "";
  child.stdout.on("data", (d) => (child.output += d));
  child.stderr.on("data", (d) => (child.output += d));
  children.push(child);
  return child;
};
const stopAll = () => children.forEach((c) => c.kill("SIGTERM"));
process.on("exit", stopAll);

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || !detail ? "" : `\n      -> ${detail}`}`);
};

async function waitFor(url, label) {
  for (let i = 0; i < 90; i++) {
    try {
      if ((await fetch(url)).status < 500) return;
    } catch {
      /* not up yet */
    }
    await sleep(1000);
  }
  throw new Error(`${label} did not start`);
}

// ---- helpers ------------------------------------------------------------------------------

let cookie = "";
const api = async (path, { method = "GET", json, form, origin = SITE, withCookie = true, headers = {} } = {}) => {
  const init = { method, headers: { ...headers }, redirect: "manual" };
  if (origin) init.headers.Origin = origin;
  if (withCookie && cookie) init.headers.Cookie = cookie;
  if (json !== undefined) {
    init.headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(json);
  }
  if (form) init.body = form;
  const response = await fetch(`${SITE}${path}`, init);
  const text = await response.text();
  let body = null;
  try {
    body = JSON.parse(text);
  } catch {
    /* not JSON */
  }
  return { status: response.status, body, headers: response.headers, text };
};

const ghState = async () => (await fetch(`${GH}/__state`)).json();
const ghFile = async (p) => {
  const r = await fetch(`${GH}/__file?path=${encodeURIComponent(p)}`);
  return r.ok ? Buffer.from(await r.arrayBuffer()) : null;
};

const post = (over = {}) => ({
  title: "Why Goals Fail",
  slug: "why-goals-fail",
  date: "2026-10-22",
  summary: "A short summary of the post.",
  linkedinUrl: "https://www.linkedin.com/posts/example-123",
  linkedinOnly: false,
  body: "First paragraph.\n\n## A heading\n\nSecond paragraph with **bold**.",
  ...over,
});

const publishForm = (fields, { mode = "create", sha = "", images = {} } = {}) => {
  const form = new FormData();
  form.set("post", JSON.stringify(fields));
  form.set("mode", mode);
  form.set("sha", sha);
  for (const [id, bytes] of Object.entries(images)) form.set(`image:${id}`, new Blob([bytes]), `${id}.bin`);
  return form;
};

// A real 1x1 PNG.
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64"
);

// ---- the run ------------------------------------------------------------------------------

try {
  start("node", ["scripts/fake-github.mjs"]);
  start("npx", ["next", "dev", "-p", "3300"]);
  await waitFor(`${GH}/__state`, "fake GitHub");
  await waitFor(`${SITE}/blog`, "site");
  console.log("\n-- Signed out --");

  let r = await api("/api/admin/posts", { withCookie: false });
  check("listing posts requires sign-in (401)", r.status === 401, r.status);
  r = await api("/api/admin/publish", { method: "POST", withCookie: false, form: publishForm(post()) });
  check("publishing requires sign-in (401)", r.status === 401, r.status);
  r = await api("/api/admin/publish", { method: "POST", origin: null, form: publishForm(post()) });
  check("a request with no Origin is blocked (403)", r.status === 403, r.status);
  r = await api("/api/admin/publish", { method: "POST", origin: "https://evil.example", form: publishForm(post()) });
  check("a request from another site is blocked (403)", r.status === 403, r.status);

  console.log("\n-- Signing in --");
  r = await api("/api/admin/login", { method: "POST", json: { password: "nope" } });
  check("wrong password is refused (401) with a friendly message", r.status === 401 && /isn't right/.test(r.body?.error ?? ""), JSON.stringify(r.body));
  r = await api("/api/admin/login", { method: "POST", origin: null, json: { password: PASSWORD } });
  check("sign-in from outside the site is blocked (403)", r.status === 403, r.status);
  r = await api("/api/admin/login", { method: "POST", json: { password: PASSWORD } });
  check("right password signs in (200)", r.status === 200 && r.body?.ok, JSON.stringify(r.body));
  const setCookie = r.headers.get("set-cookie") ?? "";
  check("session cookie is HttpOnly and SameSite=Strict", /HttpOnly/i.test(setCookie) && /SameSite=strict/i.test(setCookie), setCookie);
  cookie = setCookie.split(";")[0];

  console.log("\n-- Reading posts --");
  r = await api("/api/admin/posts");
  check("lists the existing four posts, newest first", r.status === 200 && r.body.posts.length === 4 && r.body.posts[0].slug === "the-jelly-belly-dispenser", JSON.stringify(r.body?.posts?.map((p) => p.slug)));
  r = await api("/api/admin/posts/two-numbers-on-a-dry-erase-board");
  check("opens one post with its text and version", r.status === 200 && r.body.post.title === "Two Numbers on a Dry-Erase Board" && r.body.sha && r.body.post.body.startsWith("My battalion"), JSON.stringify(r.body)?.slice(0, 200));
  r = await api("/api/admin/posts/..%2Fsecret");
  check("a path-traversal address is rejected (404)", r.status === 404, r.status);
  r = await api("/api/admin/posts/does-not-exist");
  check("a missing post is a clean 404", r.status === 404, r.status);

  console.log("\n-- Publishing --");
  let before = (await ghState()).commits;
  r = await api("/api/admin/publish", { method: "POST", form: publishForm(post()) });
  check("publishes a new post (200) and returns its public link", r.status === 200 && r.body.url === "https://summitinitiativesolutions.com/blog/why-goals-fail" && r.body.created, JSON.stringify(r.body));
  let file = await ghFile("content/posts/why-goals-fail.md");
  check("the post file landed in the repository with the right content", file && /title: "Why Goals Fail"/.test(file.toString()) && /\*\*bold\*\*/.test(file.toString()), file?.toString());
  check("it was a single commit", (await ghState()).commits === before + 1);

  r = await api("/api/admin/publish", { method: "POST", form: publishForm(post()) });
  check("publishing the same address again is refused (409)", r.status === 409 && /already exists/.test(r.body?.error ?? ""), JSON.stringify(r.body));

  r = await api("/api/admin/publish", { method: "POST", form: publishForm(post({ title: "" })) });
  check("a missing title gets a plain-language error (400)", r.status === 400 && /title/i.test(r.body?.error ?? ""), JSON.stringify(r.body));
  r = await api("/api/admin/publish", { method: "POST", form: publishForm(post({ slug: "../../etc/passwd" })) });
  check("an unsafe web address is refused (400)", r.status === 400, JSON.stringify(r.body));
  r = await api("/api/admin/publish", { method: "POST", form: publishForm(post({ slug: "x", linkedinUrl: "http://evil.test" })) });
  check("a non-LinkedIn link is refused (400)", r.status === 400, JSON.stringify(r.body));

  r = await api("/api/admin/publish", { method: "POST", form: publishForm(post({ slug: "link-only", title: "Only On LinkedIn", linkedinOnly: true, body: "" })) });
  check("a LinkedIn-only entry publishes without text", r.status === 200 && r.body.linkedinOnly && r.body.url.startsWith("https://www.linkedin.com/"), JSON.stringify(r.body));

  console.log("\n-- Images --");
  before = (await ghState()).commits;
  const withImage = post({ slug: "with-picture", title: "With a Picture", body: "Intro\n\n![A tiny test](pending:abcdef123456)\n\nOutro" });
  r = await api("/api/admin/publish", { method: "POST", form: publishForm(withImage, { images: { abcdef123456: PNG } }) });
  check("a post with a picture publishes", r.status === 200, JSON.stringify(r.body));
  const year = new Date().getFullYear();
  const md = (await ghFile("content/posts/with-picture.md"))?.toString() ?? "";
  check("the text now points at the real image address, which carries the picture's size", md.includes(`](/uploads/blog/${year}/abcdef123456-1x1.png)`) && !md.includes("pending:"), md);
  const img = await ghFile(`public/uploads/blog/${year}/abcdef123456-1x1.png`);
  check("the image bytes were stored intact", img && img.equals(PNG));
  check("post and image went up in one commit", (await ghState()).commits === before + 1, `${before} -> ${(await ghState()).commits}`);

  r = await api("/api/admin/publish", { method: "POST", form: publishForm(post({ slug: "bad-image", title: "Bad", body: "![x](pending:zzzzzz999999)" }), { images: { zzzzzz999999: Buffer.from("<svg xmlns='http://www.w3.org/2000/svg'><script>alert(1)</script></svg>") } }) });
  check("an SVG disguised as an image is refused (400)", r.status === 400 && /JPG, PNG, GIF, or WebP/.test(r.body?.error ?? ""), JSON.stringify(r.body));
  r = await api("/api/admin/publish", { method: "POST", form: publishForm(post({ slug: "missing-image", title: "Missing", body: "![x](pending:nofile123456)" })) });
  check("a picture that wasn't uploaded is refused (400)", r.status === 400, JSON.stringify(r.body));
  const huge = Buffer.concat([PNG, Buffer.alloc(1_600_000)]);
  r = await api("/api/admin/publish", { method: "POST", form: publishForm(post({ slug: "huge", title: "Huge", body: "![x](pending:huge12345678)" }), { images: { huge12345678: huge } }) });
  check("an oversized image is refused (400)", r.status === 400 && /too large/.test(r.body?.error ?? ""), JSON.stringify(r.body));
  check("none of the refused posts reached the repository", !(await ghFile("content/posts/bad-image.md")) && !(await ghFile("content/posts/huge.md")) && !(await ghFile("content/posts/missing-image.md")));

  console.log("\n-- Editing --");
  r = await api("/api/admin/posts/why-goals-fail");
  const sha = r.body.sha;
  const edited = post({ body: "Rewritten body.\n\nStill two paragraphs.", summary: "Updated summary." });
  r = await api("/api/admin/publish", { method: "POST", form: publishForm(edited, { mode: "update", sha: "0000000000000000000000000000000000000000" }) });
  check("saving over a newer version is refused (409)", r.status === 409 && /changed somewhere else/.test(r.body?.error ?? ""), JSON.stringify(r.body));
  r = await api("/api/admin/publish", { method: "POST", form: publishForm(edited, { mode: "update", sha }) });
  check("saving with the current version works", r.status === 200 && r.body.created === false, JSON.stringify(r.body));
  file = (await ghFile("content/posts/why-goals-fail.md"))?.toString() ?? "";
  check("the changes are in the repository", /Rewritten body/.test(file) && /Updated summary/.test(file), file);
  r = await api("/api/admin/publish", { method: "POST", form: publishForm(post({ slug: "never-existed" }), { mode: "update", sha }) });
  check("editing a post that doesn't exist is a clean 404", r.status === 404, JSON.stringify(r.body));

  console.log("\n-- Someone else pushed at the same moment --");
  await fetch(`${GH}/__race`, { method: "POST" });
  r = await api("/api/admin/publish", { method: "POST", form: publishForm(post({ slug: "after-race", title: "After the Race" })) });
  check("publishing survives a conflicting push by retrying", r.status === 200, JSON.stringify(r.body));
  check("the post is there, and the other push was kept", !!(await ghFile("content/posts/after-race.md")));

  console.log("\n-- Deleting --");
  r = await api("/api/admin/posts/link-only", { method: "DELETE" });
  check("deletes a post", r.status === 200, JSON.stringify(r.body));
  check("it is gone from the repository", !(await ghFile("content/posts/link-only.md")));
  r = await api("/api/admin/posts/link-only", { method: "DELETE" });
  check("deleting it twice is a clean 404", r.status === 404, r.status);
  r = await api("/api/admin/posts/x", { method: "DELETE", origin: "https://evil.example" });
  check("a delete from another site is blocked (403)", r.status === 403, r.status);

  console.log("\n-- Signing out and locking out --");
  r = await api("/api/admin/logout", { method: "POST" });
  check("sign out works", r.status === 200);
  const cleared = r.headers.get("set-cookie") ?? "";
  check("the cookie is cleared", /summit_admin=;|Max-Age=0|Expires=Thu, 01 Jan 1970/i.test(cleared), cleared);
  r = await api("/api/admin/posts", { withCookie: false });
  check("after signing out the API is closed again (401)", r.status === 401);
  r = await api("/api/admin/posts", { headers: { Cookie: "summit_admin=forged.token" }, withCookie: false });
  check("a forged cookie is rejected (401)", r.status === 401);

  let last;
  for (let i = 0; i < 10; i++) {
    last = await api("/api/admin/login", { method: "POST", withCookie: false, headers: { "x-forwarded-for": "9.9.9.9" }, json: { password: `guess-${i}` } });
  }
  check("repeated wrong passwords are locked out for a while (429)", last.status === 429, last.status);
  r = await api("/api/admin/login", { method: "POST", withCookie: false, headers: { "x-forwarded-for": "9.9.9.9" }, json: { password: PASSWORD } });
  check("even the right password waits out the lockout", r.status === 429, r.status);

  console.log("\n-- Pages --");
  r = await api("/admin", { withCookie: false });
  check("/admin shows the sign-in form to visitors", r.status === 200 && /Sign in/.test(r.text) && !/Your blog posts/.test(r.text));
  check("/admin tells search engines not to index it", /noindex/.test(r.text));
  r = await api("/admin/new", { withCookie: false });
  check("/admin/new sends signed-out visitors to /admin", r.status >= 300 && r.status < 400 && /\/admin/.test(r.headers.get("location") ?? ""), `${r.status} ${r.headers.get("location")}`);
  r = await api("/admin/edit/anything", { withCookie: false });
  check("/admin/edit/... sends signed-out visitors to /admin", r.status >= 300 && r.status < 400, r.status);
} catch (error) {
  failures += 1;
  console.log("FAIL  script error:", error);
} finally {
  stopAll();
}

console.log(`\n${failures === 0 ? "All checks passed." : `${failures} check(s) FAILED.`}`);
process.exit(failures === 0 ? 0 : 1);
