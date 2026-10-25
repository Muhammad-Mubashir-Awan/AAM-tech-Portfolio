import { useEffect, useRef } from 'react'

// The hero's mouse effect: the hero is clean until the mouse comes onto it. Each tiny dot
// has a little weight: the cursor gently pushes nearby dots aside, drags them along as it
// moves so they flow and curl around it, and a soft spring floats them back home. Dots
// light up only while they're near the cursor or still moving, so a quick move leaves a
// short fading wake. On phones a finger does the same: a tap ripples the dots out and a
// drag pulls them along.

const enabled =
  typeof window !== 'undefined' &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

const SPACING = 18 // px between dots
// Feel of the motion
const PUSH = 750 // how hard the cursor pushes dots outward (px/s²)
const DRAG = 3 // how much the cursor's movement carries dots along with it
const SWIRL = 140 // gentle curl around the cursor (px/s²)
const SPRING = 30 // pull back to each dot's home spot
const DAMP = 6 // friction, so dots glide and settle instead of bouncing
const MAX_SHIFT = 40 // furthest a dot can be pushed from home (px)
const SPEED_REF = 120 // a dot moving this fast (px/s) is fully lit

// Antigravity's light palette: blue → red → yellow, giving purple and orange in between.
// Blue→red takes most of the range and red→yellow the last fifth. Pre-blended into a few
// batches for fast drawing.
const BLUE = [44, 100, 237] // #2c64ed
const RED = [248, 66, 66] // #f84242
const YELLOW = [255, 207, 3] // #ffcf03
const mix = (a, b, f) => a.map((v, k) => Math.round(v + (b[k] - v) * f))
const SHADES = 10
const PALETTE = Array.from({ length: SHADES }, (_, i) => {
  const p = i / (SHADES - 1)
  const c = p < 0.8 ? mix(BLUE, RED, p / 0.8) : mix(RED, YELLOW, (p - 0.8) / 0.2)
  return `rgb(${c.join(',')})`
})

// Cheap smooth noise in -1..1 — a few overlapping sine waves
const wave = (x, y, t) =>
  (Math.sin(x * 1.7 + t * 0.9) + Math.sin(y * 1.3 - t * 0.7) + Math.sin((x + y) * 0.9 + t * 0.5)) / 3

function buildPoints(width, height) {
  const points = []
  for (let y = SPACING / 2; y < height; y += SPACING) {
    for (let x = SPACING / 2; x < width; x += SPACING) {
      const hx = x + (Math.random() - 0.5) * SPACING * 0.7
      const hy = y + (Math.random() - 0.5) * SPACING * 0.7
      points.push({ hx, hy, x: hx, y: hy, vx: 0, vy: 0, glow: 0, seed: Math.random() * 100 })
    }
  }
  return points
}

export default function HoverField() {
  if (!enabled) return null
  return <Field />
}

function Field() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const hero = canvas.parentElement
    const ctx = canvas.getContext('2d')
    let width = 0
    let height = 0
    let points = []
    let frame = 0
    let visible = true
    let last = performance.now()

    // Cursor position, its smoothed velocity, and how "present" it is (fades in/out)
    const pointer = { x: 0, y: 0, vx: 0, vy: 0, inside: false, time: 0, strength: 0 }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = hero.clientWidth
      height = hero.clientHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      points = buildPoints(width, height)
    }

    const track = (clientX, clientY) => {
      const rect = hero.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height
      const now = performance.now()
      if (inside && pointer.inside) {
        // Smoothed cursor speed, so one jumpy event doesn't fling the dots
        const dt = Math.max((now - pointer.time) / 1000, 0.008)
        const cap = (v) => Math.max(-3000, Math.min(3000, v))
        pointer.vx += (cap((x - pointer.x) / dt) - pointer.vx) * 0.35
        pointer.vy += (cap((y - pointer.y) / dt) - pointer.vy) * 0.35
      } else {
        // Arriving fresh: start still, so nothing jumps
        pointer.vx = 0
        pointer.vy = 0
      }
      pointer.inside = inside
      pointer.x = x
      pointer.y = y
      pointer.time = now
    }

    // Mouse and pen; touch is handled by the touch listeners below
    const onMove = (e) => {
      if (e.pointerType !== 'touch') track(e.clientX, e.clientY)
    }
    // A finger on the hero acts like the cursor. Listeners are passive, so scrolling still works.
    // A quick tap lingers a moment, so it still opens a visible ripple
    let release = 0
    const onTouch = (e) => {
      clearTimeout(release)
      const t = e.touches[0]
      if (t) track(t.clientX, t.clientY)
    }
    const onTouchEnd = () => {
      clearTimeout(release)
      release = setTimeout(() => { pointer.inside = false }, 300)
    }

    const draw = (now) => {
      frame = requestAnimationFrame(draw)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const t = now / 1000

      pointer.strength += ((pointer.inside ? 1 : 0) - pointer.strength) * (1 - Math.exp(-dt * 5))
      // No pointer events while the mouse is still, so its speed eases off by itself
      const ease = Math.exp(-dt * 8)
      pointer.vx *= ease
      pointer.vy *= ease

      const reach = Math.min(220, Math.max(120, width * 0.14))
      const friction = Math.exp(-DAMP * dt)
      const glowUp = 1 - Math.exp(-dt * 10)
      const glowDown = 1 - Math.exp(-dt * 2.5)
      const active = pointer.strength > 0.01

      // Two opacity tiers, so the faintest dots never compete with the text
      const faint = Array.from({ length: SHADES }, () => new Path2D())
      const bold = Array.from({ length: SHADES }, () => new Path2D())

      for (const p of points) {
        const dx = p.x - pointer.x
        const dy = p.y - pointer.y
        const dist = Math.hypot(dx, dy)
        const near = active && dist < reach

        // Resting dots far from the cursor need no work at all
        if (!near && p.glow < 0.01 && Math.abs(p.vx) + Math.abs(p.vy) < 1) {
          p.x = p.hx
          p.y = p.hy
          p.vx = p.vy = p.glow = 0
          continue
        }

        let ax = (p.hx - p.x) * SPRING
        let ay = (p.hy - p.y) * SPRING
        let fall = 0
        if (near) {
          fall = (1 - dist / reach) ** 2 * pointer.strength
          const nx = dist > 0.001 ? dx / dist : 0
          const ny = dist > 0.001 ? dy / dist : 0
          // Pushed outward, carried along with the cursor, and curled gently around it
          ax += nx * PUSH * fall + pointer.vx * DRAG * fall - ny * SWIRL * fall
          ay += ny * PUSH * fall + pointer.vy * DRAG * fall + nx * SWIRL * fall
        }

        p.vx = (p.vx + ax * dt) * friction
        p.vy = (p.vy + ay * dt) * friction
        p.x += p.vx * dt
        p.y += p.vy * dt

        // Never drift too far from home
        const ox = p.x - p.hx
        const oy = p.y - p.hy
        const shift = Math.hypot(ox, oy)
        if (shift > MAX_SHIFT) {
          p.x = p.hx + (ox / shift) * MAX_SHIFT
          p.y = p.hy + (oy / shift) * MAX_SHIFT
          p.vx *= 0.5
          p.vy *= 0.5
        }

        // Lit near the cursor and while still moving, so fast moves leave a fading wake
        const speed = Math.hypot(p.vx, p.vy)
        const target = Math.max(fall, Math.min(1, speed / SPEED_REF))
        p.glow += (target - p.glow) * (target > p.glow ? glowUp : glowDown)
        if (p.glow < 0.05) continue

        // A barely-there drift while lit, so the dots feel alive rather than gridded
        const x = p.x + wave(p.hx * 0.004, p.hy * 0.004 + p.seed * 0.01, t * 0.6) * 2 * p.glow
        const y = p.y + wave(p.hy * 0.004 + 7.3, p.hx * 0.004, t * 0.6) * 2 * p.glow

        // Each dash points the way it's moving (or away from the cursor when nearly still)
        const angle = speed > 15 ? Math.atan2(p.vy, p.vx) : Math.atan2(dy, dx)
        const len = 0.3 + Math.min(p.glow, 1) * 1.1
        const ux = Math.cos(angle) * len * 0.5
        const uy = Math.sin(angle) * len * 0.5
        // Colour drifts smoothly across the field in broad patches that slowly shift
        const n = Math.min(1, Math.max(0, 0.5 + wave(p.hx * 0.004, p.hy * 0.004, t * 0.3) * 1.1))
        const shade = Math.round(n * (SHADES - 1))
        const path = (p.glow < 0.5 ? faint : bold)[shade]
        path.moveTo(x - ux, y - uy)
        path.lineTo(x + ux, y + uy)
      }

      ctx.clearRect(0, 0, width, height)
      ctx.lineCap = 'round'
      ctx.lineWidth = 1.6
      for (const [paths, alpha] of [[faint, 0.5], [bold, 0.9]]) {
        ctx.globalAlpha = alpha
        paths.forEach((path, i) => {
          ctx.strokeStyle = PALETTE[i]
          ctx.stroke(path)
        })
      }
      ctx.globalAlpha = 1
    }

    const start = () => {
      if (frame || !visible || document.hidden) return
      last = performance.now()
      frame = requestAnimationFrame(draw)
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }

    // Only animate while the hero is on screen and the tab is in front
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      visible ? start() : stop()
    })
    io.observe(hero)
    const onVisibility = () => (document.hidden ? stop() : start())
    const onLeave = () => { pointer.inside = false }

    const ro = new ResizeObserver(resize)
    ro.observe(hero)
    resize()
    start()

    window.addEventListener('pointermove', onMove, { passive: true })
    hero.addEventListener('touchstart', onTouch, { passive: true })
    hero.addEventListener('touchmove', onTouch, { passive: true })
    hero.addEventListener('touchend', onTouchEnd)
    hero.addEventListener('touchcancel', onTouchEnd)
    document.documentElement.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      hero.removeEventListener('touchstart', onTouch)
      hero.removeEventListener('touchmove', onTouch)
      hero.removeEventListener('touchend', onTouchEnd)
      hero.removeEventListener('touchcancel', onTouchEnd)
      clearTimeout(release)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0 size-full" aria-hidden="true" />
}
