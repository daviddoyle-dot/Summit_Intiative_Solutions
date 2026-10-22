import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";
import { getFullPosts, getPostBySlug } from "@/lib/posts";
import { formatPostDate } from "@/lib/post-format";
import { SITE_NAME } from "@/lib/site";

// The preview card LinkedIn (and other sites) show when a post link is shared.
export const alt = "Blog post from Summit Initiative Solutions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getFullPosts().map((post) => ({ slug: post.slug }));
}

function titleFontSize(title: string): number {
  if (title.length > 100) return 48;
  if (title.length > 70) return 56;
  if (title.length > 45) return 64;
  return 76;
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.title ?? SITE_NAME;
  const date = post ? formatPostDate(post.date) : "";

  const logo = fs.readFileSync(path.join(process.cwd(), "public", "logo-mark-tight.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(160deg, #0f1524 0%, #0a0e17 70%)",
          padding: "64px 72px",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#C9713D",
            }}
          >
            {SITE_NAME}
          </div>
          <img src={logoSrc} width={170} height={87} alt="" />
        </div>

        <div
          style={{
            display: "flex",
            fontSize: titleFontSize(title),
            lineHeight: 1.12,
            fontWeight: 700,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 28,
            color: "rgba(255,255,255,0.65)",
            borderTop: "2px solid rgba(255,255,255,0.12)",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex" }}>Major General (Ret.) David S. Doyle</div>
          <div style={{ display: "flex" }}>{date}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
