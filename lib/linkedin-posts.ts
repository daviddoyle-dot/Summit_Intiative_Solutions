export type LinkedInPost = {
  title: string;
  excerpt: string;
  url: string;
  date: string;
};

// LinkedIn doesn't offer a public API for pulling a personal profile's
// most-liked posts, so this list is hand-curated rather than auto-fetched.
//
// To feature a post:
//   1. Open the post on David's LinkedIn profile and copy its URL.
//   2. Write a short title and one-line excerpt summarizing it.
//   3. Add (or replace) an entry below with { title, excerpt, url, date }.
//
// TODO: the two entries below use David's personal profile URL as a
// placeholder — swap in the direct post URL and posted date once available.
export const FEATURED_POSTS: LinkedInPost[] = [
  {
    title: "Two Numbers on a Dry-Erase Board",
    excerpt:
      "A battalion commander never said a word — he just wrote two numbers on a dry-erase board. It taught a young lieutenant that a goal only changes behavior once people believe it's real.",
    url: "https://www.linkedin.com/in/mg-david-doyle/",
    date: "TBD",
  },
  {
    title: "The Jelly Belly Dispenser",
    excerpt:
      "A $60-a-week candy habit in the Pentagon basement became one of the best sources of informal intelligence about what a team was really thinking — and doing.",
    url: "https://www.linkedin.com/in/mg-david-doyle/",
    date: "TBD",
  },
  {
    title: "Not Yet Your Problem",
    excerpt:
      "Commanding JRTC meant diagnosing a new unit's friction every month — often faster than the unit itself could, not by being smarter, but by not living inside the problem.",
    url: "https://www.linkedin.com/in/mg-david-doyle/",
    date: "TBD",
  },
  {
    title: "Your Calendar Is Your Battle Rhythm",
    excerpt:
      "Leaders often schedule meetings. The best leaders schedule thinking — and a calendar, examined honestly, is a statement of what you actually value.",
    url: "https://www.linkedin.com/in/mg-david-doyle/",
    date: "TBD",
  },
];
