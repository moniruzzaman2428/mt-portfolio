"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, CheckCircle2, Github } from "lucide-react"
import Reveal from "./Reveal"
import SectionTitle from "./SectionTitle"
import SpotlightCard from "./SpotlightCard"
import { site } from "@/lib/content"

const angles = [135, 45, 225, 315]

export default function Work() {
  return (
    <section id="work" className="section">
      <div className="container-mt">
        <SectionTitle eyebrow="Selected work" title="Projects that" accent="make an impact" />
        <div className="grid gap-6 md:grid-cols-2">
          {site.projects.map((p, i) => (
            <Reveal key={p.title} delay={(i % 2) * 0.12} className="h-full">
              <SpotlightCard className="group flex h-full flex-col">
                <a href={p.live} target="_blank" rel="noopener noreferrer" aria-label={`Open ${p.title} live demo`}
                  className="relative block h-56 overflow-hidden"
                  style={{ backgroundImage: `linear-gradient(${angles[i % 4]}deg, rgb(var(--mt-1) / .85), rgb(var(--mt-2) / .75) 55%, rgb(var(--mt-3) / .85))` }}>
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={`${p.title} screenshot`} loading="lazy" referrerPolicy="no-referrer"
                      className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => { e.currentTarget.style.display = "none" }} />
                  ) : null}
                  <motion.div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[#ffffff33] blur-2xl"
                    animate={{ x: [0, -40, 0], y: [0, 30, 0] }} transition={{ duration: 9 + i * 2, repeat: Infinity, ease: "easeInOut" }} />
                  <span className="absolute bottom-3 left-5 text-6xl font-black text-[#ffffff4d] drop-shadow">0{i + 1}</span>
                  <div className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 keep-white opacity-0 backdrop-blur transition-all duration-500 group-hover:-translate-y-1 group-hover:opacity-100">
                    <ArrowUpRight size={18} />
                  </div>
                </a>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold uppercase tracking-[0.2em] text-mt1">{p.tag}</span>
                    <span className="text-white/40">{p.launched}</span>
                  </div>
                  <h3 className="mb-2 mt-2 text-2xl font-bold text-white">{p.title}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-white/55">{p.text}</p>
                  <ul className="mb-5 space-y-1.5">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-white/50"><CheckCircle2 size={14} className="mt-0.5 shrink-0 text-mt1" />{f}</li>
                    ))}
                  </ul>
                  <div className="mb-5 flex flex-wrap gap-2">
                    {p.tech.map((t) => <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">{t}</span>)}
                  </div>
                  <div className="mt-auto flex gap-3">
                    <a href={p.live} target="_blank" rel="noopener noreferrer" className="bg-gradient-mt inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold text-white">
                      Live demo <ArrowUpRight size={14} />
                    </a>
                    {p.source && (
                      <a href={p.source} target="_blank" rel="noopener noreferrer" className="glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold text-white transition hover:border-white/30">
                        <Github size={14} /> Source
                      </a>
                    )}
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 text-center">
          <a href={site.socials[0].href} target="_blank" rel="noopener noreferrer" className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:border-mt1/60">
            <Github size={16} /> More on GitHub
          </a>
        </Reveal>
      </div>
    </section>
  )
}
