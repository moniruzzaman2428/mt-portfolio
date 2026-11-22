"use client"

import { motion } from "framer-motion"
import { useId } from "react"

/** Animated MT monogram — draws itself in, colors follow the live palette. */
export default function Logo({ size = 44, animate = true }: { size?: number; animate?: boolean }) {
  // .replace(/:/g, "") লাইনটি বাদ দেওয়া হয়েছে
  const id = useId() 
  
  const draw = (delay: number) => ({
    initial: animate ? { pathLength: 0, opacity: 0 } : false,
    animate: { pathLength: 1, opacity: 1 },
    transition: { duration: 1.1, delay, ease: "easeInOut" as const },
  })

  // id-র সাথে সরাসরি 'g-' প্রিফিক্স যুক্ত করা হয়েছে যেন এটি একটি ইউনিক স্ট্রিং হয়
  const gradientId = `g-${id}`

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-label="MT logo" role="img">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "rgb(var(--mt-1))" }} />
          <stop offset="0.55" style={{ stopColor: "rgb(var(--mt-2))" }} />
          <stop offset="1" style={{ stopColor: "rgb(var(--mt-3))" }} />
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="61" height="61" rx="16" fill="#05060a" stroke={`url(#${gradientId})`} strokeWidth="2.5" />
      <motion.path
        d="M12 44V20l9 13 9-13v24"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...draw(0.1)}
      />
      <motion.path
        d="M35 20h18M44 20v24"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...draw(0.7)}
      />
    </svg>
  )
}
