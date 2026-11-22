"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import Logo from "./Logo"
import PaletteSwitcher from "./PaletteSwitcher"
import ThemeToggle from "./ThemeToggle"
import { site } from "@/lib/content"

const href = (h: string) => `/${h}`

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState("#home")
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" },
    )
    site.nav.forEach((n) => {
      const el = document.querySelector(n.href)
      if (el) io.observe(el)
    })
    return () => {
      window.removeEventListener("scroll", onScroll)
      io.disconnect()
    }
  }, [])

  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500 ${
          scrolled ? "glass shadow-[0_10px_40px_-10px_rgba(0,0,0,0.35)]" : "border border-transparent"
        }`}
      >
        <a href="/" className="flex items-center gap-3" aria-label="MT — home">
          <Logo size={40} />
          <span className="hidden text-sm font-semibold tracking-wide text-white sm:block">
            Md Moniruzzaman <span className="text-gradient">Tonoy</span>
          </span>
        </a>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {site.nav.map((n) => (
            <li key={n.href} className="relative">
              <a
                href={href(n.href)}
                className={`relative z-10 block px-3.5 py-2 text-sm transition-colors ${
                  active === n.href ? "text-white" : "text-white/55 hover:text-white"
                }`}
              >
                {n.label}
              </a>
              {active === n.href && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-xl bg-white/10"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <PaletteSwitcher />
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            className="glass rounded-xl p-2.5 text-white lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="glass mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl p-2 lg:hidden"
          >
            {site.nav.map((n, i) => (
              <motion.li key={n.href} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <a
                  href={href(n.href)}
                  onClick={() => setOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-sm ${active === n.href ? "bg-white/10 text-white" : "text-white/70"}`}
                >
                  {n.label}
                </a>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
