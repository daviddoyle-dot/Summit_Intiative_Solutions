# Summit Initiative Solutions

Marketing website for Summit Initiative Solutions, built with Next.js 16 + Tailwind CSS 4.

## Getting started

```bash
npm install
npm run dev
```

## Before launch — TODO

- [x] **Logo**: real mark installed (`public/logo-mark.png`, `public/logo-full.png`), background removed for transparency, favicon/apple-touch-icon generated from it.
- [x] **Calendly**: `https://calendly.com/daviddoyle-summitinitiativesolutions`
- [x] **Contact email**: `daviddoyle@summitinitiativesolutions.com`
- [x] **LinkedIn**: company page `https://www.linkedin.com/company/summit-initiative-solutions/` (nav, footer, contact); David's personal profile is used only on the Blog page.
- [ ] **Copy review**: all page copy is drafted from the intake questionnaire — confirm wording with David before launch.
- [x] **Domain**: `summitinitiativesolutions.com` is registered in David's name on Squarespace and now serves this site from Vercel. DNS stays at Squarespace: `www` CNAME -> Vercel, apex A record -> `76.76.21.21`. MX and TXT records are Google Workspace email — do not remove them.
- [x] **GitHub**: repo lives under David's own account (`daviddoyle-dot`), Jeremy added as collaborator.
- [x] **Vercel**: deployed under David's own Vercel account — https://summit-intiative-solutions.vercel.app
- [x] **Bare domain is primary in Vercel**: `https://summitinitiativesolutions.com` serves the site and `www` 308-redirects to it, matching the sitemap, Open Graph tags, robots, and JSON-LD.
- [x] **Contact form**: sends through Resend (domain verified, `RESEND_API_KEY` set in Vercel). Test message confirmed delivered to daviddoyle@summitinitiativesolutions.com.
- [x] **Search Console**: sitemap submitted (`https://summitinitiativesolutions.com/sitemap.xml`). Check back that the status reads Success and discovered pages are counted.
- [ ] **LinkedIn company page**: add the site URL.
- [ ] **Optional**: Vercel suggests newer DNS values (www CNAME already updated; apex A record still shows a cosmetic "DNS Change Recommended" warning — the current record works).

## Contact form

The contact page posts to `app/api/contact/route.ts`, which emails David through
[Resend](https://resend.com). It needs `RESEND_API_KEY` set in Vercel (see `.env.example`)
and `summitinitiativesolutions.com` verified in Resend. Without the key the form shows an
error and points visitors to David's email address.

## Blog and the editor

Posts are Markdown files in `content/posts/` (one file per post, the file name is the web
address). Each has a small header (title, date, summary, optional LinkedIn link) followed by
the text. The blog list, the post pages, the sitemap, and the link-preview images are all
built from those files.

Two kinds of entry are supported:

- **Full post**: the text lives on this site at `/blog/<address>`. A LinkedIn post can send
  readers there with a plain link, and the link shows a proper preview card (title, summary,
  branded image) because every post page has its own Open Graph image.
- **LinkedIn only**: the blog shows a card that links straight to LinkedIn, with no text
  stored here.

### Publishing from the browser (`/admin`)

David signs in at `https://summitinitiativesolutions.com/admin`, writes or pastes a post
(Word and Google Docs formatting is cleaned up on paste), adds pictures, previews it, and
presses **Publish**. The editor commits the post (and its pictures, in one commit) to GitHub,
which makes Vercel rebuild the site; the post is live about a minute later. There is no
database. Everything is in the repository, and the editor is only a friendly way of making
commits. Unsaved writing is kept in the browser, so a closed tab doesn't lose it.

The editor stays switched off until these are set in **Vercel -> Project -> Settings ->
Environment Variables** (Production). See `.env.example`.

| Variable | What it is |
| --- | --- |
| `ADMIN_PASSWORD` | David's password for `/admin`. At least 12 characters; a long phrase is best. |
| `ADMIN_SESSION_SECRET` | Random text used to sign the login cookie. Generate with `openssl rand -base64 32`. Changing it signs everyone out. |
| `BLOG_GITHUB_TOKEN` | A GitHub access token that may write to this repository (below). Mark it **Sensitive**. |

Optional: `BLOG_GITHUB_REPO` (default `daviddoyle-dot/Summit_Intiative_Solutions`) and
`BLOG_GITHUB_BRANCH` (default `main`).

**Creating the GitHub token** (David does this while signed in to his own GitHub account, so
the commits are his and Vercel accepts them on the free plan):

1. GitHub -> Settings -> Developer settings -> Personal access tokens -> **Fine-grained tokens**
   -> Generate new token.
2. Resource owner: `daviddoyle-dot`. Repository access: **Only select repositories** ->
   `Summit_Intiative_Solutions`.
3. Repository permissions: **Contents -> Read and write**. Nothing else is needed.
4. Pick the longest expiry offered and note the date. When a token expires, publishing shows
   "GitHub didn't accept the access token"; make a new one and replace the Vercel variable.

After changing environment variables, redeploy (Vercel -> Deployments -> latest -> Redeploy)
so they take effect.

### Sharing a post on LinkedIn

After publishing, the editor shows the post's link with a Copy button. Paste it into the
LinkedIn post. If LinkedIn shows an old preview, refresh it with LinkedIn's
[Post Inspector](https://www.linkedin.com/post-inspector/). Visits that come from LinkedIn
show up under **Referrers** in Vercel Analytics.

### How it's built

- `lib/post-format.ts`: the post fields, the validation rules, and how a post is written to a
  file. Used by both the site and the editor.
- `lib/posts.ts`: reads the files at build time (`content/posts`). A broken file is skipped
  rather than breaking the build.
- `components/PostBody.tsx`: renders the Markdown (no raw HTML, unsafe links stripped).
- `app/blog/[slug]/`: the post page and its preview-image generator.
- `components/admin/`, `app/admin/`: the editor screens.
- `app/api/admin/`: sign-in, listing, deleting, and `publish` (create/update in one commit).
- `lib/github.ts`: talks to GitHub. `lib/admin-session.ts` / `lib/admin-auth.ts`: sign-in.
- `lib/paste-to-markdown.ts`: turns pasted Word / Google Docs content into Markdown.

Security notes: sign-in uses a signed, HttpOnly, SameSite=Strict cookie (7 days) and a
best-effort guess limiter; every change request must come from the site itself; uploaded
pictures are checked by their actual bytes (JPG, PNG, GIF, WebP only, never SVG); the editor
can only write to `content/posts/*.md` and `public/uploads/blog/`. Because the repository is
public, anything saved through the editor is public once committed, so keep unfinished work
in Word until it's ready.

### Testing it

```bash
npm test                    # fast unit tests (paste cleanup, validation, sign-in, images)
node scripts/e2e-admin.mjs  # starts a fake GitHub + the site and runs ~50 end-to-end checks
```

The end-to-end script never touches the real repository. To click around the editor by hand
without GitHub, run `node scripts/fake-github.mjs` and start the site with the variables
listed at the top of that file.

## Analytics

Vercel Web Analytics is already wired in (`@vercel/analytics` in `app/layout.tsx`) and has
been recording pageviews since the first deploy — nothing left to set up.

To view it:

1. Log into Vercel and open the `summit-intiative-solutions` project.
2. Click the **Analytics** tab in the left sidebar.

The project is on Vercel's Hobby plan, which includes basic Web Analytics (pageviews, top
pages, referrers) but with a capped free event quota and a shorter retention window than
the Pro plan. If traffic grows enough to hit the Hobby cap, or David wants longer history,
upgrading to Pro unlocks that — no code changes required either way.

## Roadmap / ideas for a future iteration

- [x] ~~Real contact-form backend~~: done, see above.
- [ ] **Testimonials / case studies** — once client permission is confirmed (see the
      Selected Clients list on the `add-client-list` branch), add short quotes or
      results tied to specific engagements.
- [ ] **Press / speaking mentions** — an "As Seen In" or "Speaking" strip if applicable.
- [x] ~~Blog detail pages and an in-browser editor~~: done, see "Blog and the editor".
- [ ] **Newsletter signup**.
- [ ] **RSS feed** for the blog.
- [x] ~~Structured data (JSON-LD)~~: Organization, Person, and BlogPosting are in place.
- [ ] **Privacy Policy / Terms pages** — especially once a real contact-form backend exists.
- [ ] Client portal (originally out of scope for v1).

## Preview branches not yet merged

- `add-client-list`: adds a "Proven Track Record" / Selected Clients section to the About
  page (Flowserve, Veriten, The Brooks Group, Helix Earth, Leidos). **Do not merge to
  main** until David confirms naming permission for every entry — The Brooks Group and
  Leidos are still pending as of this writing.
