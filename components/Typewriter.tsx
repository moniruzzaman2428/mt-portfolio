"use client"

import { useEffect, useState } from "react"

/** Tiny typewriter that loops through the given lines. */
export default function Typewriter({ lines, className = "" }: { lines: string[]; className?: string }) {
  const [text, setText] = useState(lines[0])
  useEffect(() => {
    let li = 0, ci = 0, del = false
    let t: ReturnType<typeof setTimeout>
    const step = () => {
      const full = lines[li]
      if (!del) {
        ci++
        setText(full.slice(0, ci))
        if (ci === full.length) { del = true; t = setTimeout(step, 1600); return }
        t = setTimeout(step, 45)
      } else {
        ci--
        setText(full.slice(0, ci))
        if (ci === 0) { del = false; li = (li + 1) % lines.length; t = setTimeout(step, 350); return }
        t = setTimeout(step, 22)
      }
    }
    ci = 0; setText(""); t = setTimeout(step, 400)
    return () => clearTimeout(t)
  }, [lines])
  return (
    <span className={className} aria-label={lines[0]}>
      {text}
      <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-mt1 align-middle" style={{ height: "1.1em" }} />
    </span>
  )
}
