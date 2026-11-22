"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { live } from "@/lib/palette"
import { getTheme } from "@/lib/theme"

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

export default function Globe() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [showHint, setShowHint] = useState(true)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

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

    // Dot-matrix sphere (Fibonacci distribution)
    const N = 6200
    const pos = new Float32Array(N * 3)
    const lnd = new Float32Array(N)
    const seed = new Float32Array(N)
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2
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

    // Dark core so back-side dots are hidden
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x05060a })
    const core = new THREE.Mesh(new THREE.SphereGeometry(R - 0.06, 48, 48), coreMat)
    group.add(core)

    // Soft wireframe shell
    const wireMat = new THREE.MeshBasicMaterial({ color: c1.clone(), wireframe: true, transparent: true, opacity: 0.07 })
    const wire = new THREE.Mesh(new THREE.SphereGeometry(R + 0.02, 24, 24), wireMat)
    group.add(wire)

    // Atmosphere glow
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
    atmo.userData.follow = group

    // Orbit rings with satellites
    const rings: { pivot: THREE.Group; sat: THREE.Mesh; speed: number; mat: THREE.MeshBasicMaterial; satMat: THREE.MeshBasicMaterial }[] = []
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
      const satMat = new THREE.MeshBasicMaterial({ color: c3.clone() })
      const sat = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), satMat)
      sat.position.x = d.r
      const holder = new THREE.Group()
      holder.add(sat)
      pivot.add(holder)
      group.add(pivot)
      rings.push({ pivot: holder, sat, speed: d.speed, mat, satMat })
    })

    // ── Interaction: drag to rotate + gentle parallax ────────
    let vx = 0
    let vy = 0
    let dragging = false
    let lx = 0
    let ly = 0
    const mouse = { x: 0, y: 0 }
    const interactive = (el: EventTarget | null) =>
      el instanceof HTMLElement && !!el.closest("a,button,input,textarea,select,label,form,[data-no-drag]")

    const onDown = (e: PointerEvent) => {
      if (interactive(e.target) || window.scrollY > window.innerHeight * 0.85) return
      dragging = true
      lx = e.clientX
      ly = e.clientY
    }
    const onMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
      if (!dragging) return
      vy += (e.clientX - lx) * 0.0006
      vx += (e.clientY - ly) * 0.0006
      lx = e.clientX
      ly = e.clientY
    }
    const onUp = () => (dragging = false)
    window.addEventListener("pointerdown", onDown)
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    window.addEventListener("pointercancel", onUp)

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
    let lightMix = 0
    const tmp = [new THREE.Color(), new THREE.Color(), new THREE.Color()]

    const animate = () => {
      raf = requestAnimationFrame(animate)
      const dt = Math.min(clock.getDelta(), 0.05)
      const time = clock.elapsedTime

      // theme: light mode uses a pale core, no stars/glow and slightly darker brand colors
      const light = getTheme() === "light"
      lightMix += ((light ? 1 : 0) - lightMix) * 0.08
      const k = 1 - 0.18 * lightMix
      coreMat.color.setRGB(0.02 + lightMix * 0.94, 0.024 + lightMix * 0.95, 0.039 + lightMix * 0.96)
      starMat.opacity = 0.85 * (1 - lightMix)
      atmo.visible = lightMix < 0.5
      wireMat.opacity = 0.07 + lightMix * 0.1
      // colors from the live palette
      live.c.forEach((c, i) => tmp[i].setRGB((c[0] / 255) * k, (c[1] / 255) * k, (c[2] / 255) * k))
      dotMat.uniforms.uC1.value.copy(tmp[0])
      dotMat.uniforms.uC2.value.copy(tmp[1])
      dotMat.uniforms.uC3.value.copy(tmp[2])
      dotMat.uniforms.uTime.value = time
      wireMat.color.copy(tmp[0])
      atmoMat.uniforms.glowColor.value.copy(tmp[0]).lerp(tmp[1], 0.4)
      starMat.color.set(0xffffff).lerp(tmp[0], 0.25)
      rings.forEach((r, i) => {
        r.mat.color.copy(tmp[(i + 1) % 3])
        r.satMat.color.copy(tmp[(i + 2) % 3])
        r.pivot.rotation.z += dt * r.speed
      })

      // scroll-driven layout: globe slides right & shrinks after the hero
      const aspect = window.innerWidth / window.innerHeight
      const wide = aspect > 1.15
      const targetP = Math.min(window.scrollY / window.innerHeight, 1)
      scrollP += (targetP - scrollP) * 0.08
      const baseX = wide ? 3.6 : 0
      const targetX = baseX + scrollP * (wide ? 2.2 : 0)
      const s = 1 - scrollP * 0.3
      camera.position.z = wide ? 15 : Math.min(26, 15 / Math.max(aspect * 1.25, 0.55))
      group.position.x += (targetX - group.position.x) * 0.08
      group.position.y += ((wide ? 0 : 1.2 - scrollP * 1.2) - group.position.y) * 0.08
      group.scale.setScalar(s)
      atmo.position.copy(group.position)
      atmo.scale.setScalar(s)
      renderer.domElement.style.opacity = String((wide ? 1 : 0.55) - scrollP * 0.45)

      // rotation: idle spin + inertia + parallax
      group.rotation.y += dt * 0.14 + vy
      group.rotation.x += vx
      group.rotation.x += (mouse.y * 0.12 - group.rotation.x) * 0.02
      group.rotation.x = Math.max(-0.9, Math.min(0.9, group.rotation.x))
      vx *= 0.92
      vy *= 0.92
      stars.rotation.y += dt * 0.006
      stars.rotation.x += dt * 0.002
      camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.03

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
      window.removeEventListener("resize", onResize)
      scene.traverse((o) => {
        const m = o as THREE.Mesh
        m.geometry?.dispose?.()
        const mat = m.material as THREE.Material | THREE.Material[] | undefined
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
