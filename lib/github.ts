// Reads and writes post files in the GitHub repository.
// A commit to the main branch makes Vercel rebuild the site, which is how a post goes live.

const API_BASE = process.env.GITHUB_API_URL ?? "https://api.github.com";
const POSTS_PATH = "content/posts";

export class GitHubError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

function repo(): string {
  return process.env.BLOG_GITHUB_REPO ?? "daviddoyle-dot/Summit_Intiative_Solutions";
}

function branch(): string {
  return process.env.BLOG_GITHUB_BRANCH ?? "main";
}

async function request(path: string, init: RequestInit = {}): Promise<Response> {
  const token = process.env.BLOG_GITHUB_TOKEN;
  if (!token) throw new GitHubError("Publishing isn't set up yet.", 503);

  const response = await fetch(`${API_BASE}/repos/${repo()}/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "summit-initiative-solutions-site",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
    cache: "no-store",
  });

  if (response.status === 401 || response.status === 403) {
    console.error("GitHub rejected the token", response.status, await response.clone().text());
    throw new GitHubError("GitHub didn't accept the access token. It may have expired.", 502);
  }
  return response;
}

async function failure(response: Response, fallback: string): Promise<GitHubError> {
  console.error(fallback, response.status, await response.text());
  return new GitHubError(fallback, 502);
}

async function json<T>(response: Response, fallback: string): Promise<T> {
  if (!response.ok) throw await failure(response, fallback);
  return (await response.json()) as T;
}

type ContentsEntry = { name: string; sha: string; content?: string };

export async function listPostSlugs(): Promise<string[]> {
  const response = await request(`contents/${POSTS_PATH}?ref=${encodeURIComponent(branch())}`);
  if (response.status === 404) return [];
  const files = await json<ContentsEntry[]>(response, "Couldn't load the list of posts.");
  return files.filter((file) => file.name.endsWith(".md")).map((file) => file.name.slice(0, -3));
}

export async function readPost(slug: string): Promise<{ raw: string; sha: string } | null> {
  const response = await request(
    `contents/${POSTS_PATH}/${slug}.md?ref=${encodeURIComponent(branch())}`
  );
  if (response.status === 404) return null;
  const file = await json<ContentsEntry>(response, "Couldn't load that post.");
  return { raw: Buffer.from(file.content ?? "", "base64").toString("utf8"), sha: file.sha };
}

export async function deletePost(slug: string, sha: string, message: string): Promise<void> {
  const response = await request(`contents/${POSTS_PATH}/${slug}.md`, {
    method: "DELETE",
    body: JSON.stringify({ message, sha, branch: branch() }),
  });
  if (!response.ok) throw await failure(response, "Couldn't delete the post.");
}

export type FileToCommit = { path: string; text?: string; data?: Buffer };

/**
 * Commits several files at once (a post plus its images) so the site rebuilds a single time
 * and a post can never go live pointing at an image that isn't there yet.
 */
export async function commitFiles(files: FileToCommit[], message: string): Promise<void> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const ref = await json<{ object: { sha: string } }>(
      await request(`git/ref/heads/${encodeURIComponent(branch())}`),
      "Couldn't reach the site's repository."
    );
    const parentSha = ref.object.sha;
    const parent = await json<{ tree: { sha: string } }>(
      await request(`git/commits/${parentSha}`),
      "Couldn't reach the site's repository."
    );

    // Upload the pictures in parallel; the text goes in directly.
    const entries = await Promise.all(
      files.map(async (file) => {
        if (!file.data) {
          return { path: file.path, mode: "100644", type: "blob", content: file.text ?? "" };
        }
        const blob = await json<{ sha: string }>(
          await request("git/blobs", {
            method: "POST",
            body: JSON.stringify({ content: file.data.toString("base64"), encoding: "base64" }),
          }),
          "Couldn't upload an image."
        );
        return { path: file.path, mode: "100644", type: "blob", sha: blob.sha };
      })
    );

    const tree = await json<{ sha: string }>(
      await request("git/trees", {
        method: "POST",
        body: JSON.stringify({ base_tree: parent.tree.sha, tree: entries }),
      }),
      "Couldn't save the post."
    );
    const commit = await json<{ sha: string }>(
      await request("git/commits", {
        method: "POST",
        body: JSON.stringify({ message, tree: tree.sha, parents: [parentSha] }),
      }),
      "Couldn't save the post."
    );

    const update = await request(`git/refs/heads/${encodeURIComponent(branch())}`, {
      method: "PATCH",
      body: JSON.stringify({ sha: commit.sha, force: false }),
    });
    if (update.ok) return;

    // Someone else committed in the meantime. Rebuild on top of their commit and try again.
    if (update.status === 422 || update.status === 409) {
      console.warn("Branch moved during publish; retrying", attempt + 1);
      continue;
    }
    throw await failure(update, "Couldn't save the post.");
  }
  throw new GitHubError("The site changed while saving. Please try publishing again.", 409);
}
