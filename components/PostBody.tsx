import ReactMarkdown, { defaultUrlTransform, type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { SIZED_IMAGE_NAME } from "@/lib/image-limits";

// Renders a post's Markdown with the site's styling. Used for the public post page and for
// the live preview in the admin editor, so what David sees while writing is what visitors get.
// Raw HTML in the Markdown is not rendered, and unsafe link types (like javascript:) are stripped.

const components: Components = {
  // The page title is the only h1, so a stray "# Heading" becomes a section heading.
  h1: ({ children }) => (
    <h2 className="text-2xl md:text-3xl font-black text-white mt-12 mb-4 leading-tight">{children}</h2>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl md:text-3xl font-black text-white mt-12 mb-4 leading-tight">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl md:text-2xl font-bold text-white mt-10 mb-3 leading-snug">{children}</h3>
  ),
  h4: ({ children }) => <h4 className="text-lg font-bold text-white mt-8 mb-2">{children}</h4>,
  p: ({ children }) => <p className="text-white/70 text-lg leading-relaxed">{children}</p>,
  strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href, children }) => {
    const external = typeof href === "string" && /^https?:\/\//i.test(href);
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="text-[#E0966A] underline underline-offset-2 hover:text-white transition-colors"
      >
        {children}
      </a>
    );
  },
  ul: ({ children }) => (
    <ul className="list-disc pl-6 space-y-2 text-white/70 text-lg leading-relaxed marker:text-[#C9713D]">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 space-y-2 text-white/70 text-lg leading-relaxed marker:text-[#C9713D]">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-[#C9713D]/60 pl-5 italic [&_p]:text-white/60">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-white/10 my-10" />,
  img: ({ src, alt }) => {
    const url = typeof src === "string" ? src : undefined;
    const size = url?.match(SIZED_IMAGE_NAME);
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={alt ?? ""}
        loading="lazy"
        // Width and height let the browser hold the space before the picture arrives.
        {...(size ? { width: Number(size[1]), height: Number(size[2]) } : {})}
        className="rounded-xl border border-white/[0.08] max-w-full h-auto my-2"
      />
    );
  },
  code: ({ children }) => (
    <code className="rounded bg-white/10 px-1.5 py-0.5 text-[0.9em] text-white/90">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-xl bg-[#141b2c] border border-white/[0.08] p-5 text-sm text-white/80">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-white/70 border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-white/20 px-3 py-2 font-bold text-white">{children}</th>
  ),
  td: ({ children }) => <td className="border-b border-white/10 px-3 py-2">{children}</td>,
};

type PostBodyProps = {
  markdown: string;
  /** Lets the editor preview show images that haven't been uploaded yet ("pending:" links). */
  resolvePendingImage?: (url: string) => string | undefined;
};

export default function PostBody({ markdown, resolvePendingImage }: PostBodyProps) {
  return (
    <div className="space-y-5">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={components}
        urlTransform={(url) =>
          url.startsWith("pending:") ? (resolvePendingImage?.(url) ?? "") : defaultUrlTransform(url)
        }
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
