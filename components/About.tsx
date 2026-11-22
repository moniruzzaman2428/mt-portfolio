"use client"

import { motion } from "framer-motion"
import { Calendar, Code2, Download, Heart, Lightbulb, Mail, MapPin, Phone, Rocket, User, type LucideIcon } from "lucide-react"
import Reveal from "./Reveal"
import SectionTitle from "./SectionTitle"
import SpotlightCard from "./SpotlightCard"
import Typewriter from "./Typewriter"
import Logo from "./Logo"
import { Counter } from "./Hero"
import { site } from "@/lib/content"

const info: { icon: LucideIcon; label: string; value: string }[] = [
  { icon: User, label: "Full Name", value: site.name },
  { icon: MapPin, label: "Location", value: site.location },
  { icon: Mail, label: "Email", value: site.email },
  { icon: Phone, label: "Phone", value: site.phone },
  { icon: Calendar, label: "Birth Date", value: site.birthDate },
  { icon: Code2, label: "Freelance", value: site.freelance },
]
const interestIcons: LucideIcon[] = [Code2, Rocket, Lightbulb, Heart]

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container-mt">
        <SectionTitle eyebrow="About me" title="Get to know the person" accent="behind the code" />

        <div className="grid items-start gap-14 lg:grid-cols-5">
          {/* Photo card */}
          <Reveal className="lg:col-span-2">
            <div className="mx-auto max-w-sm">
              <div className="relative">
                <div className="bg-gradient-mt absolute -inset-1 rounded-[2rem] opacity-70 blur-xl" />
                <div className="bg-gradient-mt relative rounded-[2rem] p-[2px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/profile-hero.webp" alt={`${site.name} — ${site.jobTitle}`} width={600} height={800} loading="lazy"
                    className="aspect-[3/4] w-full rounded-[calc(2rem-2px)] object-cover object-top" />
                </div>
                <div className="animate-float glass absolute -right-4 top-8 rounded-2xl p-2.5"><Logo size={44} animate={false} /></div>
                <div className="glass absolute -bottom-4 -left-4 rounded-2xl px-4 py-2.5 text-xs font-medium text-white">
                  <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />Open to work
                </div>
              </div>

              <motion.a
                href={site.resume.download} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="bg-gradient-mt mt-10 flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white"
              >
                <Download size={16} /> Download CV
              </motion.a>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {site.stats.map((s) => (
                  <div key={s.label} className="glass rounded-2xl p-4 text-center">
                    <div className="text-gradient text-2xl font-extrabold"><Counter value={s.value} suffix={s.suffix} /></div>
                    <div className="mt-1 text-[11px] uppercase tracking-widest text-white/45">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Details */}
          <div className="lg:col-span-3">
            <Reveal>
              <h3 className="mb-3 text-2xl font-bold text-white">{site.about.title}</h3>
              <p className="mb-6 h-8 text-lg text-mt1"><Typewriter lines={site.about.typed} /></p>
            </Reveal>
            {site.about.text.map((p, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <p className="mb-5 leading-relaxed text-white/60">{p}</p>
              </Reveal>
            ))}

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {info.map((it, i) => (
                <Reveal key={it.label} delay={0.05 * i}>
                  <SpotlightCard className="flex items-center gap-4 p-4">
                    <span className="bg-gradient-mt flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"><it.icon size={18} /></span>
                    <span className="min-w-0">
                      <span className="block text-[11px] uppercase tracking-widest text-white/40">{it.label}</span>
                      <span className="block truncate text-sm font-medium text-white">{it.value}</span>
                    </span>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-10">
              <h3 className="mb-4 text-lg font-semibold text-white">My Interests</h3>
              <div className="flex flex-wrap gap-3">
                {site.about.interests.map((t, i) => {
                  const Icon = interestIcons[i % interestIcons.length]
                  return (
                    <span key={t} className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white/80 transition hover:border-mt1/60">
                      <Icon size={15} className="text-mt1" /> {t}
                    </span>
                  )
                })}
              </div>
            </Reveal>

            <Reveal className="mt-10">
              <blockquote className="glass relative rounded-2xl p-6 pl-8">
                <span className="bg-gradient-mt absolute bottom-5 left-0 top-5 w-1 rounded-full" />
                <p className="italic leading-relaxed text-white/70">&ldquo;{site.about.quote}&rdquo;</p>
                <footer className="mt-4 text-sm text-white/45">— {site.firstName}, {site.about.title}</footer>
              </blockquote>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
