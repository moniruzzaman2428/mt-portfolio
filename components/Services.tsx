"use client"

import { Code2, MessageSquare, Palette, Rocket, type LucideIcon } from "lucide-react"
import Reveal from "./Reveal"
import SectionTitle from "./SectionTitle"
import SpotlightCard from "./SpotlightCard"
import { site } from "@/lib/content"

const icons: Record<string, LucideIcon> = { code: Code2, palette: Palette, message: MessageSquare, rocket: Rocket }

export default function Services() {
  return (
    <section id="services" className="section">
      <div className="container-mt">
        <SectionTitle eyebrow="Services" title="What I can" accent="do for you" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {site.services.map((s, i) => {
            const Icon = icons[s.icon] ?? Code2
            return (
              <Reveal key={s.title} delay={i * 0.1} className="h-full">
                <SpotlightCard className="group h-full p-7">
                  <div className="bg-gradient-mt mb-6 flex h-14 w-14 items-center justify-center rounded-2xl text-white transition-transform duration-500 group-hover:rotate-[12deg] group-hover:scale-110">
                    <Icon size={26} />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-white">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-white/55">{s.text}</p>
                  <span className="mt-6 block text-xs font-semibold tracking-widest text-white/30">
                    0{i + 1}
                  </span>
                </SpotlightCard>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
