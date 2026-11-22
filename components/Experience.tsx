"use client"

import { motion } from "framer-motion"
import { Award, Briefcase, Download, ExternalLink, FileText, GraduationCap, Languages, MapPin } from "lucide-react"
import Reveal from "./Reveal"
import SectionTitle from "./SectionTitle"
import { site } from "@/lib/content"

function Timeline({ children }: { children: React.ReactNode }) {
  return <div className="relative space-y-6 border-l border-white/10 pl-8">{children}</div>
}
function Dot() {
  return (
    <span className="bg-gradient-mt absolute -left-[41px] top-6 flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-ink">
      <span className="h-1.5 w-1.5 rounded-full bg-[#fff]" />
    </span>
  )
}

export default function Experience() {
  return (
    <section id="experience" className="section">
      <div className="container-mt">
        <SectionTitle eyebrow="Experience & Education" title="My professional" accent="journey" />

        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <Reveal><h3 className="mb-8 flex items-center gap-3 text-xl font-semibold text-white"><Briefcase className="text-mt1" size={22} /> Work Experience</h3></Reveal>
            <Timeline>
              {site.experience.map((e, i) => (
                <Reveal key={e.title} delay={i * 0.1}>
                  <div className="glass relative rounded-2xl p-6 transition hover:border-mt1/50">
                    <Dot />
                    <span className="text-xs font-semibold uppercase tracking-widest text-mt1">{e.period}</span>
                    <h4 className="mt-2 text-lg font-bold text-white">{e.title}</h4>
                    <p className="mb-3 flex flex-wrap items-center gap-x-3 text-sm text-white/55">
                      {e.url ? (
                        <a href={e.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-white">{e.company}<ExternalLink size={12} /></a>
                      ) : e.company}
                      <span className="inline-flex items-center gap-1"><MapPin size={12} />{e.location}</span>
                    </p>
                    <p className="mb-4 text-sm leading-relaxed text-white/55">{e.text}</p>
                    <div className="flex flex-wrap gap-2">
                      {e.tech.map((t) => <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/60">{t}</span>)}
                    </div>
                  </div>
                </Reveal>
              ))}
            </Timeline>
          </div>

          <div>
            <Reveal><h3 className="mb-8 flex items-center gap-3 text-xl font-semibold text-white"><GraduationCap className="text-mt1" size={22} /> Education</h3></Reveal>
            <Timeline>
              {site.education.map((e, i) => (
                <Reveal key={e.title} delay={i * 0.1}>
                  <div className="glass relative rounded-2xl p-6 transition hover:border-mt1/50">
                    <Dot />
                    <span className="text-xs font-semibold uppercase tracking-widest text-mt1">{e.period}</span>
                    <h4 className="mt-2 text-lg font-bold text-white">{e.title}</h4>
                    <p className="mb-2 text-sm text-white/55">{e.institution}</p>
                    <p className="text-sm leading-relaxed text-white/50">{e.text}</p>
                  </div>
                </Reveal>
              ))}
            </Timeline>
          </div>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <Reveal>
            <div className="glass h-full rounded-2xl p-6">
              <h3 className="mb-5 flex items-center gap-3 text-lg font-semibold text-white"><Award className="text-mt1" size={20} /> Certificates</h3>
              <ul className="space-y-3">
                {site.certificates.map((c) => (
                  <li key={c.name} className="flex items-center justify-between gap-4 rounded-xl bg-white/[0.04] px-4 py-3">
                    <span><span className="block text-sm font-medium text-white">{c.name}</span><span className="text-xs text-white/45">{c.issuer}</span></span>
                    <span className="text-xs text-mt1">{c.year}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="glass h-full rounded-2xl p-6">
              <h3 className="mb-5 flex items-center gap-3 text-lg font-semibold text-white"><Languages className="text-mt1" size={20} /> Languages</h3>
              <ul className="space-y-5">
                {site.languages.map((l) => (
                  <li key={l.name}>
                    <div className="mb-1.5 flex justify-between text-sm"><span className="text-white">{l.name}</span><span className="text-white/45">{l.level}</span></div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                      <motion.div className="bg-gradient-mt h-full rounded-full" initial={{ width: 0 }} whileInView={{ width: `${l.value}%` }} viewport={{ once: true }} transition={{ duration: 1.2 }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-14">
          <div id="resume" className="glass flex flex-col items-center justify-between gap-6 rounded-3xl p-8 md:flex-row">
            <div className="flex items-center gap-4">
              <span className="bg-gradient-mt flex h-14 w-14 items-center justify-center rounded-2xl text-white"><FileText size={26} /></span>
              <div><h3 className="text-xl font-bold text-white">My Resume</h3><p className="text-sm text-white/50">View online or download the latest PDF.</p></div>
            </div>
            <div className="flex gap-3">
              <a href={site.resume.view} target="_blank" rel="noopener noreferrer" className="glass rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30">View online</a>
              <a href={site.resume.download} target="_blank" rel="noopener noreferrer" className="bg-gradient-mt inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"><Download size={16} /> Download</a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
