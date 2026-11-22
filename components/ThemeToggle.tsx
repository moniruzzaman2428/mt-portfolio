"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { live } from "@/lib/palette"
import { THEME_KEY, getTheme, type Theme } from "@/lib/theme"

/** Sun/Moon switch. Remembers the choice and follows the system setting on first visit. */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark")

  useEffect(() => {
    setTheme(getTheme())
    // follow system changes only while the visitor has not picked a theme manually
    const mq = window.matchMedia("(prefers-color-scheme: light)")
    const onSys = (e: MediaQueryListEvent) => {
      try { if (localStorage.getItem(THEME_KEY)) return } catch {}
      apply(e.matches ? "light" : "dark", false)
    }
    mq.addEventListener("change", onSys)
    return () => mq.removeEventListener("change", onSys)
  }, [])

  const apply = (t: Theme, persist = true) => {
    document.documentElement.setAttribute("data-theme", t)
    if (persist) { try { localStorage.setItem(THEME_KEY, t) } catch {} }
    live.dirty = true // re-tint palette variables for the new theme
    setTheme(t)
  }

  const isLight = theme === "light"
  return (
    <button
      onClick={() => apply(isLight ? "dark" : "light")}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      title={isLight ? "Dark mode" : "Light mode"}
      className="glass relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full text-white transition hover:border-mt1/60"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: 18, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -18, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex"
        >
          {isLight ? <Moon size={17} /> : <Sun size={17} />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
