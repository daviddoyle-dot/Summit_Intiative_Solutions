export type LinkedInPost = {
  title: string;
  excerpt: string;
  url: string;
  date: string;
};

// LinkedIn doesn't offer a public API for pulling a personal profile's
// most-liked posts, so this list is hand-curated rather than auto-fetched.
//
// To feature a real post:
//   1. Open the post on David's LinkedIn profile and copy its URL.
//   2. Write a short title and one-line excerpt summarizing it.
//   3. Add (or replace) an entry below with { title, excerpt, url, date }.
//
// The three entries below are placeholders showing the layout — swap them
// out for David's actual top posts before this goes live.
export const FEATURED_POSTS: LinkedInPost[] = [
  {
    title: "Post title goes here",
    excerpt: "A short one- or two-sentence preview of what the post covers.",
    url: "https://www.linkedin.com/in/mg-david-doyle/",
    date: "TBD",
  },
  {
    title: "Post title goes here",
    excerpt: "A short one- or two-sentence preview of what the post covers.",
    url: "https://www.linkedin.com/in/mg-david-doyle/",
    date: "TBD",
  },
  {
    title: "Post title goes here",
    excerpt: "A short one- or two-sentence preview of what the post covers.",
    url: "https://www.linkedin.com/in/mg-david-doyle/",
    date: "TBD",
  },
];
