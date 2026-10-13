import { useEffect, useLayoutEffect, useRef, useState } from 'react'

// Types a headline in letter by letter, with a blinking cursor running just ahead of the
// text that fades out when it's done. `parts` keeps styled runs intact, e.g.
// [{ text: 'We build ' }, { text: 'digital experiences', className: 'gradient-text' }].
// Letters are switched on with `visibility`, so gradient text (background-clip: text)
// still paints through them, and the line layout is reserved from the start.

const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function TypedTitle({ parts, duration = 900, delay = 250 }) {
  const full = parts.map((p) => p.text).join('')
  const total = full.length
  const [count, setCount] = useState(reducedMotion ? total : 0)
  const [done, setDone] = useState(reducedMotion)
  const boxRef = useRef(null)
  const charRefs = useRef([])
  const caretRef = useRef(null)

  // Reveal one more letter every `duration / total` ms after the start delay. The clock
  // starts on the first painted frame, so a tab opened in the background still types
  // when it's first seen instead of showing the whole line at once.
  useEffect(() => {
    if (reducedMotion) return
    const perChar = duration / total
    let start = null
    let frame = requestAnimationFrame(function tick(now) {
      if (start === null) start = now + delay
      const n = Math.max(0, Math.min(total, Math.floor((now - start) / perChar) + 1))
      setCount(n)
      if (n < total) frame = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(frame)
  }, [total, duration, delay])

  // Let the cursor linger a moment after the last letter, then fade it
  useEffect(() => {
    if (count < total || done) return
    const timer = setTimeout(() => setDone(true), 400)
    return () => clearTimeout(timer)
  }, [count, total, done])

  // Park the cursor right after the last visible letter (or before the first one)
  useLayoutEffect(() => {
    const caret = caretRef.current
    const box = boxRef.current
    const char = charRefs.current[Math.max(0, count - 1)]
    if (!caret || !box || !char) return
    const b = box.getBoundingClientRect()
    const c = char.getBoundingClientRect()
    const x = (count === 0 ? c.left : c.right) - b.left
    caret.style.transform = `translate(${x + 2}px, ${c.top - b.top + c.height * 0.12}px)`
    caret.style.height = `${c.height * 0.76}px`
  }, [count])

  let index = 0
  return (
    <>
      <span className="visually-hidden">{full}</span>
      <span className="typed" ref={boxRef} aria-hidden="true">
        {parts.map((part, p) => (
          <span key={p} className={part.className}>
            {/* Words stay whole so a line never breaks mid-word */}
            {part.text.split(/(\s+)/).map((word, w) =>
              /^\s+$/.test(word) ? (
                [...word].map((ch) => {
                  const i = index++
                  return <span key={`${w}-${i}`} ref={(el) => (charRefs.current[i] = el)} className={i < count ? undefined : 'typed__hidden'}>{ch}</span>
                })
              ) : (
                <span key={w} className="typed__word">
                  {[...word].map((ch) => {
                    const i = index++
                    return <span key={i} ref={(el) => (charRefs.current[i] = el)} className={i < count ? undefined : 'typed__hidden'}>{ch}</span>
                  })}
                </span>
              ),
            )}
          </span>
        ))}
        {/* Solid while typing; blinks while waiting to start and just after finishing */}
        {!reducedMotion && (
          <span
            ref={caretRef}
            className={`typed__caret${done ? ' typed__caret--gone' : count > 0 && count < total ? '' : ' typed__caret--blink'}`}
          />
        )}
      </span>
    </>
  )
}
