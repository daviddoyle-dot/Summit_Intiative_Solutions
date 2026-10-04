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
- [ ] **Search Console**: submit `https://summitinitiativesolutions.com/sitemap.xml` once the bare domain is primary.
- [ ] **LinkedIn company page**: add the site URL.
- [ ] **Optional**: Vercel suggests newer DNS values (www CNAME already updated; apex A record still shows a cosmetic "DNS Change Recommended" warning — the current record works).

## Contact form

The contact page posts to `app/api/contact/route.ts`, which emails David through
[Resend](https://resend.com). It needs `RESEND_API_KEY` set in Vercel (see `.env.example`)
and `summitinitiativesolutions.com` verified in Resend. Without the key the form shows an
error and points visitors to David's email address.

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

- [ ] **Real contact-form backend** (e.g. Resend) — the contact page currently opens a
      `mailto:` link rather than submitting anywhere; a real backend is more reliable and
      could log leads.
- [ ] **Testimonials / case studies** — once client permission is confirmed (see the
      Selected Clients list on the `add-client-list` branch), add short quotes or
      results tied to specific engagements.
- [ ] **Press / speaking mentions** — an "As Seen In" or "Speaking" strip if applicable.
- [ ] **Blog detail pages** (`/blog/[slug]`) — host full post text on-site instead of
      linking out to LinkedIn, once there are enough posts to justify it.
- [ ] **Newsletter signup**.
- [ ] **Structured data (JSON-LD)** for Person/Organization schema, for richer Google results.
- [ ] **Privacy Policy / Terms pages** — especially once a real contact-form backend exists.
- [ ] Client portal (originally out of scope for v1).

## Preview branches not yet merged

- `add-client-list`: adds a "Proven Track Record" / Selected Clients section to the About
  page (Flowserve, Veriten, The Brooks Group, Helix Earth, Leidos). **Do not merge to
  main** until David confirms naming permission for every entry — The Brooks Group and
  Leidos are still pending as of this writing.
