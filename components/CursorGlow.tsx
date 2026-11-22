"use client"

import { motion, useMotionValue, useSpring } from "framer-motion"
import { useEffect } from "react"

export default function CursorGlow() {
  const x = useMotionValue(-400)
  const y = useMotionValue(-400)
  const sx = useSpring(x, { stiffness: 120, damping: 20, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 120, damping: 20, mass: 0.6 })

  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX - 200)
      y.set(e.clientY - 200)
    }
    window.addEventListener("pointermove", move)
    return () => window.removeEventListener("pointermove", move)
  }, [x, y])

  return (
    <motion.div
      aria-hidden
      className="cursor-glow pointer-events-none fixed left-0 top-0 z-[1] h-[400px] w-[400px] rounded-full opacity-30"
      style={{
        x: sx,
        y: sy,
        background: "radial-gradient(circle, rgb(var(--mt-1) / 0.55), transparent 65%)",
        filter: "blur(30px)",
      }}
    />
  )
}
