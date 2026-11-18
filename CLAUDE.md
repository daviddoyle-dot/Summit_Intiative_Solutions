# Summit Initiative Solutions — Claude Code Rules

Marketing site and blog for David Doyle's Summit Initiative Solutions: Next.js 16, React 19, Tailwind 4, deployed on David's Vercel account. The README is the full guide; this file is the rules.

## The repository is public and `main` is production
- Every push to `main` deploys to summitinitiativesolutions.com. Work on a branch and open a pull request; a person merges it, never you.
- The blog editor at `/admin` also commits straight to `main` (posts in `content/posts/`, pictures in `public/uploads/blog/`). Pull before you branch, and don't rewrite or delete those commits.
- Anything committed is public. No secrets, no `.env*` files, and no client or company names unless David has confirmed permission for each one.
- Branches not yet merged are David's decisions, not yours: `add-client-list` must not be merged until David confirms every client name (see the README), and `brand-refresh` carries copy David hasn't released.

## Copy is David's
Page text and posts are in David's voice. Don't rewrite, shorten or "improve" them unless asked; when asked, change only what was asked.

## Before every commit
1. `npm test` (unit tests in `tests/`, run with Node's test runner through tsx).
2. `npm run lint`. It enforces the no-`console.log` and client-component environment rules below.
3. `npm run build`.
4. If you touched `/admin`, `app/api/admin/` or `lib/github.ts`: `node scripts/e2e-admin.mjs` (fake GitHub; never the real repository).

## Code rules
- No `console.log` in site code (`app/`, `components/`, `lib/`, `proxy.ts`); `console.warn` / `console.error` are fine.
- Secrets (`ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `BLOG_GITHUB_TOKEN`, `RESEND_API_KEY`) are read only in server code (`lib/`, `app/api/`). A `"use client"` file may only read `NEXT_PUBLIC_` variables.
- Keep the editor's security properties (README, "Security notes"): signed HttpOnly SameSite=Strict cookie, same-site check on every change request, pictures checked by their bytes (JPG, PNG, GIF, WebP; never SVG), and writes limited to `content/posts/*.md` and `public/uploads/blog/`.
- Posts render as Markdown with no raw HTML (`components/PostBody.tsx`). Don't add raw-HTML rendering.
- New environment variables go in `.env.example` with a one-line explanation, and in the README if David has to set them.
- Tests use `node:test` and `node:assert/strict`, and fake only what's outside the app (GitHub, Resend, `fetch`).

## Commits
Plain imperative sentences, as in the history: "Add New Zealand to the allowed countries", "Fix mobile nav: menu button on phones, desktop unchanged".
