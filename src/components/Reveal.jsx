import useReveal from '../hooks/useReveal.js'
import { cn } from '@/lib/utils'

// Animates its content into view on scroll. `index` staggers items in a list.
export default function Reveal({ as: Tag = 'div', index = 0, className = '', style, children, ...rest }) {
  const [ref, visible] = useReveal()
  return (
    <Tag
      ref={ref}
      className={cn(
        'origin-bottom transition-[opacity,transform] delay-(--delay) duration-[850ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none',
        visible
          ? 'opacity-100 transform-none'
          : 'opacity-0 [transform:perspective(900px)_translateY(40px)_rotateX(12deg)] motion-reduce:opacity-100 motion-reduce:transform-none',
        className,
      )}
      style={{ '--delay': `${index * 90}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
