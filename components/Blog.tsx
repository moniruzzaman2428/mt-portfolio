import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"
import Reveal from "./Reveal"
import SectionTitle from "./SectionTitle"
import SpotlightCard from "./SpotlightCard"
import { posts } from "@/lib/blog-data"

export default function Blog() {
  return (
    <section id="blog" className="section">
      <div className="container-mt">
        <SectionTitle eyebrow="Blog" title="Thoughts, tutorials" accent="& insights" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 6).map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.1} className="h-full">
              <Link href={`/blog/${p.slug}/`} className="block h-full">
                <SpotlightCard className="group h-full">
                  <div className="h-44 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="p-6">
                    <div className="mb-3 flex items-center justify-between text-xs">
                      <span className="font-semibold uppercase tracking-widest text-mt1">{p.category}</span>
                      <span className="flex items-center gap-1 text-white/40"><Clock size={12} />{p.readTime}</span>
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-white">{p.title}</h3>
                    <p className="mb-4 text-sm leading-relaxed text-white/55">{p.excerpt}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-all group-hover:gap-3 group-hover:text-white">
                      Read article <ArrowRight size={14} />
                    </span>
                  </div>
                </SpotlightCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
