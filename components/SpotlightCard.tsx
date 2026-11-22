"use client"

import type { ReactNode, MouseEvent } from "react"

export default function SpotlightCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`)
  }
  return (
    <div onMouseMove={onMove} className={`spotlight glass rounded-2xl ${className}`}>
      {children}
    </div>
  )
}
