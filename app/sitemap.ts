import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/content"
import { posts } from "@/lib/blog-data"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const home = { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 }
  const blog = { url: `${SITE_URL}/blog/`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 }
  const articles = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}/`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))
  return [home, blog, ...articles]
}
