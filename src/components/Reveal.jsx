import useReveal from '../hooks/useReveal.js'
import { cn } from '@/lib/utils'

// Animates its content into view on scroll. `index` staggers items in a list. Content that is
// already on screen when the page opens just shows, with no animation.
export default function Reveal({ as: Tag = 'div', index = 0, className = '', style, children, ...rest }) {
  const [ref, , state] = useReveal()
  return (
    <Tag
      ref={ref}
      className={cn(
        state !== 'shown' &&
          'origin-bottom transition-[opacity,transform] delay-(--delay) duration-[850ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none',
        state === 'hidden' &&
          'opacity-0 [transform:perspective(900px)_translateY(40px)_rotateX(12deg)] motion-reduce:opacity-100 motion-reduce:transform-none',
        className,
      )}
      style={{ '--delay': `${index * 90}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
