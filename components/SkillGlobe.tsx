"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Maximize2, Minimize2, Minus, MousePointer2, Plus, RotateCcw, SlidersHorizontal, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { site } from "@/lib/content"
import { skillIcons } from "@/lib/icons"
import { live } from "@/lib/palette"
import { getTheme } from "@/lib/theme"

/* ───────────────────────── settings ───────────────────────── */
type Layout = "sphere" | "orbits" | "helix"
type Settings = {
  layout: Layout
  autoRotate: boolean
  speed: number // 0 – 2
  zoom: number // ZMIN – ZMAX
  nodeSize: number // 0.7 – 1.5
  labels: "always" | "hover"
  links: boolean
  colorByGroup: boolean
}
const DEFAULTS: Settings = { layout: "sphere", autoRotate: true, speed: 0.6, zoom: 1, nodeSize: 1, labels: "hover", links: true, colorByGroup: true }
const KEY = "mt-skill-globe"
const ZMIN = 0.55
const ZMAX = 2.4

const loadSettings = (): Settings => {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {}
  return DEFAULTS
}
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

/* ───────────────────────── layout math ───────────────────────── */
const skills = site.skills
const N = skills.length
const GROUPS = ["Frontend", "Backend", "Tools"]
const gIdx = skills.map((s) => GROUPS.indexOf(s.group))
const members = GROUPS.map((g) => skills.map((s, i) => (s.group === g ? i : -1)).filter((i) => i >= 0))
const posInGroup = skills.map((s, i) => members[GROUPS.indexOf(s.group)].indexOf(i))
const R = 4.6

const RINGS = [
  { r: 5.7, tilt: new THREE.Euler(0.45, 0, 0.22), speed: 0.26 },
  { r: 4.1, tilt: new THREE.Euler(-0.65, 0, -0.5), speed: -0.4 },
  { r: 2.6, tilt: new THREE.Euler(0.95, 0, 0.9), speed: 0.62 },
]

const targetFor = (i: number, layout: Layout, t: number, out: THREE.Vector3) => {
  if (layout === "sphere") {
    const y = 1 - (i / (N - 1)) * 2
    const rr = Math.sqrt(1 - y * y)
    const th = Math.PI * (3 - Math.sqrt(5)) * i
    return out.set(Math.cos(th) * rr * R, y * R, Math.sin(th) * rr * R)
  }
  if (layout === "orbits") {
    const g = gIdx[i]
    const ring = RINGS[g]
    const th = (posInGroup[i] / members[g].length) * Math.PI * 2 + t * ring.speed
    return out.set(Math.cos(th) * ring.r, 0, Math.sin(th) * ring.r).applyEuler(ring.tilt)
  }
  // helix
  const y = (i / (N - 1) - 0.5) * 9.4
  const th = i * 0.9
  return out.set(Math.cos(th) * 3.9, y, Math.sin(th) * 3.9)
}

/* ───────────────────────── component ───────────────────────── */
export default function SkillGlobe({ group, engaged }: { group: string; engaged: boolean }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const nodeEls = useRef<(HTMLDivElement | null)[]>([])
  const movedRef = useRef(0)

  const [settings, setSettings] = useState<Settings>(loadSettings)
  const sRef = useRef(settings)
  const groupRef = useRef(group)
  const engagedRef = useRef(engaged)
  const [hover, setHover] = useState<number | null>(null)
  const [sel, setSel] = useState<number | null>(null)
  const hoverRef = useRef<number | null>(null)
  const selRef = useRef<number | null>(null)
  const [panel, setPanel] = useState(false)
  const [full, setFull] = useState(false)
  const api = useRef({ reset: () => {}, focus: (_i: number) => {} })

  useEffect(() => { groupRef.current = group }, [group])
  useEffect(() => { engagedRef.current = engaged }, [engaged])
  useEffect(() => {
    sRef.current = settings
    try { localStorage.setItem(KEY, JSON.stringify(settings)) } catch {}
  }, [settings])

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch }
      sRef.current = next
      return next
    })
  }, [])

  const hoverNode = (i: number | null) => { hoverRef.current = i; setHover(i) }
  const selectNode = (i: number | null) => {
    selRef.current = i
    setSel(i)
    if (i !== null) api.current.focus(i)
  }

  /* ───────── fullscreen ───────── */
  useEffect(() => {
    const onFs = () => setFull(document.fullscreenElement === boxRef.current)
    document.addEventListener("fullscreenchange", onFs)
    return () => document.removeEventListener("fullscreenchange", onFs)
  }, [])
  const toggleFull = () => {
    const el = boxRef.current
    if (!el) return
    if (document.fullscreenElement) document.exitFullscreen?.()
    else el.requestFullscreen?.().catch(() => {})
  }

  /* ───────── three.js scene ───────── */
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block"
    stage.insertBefore(renderer.domElement, stage.firstChild)

    const world = new THREE.Group()
    scene.add(world)
    const disposables: { dispose: () => void }[] = []
    const track = <T extends { dispose: () => void }>(o: T) => (disposables.push(o), o)

    // shell (sphere layout)
    const shellMat = track(new THREE.MeshBasicMaterial({ wireframe: true, transparent: true, opacity: 0 }))
    world.add(new THREE.Mesh(track(new THREE.SphereGeometry(R, 26, 18)), shellMat))

    // orbit rings (orbit layout)
    const ringMats: THREE.MeshBasicMaterial[] = []
    RINGS.forEach((rd) => {
      const holder = new THREE.Group()
      holder.rotation.copy(rd.tilt)
      const m = track(new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }))
      const torus = new THREE.Mesh(track(new THREE.TorusGeometry(rd.r, 0.018, 6, 160)), m)
      torus.rotation.x = Math.PI / 2
      holder.add(torus)
      world.add(holder)
      ringMats.push(m)
    })

    // helix axis
    const axisGeo = track(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -5.2, 0), new THREE.Vector3(0, 5.2, 0)]))
    const axisMat = track(new THREE.LineBasicMaterial({ transparent: true, opacity: 0 }))
    world.add(new THREE.Line(axisGeo, axisMat))

    // core glow
    const coreMat = track(new THREE.MeshBasicMaterial())
    const core = new THREE.Mesh(track(new THREE.SphereGeometry(0.42, 24, 24)), coreMat)
    world.add(core)
    const cv = document.createElement("canvas")
    cv.width = cv.height = 128
    const cx = cv.getContext("2d")!
    const grd = cx.createRadialGradient(64, 64, 0, 64, 64, 64)
    grd.addColorStop(0, "rgba(255,255,255,1)")
    grd.addColorStop(0.35, "rgba(255,255,255,0.35)")
    grd.addColorStop(1, "rgba(255,255,255,0)")
    cx.fillStyle = grd
    cx.fillRect(0, 0, 128, 128)
    const haloTex = track(new THREE.CanvasTexture(cv))
    const haloMat = track(new THREE.SpriteMaterial({ map: haloTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
    const halo = new THREE.Sprite(haloMat)
    halo.scale.setScalar(3.4)
    world.add(halo)

    // dust
    const dustN = 450
    const dp = new Float32Array(dustN * 3)
    for (let i = 0; i < dustN; i++) {
      const r = 3 + Math.random() * 6
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      dp[i * 3] = r * Math.sin(ph) * Math.cos(th)
      dp[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th)
      dp[i * 3 + 2] = r * Math.cos(ph)
    }
    const dustGeo = track(new THREE.BufferGeometry())
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dp, 3))
    const dustMat = track(new THREE.PointsMaterial({ size: 0.06, transparent: true, opacity: 0.55, sizeAttenuation: true }))
    const dust = new THREE.Points(dustGeo, dustMat)
    world.add(dust)

    // links between neighbours of the same group
    const pairs: [number, number][] = []
    members.forEach((m) => {
      if (m.length < 2) return
      for (let k = 0; k < m.length; k++) {
        if (m.length === 2 && k === 1) break
        pairs.push([m[k], m[(k + 1) % m.length]])
      }
    })
    const linkArr = new Float32Array(pairs.length * 6)
    const linkGeo = track(new THREE.BufferGeometry())
    const linkAttr = new THREE.BufferAttribute(linkArr, 3)
    linkGeo.setAttribute("position", linkAttr)
    const linkMat = track(new THREE.LineBasicMaterial({ transparent: true, opacity: 0.4 }))
    world.add(new THREE.LineSegments(linkGeo, linkMat))

    // node state
    const cur = skills.map((_, i) => targetFor(i, "sphere", 0, new THREE.Vector3()).multiplyScalar(0.2))
    const tgt = new THREE.Vector3()
    const tmp = new THREE.Vector3()
    const colors = [new THREE.Color(), new THREE.Color(), new THREE.Color()]

    // interaction state
    const rot = new THREE.Quaternion()
    const qa = new THREE.Quaternion()
    let focusQ: THREE.Quaternion | null = null
    let velX = 0
    let velY = 0
    let dragging = false
    let lastX = 0
    let lastY = 0
    const ptrs = new Map<number, { x: number; y: number }>()
    let pinchD = 0
    let zoomSm = 0.7
    let engagedMix = 0
    let lightMix = 0
    let lastLight = false
    let visible = true
    let w = 1
    let h = 1

    const applyRot = (dx: number, dy: number) => {
      qa.setFromAxisAngle(new THREE.Vector3(0, 1, 0), dx)
      rot.premultiply(qa)
      qa.setFromAxisAngle(new THREE.Vector3(1, 0, 0), dy)
      rot.premultiply(qa)
      rot.normalize()
    }

    api.current.reset = () => {
      rot.identity()
      focusQ = null
      velX = velY = 0
      selRef.current = null
      setSel(null)
      update({ zoom: 1 })
    }
    api.current.focus = (i: number) => {
      if (sRef.current.layout === "orbits") return
      targetFor(i, sRef.current.layout, 0, tmp)
      focusQ = new THREE.Quaternion().setFromUnitVectors(tmp.clone().normalize(), new THREE.Vector3(0, 0, 1))
    }

    /* pointer handlers */
    const onDown = (e: PointerEvent) => {
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (ptrs.size === 1) {
        dragging = true
        movedRef.current = 0
        lastX = e.clientX
        lastY = e.clientY
        focusQ = null
        stage.style.cursor = "grabbing"
      } else if (ptrs.size === 2) {
        const [a, b] = [...ptrs.values()]
        pinchD = Math.hypot(a.x - b.x, a.y - b.y)
      }
    }
    const onMove = (e: PointerEvent) => {
      if (!ptrs.has(e.pointerId)) return
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (ptrs.size === 2) {
        const [a, b] = [...ptrs.values()]
        const d = Math.hypot(a.x - b.x, a.y - b.y)
        if (pinchD > 0) update({ zoom: clamp(sRef.current.zoom * (d / pinchD), ZMIN, ZMAX) })
        pinchD = d
        movedRef.current += 10
        return
      }
      if (!dragging) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      lastX = e.clientX
      lastY = e.clientY
      movedRef.current += Math.abs(dx) + Math.abs(dy)
      velY = velY * 0.4 + dx * 0.0055 * 0.6
      velX = velX * 0.4 + dy * 0.0055 * 0.6
      applyRot(dx * 0.0055, dy * 0.0055)
    }
    const onUp = (e: PointerEvent) => {
      ptrs.delete(e.pointerId)
      if (ptrs.size === 0) {
        dragging = false
        stage.style.cursor = "grab"
      }
      if (ptrs.size < 2) pinchD = 0
    }
    const onWheel = (e: WheelEvent) => {
      const z = sRef.current.zoom
      const next = clamp(z * Math.exp(-e.deltaY * 0.0013), ZMIN, ZMAX)
      if (next === z) return // at the limit → let the page scroll normally
      e.preventDefault()
      update({ zoom: next })
    }
    stage.addEventListener("pointerdown", onDown)
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    window.addEventListener("pointercancel", onUp)
    stage.addEventListener("wheel", onWheel, { passive: false })

    /* sizing + visibility */
    const ro = new ResizeObserver(() => {
      w = Math.max(1, stage.clientWidth)
      h = Math.max(1, stage.clientHeight)
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    })
    ro.observe(stage)
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting), { threshold: 0.01 })
    io.observe(stage)

    /* loop */
    const clock = new THREE.Clock()
    let time = 0
    let raf = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (!visible || document.hidden) { clock.getDelta(); return }
      const dt = Math.min(clock.getDelta(), 0.05)
      time += dt
      const S = sRef.current
      const light = getTheme() === "light"
      lightMix += ((light ? 1 : 0) - lightMix) * 0.1
      engagedMix += ((engagedRef.current ? 1 : 0) - engagedMix) * 0.06
      const k = 1 - 0.18 * lightMix

      // palette colors
      live.c.forEach((c, i) => colors[i].setRGB((c[0] / 255) * k, (c[1] / 255) * k, (c[2] / 255) * k))
      shellMat.color.copy(colors[0])
      axisMat.color.copy(colors[1])
      ringMats.forEach((m, i) => m.color.copy(colors[i % 3]))
      coreMat.color.copy(colors[2])
      haloMat.color.copy(colors[0]).lerp(colors[2], 0.4)
      dustMat.color.copy(colors[1])
      linkMat.color.copy(S.colorByGroup ? colors[1] : colors[0])
      if (light !== lastLight) {
        lastLight = light
        haloMat.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending
        haloMat.needsUpdate = true
      }
      haloMat.opacity = (light ? 0.35 : 0.7) * (0.75 + 0.25 * engagedMix)
      halo.scale.setScalar(3.2 + Math.sin(time * 1.6) * 0.18 + engagedMix * 0.5)
      core.scale.setScalar(1 + Math.sin(time * 2) * 0.06)
      dustMat.opacity = (light ? 0.5 : 0.55)
      dust.rotation.y += dt * 0.02

      // layout visuals
      const lerpTo = (cur: number, to: number) => cur + (to - cur) * 0.08
      shellMat.opacity = lerpTo(shellMat.opacity, S.layout === "sphere" ? 0.1 + lightMix * 0.08 : 0)
      ringMats.forEach((m) => (m.opacity = lerpTo(m.opacity, S.layout === "orbits" ? 0.4 : 0)))
      axisMat.opacity = lerpTo(axisMat.opacity, S.layout === "helix" ? 0.4 : 0)
      linkMat.opacity = lerpTo(linkMat.opacity, S.links ? 0.38 : 0)

      // rotation
      const active = hoverRef.current ?? selRef.current
      if (focusQ && !dragging) {
        rot.slerp(focusQ, 1 - Math.exp(-dt * 4))
        if (rot.angleTo(focusQ) < 0.01) focusQ = null
      } else if (!dragging) {
        applyRot(velY, velX)
        velY *= 0.93
        velX *= 0.93
        if (S.autoRotate && active === null && !reduced && Math.abs(velY) + Math.abs(velX) < 0.004) applyRot(dt * S.speed * 0.35, 0)
      }
      world.quaternion.copy(rot)

      // zoom / camera
      zoomSm += (S.zoom * (1 + engagedMix * 0.07) - zoomSm) * (1 - Math.exp(-dt * 7))
      const base = 16 / Math.min(1, (w / h) * 1.15)
      camera.position.set(0, 0, base / zoomSm)
      camera.lookAt(0, 0, 0)
      camera.updateMatrixWorld()

      // nodes
      const ease = 1 - Math.exp(-dt * 5)
      const flt = groupRef.current
      for (let i = 0; i < N; i++) {
        targetFor(i, S.layout, time, tgt)
        cur[i].lerp(tgt, ease)
      }
      for (let p = 0; p < pairs.length; p++) {
        const a = cur[pairs[p][0]]
        const b = cur[pairs[p][1]]
        linkArr.set([a.x, a.y, a.z, b.x, b.y, b.z], p * 6)
      }
      linkAttr.needsUpdate = true

      const activeGroup = active !== null ? skills[active].group : null
      for (let i = 0; i < N; i++) {
        const el = nodeEls.current[i]
        if (!el) continue
        tmp.copy(cur[i]).applyQuaternion(rot)
        const df = clamp((tmp.z + 6) / 12, 0, 1)
        tmp.project(camera)
        const x = (tmp.x * w) / 2
        const y = (-tmp.y * h) / 2
        const isActive = active === i
        const filtered = flt !== "All" && skills[i].group !== flt
        let op = 0.4 + 0.6 * df
        if (activeGroup && !isActive && skills[i].group !== activeGroup) op *= 0.5
        if (filtered) op *= 0.14
        const sc = (0.6 + 0.55 * df) * S.nodeSize * (isActive ? 1.25 : 1)
        el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) translate(-50%,-50%) scale(${sc.toFixed(3)})`
        el.style.opacity = op.toFixed(3)
        el.style.zIndex = String(Math.round(df * 50) + (isActive ? 100 : 0))
        el.style.pointerEvents = filtered ? "none" : "auto"
        el.dataset.active = isActive ? "1" : "0"
      }

      renderer.render(scene, camera)
    }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      stage.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      window.removeEventListener("pointercancel", onUp)
      stage.removeEventListener("wheel", onWheel)
      ro.disconnect()
      io.disconnect()
      disposables.forEach((d) => d.dispose())
      renderer.dispose()
      if (renderer.domElement.parentNode === stage) stage.removeChild(renderer.domElement)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const active = hover ?? sel
  const info = active !== null ? skills[active] : null
  const InfoIcon = info ? skillIcons[info.icon] : null

  return (
    <div
      ref={boxRef}
      className={`glass relative overflow-hidden rounded-3xl ${full ? "bg-ink" : ""} h-[480px] md:h-[640px]`}
      style={full ? { height: "100vh", borderRadius: 0 } : undefined}
    >
      {/* interactive stage */}
      <div
        ref={stageRef}
        data-labels={settings.labels}
        data-colorgroup={settings.colorByGroup ? "1" : "0"}
        className="absolute inset-0 cursor-grab select-none [touch-action:pan-y]"
      >
        {skills.map((s, i) => {
          const Icon = skillIcons[s.icon]
          return (
            <div
              key={s.name}
              ref={(el) => { nodeEls.current[i] = el }}
              data-group={s.group}
              data-active="0"
              className="skill-node absolute left-1/2 top-1/2 will-change-transform"
              style={{ ["--lv" as string]: s.level }}
            >
              <button
                type="button"
                aria-label={`${s.name} — ${s.level}%`}
                onPointerEnter={() => hoverNode(i)}
                onPointerLeave={() => hoverNode(null)}
                onFocus={() => hoverNode(i)}
                onBlur={() => hoverNode(null)}
                onClick={() => { if (movedRef.current < 6) selectNode(sel === i ? null : i) }}
                className="skill-chip group flex flex-col items-center gap-1.5 outline-none"
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
      </div>

      {/* top-left toolbar */}
      <div className="absolute left-4 top-4 z-[300] flex gap-2">
        {[
          { icon: Plus, label: "Zoom in", fn: () => update({ zoom: clamp(settings.zoom * 1.25, ZMIN, ZMAX) }) },
          { icon: Minus, label: "Zoom out", fn: () => update({ zoom: clamp(settings.zoom / 1.25, ZMIN, ZMAX) }) },
          { icon: RotateCcw, label: "Reset view", fn: () => api.current.reset() },
          { icon: full ? Minimize2 : Maximize2, label: full ? "Exit fullscreen" : "Fullscreen", fn: toggleFull },
        ].map((b) => (
          <button key={b.label} onClick={b.fn} aria-label={b.label} title={b.label}
            className="glass flex h-10 w-10 items-center justify-center rounded-xl text-white/80 transition hover:border-mt1/60 hover:text-white">
            <b.icon size={16} />
          </button>
        ))}
      </div>

      {/* customize button */}
      <button
        onClick={() => setPanel((v) => !v)}
        className="glass absolute right-4 top-4 z-[300] flex h-10 items-center gap-2 rounded-xl px-4 text-xs font-semibold text-white transition hover:border-mt1/60"
        aria-expanded={panel}
      >
        {panel ? <X size={15} /> : <SlidersHorizontal size={15} />} Customize
      </button>

      {/* customize panel */}
      <AnimatePresence>
        {panel && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="absolute right-4 top-16 z-[300] max-h-[calc(100%-5.5rem)] w-72 max-w-[calc(100%-2rem)] space-y-5 overflow-y-auto rounded-2xl border border-white/10 bg-ink/85 p-5 text-white backdrop-blur-xl"
          >
            <Field label="Layout">
              <Seg value={settings.layout} onChange={(v) => update({ layout: v as Layout })}
                options={[["sphere", "Sphere"], ["orbits", "Orbits"], ["helix", "Helix"]]} />
            </Field>
            <Field label="Auto-rotate">
              <Toggle on={settings.autoRotate} onChange={(v) => update({ autoRotate: v })} />
            </Field>
            <Slider label="Rotation speed" value={settings.speed} min={0.1} max={2} step={0.05} onChange={(v) => update({ speed: v })} fmt={(v) => `${v.toFixed(2)}×`} />
            <Slider label="Zoom" value={settings.zoom} min={ZMIN} max={ZMAX} step={0.01} onChange={(v) => update({ zoom: v })} fmt={(v) => `${Math.round(v * 100)}%`} />
            <Slider label="Node size" value={settings.nodeSize} min={0.7} max={1.5} step={0.05} onChange={(v) => update({ nodeSize: v })} fmt={(v) => `${Math.round(v * 100)}%`} />
            <Field label="Labels">
              <Seg value={settings.labels} onChange={(v) => update({ labels: v as Settings["labels"] })} options={[["hover", "On hover"], ["always", "Always"]]} />
            </Field>
            <Field label="Connections"><Toggle on={settings.links} onChange={(v) => update({ links: v })} /></Field>
            <Field label="Color by group"><Toggle on={settings.colorByGroup} onChange={(v) => update({ colorByGroup: v })} /></Field>
            <button
              onClick={() => { setSettings(DEFAULTS); sRef.current = DEFAULTS; api.current.reset() }}
              className="w-full rounded-xl border border-white/10 py-2.5 text-xs font-semibold text-white/70 transition hover:border-mt1/60 hover:text-white"
            >
              Restore defaults
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* info card */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-[300] w-64 max-w-[calc(100%-2rem)]">
        <AnimatePresence mode="wait">
          {info && InfoIcon ? (
            <motion.div key={info.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              className="glass rounded-2xl p-4 backdrop-blur-xl">
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
              {sel === active && <p className="mt-3 text-[11px] text-white/40">Click again to unpin</p>}
            </motion.div>
          ) : (
            <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-ink/60 px-4 py-2 text-[11px] tracking-wide text-white/60 backdrop-blur">
              <MousePointer2 size={13} className="text-mt1" /> Drag to rotate · Scroll to zoom · Click a skill
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ───────────────────────── small UI helpers ───────────────────────── */
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
    <button
      role="switch" aria-checked={on} onClick={() => onChange(!on)}
      className={`relative h-6 w-11 rounded-full transition ${on ? "bg-gradient-mt" : "bg-white/15"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-[#fff] shadow transition-all ${on ? "left-[1.35rem]" : "left-0.5"}`} />
    </button>
  )
}

function Seg({ value, options, onChange }: { value: string; options: [string, string][]; onChange: (v: string) => void }) {
  return (
    <div className="flex rounded-lg bg-white/5 p-0.5">
      {options.map(([v, l]) => (
        <button
          key={v} onClick={() => onChange(v)}
          className={`rounded-md px-2.5 py-1.5 text-[11px] font-semibold transition ${value === v ? "bg-gradient-mt" : "text-white/60 hover:text-white"}`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

function Slider({ label, value, min, max, step, onChange, fmt }: {
  label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; fmt: (v: number) => string
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-xs">
        <span className="font-semibold uppercase tracking-widest text-white/50">{label}</span>
        <span className="text-white/70">{fmt(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value} aria-label={label}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full cursor-pointer accent-[rgb(var(--mt-1))]"
      />
    </div>
  )
}
