"use client"

import { AnimatePresence, motion } from "framer-motion"
import dynamic from "next/dynamic"
import { useState } from "react"
import Reveal from "./Reveal"
import SectionTitle from "./SectionTitle"
import { Counter } from "./Hero"
import { site } from "@/lib/content"
import { skillIcons } from "@/lib/icons"

const SkillGlobe = dynamic(() => import("./SkillGlobe"), {
  ssr: false,
  loading: () => <div className="glass h-[480px] animate-pulse rounded-3xl md:h-[640px]" aria-hidden />,
})

const groups = ["All", "Frontend", "Backend", "Tools"] as const

export default function Skills() {
  const [group, setGroup] = useState<(typeof groups)[number]>("All")
  const [engaged, setEngaged] = useState(false)
  const list = site.skills.filter((s) => group === "All" || s.group === group)

  return (
    <section
      id="skills"
      className="section"
      onPointerEnter={() => setEngaged(true)}
      onPointerLeave={() => setEngaged(false)}
    >
      <div className="container-mt">
        <SectionTitle eyebrow="Skills" title="Technical" accent="expertise" />

        <Reveal className="mb-10 flex flex-wrap gap-2">
          {groups.map((g) => (
            <button
              key={g} onClick={() => setGroup(g)}
              className={`relative rounded-full px-5 py-2 text-sm font-medium transition ${group === g ? "text-white" : "text-white/55 hover:text-white"}`}
            >
              {group === g && <motion.span layoutId="skill-pill" className="bg-gradient-mt absolute inset-0 rounded-full" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
              <span className="relative">{g}</span>
            </button>
          ))}
        </Reveal>

        <Reveal className="mb-8">
          <SkillGlobe group={group} engaged={engaged} />
        </Reveal>

        {/* <Reveal className="mb-6">
          <h3 className="text-lg font-semibold text-white">All skills in detail</h3>
        </Reveal> */}

        {/* <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((s, i) => {
              const Icon = skillIcons[s.icon]
              return (
                <motion.div
                  key={s.name} layout
                  initial={{ opacity: 0, y: 24, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.03 }}
                  className="spotlight glass group rounded-2xl p-5"
                  onMouseMove={(e) => {
                    const r = e.currentTarget.getBoundingClientRect()
                    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`)
                    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`)
                  }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-2xl text-mt1 transition-transform duration-500 group-hover:rotate-[10deg] group-hover:scale-110"><Icon /></span>
                    <span className="text-xs text-white/40">{s.group}</span>
                  </div>
                  <p className="mb-3 font-semibold text-white">{s.name}</p>
                  <div className="mb-1.5 flex justify-between text-xs text-white/45">
                    <span>Proficiency</span><span className="text-white/70"><Counter value={s.level} suffix="%" /></span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="bg-gradient-mt h-full rounded-full" initial={{ width: 0 }} whileInView={{ width: `${s.level}%` }}
                      viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div> */}
      </div>
    </section>
  )
}

