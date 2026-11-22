import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { getPost, posts } from "@/lib/blog-data"
import { abs } from "@/lib/seo"
import { site } from "@/lib/content"

export const dynamicParams = false

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: { canonical: `/blog/${post.slug}/` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: abs(`/blog/${post.slug}/`),
      publishedTime: post.date,
      authors: [site.name],
      tags: post.tags,
      images: [{ url: post.image, alt: post.title }],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: [post.image] },
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: abs(post.image),
    datePublished: post.date,
    dateModified: post.date,
    keywords: post.tags.join(", "),
    mainEntityOfPage: abs(`/blog/${post.slug}/`),
    author: { "@type": "Person", name: site.name, url: abs("/") },
    publisher: { "@type": "Person", name: site.name, url: abs("/") },
  }

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="section pt-36">
        <article className="mx-auto max-w-3xl">
          <Link href="/blog/" className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white">
            <ArrowLeft size={16} /> All articles
          </Link>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-mt1">{post.category}</span>
          <h1 className="mb-4 mt-3 text-4xl font-bold leading-tight text-white md:text-5xl">{post.title}</h1>
          <p className="mb-8 text-sm text-white/45">
            By {site.name} · <time dateTime={post.date}>{post.dateLabel}</time> · {post.readTime} read
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.image} alt={post.title} className="mb-10 max-h-[26rem] w-full rounded-2xl border border-white/10 object-cover" />
          <div className="prose-mt glass rounded-2xl p-6 md:p-10" dangerouslySetInnerHTML={{ __html: post.content }} />
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">#{t}</span>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
