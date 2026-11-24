"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Logo from "./Logo"
import { site } from "@/lib/content"

const RADIUS = 66
const CIRC = 2 * Math.PI * RADIUS

const STATUS = [
  { upto: 28, text: "Initializing" },
  { upto: 58, text: "Loading assets" },
  { upto: 86, text: "Preparing 3D scene" },
  { upto: 101, text: "Almost ready" },
]

const ease = [0.76, 0, 0.24, 1] as const

/**
 * Modern full-screen preloader.
 * – Follows the live color palette + light/dark theme
 * – Progress ring around the animated MT logo, big counter, status text
 * – Waits for the page to really finish loading (with a minimum + maximum time)
 * – Split-curtain exit, scroll lock while visible, hidden when JS is disabled
 */
export default function Loader() {
  const [phase, setPhase] = useState<"load" | "exit" | "done">("load")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let seen = false
    try { seen = sessionStorage.getItem("mt-seen") === "1" } catch {}
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const minTime = reduced ? 300 : seen ? 800 : 2200 // never faster than this
    const maxTime = 6000 // never slower than this
    const start = performance.now()
    let raf = 0
    let current = 0
    let exitTimer: ReturnType<typeof setTimeout> | undefined
    let doneTimer: ReturnType<typeof setTimeout> | undefined

    document.documentElement.style.overflow = "hidden"

    const tick = (now: number) => {
      const elapsed = now - start
      const t = Math.min(elapsed / minTime, 1)
      const timeValue = (1 - Math.pow(1 - t, 3)) * 100 // ease-out
      const loaded = document.readyState === "complete" || elapsed > maxTime

      // hold at 92% until the page has really loaded, then finish
      const target = loaded && t >= 1 ? 100 : Math.min(timeValue, 92)
      current += (target - current) * 0.18
      if (target === 100 && current > 99.4) current = 100

      setProgress(Math.round(current))

      if (current < 100) {
        raf = requestAnimationFrame(tick)
      } else {
        try { sessionStorage.setItem("mt-seen", "1") } catch {}
        exitTimer = setTimeout(() => {
          setPhase("exit")
          doneTimer = setTimeout(() => {
            setPhase("done")
            document.documentElement.style.overflow = ""
          }, 1000)
        }, 350)
      }
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(exitTimer)
      clearTimeout(doneTimer)
      document.documentElement.style.overflow = ""
    }
  }, [])

  if (phase === "done") return null

  const exiting = phase === "exit"
  const status = STATUS.find((s) => progress < s.upto)?.text ?? "Almost ready"
  const letters = site.name.toUpperCase().split("")

  return (
    <>
      {/* never block the site for visitors without JavaScript */}
      <noscript>
        <style>{`.mt-loader{display:none!important}`}</style>
      </noscript>

      <div
        className="mt-loader fixed inset-0 z-[9999] overflow-hidden"
        role="status"
        aria-label="Loading website"
        style={{ pointerEvents: exiting ? "none" : "auto" }}
      >
        {/* split curtain */}
        <motion.div
          className="absolute inset-x-0 top-0 h-1/2 bg-ink"
          animate={{ y: exiting ? "-101%" : "0%" }}
          transition={{ duration: 0.9, ease }}
        />
        <motion.div
          className="absolute inset-x-0 bottom-0 h-1/2 bg-ink"
          animate={{ y: exiting ? "101%" : "0%" }}
          transition={{ duration: 0.9, ease }}
        />

        {/* content */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: exiting ? 0 : 1, scale: exiting ? 1.04 : 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* ambient glow + grid (palette colors) */}
          <div className="pointer-events-none absolute inset-0">
            <motion.div
              className="absolute left-[18%] top-[22%] h-[380px] w-[380px] rounded-full blur-[110px]"
              style={{ background: "rgb(var(--mt-1) / 0.22)" }}
              animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-[14%] right-[16%] h-[420px] w-[420px] rounded-full blur-[120px]"
              style={{ background: "rgb(var(--mt-3) / 0.18)" }}
              animate={{ x: [0, -50, 0], y: [0, -40, 0] }}
              transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
            />
            <div
              className="absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_center,#000_15%,transparent_70%)]"
              style={{
                backgroundImage:
                  "linear-gradient(rgb(var(--fg) / 0.05) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--fg) / 0.05) 1px, transparent 1px)",
                backgroundSize: "56px 56px",
              }}
            />
          </div>

          {/* corner labels */}
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="absolute left-6 top-6 text-[10px] font-semibold uppercase tracking-[0.35em] text-white/50 sm:left-10 sm:top-8"
          >
            MT <span className="text-white/25">/</span> Portfolio
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="absolute right-6 top-6 hidden text-[10px] font-semibold uppercase tracking-[0.35em] text-white/50 sm:right-10 sm:top-8 sm:block"
          >
            {site.jobTitle}
          </motion.p>

          {/* centre: logo inside progress ring */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex h-[168px] w-[168px] items-center justify-center"
            >
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 168 168" aria-hidden>
                <defs>
                  <linearGradient id="loader-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" style={{ stopColor: "rgb(var(--mt-1))" }} />
                    <stop offset="0.55" style={{ stopColor: "rgb(var(--mt-2))" }} />
                    <stop offset="1" style={{ stopColor: "rgb(var(--mt-3))" }} />
                  </linearGradient>
                </defs>
                <circle cx="84" cy="84" r={RADIUS} fill="none" strokeWidth="2" className="stroke-white/10" />
                <circle
                  cx="84" cy="84" r={RADIUS} fill="none" strokeWidth="3" strokeLinecap="round"
                  stroke="url(#loader-grad)"
                  strokeDasharray={CIRC}
                  strokeDashoffset={CIRC * (1 - progress / 100)}
                  style={{ filter: "drop-shadow(0 0 6px rgb(var(--mt-1) / 0.7))" }}
                />
              </svg>

              {/* orbiting spark */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
              >
                <span
                  className="absolute left-1/2 top-[9px] h-2 w-2 -translate-x-1/2 rounded-full"
                  style={{ background: "rgb(var(--mt-3))", boxShadow: "0 0 14px 3px rgb(var(--mt-3) / 0.8)" }}
                />
              </motion.div>

              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Logo size={76} />
              </motion.div>
            </motion.div>

            {/* name, letter by letter */}
            <h2 className="mt-9 flex max-w-full flex-wrap justify-center text-center text-[11px] font-semibold tracking-[0.34em] text-white sm:text-sm" aria-label={site.name}>
              {letters.map((ch, i) => (
                <motion.span
                  key={i}
                  aria-hidden
                  initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.35 + i * 0.035, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className={ch === " " ? "w-[0.9em]" : ""}
                >
                  {ch}
                </motion.span>
              ))}
            </h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="mt-3 text-[10px] uppercase tracking-[0.4em] text-white/35"
            >
              Crafted with precision
            </motion.p>
          </div>

          {/* bottom: big counter + status */}
          <div className="absolute inset-x-6 bottom-8 flex items-end justify-between sm:inset-x-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="flex items-start leading-none"
            >
              <span className="text-gradient text-6xl font-extrabold tabular-nums tracking-tight sm:text-8xl">
                {progress.toString().padStart(2, "0")}
              </span>
              <span className="mt-1 text-lg font-semibold text-white/40 sm:mt-2 sm:text-2xl">%</span>
            </motion.div>

            <div className="mb-1 text-right sm:mb-2">
              <p className="mb-1 text-[9px] uppercase tracking-[0.3em] text-white/30">Status</p>
              <motion.p
                key={status}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="text-xs font-medium uppercase tracking-[0.25em] text-white/80 sm:text-sm"
              >
                {status}
              </motion.p>
            </div>
          </div>

          {/* full-width progress line */}
          <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/10">
            <div
              className="bg-gradient-mt relative h-full"
              style={{ width: `${progress}%`, boxShadow: "0 0 18px rgb(var(--mt-1) / 0.8)" }}
            />
          </div>
        </motion.div>
      </div>
    </>
  )
}