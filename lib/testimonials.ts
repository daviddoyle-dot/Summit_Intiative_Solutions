export type Testimonial = {
  quote: string;
  author: string;
  title: string;
  company: string;
};

// Same permission gate as the Selected Clients list on the About page:
// do NOT merge/deploy to production until every named client below has
// confirmed both (a) being named publicly, and (b) the quote attributed
// to them.
//
// The entries below are placeholders showing the layout — replace `quote`
// and `author`/`title` with real testimonial text once available. Keep
// `company` in sync with the CLIENTS list in app/about/page.tsx.
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Placeholder quote — replace with what this client actually said about working with David.",
    author: "Name TBD",
    title: "Title TBD",
    company: "Flowserve",
  },
  {
    quote:
      "Placeholder quote — replace with what this client actually said about working with David.",
    author: "Name TBD",
    title: "Title TBD",
    company: "Veriten",
  },
  {
    quote:
      "Placeholder quote — replace with what this client actually said about working with David.",
    author: "Name TBD",
    title: "Title TBD",
    company: "Helix Earth",
  },
];
