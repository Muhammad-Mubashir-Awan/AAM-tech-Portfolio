import { useRef } from 'react'
import { cn } from '@/lib/utils'

const canTilt =
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

// A card that tilts toward the mouse in 3D, with a soft glare that follows it.
export default function TiltCard({ as: Tag = 'div', className = '', max = 10, children, ...rest }) {
  const ref = useRef(null)

  const onMove = (e) => {
    const el = ref.current
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    el.style.setProperty('--rx', `${(0.5 - y) * max}deg`)
    el.style.setProperty('--ry', `${(x - 0.5) * max}deg`)
    el.style.setProperty('--gx', `${x * 100}%`)
    el.style.setProperty('--gy', `${y * 100}%`)
  }

  const onLeave = () => {
    const el = ref.current
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <Tag
      ref={ref}
      className={cn(
        'group/tilt relative h-full rounded-xl border border-pine-800/10 bg-card/90 shadow-[0_10px_30px_rgba(11,43,38,0.08)]',
        '[transform:perspective(900px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] transform-3d',
        'transition-[transform,border-color,box-shadow] duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)]',
        'hover:border-pine-600/45 hover:shadow-[0_24px_50px_-20px_rgba(11,43,38,0.3)] hover:duration-[80ms,250ms,400ms]',
        '[&>*:not([data-glare])]:[transform:translateZ(20px)] motion-reduce:transform-none',
        className,
      )}
      onPointerMove={canTilt ? onMove : undefined}
      onPointerLeave={canTilt ? onLeave : undefined}
      {...rest}
    >
      {children}
      <span
        data-glare
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_var(--gx,50%)_var(--gy,50%),rgba(35,83,71,0.1),transparent_55%)] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
      />
    </Tag>
  )
}
