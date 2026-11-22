export type RGB = [number, number, number]

const hex = (h: string): RGB => {
  const n = parseInt(h.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** Every palette has 3 colors: primary, secondary, accent. */
export const PALETTES: { name: string; c: RGB[] }[] = [
  { name: "Cosmic", c: ["#3a86ff", "#8338ec", "#ff006e"] },
  { name: "Aurora", c: ["#00f5d4", "#00bbf9", "#9b5de5"] },
  { name: "Sunset", c: ["#ff5e62", "#ff9966", "#ffd166"] },
  { name: "Emerald", c: ["#06d6a0", "#118ab2", "#a3e635"] },
  { name: "Neon", c: ["#f72585", "#7209b7", "#4cc9f0"] },
  { name: "Solar", c: ["#f9c74f", "#f3722c", "#f94144"] },
].map((p) => ({ name: p.name, c: p.c.map(hex) }))

/**
 * Shared live state. <PaletteEngine /> writes it every frame,
 * the 3D globe reads it every frame, and CSS reads it through
 * the --mt-1 / --mt-2 / --mt-3 variables.
 */
export const live = {
  c: PALETTES[0].c.map((x) => [...x] as RGB),
  index: 0,
  name: PALETTES[0].name,
  skip: 0,
  paused: false,
  dirty: false, // set when the theme changes so CSS variables get re-written
  listeners: new Set<() => void>(),
}

export const notify = () => live.listeners.forEach((fn) => fn())
