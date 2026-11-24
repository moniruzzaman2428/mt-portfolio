"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { live } from "@/lib/palette"
import { getTheme } from "@/lib/theme"
import { N, RINGS, ZMAX, ZMIN, clamp, ctl, members, skills, targetFor } from "@/lib/skillCtl"

const R = 5 // globe radius

const DOT_VERT = /* glsl */ `
  attribute float aLand;
  attribute float aSeed;
  uniform float uTime;
  uniform float uPixel;
  uniform vec3 uC1;
  uniform vec3 uC2;
  uniform vec3 uC3;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    float wave = 0.5 + 0.5 * sin(uTime * 1.3 - p.y * 0.9 + p.x * 0.35);
    vec3 base = mix(uC1, uC2, (p.y / 5.0) * 0.5 + 0.5);
    vColor = mix(base, uC3, wave * aLand * 0.95);
    vec4 mv = modelViewMatrix * vec4(p * (1.0 + 0.025 * wave * aLand), 1.0);
    float facing = normalize(mat3(modelViewMatrix) * p).z;
    vAlpha = mix(0.22, 1.0, aLand) * (0.65 + 0.35 * sin(uTime * 2.0 + aSeed * 6.2831));
    vAlpha *= mix(0.18, 1.0, smoothstep(-0.25, 0.45, facing));
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (aLand > 0.5 ? 3.4 : 1.7) * uPixel * (13.0 / -mv.z);
  }
`
const DOT_FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(vColor, smoothstep(0.5, 0.08, d) * vAlpha);
  }
`
const ATMO_VERT = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const ATMO_FRAG = /* glsl */ `
  uniform vec3 glowColor;
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
    gl_FragColor = vec4(glowColor, 1.0) * intensity * 1.6;
  }
`

/** Cheap pseudo-noise that produces continent-like blobs on the sphere. */
const land = (x: number, y: number, z: number) => {
  const n =
    Math.sin(x * 0.9 + 1.3) * Math.cos(y * 1.1 - 0.4) +
    Math.sin(y * 1.7 + z * 1.2) * 0.6 +
    Math.cos(z * 1.4 - x * 0.8 + 2.0) * 0.5 +
    Math.sin((x + y + z) * 2.3) * 0.25
  return n > 0.35 ? 1 : 0
}

/**
 * The one background globe. In the hero it sits on the right; while scrolling it
 * shrinks away — and when the Skills section scrolls into view it flies to the
 * centre of the Skills stage (ctl.stage), where the skills orbit it. The same
 * globe can then be dragged, zoomed and explored.
 */
export default function Globe() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [showHint, setShowHint] = useState(true)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    ctl.init()

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.domElement.style.display = "block"
    mount.appendChild(renderer.domElement)

    const col = () => live.c.map((c) => new THREE.Color(c[0] / 255, c[1] / 255, c[2] / 255))

    // ── Stars ────────────────────────────────────────────────
    const starCount = 2600
    const sp = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      const r = 60 + Math.random() * 180
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      sp[i * 3] = r * Math.sin(ph) * Math.cos(th)
      sp[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th)
      sp[i * 3 + 2] = r * Math.cos(ph)
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3))
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.35, sizeAttenuation: true, transparent: true, opacity: 0.85 })
    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)

    // ── Globe group ──────────────────────────────────────────
    const group = new THREE.Group()
    scene.add(group)

    const N_DOTS = 6200
    const pos = new Float32Array(N_DOTS * 3)
    const lnd = new Float32Array(N_DOTS)
    const seed = new Float32Array(N_DOTS)
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < N_DOTS; i++) {
      const y = 1 - (i / (N_DOTS - 1)) * 2
      const rr = Math.sqrt(1 - y * y)
      const th = golden * i
      const x = Math.cos(th) * rr
      const z = Math.sin(th) * rr
      pos[i * 3] = x * R
      pos[i * 3 + 1] = y * R
      pos[i * 3 + 2] = z * R
      lnd[i] = land(x * 2, y * 2, z * 2)
      seed[i] = Math.random()
    }
    const dotGeo = new THREE.BufferGeometry()
    dotGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3))
    dotGeo.setAttribute("aLand", new THREE.BufferAttribute(lnd, 1))
    dotGeo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1))
    const [c1, c2, c3] = col()
    const dotMat = new THREE.ShaderMaterial({
      vertexShader: DOT_VERT,
      fragmentShader: DOT_FRAG,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uPixel: { value: renderer.getPixelRatio() * 1.4 },
        uC1: { value: c1 },
        uC2: { value: c2 },
        uC3: { value: c3 },
      },
    })
    group.add(new THREE.Points(dotGeo, dotMat))

    const coreMat = new THREE.MeshBasicMaterial({ color: 0x05060a })
    group.add(new THREE.Mesh(new THREE.SphereGeometry(R - 0.06, 48, 48), coreMat))

    const wireMat = new THREE.MeshBasicMaterial({ color: c1.clone(), wireframe: true, transparent: true, opacity: 0.07 })
    group.add(new THREE.Mesh(new THREE.SphereGeometry(R + 0.02, 24, 24), wireMat))

    const atmoMat = new THREE.ShaderMaterial({
      vertexShader: ATMO_VERT,
      fragmentShader: ATMO_FRAG,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
      uniforms: { glowColor: { value: c1.clone() } },
    })
    const atmo = new THREE.Mesh(new THREE.SphereGeometry(R + 0.7, 48, 48), atmoMat)
    scene.add(atmo)

    // Decorative orbit rings with satellites (fade while skills are shown)
    const rings: { holder: THREE.Group; sat: THREE.Mesh; speed: number; mat: THREE.MeshBasicMaterial; satMat: THREE.MeshBasicMaterial }[] = []
    const ringDefs = [
      { r: R + 1.4, tilt: [1.2, 0.2], speed: 0.55 },
      { r: R + 2.1, tilt: [0.5, -0.9], speed: -0.38 },
      { r: R + 2.8, tilt: [-0.7, 0.5], speed: 0.27 },
    ]
    ringDefs.forEach((d) => {
      const pivot = new THREE.Group()
      pivot.rotation.set(d.tilt[0], d.tilt[1], 0)
      const mat = new THREE.MeshBasicMaterial({ color: c2.clone(), transparent: true, opacity: 0.32 })
      pivot.add(new THREE.Mesh(new THREE.TorusGeometry(d.r, 0.008, 6, 220), mat))
      const satMat = new THREE.MeshBasicMaterial({ color: c3.clone(), transparent: true })
      const sat = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), satMat)
      sat.position.x = d.r
      const holder = new THREE.Group()
      holder.add(sat)
      pivot.add(holder)
      group.add(pivot)
      rings.push({ holder, sat, speed: d.speed, mat, satMat })
    })

    // ── Skill-mode helpers (links, layout rings, helix axis) ──
    const skillRingMats: THREE.MeshBasicMaterial[] = []
    RINGS.forEach((rd) => {
      const holder = new THREE.Group()
      holder.rotation.set(rd.tilt[0], 0, rd.tilt[1])
      const m = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
      const torus = new THREE.Mesh(new THREE.TorusGeometry(rd.r, 0.014, 6, 180), m)
      torus.rotation.x = Math.PI / 2
      holder.add(torus)
      group.add(holder)
      skillRingMats.push(m)
    })
    const axisMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0 })
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -R * 1.3, 0), new THREE.Vector3(0, R * 1.3, 0)]), axisMat))

    const pairs: [number, number][] = []
    members.forEach((m) => {
      if (m.length < 2) return
      for (let k = 0; k < m.length; k++) {
        if (m.length === 2 && k === 1) break
        pairs.push([m[k], m[(k + 1) % m.length]])
      }
    })
    const linkArr = new Float32Array(pairs.length * 6)
    const linkGeo = new THREE.BufferGeometry()
    const linkAttr = new THREE.BufferAttribute(linkArr, 3)
    linkGeo.setAttribute("position", linkAttr)
    const linkMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0 })
    const linkLines = new THREE.LineSegments(linkGeo, linkMat)
    linkLines.frustumCulled = false
    group.add(linkLines)

    // ── Interaction ──────────────────────────────────────────
    const rot = new THREE.Quaternion()
    const qa = new THREE.Quaternion()
    const AX = new THREE.Vector3(1, 0, 0)
    const AY = new THREE.Vector3(0, 1, 0)
    const applyRot = (dx: number, dy: number) => {
      qa.setFromAxisAngle(AY, dx)
      rot.premultiply(qa)
      qa.setFromAxisAngle(AX, dy)
      rot.premultiply(qa)
      rot.normalize()
    }
    let focusQ: THREE.Quaternion | null = null
    let vx = 0
    let vy = 0
    let dragging = false
    let lx = 0
    let ly = 0
    let pinchD = 0
    const ptrs = new Map<number, { x: number; y: number }>()
    const mouse = { x: 0, y: 0 }

    const interactive = (el: EventTarget | null) =>
      el instanceof Element && !!el.closest("a,button,input,textarea,select,label,form,[data-no-drag]")

    const onDown = (e: PointerEvent) => {
      const t = e.target as Element
      if (!(t instanceof Element)) return
      if (t.closest("[data-no-drag]")) return
      const inStage = !!t.closest("[data-skill-stage]")
      const isNode = !!t.closest("[data-skill-node]")
      if (!inStage && (interactive(t) || window.scrollY > window.innerHeight * 0.85)) return
      if (inStage && interactive(t) && !isNode) return
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (ptrs.size === 1) {
        dragging = true
        lx = e.clientX
        ly = e.clientY
        focusQ = null
        if (inStage) ctl.moved = 0
      } else if (ptrs.size === 2) {
        const [a, b] = [...ptrs.values()]
        pinchD = Math.hypot(a.x - b.x, a.y - b.y)
      }
    }
    const onMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
      if (!ptrs.has(e.pointerId)) return
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (ptrs.size === 2) {
        const [a, b] = [...ptrs.values()]
        const d = Math.hypot(a.x - b.x, a.y - b.y)
        if (pinchD > 0) ctl.set({ zoom: clamp(ctl.settings.zoom * (d / pinchD), ZMIN, ZMAX) })
        pinchD = d
        ctl.moved += 10
        return
      }
      if (!dragging) return
      const dx = e.clientX - lx
      const dy = e.clientY - ly
      lx = e.clientX
      ly = e.clientY
      ctl.moved += Math.abs(dx) + Math.abs(dy)
      vy += dx * 0.0006
      vx += dy * 0.0006
    }
    const onUp = (e: PointerEvent) => {
      ptrs.delete(e.pointerId)
      if (ptrs.size === 0) dragging = false
      if (ptrs.size < 2) pinchD = 0
    }
    // Zoom: Ctrl/⌘ + wheel (also trackpad pinch) — or plain wheel when "Scroll-wheel zoom" is on.
    const onWheel = (e: WheelEvent) => {
      const t = e.target as Element
      if (!(t instanceof Element) || !t.closest("[data-skill-stage]") || t.closest("[data-no-drag]")) return
      if (!(e.ctrlKey || e.metaKey || ctl.settings.wheelZoom)) return
      const z = ctl.settings.zoom
      const next = clamp(z * Math.exp(-e.deltaY * 0.0014), ZMIN, ZMAX)
      if (next === z) return
      e.preventDefault()
      ctl.set({ zoom: next })
    }
    window.addEventListener("pointerdown", onDown)
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    window.addEventListener("pointercancel", onUp)
    window.addEventListener("wheel", onWheel, { passive: false })

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", onResize)

    // ── Animate ──────────────────────────────────────────────
    const clock = new THREE.Clock()
    let raf = 0
    let scrollP = 0
    let stageMix = 0
    let engagedMix = 0
    let lightMix = 0
    let time = 0
    const tmp = [new THREE.Color(), new THREE.Color(), new THREE.Color()]
    const cur = skills.map((_, i) => new THREE.Vector3(...targetFor(i, "sphere", 0)).multiplyScalar(0.3))
    const v = new THREE.Vector3()

    const animate = () => {
      raf = requestAnimationFrame(animate)
      const dt = Math.min(clock.getDelta(), 0.05)
      time += dt
      const S = ctl.settings

      // theme + palette
      const light = getTheme() === "light"
      lightMix += ((light ? 1 : 0) - lightMix) * 0.08
      const k = 1 - 0.18 * lightMix
      coreMat.color.setRGB(0.02 + lightMix * 0.94, 0.024 + lightMix * 0.95, 0.039 + lightMix * 0.96)
      starMat.opacity = 0.85 * (1 - lightMix)
      atmo.visible = lightMix < 0.5
      wireMat.opacity = 0.07 + lightMix * 0.1
      live.c.forEach((c, i) => tmp[i].setRGB((c[0] / 255) * k, (c[1] / 255) * k, (c[2] / 255) * k))
      dotMat.uniforms.uC1.value.copy(tmp[0])
      dotMat.uniforms.uC2.value.copy(tmp[1])
      dotMat.uniforms.uC3.value.copy(tmp[2])
      dotMat.uniforms.uTime.value = time
      wireMat.color.copy(tmp[0])
      atmoMat.uniforms.glowColor.value.copy(tmp[0]).lerp(tmp[1], 0.4)
      starMat.color.set(0xffffff).lerp(tmp[0], 0.25)
      axisMat.color.copy(tmp[1])
      skillRingMats.forEach((m, i) => m.color.copy(tmp[i % 3]))
      linkMat.color.copy(S.colorByGroup ? tmp[1] : tmp[0])

      // camera / viewport
      const W = window.innerWidth
      const H = window.innerHeight
      const aspect = W / H
      const wide = aspect > 1.15
      camera.position.z = wide ? 15 : Math.min(26, 15 / Math.max(aspect * 1.25, 0.55))

      // how strongly the skills stage is on screen (0..1)
      const stage = ctl.stage
      let rect: DOMRect | null = null
      let mTarget = 0
      if (stage) {
        rect = stage.getBoundingClientRect()
        const ov = (Math.min(rect.bottom, H) - Math.max(rect.top, 0)) / Math.min(rect.height, H)
        mTarget = clamp((ov - 0.3) / 0.45, 0, 1)
      }
      stageMix += (mTarget - stageMix) * 0.08
      engagedMix += ((ctl.engaged ? 1 : 0) - engagedMix) * 0.06
      const m = stageMix

      // default placement (hero → shrinks & moves away on scroll)
      const targetP = Math.min(window.scrollY / H, 1)
      scrollP += (targetP - scrollP) * 0.08
      let tx = (wide ? 3.6 : 0) + scrollP * (wide ? 2.2 : 0)
      let ty = wide ? 0 : 1.2 - scrollP * 1.2
      let ts = 1 - scrollP * 0.3
      let op = (wide ? 1 : 0.55) - scrollP * 0.45

      // skills-stage placement: centre of the stage, sized to fit the orbiting skills
      if (rect && m > 0.001) {
        const upp = (2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) / H
        const sx = (rect.left + rect.width / 2 - W / 2) * upp
        const sy = -(rect.top + rect.height / 2 - H / 2) * upp
        const pr = Math.min(rect.width, rect.height) * 0.3 * S.zoom * (1 + engagedMix * 0.05)
        tx += (sx - tx) * m
        ty += (sy - ty) * m
        ts += ((pr * upp) / R - ts) * m
        op += (0.95 - op) * m
      }
      const ease = 0.08 + 0.2 * m
      group.position.x += (tx - group.position.x) * ease
      group.position.y += (ty - group.position.y) * ease
      group.scale.setScalar(ts)
      atmo.position.copy(group.position)
      atmo.scale.setScalar(ts)
      renderer.domElement.style.opacity = String(op)

      // reset / focus requests from the UI
      if (ctl.resetReq) { ctl.resetReq = false; rot.identity(); focusQ = null; vx = vy = 0 }
      if (ctl.focusReq !== null) {
        if (S.layout !== "orbits") {
          const p = new THREE.Vector3(...targetFor(ctl.focusReq, S.layout, time)).normalize()
          focusQ = new THREE.Quaternion().setFromUnitVectors(p, new THREE.Vector3(0, 0, 1))
        }
        ctl.focusReq = null
      }

      // rotation: idle spin (or user speed in skills mode) + inertia
      const active = ctl.hover ?? ctl.sel
      if (focusQ && !dragging) {
        rot.slerp(focusQ, 1 - Math.exp(-dt * 4))
        if (rot.angleTo(focusQ) < 0.01) focusQ = null
      } else {
        const userSpin = S.autoRotate && active === null ? S.speed / 0.6 : 0
        const spin = 1 + (userSpin - 1) * m
        applyRot(dt * 0.14 * spin + vy, vx)
      }
      vx *= 0.92
      vy *= 0.92
      group.quaternion.copy(rot)

      // decorative satellites rings + stars
      rings.forEach((r) => {
        r.mat.color.copy(tmp[(rings.indexOf(r) + 1) % 3])
        r.satMat.color.copy(tmp[(rings.indexOf(r) + 2) % 3])
        r.holder.rotation.z += dt * r.speed
        r.mat.opacity = 0.32 * (1 - 0.7 * m)
        r.satMat.opacity = 1 - m
      })
      stars.rotation.y += dt * 0.006
      stars.rotation.x += dt * 0.002
      camera.position.x += (mouse.x * 0.6 * (1 - m) - camera.position.x) * 0.03

      // layout visuals
      const fade = (cur: number, to: number) => cur + (to - cur) * 0.1
      skillRingMats.forEach((mm) => (mm.opacity = fade(mm.opacity, S.layout === "orbits" ? 0.45 * m : 0)))
      axisMat.opacity = fade(axisMat.opacity, S.layout === "helix" ? 0.45 * m : 0)
      linkMat.opacity = fade(linkMat.opacity, S.links ? 0.42 * m : 0)

      // skill nodes (HTML overlay inside the stage, projected from the globe's 3D space)
      group.updateMatrixWorld(true)
      camera.updateMatrixWorld()
      camera.updateProjectionMatrix()
      const nEase = 1 - Math.exp(-dt * 5)
      for (let i = 0; i < N; i++) {
        const t = targetFor(i, S.layout, time)
        cur[i].x += (t[0] - cur[i].x) * nEase
        cur[i].y += (t[1] - cur[i].y) * nEase
        cur[i].z += (t[2] - cur[i].z) * nEase
      }
      for (let p = 0; p < pairs.length; p++) {
        const a = cur[pairs[p][0]]
        const b = cur[pairs[p][1]]
        linkArr[p * 6] = a.x; linkArr[p * 6 + 1] = a.y; linkArr[p * 6 + 2] = a.z
        linkArr[p * 6 + 3] = b.x; linkArr[p * 6 + 4] = b.y; linkArr[p * 6 + 5] = b.z
      }
      linkAttr.needsUpdate = true

      const showNodes = !!rect && m > 0.02
      const activeGroup = active !== null ? skills[active].group : null
      const worldR = R * 1.5 * ts
      for (let i = 0; i < N; i++) {
        const el = ctl.nodes[i]
        if (!el) continue
        if (!showNodes || !rect) {
          if (el.style.visibility !== "hidden") el.style.visibility = "hidden"
          continue
        }
        v.copy(cur[i]).applyMatrix4(group.matrixWorld)
        const df = clamp(((v.z - group.position.z) / worldR + 1) / 2, 0, 1)
        v.project(camera)
        const px = (v.x * 0.5 + 0.5) * W - rect.left
        const py = (-v.y * 0.5 + 0.5) * H - rect.top
        const isActive = active === i
        const filtered = ctl.filter !== "All" && skills[i].group !== ctl.filter
        let o = (0.4 + 0.6 * df) * m
        if (activeGroup && !isActive && skills[i].group !== activeGroup) o *= 0.5
        if (filtered) o *= 0.14
        const sc = (0.6 + 0.55 * df) * S.nodeSize * (isActive ? 1.25 : 1)
        el.style.visibility = "visible"
        el.style.transform = `translate3d(${px.toFixed(1)}px,${py.toFixed(1)}px,0) translate(-50%,-50%) scale(${sc.toFixed(3)})`
        el.style.opacity = o.toFixed(3)
        el.style.zIndex = String(Math.round(df * 50) + (isActive ? 100 : 0))
        el.style.pointerEvents = filtered || m < 0.5 ? "none" : "auto"
        el.dataset.active = isActive ? "1" : "0"
      }

      renderer.render(scene, camera)
    }
    animate()

    const hint = setTimeout(() => setShowHint(false), 5000)

    return () => {
      clearTimeout(hint)
      cancelAnimationFrame(raf)
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      window.removeEventListener("pointercancel", onUp)
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("resize", onResize)
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh
        mesh.geometry?.dispose?.()
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined
        Array.isArray(mat) ? mat.forEach((x) => x.dispose()) : mat?.dispose?.()
      })
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div ref={mountRef} aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div
        className={`absolute bottom-6 right-6 hidden rounded-full border border-white/10 bg-ink/50 px-4 py-1.5 text-xs tracking-widest text-white/70 backdrop-blur transition-opacity duration-1000 md:block ${
          showHint ? "opacity-90" : "opacity-0"
        }`}
      >
        DRAG TO EXPLORE
      </div>
    </div>
  )
}