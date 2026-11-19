# Summit Initiative Solutions — Claude Code Rules

Marketing site and blog for David Doyle's Summit Initiative Solutions: Next.js 16, React 19, Tailwind 4, deployed on David's Vercel account. The README is the full guide; this file is the rules.

## The repository is public and `main` is production
- Every push to `main` deploys to summitinitiativesolutions.com.
- **Code changes go through a pull request, merged by doylejeremy1988-lab, never by an agent.** This started on 2026-11-18; earlier work was pushed straight to `main`, so the history won't show it.
- The one exception is David's blog editor at `/admin`, which commits posts straight to `main` (`content/posts/`, pictures in `public/uploads/blog/`). Pull before you branch, and don't rewrite or delete those commits.
- Anything committed is public. No secrets, no `.env*` files, and no client or company names unless David has confirmed permission for each one.
- Branches not yet merged are David's decisions, not yours: `add-client-list` must not be merged until David confirms every client name (see the README), and `brand-refresh` carries copy David hasn't released.

## Copy is David's
Page text and posts are in David's voice. Don't rewrite, shorten or "improve" them unless asked; when asked, change only what was asked.

## Before every commit
1. `npm test` (unit tests in `tests/`, run with Node's test runner through tsx).
2. `npm run lint`. The project rules it enforces are in `eslint.config.mjs`.
3. `npm run build`.
4. If you touched `/admin`, `app/api/admin/` or `lib/github.ts`: `node scripts/e2e-admin.mjs` (fake GitHub; never the real repository).

## Code rules
- Site code (`app/`, `components/`, `lib/`, `proxy.ts`) logs only with `console.warn` / `console.error`. Lint enforces this.
- Secrets (`ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `BLOG_GITHUB_TOKEN`, `RESEND_API_KEY`) are read only in `app/api/`, `lib/admin-auth.ts` and `lib/github.ts`. **`lib/` as a whole is not server-only**: the editor's client components import `lib/post-format.ts`, `lib/paste-to-markdown.ts`, `lib/prepare-image.ts`, `lib/editor-text.ts`, `lib/image-limits.ts` and `lib/site.ts`, so a secret in one of those would land in the browser bundle (as `undefined`).
- A `"use client"` file may read only `NEXT_PUBLIC_` variables and `NODE_ENV`, each by name (`process.env.NEXT_PUBLIC_NAME`), never through a destructured `process.env` (not filled in) or an alias of it (not reliably filled in). Lint enforces this.
- Visitors outside the countries in `lib/geo.ts` get a 403 from `proxy.ts`. `GEO_BLOCK_DISABLED=1` in Vercel (then redeploy) is the emergency switch. Changing the country list is David's call.
- Keep the editor's security properties (README, "Security notes"): signed HttpOnly SameSite=Strict cookie, same-site check on every change request, pictures checked by their bytes (JPG, PNG, GIF, WebP; never SVG), and writes limited to `content/posts/*.md` and `public/uploads/blog/`.
- Posts render as Markdown with no raw HTML (`components/PostBody.tsx`). Don't add raw-HTML rendering. Structured data goes into its `<script>` through `jsonLdHtml` (`lib/json-ld.ts`), never a bare `JSON.stringify`.
- New environment variables go in `.env.example` with a one-line explanation, and in the README if David has to set them.
- Tests use `node:test` and `node:assert/strict`, and fake only what's outside the app (GitHub, Resend, `fetch`).

## Commits
Plain imperative sentences, as in the history: "Add New Zealand to the allowed countries", "Fix mobile nav: menu button on phones, desktop unchanged".
