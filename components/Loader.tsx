
"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import Logo from "./Logo"
import { site } from "@/lib/content"

export default function Loader() {
  const [show, setShow] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let seen = false

    try {
      seen = sessionStorage.getItem("mt-seen") === "1"
    } catch {}

    const duration = seen ? 600 : 1800
    const start = performance.now()

    let raf = 0
    let hideTimer: ReturnType<typeof setTimeout>

    const tick = (now: number) => {
      const elapsed = now - start
      const linear = Math.min(elapsed / duration, 1)

      // Smooth ease-out progress
      const eased = 1 - Math.pow(1 - linear, 3)
      const value = Math.round(eased * 100)

      setProgress(value)

      if (linear < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        try {
          sessionStorage.setItem("mt-seen", "1")
        } catch {}

        hideTimer = setTimeout(() => {
          setShow(false)
        }, 300)
      }
    }

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(hideTimer)
    }
  }, [])

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key="premium-loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.025,
            filter: "blur(12px)",
          }}
          transition={{
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-ink"
          aria-label="Loading website"
          role="status"
        >
          {/* Background Glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/[0.08] blur-[120px]" />

            <div className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
                backgroundSize: "55px 55px",
              }}
            />
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex w-full max-w-sm flex-col items-center px-8">

            {/* Logo Animation */}
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative"
            >
              <motion.div
                animate={{
                  scale: [1, 1.035, 1],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Logo size={88} />
              </motion.div>

              {/* Logo Glow */}
              <div className="absolute inset-0 -z-10 rounded-full bg-sky-400/20 blur-3xl" />
            </motion.div>

            {/* Website Name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="mt-7 text-center"
            >
              <h2 className="text-sm font-semibold uppercase tracking-[0.32em] text-white">
                {site.name}
              </h2>

              <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.38em] text-white/35">
                Digital Experience
              </p>
            </motion.div>

            {/* Progress */}
            <motion.div
              initial={{ opacity: 0, width: "65%" }}
              animate={{ opacity: 1, width: "100%" }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-12 w-full"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[9px] font-medium uppercase tracking-[0.25em] text-white/35">
                  Initializing Experience
                </span>

                <span className="font-mono text-xs font-medium tabular-nums text-sky-400">
                  {progress.toString().padStart(2, "0")}%
                </span>
              </div>

              <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-300 to-white shadow-[0_0_15px_rgba(56,189,248,0.5)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </motion.div>

            {/* Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8 text-[9px] uppercase tracking-[0.3em] text-white/25"
            >
              Crafted with precision
            </motion.p>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
