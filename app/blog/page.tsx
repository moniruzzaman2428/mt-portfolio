import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { posts } from "@/lib/blog-data"
import { abs } from "@/lib/seo"
import { site } from "@/lib/content"

export const metadata: Metadata = {
  title: "Blog",
  description: `Articles on React, Tailwind CSS, Node.js, MongoDB and modern JavaScript by ${site.name}.`,
  alternates: { canonical: "/blog/" },
}

export default function BlogIndex() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${site.name} — Blog`,
    url: abs("/blog/"),
    blogPost: posts.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: abs(`/blog/${p.slug}/`), datePublished: p.date })),
  }
  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="section pt-36">
        <div className="container-mt">
          <h1 className="mb-12 text-4xl font-bold text-white md:text-5xl">
            The <span className="text-gradient">Blog</span>
          </h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}/`} className="spotlight glass group block overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.title} loading="lazy" className="h-48 w-full object-cover" />
                <div className="p-6">
                  <span className="text-xs font-semibold uppercase tracking-widest text-mt1">{p.category}</span>
                  <h2 className="mb-2 mt-2 text-xl font-bold text-white">{p.title}</h2>
                  <p className="mb-4 text-sm text-white/55">{p.excerpt}</p>
                  <span className="text-xs text-white/40">{p.dateLabel} · {p.readTime} read</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
