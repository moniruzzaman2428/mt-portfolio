"use client"

import { useEffect } from "react"
import { PALETTES, live, notify, type RGB } from "@/lib/palette"
import { colorFactor } from "@/lib/theme"

const HOLD = 4.5 // seconds a palette stays before changing
const FADE = 2.2 // seconds of the smooth color transition

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

/**
 * Invisible component. Smoothly blends between color palettes forever and
 * writes the result to CSS variables (--mt-1/2/3) and to `live.c` for WebGL.
 */
export default function PaletteEngine() {
  useEffect(() => {
    const root = document.documentElement
    let raf = 0
    let last = performance.now()
    let lastWrite = 0
    let hold = 0
    let t = 1
    let target = 0
    let from: RGB[] = live.c.map((c) => [...c] as RGB)

    const write = () => {
      live.dirty = false
      const k = colorFactor()
      live.c.forEach((c, i) =>
        root.style.setProperty(`--mt-${i + 1}`, `${Math.round(c[0] * k)} ${Math.round(c[1] * k)} ${Math.round(c[2] * k)}`),
      )
    }

    const start = (next: number) => {
      from = live.c.map((c) => [...c] as RGB)
      target = next
      t = 0
      hold = 0
      live.index = next
      live.name = PALETTES[next].name
      notify()
    }

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now

      if (live.skip > 0) {
        live.skip = 0
        start((target + 1) % PALETTES.length)
      }

      if (t < 1) {
        t = Math.min(1, t + dt / FADE)
        const e = ease(t)
        const to = PALETTES[target].c
        live.c = from.map((f, i) => [
          f[0] + (to[i][0] - f[0]) * e,
          f[1] + (to[i][1] - f[1]) * e,
          f[2] + (to[i][2] - f[2]) * e,
        ]) as RGB[]

        if (now - lastWrite > 32 || t === 1) {
          lastWrite = now
          write()
        }
      } else if (live.dirty) {
        write()
      } else if (!live.paused) {
        hold += dt
        if (hold >= HOLD) start((target + 1) % PALETTES.length)
      }

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return null
}
