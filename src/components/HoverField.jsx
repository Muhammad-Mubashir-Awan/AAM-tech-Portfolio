import { useEffect, useRef } from 'react'
import useLightTheme from '../hooks/useLightTheme.js'

// Light mode's mouse effect: the hero is still water dusted with faint specks.
// When the mouse comes onto it, a ring of tiny colourful dots splashes open around the
// cursor, glides after it as it moves and ripples gently, then melts back into specks
// when the mouse leaves. (Dark mode keeps its own water ripple instead.)

const enabled =
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

const SPACING = 18 // px between points
const SPECK = '#475569' // resting dot colour
const SPECK_ALPHA = 0.32
const FOLLOW = 3 // how quickly the ring glides after the cursor (higher = snappier)

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

const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// Cheap smooth noise in -1..1 — a few overlapping sine waves
const wave = (x, y, t) =>
  (Math.sin(x * 1.7 + t * 0.9) + Math.sin(y * 1.3 - t * 0.7) + Math.sin((x + y) * 0.9 + t * 0.5)) / 3

function buildPoints(width, height) {
  const points = []
  for (let y = SPACING / 2; y < height; y += SPACING) {
    for (let x = SPACING / 2; x < width; x += SPACING) {
      points.push({
        x: x + (Math.random() - 0.5) * SPACING * 0.7,
        y: y + (Math.random() - 0.5) * SPACING * 0.7,
        seed: Math.random() * 100,
        size: 0,
      })
    }
  }
  return points
}

export default function HoverField() {
  const light = useLightTheme()
  if (!enabled || !light) return null
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

    const pointer = { x: 0, y: 0, inside: false }
    const ring = { x: 0, y: 0, strength: 0 }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = hero.clientWidth
      height = hero.clientHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      points = buildPoints(width, height)
    }

    const onMove = (e) => {
      const rect = hero.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height
      // Arriving fresh: open the ring at the cursor rather than sliding in from elsewhere
      if (inside && !pointer.inside && ring.strength < 0.05) {
        ring.x = x
        ring.y = y
      }
      pointer.inside = inside
      pointer.x = x
      pointer.y = y
    }

    const draw = (now) => {
      frame = requestAnimationFrame(draw)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const t = now / 1000

      // Mouse on the section opens the ring; off it, the ring melts away
      ring.strength += ((pointer.inside ? 1 : 0) - ring.strength) * (1 - Math.exp(-dt * 4))

      // Glides after the cursor, like a ripple dragged across water
      if (pointer.inside) {
        const follow = 1 - Math.exp(-dt * FOLLOW)
        ring.x += (pointer.x - ring.x) * follow
        ring.y += (pointer.y - ring.y) * follow
      }

      // Opens out from a smaller ring like a splash, and breathes gently
      const open = 1 - (1 - ring.strength) ** 3
      const radius = Math.min(280, Math.max(140, width * 0.18)) *
        (0.6 + 0.4 * open) * (1 + 0.05 * Math.sin(t * 1.1) + 0.03 * Math.cos(t * 2.6))
      const half = radius * 0.45 // half the ring's thickness

      const grow = 1 - Math.exp(-dt * 8)
      const specks = new Path2D()
      // Two opacity tiers, so the smallest dots stay faint and never compete with the text
      const faint = Array.from({ length: SHADES }, () => new Path2D())
      const bold = Array.from({ length: SHADES }, () => new Path2D())

      for (const p of points) {
        // A barely-there drift so the specks feel like a surface, not a grid
        const x = p.x + wave(p.x * 0.004, p.y * 0.004 + p.seed * 0.01, t * 0.4) * 3
        const y = p.y + wave(p.y * 0.004 + 7.3, p.x * 0.004, t * 0.4) * 3
        const dx = x - ring.x
        const dy = y - ring.y
        const dist = Math.hypot(dx, dy)

        let target = 0
        if (ring.strength > 0.01) {
          // A wide soft band, with ripples travelling outward through it and patchy noise
          const band = smoothstep(radius - half, radius - half * 0.4, dist) *
            (1 - smoothstep(radius + half * 0.3, radius + half, dist))
          const ripple = 0.65 + 0.35 * Math.sin(dist * 0.06 - t * 2.5)
          const patchy = 0.35 + 0.65 * smoothstep(-0.8, 0.8, wave(x * 0.02 + p.seed, y * 0.02, t * 0.6))
          target = band * ripple * patchy * ring.strength * 1.2
        }

        p.size += (target - p.size) * grow

        if (p.size < 0.2) {
          specks.rect(x - 0.7, y - 0.7, 1.4, 1.4)
          continue
        }

        // A tiny dot, stretched a hair outward from the ring centre (with a little wobble)
        const angle = Math.atan2(dy, dx) + wave(x * 0.02, y * 0.02, t * 1.7) * 0.35
        const len = 0.3 + Math.min(p.size, 1) * 1.1
        const ux = Math.cos(angle) * len * 0.5
        const uy = Math.sin(angle) * len * 0.5
        // Colour drifts smoothly across the field in broad patches that slowly shift
        const n = Math.min(1, Math.max(0, 0.5 + wave(x * 0.004, y * 0.004, t * 0.3) * 1.1))
        const shade = Math.round(n * (SHADES - 1))
        const path = (p.size < 0.5 ? faint : bold)[shade]
        path.moveTo(x - ux, y - uy)
        path.lineTo(x + ux, y + uy)
      }

      ctx.clearRect(0, 0, width, height)
      ctx.globalAlpha = SPECK_ALPHA
      ctx.fillStyle = SPECK
      ctx.fill(specks)

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
    document.documentElement.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} className="hover-field" aria-hidden="true" />
}
