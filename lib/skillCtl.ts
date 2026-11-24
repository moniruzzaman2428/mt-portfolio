import { site } from "./content"

/**
 * Shared control state between the background 3D globe (components/Globe.tsx)
 * and the Skills section UI (components/SkillStage.tsx).
 * The globe reads it every frame; the UI mutates it and calls emit().
 */
export type Layout = "sphere" | "orbits" | "helix"
export type SkillSettings = {
  layout: Layout
  autoRotate: boolean
  speed: number
  zoom: number
  nodeSize: number
  labels: "always" | "hover"
  links: boolean
  colorByGroup: boolean
  wheelZoom: boolean
}

export const DEFAULTS: SkillSettings = {
  layout: "sphere", autoRotate: true, speed: 0.6, zoom: 1, nodeSize: 1,
  labels: "hover", links: true, colorByGroup: true, wheelZoom: false,
}
export const ZMIN = 0.55
export const ZMAX = 2.2
const KEY = "mt-skill-globe"

export const skills = site.skills
export const N = skills.length
export const GROUPS = ["Frontend", "Backend", "Tools"]
const gIdx = skills.map((s) => GROUPS.indexOf(s.group))
export const members = GROUPS.map((g) => skills.map((s, i) => (s.group === g ? i : -1)).filter((i) => i >= 0))
const posInGroup = skills.map((s, i) => members[GROUPS.indexOf(s.group)].indexOf(i))

const R = 5 // base radius of the background globe (see Globe.tsx)

/** Orbit rings, in units of the globe radius. tilt = [x, z] Euler angles. */
export const RINGS = [
  { r: 1.5 * R, tilt: [0.45, 0.22] as [number, number], speed: 0.26 },
  { r: 1.3 * R, tilt: [-0.65, -0.5] as [number, number], speed: -0.4 },
  { r: 1.12 * R, tilt: [0.95, 0.9] as [number, number], speed: 0.62 },
]

/** Local-space position of skill `i` for a layout (globe radius = 5). Pure math, no three.js. */
export function targetFor(i: number, layout: Layout, t: number): [number, number, number] {
  if (layout === "sphere") {
    const y = 1 - (i / (N - 1)) * 2
    const rr = Math.sqrt(1 - y * y)
    const th = Math.PI * (3 - Math.sqrt(5)) * i
    const r = R * 1.24
    return [Math.cos(th) * rr * r, y * r, Math.sin(th) * rr * r]
  }
  if (layout === "orbits") {
    const g = gIdx[i]
    const ring = RINGS[g]
    const th = (posInGroup[i] / members[g].length) * Math.PI * 2 + t * ring.speed
    let x = Math.cos(th) * ring.r
    let y = 0
    let z = Math.sin(th) * ring.r
    // same order as THREE.Euler("XYZ"): Z first, then X
    const [tx, tz] = ring.tilt
    const x1 = x * Math.cos(tz) - y * Math.sin(tz)
    const y1 = x * Math.sin(tz) + y * Math.cos(tz)
    x = x1
    y = y1 * Math.cos(tx) - z * Math.sin(tx)
    z = y1 * Math.sin(tx) + z * Math.cos(tx)
    return [x, y, z]
  }
  const y = (i / (N - 1) - 0.5) * R * 2.4
  const th = i * 0.9
  return [Math.cos(th) * R * 1.12, y, Math.sin(th) * R * 1.12]
}

const load = (): SkillSettings => {
  if (typeof window === "undefined") return DEFAULTS
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {}
  return DEFAULTS
}

export const ctl = {
  settings: DEFAULTS as SkillSettings,
  stage: null as HTMLElement | null,
  nodes: [] as (HTMLElement | null)[],
  hover: null as number | null,
  sel: null as number | null,
  filter: "All",
  engaged: false,
  moved: 0,
  focusReq: null as number | null,
  resetReq: false,
  loaded: false,
  listeners: new Set<() => void>(),
  emit() { ctl.listeners.forEach((f) => f()) },
  init() {
    if (ctl.loaded) return
    ctl.loaded = true
    ctl.settings = load()
  },
  set(patch: Partial<SkillSettings>) {
    ctl.settings = { ...ctl.settings, ...patch }
    try { localStorage.setItem(KEY, JSON.stringify(ctl.settings)) } catch {}
    ctl.emit()
  },
  restore() { ctl.set({ ...DEFAULTS }); ctl.resetReq = true },
}
export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
