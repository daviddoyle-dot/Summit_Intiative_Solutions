import type { MetadataRoute } from "next";
import { FEATURED_POSTS } from "@/lib/linkedin-posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://summitinitiativesolutions.com";
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
    { url: `${base}/services`, lastModified: new Date() },
    { url: `${base}/blog`, lastModified: new Date() },
    ...FEATURED_POSTS.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(),
    })),
    { url: `${base}/contact`, lastModified: new Date() },
  ];
}
