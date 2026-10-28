import { useLayoutEffect, useRef, useState } from 'react'

// Returns [ref, visible, state]. Anything already on screen when the page opens counts as
// visible straight away, so the first screen never starts blank; anything further down is
// hidden until it scrolls into view. `state` tells <Reveal> whether to animate:
// 'shown' (on screen from the start, no animation), 'hidden' (waiting) or 'revealed' (scrolled in).
export default function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [state, setState] = useState('shown')

  // A layout effect runs before the first paint, so below-the-fold items never flash
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    if (el.getBoundingClientRect().top < window.innerHeight) return
    setState('hidden')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('revealed')
          observer.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, state !== 'hidden', state]
}
