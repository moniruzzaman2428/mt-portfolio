"use client"

import { AnimatePresence, motion } from "framer-motion"
import { MousePointer2, Minus, Plus, RotateCcw, SlidersHorizontal, X } from "lucide-react"
import { useEffect, useReducer, useState } from "react"
import { skillIcons } from "@/lib/icons"
import { ZMAX, ZMIN, clamp, ctl, skills, type Layout, type SkillSettings } from "@/lib/skillCtl"

/**
 * Transparent stage that sits in the Skills section. The page's background 3D globe
 * flies into this stage when it scrolls into view, and the skills orbit that globe.
 * This component only renders the skill chips + controls; all 3D positions are
 * computed by components/Globe.tsx (see lib/skillCtl.ts for the shared state).
 */
export default function SkillStage({ group }: { group: string }) {
  const [, force] = useReducer((x: number) => x + 1, 0)
  const [panel, setPanel] = useState(false)

  useEffect(() => {
    ctl.init()
    force()
    ctl.listeners.add(force)
    return () => void ctl.listeners.delete(force)
  }, [])
  useEffect(() => { ctl.filter = group }, [group])

  const S = ctl.settings
  const active = ctl.hover ?? ctl.sel
  const info = active !== null ? skills[active] : null
  const InfoIcon = info ? skillIcons[info.icon] : null

  const hover = (i: number | null) => { ctl.hover = i; ctl.emit() }
  const select = (i: number) => {
    ctl.sel = ctl.sel === i ? null : i
    if (ctl.sel !== null) ctl.focusReq = i
    ctl.emit()
  }

  return (
    <div
      ref={(el) => { ctl.stage = el }}
      data-skill-stage
      data-labels={S.labels}
      data-colorgroup={S.colorByGroup ? "1" : "0"}
      className="relative h-[88vh] min-h-[620px] cursor-grab select-none [touch-action:pan-y]"
    >
      {/* skill chips — positioned every frame by the globe */}
      {skills.map((s, i) => {
        const Icon = skillIcons[s.icon]
        return (
          <div
            key={s.name}
            ref={(el) => { ctl.nodes[i] = el }}
            data-group={s.group}
            data-active="0"
            className="skill-node absolute left-0 top-0 will-change-transform"
            style={{ ["--lv" as string]: s.level, visibility: "hidden" }}
          >
            <button
              type="button"
              data-skill-node
              aria-label={`${s.name} — ${s.level}%`}
              onPointerEnter={() => hover(i)}
              onPointerLeave={() => hover(null)}
              onFocus={() => hover(i)}
              onBlur={() => hover(null)}
              onClick={() => { if (ctl.moved < 6) select(i) }}
              className="skill-chip flex flex-col items-center gap-1.5 outline-none"
            >
              <span className="skill-ring flex h-[3.4rem] w-[3.4rem] items-center justify-center rounded-full p-[3px]">
                <span className="flex h-full w-full items-center justify-center rounded-full bg-ink text-2xl" style={{ color: "rgb(var(--nc))" }}>
                  <Icon />
                </span>
              </span>
              <span className="skill-label whitespace-nowrap rounded-full border border-white/10 bg-ink/80 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur">
                {s.name}
              </span>
            </button>
          </div>
        )
      })}

      {/* toolbar */}
      <div data-no-drag className="absolute left-0 top-0 z-[300] flex gap-2">
        {[
          { icon: Plus, label: "Zoom in", fn: () => ctl.set({ zoom: clamp(S.zoom * 1.2, ZMIN, ZMAX) }) },
          { icon: Minus, label: "Zoom out", fn: () => ctl.set({ zoom: clamp(S.zoom / 1.2, ZMIN, ZMAX) }) },
          { icon: RotateCcw, label: "Reset view", fn: () => { ctl.resetReq = true; ctl.sel = null; ctl.set({ zoom: 1 }) } },
        ].map((b) => (
          <button key={b.label} onClick={b.fn} aria-label={b.label} title={b.label}
            className="glass flex h-10 w-10 items-center justify-center rounded-xl text-white/80 transition hover:border-mt1/60 hover:text-white">
            <b.icon size={16} />
          </button>
        ))}
      </div>

      <button
        data-no-drag
        onClick={() => setPanel((v) => !v)}
        aria-expanded={panel}
        className="glass absolute right-0 top-0 z-[300] flex h-10 items-center gap-2 rounded-xl px-4 text-xs font-semibold text-white transition hover:border-mt1/60"
      >
        {panel ? <X size={15} /> : <SlidersHorizontal size={15} />} Customize
      </button>

      <AnimatePresence>
        {panel && (
          <motion.div
            data-no-drag
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-14 z-[300] max-h-[calc(100%-4.5rem)] w-72 max-w-full space-y-5 overflow-y-auto rounded-2xl border border-white/10 bg-ink/85 p-5 text-white backdrop-blur-xl"
          >
            <Field label="Layout">
              <Seg value={S.layout} onChange={(v) => ctl.set({ layout: v as Layout })} options={[["sphere", "Sphere"], ["orbits", "Orbits"], ["helix", "Helix"]]} />
            </Field>
            <Field label="Auto-rotate"><Toggle on={S.autoRotate} onChange={(v) => ctl.set({ autoRotate: v })} /></Field>
            <Slider label="Rotation speed" value={S.speed} min={0.1} max={2} step={0.05} onChange={(v) => ctl.set({ speed: v })} fmt={(v) => `${v.toFixed(2)}×`} />
            <Slider label="Zoom" value={S.zoom} min={ZMIN} max={ZMAX} step={0.01} onChange={(v) => ctl.set({ zoom: v })} fmt={(v) => `${Math.round(v * 100)}%`} />
            <Slider label="Node size" value={S.nodeSize} min={0.7} max={1.5} step={0.05} onChange={(v) => ctl.set({ nodeSize: v })} fmt={(v) => `${Math.round(v * 100)}%`} />
            <Field label="Labels">
              <Seg value={S.labels} onChange={(v) => ctl.set({ labels: v as SkillSettings["labels"] })} options={[["hover", "On hover"], ["always", "Always"]]} />
            </Field>
            <Field label="Connections"><Toggle on={S.links} onChange={(v) => ctl.set({ links: v })} /></Field>
            <Field label="Color by group"><Toggle on={S.colorByGroup} onChange={(v) => ctl.set({ colorByGroup: v })} /></Field>
            <Field label="Scroll-wheel zoom"><Toggle on={S.wheelZoom} onChange={(v) => ctl.set({ wheelZoom: v })} /></Field>
            <button onClick={() => ctl.restore()} className="w-full rounded-xl border border-white/10 py-2.5 text-xs font-semibold text-white/70 transition hover:border-mt1/60 hover:text-white">
              Restore defaults
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* info card / hint */}
      <div data-no-drag className="pointer-events-none absolute bottom-0 left-0 z-[300] w-64 max-w-full">
        <AnimatePresence mode="wait">
          {info && InfoIcon ? (
            <motion.div key={info.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="glass rounded-2xl p-4 backdrop-blur-xl">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-2xl text-mt1"><InfoIcon /></span>
                <span>
                  <span className="block font-semibold text-white">{info.name}</span>
                  <span className="text-xs text-white/50">{info.group}</span>
                </span>
              </div>
              <div className="mb-1.5 flex justify-between text-xs text-white/50"><span>Proficiency</span><span className="text-white/80">{info.level}%</span></div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="bg-gradient-mt h-full rounded-full transition-all duration-500" style={{ width: `${info.level}%` }} />
              </div>
              {ctl.sel === active && <p className="mt-3 text-[11px] text-white/40">Click again to unpin</p>}
            </motion.div>
          ) : (
            <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-ink/60 px-4 py-2 text-[11px] tracking-wide text-white/60 backdrop-blur">
              <MousePointer2 size={13} className="text-mt1" /> Drag to rotate · Ctrl + scroll to zoom · Click a skill
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ───────── small UI helpers ───────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs font-semibold uppercase tracking-widest text-white/50">{label}</span>
      {children}
    </div>
  )
}
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button role="switch" aria-checked={on} onClick={() => onChange(!on)} className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? "bg-gradient-mt" : "bg-white/15"}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-[#fff] shadow transition-all ${on ? "left-[1.35rem]" : "left-0.5"}`} />
    </button>
  )
}
function Seg({ value, options, onChange }: { value: string; options: [string, string][]; onChange: (v: string) => void }) {
  return (
    <div className="flex rounded-lg bg-white/5 p-0.5">
      {options.map(([v, l]) => (
        <button key={v} onClick={() => onChange(v)} className={`rounded-md px-2.5 py-1.5 text-[11px] font-semibold transition ${value === v ? "bg-gradient-mt" : "text-white/60 hover:text-white"}`}>
          {l}
        </button>
      ))}
    </div>
  )
}
function Slider({ label, value, min, max, step, onChange, fmt }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; fmt: (v: number) => string }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-xs">
        <span className="font-semibold uppercase tracking-widest text-white/50">{label}</span>
        <span className="text-white/70">{fmt(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} aria-label={label} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full cursor-pointer accent-[rgb(var(--mt-1))]" />
    </div>
  )
}