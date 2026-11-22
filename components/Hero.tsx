"use client"

import { AnimatePresence, animate, motion, useInView } from "framer-motion"
import { ArrowRight, ChevronDown, Download } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { site } from "@/lib/content"
import { socialIcons } from "@/lib/icons"

const word = {
  hidden: { opacity: 0, y: 60, rotateX: -50, filter: "blur(12px)" },
  show: (i: number) => ({
    opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)",
    transition: { duration: 0.9, delay: 0.5 + i * 0.18, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, value, { duration: 1.8, ease: "easeOut", onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [inView, value])
  return <span ref={ref}>{n}{suffix}</span>
}

export default function Hero() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % site.roles.length), 2600)
    return () => clearInterval(t)
  }, [])

  return (
    <section id="home" className="pointer-events-none relative flex min-h-screen items-center">
      <div className="container-mt px-6 pb-24 pt-32">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
            className="glass pointer-events-auto mb-8 inline-flex items-center gap-3 rounded-full py-1.5 pl-1.5 pr-4 text-xs font-medium tracking-wide text-white/80"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/profile-hero.webp" alt={`${site.name} portrait`} width={32} height={32} className="h-8 w-8 rounded-full object-cover object-top ring-2 ring-mt1" />
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping-soft absolute inset-0 rounded-full bg-mt1" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-mt1" />
            </span>
            Hey there! Available for freelance
          </motion.div>

          <h1 className="text-5xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl [perspective:800px]">
            <span className="sr-only">{site.name} — {site.jobTitle}</span>
            <motion.span aria-hidden custom={0} variants={word} initial="hidden" animate="show" className="block">
              {site.firstName}
            </motion.span>
            <motion.span aria-hidden custom={1} variants={word} initial="hidden" animate="show" className="text-gradient block">
              {site.lastName}
            </motion.span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-8 flex h-9 items-center gap-3 text-xl text-white/70 md:text-2xl"
          >
            <span>I&apos;m a</span>
            <span className="relative inline-block h-9 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={i} initial={{ y: 36, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -36, opacity: 0 }}
                  transition={{ duration: 0.45, ease: "easeOut" }} className="text-gradient block whitespace-nowrap font-semibold"
                >
                  {site.roles[i]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.8 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/55 md:text-lg"
          >
            {site.intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.8 }}
            className="pointer-events-auto mt-10 flex flex-wrap gap-4"
          >
            <motion.a href="#work" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
              className="bg-gradient-mt group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_40px_-10px_rgb(var(--mt-1))]">
              View my work <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </motion.a>
            <motion.a href={site.resume.download} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
              className="glass inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white/30">
              <Download size={16} /> Download Resume
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9, duration: 0.8 }}
            className="pointer-events-auto mt-10 flex items-center gap-4"
          >
            <span className="hidden text-xs uppercase tracking-widest text-white/35 sm:block">Connect</span>
            <div className="flex gap-2.5">
              {site.socials.slice(0, 5).map((s) => {
                const Icon = socialIcons[s.icon]
                return (
                  <motion.a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer me" aria-label={s.label}
                    whileHover={{ y: -4, scale: 1.1 }} whileTap={{ scale: 0.94 }}
                    className="glass flex h-10 w-10 items-center justify-center rounded-xl text-white/70 transition hover:border-mt1/60 hover:text-white">
                    <Icon size={17} />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
        className="pointer-events-auto absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] tracking-[0.3em] text-white/40 hover:text-white md:flex"
      >
        SCROLL <ChevronDown size={16} className="animate-bob" />
      </motion.a>
    </section>
  )
}
