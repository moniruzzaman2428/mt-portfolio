"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import Logo from "./Logo"
import { site } from "@/lib/content"

/** Short intro animation. Shown fully on the first visit, very briefly afterwards. */
export default function Loader() {
  const [show, setShow] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let seen = false
    try { seen = sessionStorage.getItem("mt-seen") === "1" } catch {}
    const total = seen ? 500 : 1700
    const t0 = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / total)
      setProgress(Math.round(p * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else {
        try { sessionStorage.setItem("mt-seen", "1") } catch {}
        setTimeout(() => setShow(false), 250)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          exit={{ opacity: 0, scale: 1.04, filter: "blur(10px)" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
          aria-hidden
        >
          <div className="animate-float"><Logo size={96} /></div>
          <p className="mt-6 text-xs uppercase tracking-[0.4em] text-white/50">{site.name}</p>
          <div className="mt-8 h-[3px] w-56 overflow-hidden rounded-full bg-white/10">
            <div className="bg-gradient-mt h-full rounded-full" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-3 font-mono text-xs text-white/40">{progress}%</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
