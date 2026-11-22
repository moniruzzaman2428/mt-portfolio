"use client"

import { useEffect, useState } from "react"
import { Pause, Play } from "lucide-react"
import { live } from "@/lib/palette"

/** Shows the current palette name; click to jump to the next one, long-press icon to pause. */
export default function PaletteSwitcher() {
  const [name, setName] = useState(live.name)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const fn = () => setName(live.name)
    live.listeners.add(fn)
    return () => void live.listeners.delete(fn)
  }, [])

  return (
    <div className="glass flex items-center gap-1 rounded-full p-1 pr-3">
      <button
        onClick={() => (live.skip = 1)}
        title="Next color theme"
        className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
      >
        <span className="flex -space-x-1">
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className="h-3.5 w-3.5 rounded-full ring-2 ring-ink"
              style={{ background: `rgb(var(--mt-${i}))` }}
            />
          ))}
        </span>
        <span className="hidden w-14 text-left sm:inline">{name}</span>
      </button>
      <button
        onClick={() => {
          live.paused = !live.paused
          setPaused(live.paused)
        }}
        title={paused ? "Resume auto colors" : "Pause auto colors"}
        className="rounded-full p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
      >
        {paused ? <Play size={13} /> : <Pause size={13} />}
      </button>
    </div>
  )
}
