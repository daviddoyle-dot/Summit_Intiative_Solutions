import type { MetadataRoute } from "next";
import { getFullPosts } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, lastModified: new Date() },
    { url: `${SITE_URL}/about`, lastModified: new Date() },
    { url: `${SITE_URL}/services`, lastModified: new Date() },
    { url: `${SITE_URL}/blog`, lastModified: new Date() },
    ...getFullPosts().map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
    })),
    { url: `${SITE_URL}/contact`, lastModified: new Date() },
  ];
}
