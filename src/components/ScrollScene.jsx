import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import { MathUtils } from 'three'
import useScrollStage, { scrollState } from '../hooks/useScrollStage.js'
import Ripple, { rippleEnabled } from './Ripple.jsx'
import useLightTheme from '../hooks/useLightTheme.js'

// Palette colours: navy in light mode, cream in dark mode
const ROYAL = '#22396f'
const BLUE = '#fcf1d0'
const STAR_LIGHT = '#0d1c42' // renders lighter on screen, so one shade darker than wanted
const CAMERA_Z = 7
const FOV = 50

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const isMobile = typeof window !== 'undefined' && window.innerWidth < 720

// Each page has its own sections (ids), and per section: camera
// distance, warp-star strength and backdrop dimming. Work and Contact have their
// own pages, so the home layout skips those rows. Work and Contact each get a
// two-stage arrangement: the page header, then the content.
const LAYOUTS = {
  home: {
    ids: ['top', 'services', 'about'],
    camera: [7, 6.4, 7],
    warp: [0, 0.5, 0],
    dim: [0, 0, 1],
  },
  work: {
    ids: ['top', 'work'],
    camera: [7, 6.8],
    warp: [0, 0.25],
    dim: [0, 1],
  },
  about: {
    ids: ['top', 'team', 'story'],
    camera: [7, 6.6, 6.6],
    warp: [0, 0, 0],
    dim: [0, 1, 1],
  },
}

const smoothstep = (t) => t * t * (3 - 2 * t)

// Blend a per-section value at the current (fractional) stage of a page with `count` sections
function atStage(stage, count, pick) {
  const i = Math.min(Math.floor(stage), count - 1)
  const j = Math.min(i + 1, count - 1)
  return MathUtils.lerp(pick(i), pick(j), smoothstep(stage - i))
}

function Particles({ count }) {
  const light = useLightTheme()
  const ref = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Random points inside a sphere shell around the scene
      const r = 4 + Math.random() * 6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    if (reducedMotion) return
    ref.current.rotation.y += delta * 0.03
    ref.current.rotation.x += delta * 0.01
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color={light ? STAR_LIGHT : BLUE} size={0.035} sizeAttenuation depthWrite={false} opacity={light ? 0.9 : 0.8} />
    </Points>
  )
}

// Stars that stream toward the camera between sections. Invisible at the hero.
function WarpField({ count, layout }) {
  const light = useLightTheme()
  const points = useRef()
  const material = useRef()
  const warp = useRef(0)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12
      arr[i * 3 + 2] = -25 + Math.random() * 30
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    const target = reducedMotion ? 0 : atStage(scrollState.stage, layout.ids.length, (i) => layout.warp[i])
    warp.current = MathUtils.damp(warp.current, target, 3, delta)
    const visible = warp.current > 0.01
    points.current.visible = visible
    if (!visible) return

    material.current.opacity = warp.current * 0.7
    const attr = points.current.geometry.attributes.position
    const step = delta * 14 * warp.current
    for (let i = 0; i < count; i++) {
      let z = attr.array[i * 3 + 2] + step
      if (z > 5) z -= 30
      attr.array[i * 3 + 2] = z
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={points} frustumCulled={false} visible={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial ref={material} color={light ? STAR_LIGHT : "#fcf1d0"} size={0.045} sizeAttenuation transparent opacity={0} depthWrite={false} />
    </points>
  )
}

// Fades and blurs the whole canvas behind the full-width lower sections.
// Fully off (no filter at all) at the hero and upper sections.
// In light mode the dark text needs a calmer background, so every section after
// the hero gets a medium blur, and the full dim is stronger. The hero is always sharp.
function Backdrop({ layout }) {
  const light = useLightTheme()
  const dim = useRef(0)
  const applied = useRef(0)

  useFrame((state, delta) => {
    const target = atStage(scrollState.stage, layout.ids.length, (i) =>
      light ? (i === 0 ? 0 : Math.max(0.45, layout.dim[i]) * 2) : layout.dim[i],
    )
    dim.current = MathUtils.damp(dim.current, target, 4, delta)
    const style = state.gl.domElement.style

    // Snap fully off near zero so the hero never keeps a faint blur
    if (dim.current < 0.01) {
      if (applied.current !== 0) {
        applied.current = 0
        style.opacity = ''
        style.filter = ''
      }
      return
    }
    if (Math.abs(dim.current - applied.current) < 0.005) return
    applied.current = dim.current
    // dim runs to 1 in dark mode (4px blur) and to 2 in light mode (8px blur)
    style.opacity = String(1 - (light ? 0.25 : 0.35) * dim.current)
    style.filter = `blur(${(dim.current * 4).toFixed(2)}px)`
  })

  return null
}

// Eases the camera in and out per section, which pulls the starfield closer or
// further away as you scroll. (The floating 3D shapes that used to live here are gone.)
function CameraRig({ layout }) {
  useFrame((state, delta) => {
    // Nothing reads the scroll speed any more; reset it so it doesn't keep growing
    scrollState.velocity = 0
    const ease = reducedMotion ? 30 : 5
    const cam = atStage(scrollState.stage, layout.ids.length, (i) => layout.camera[i])
    state.camera.position.z = MathUtils.damp(state.camera.position.z, cam, ease, delta)
  })
  return null
}

export default function ScrollScene() {
  // About, Work and Contact have their own choreography; every other route uses the home one
  const { pathname } = useLocation()
  const layout = pathname.startsWith('/about') ? LAYOUTS.about
    : pathname.startsWith('/work') ? LAYOUTS.work
    : LAYOUTS.home
  useScrollStage(layout.ids)
  const light = useLightTheme()

  // Match the old hero-sized canvas so the hero is framed exactly as before,
  // but never shorter than the screen so the 3D fills every section.
  const [height, setHeight] = useState(() => window.innerHeight)
  useLayoutEffect(() => {
    const hero = document.getElementById('top')
    const measure = () => setHeight(Math.max(hero?.offsetHeight ?? 0, window.innerHeight))
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [pathname])

  return (
    <div className="scroll-canvas" style={{ height }} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, CAMERA_Z], fov: FOV }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        eventSource={document.getElementById('root')}
        eventPrefix="client"
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <pointLight position={[-5, 2, 3]} color={ROYAL} intensity={40} />
        <pointLight position={[5, -3, 3]} color={BLUE} intensity={30} />
        <CameraRig layout={layout} />
        <Particles count={isMobile ? 600 : 1500} />
        <WarpField count={isMobile ? 250 : 600} layout={layout} />
        <Backdrop layout={layout} />
        {/* Light mode has its own mouse effect (HoverField), so the ripple is dark-only */}
        {rippleEnabled && !light && <Ripple light={light} />}
      </Canvas>
    </div>
  )
}
