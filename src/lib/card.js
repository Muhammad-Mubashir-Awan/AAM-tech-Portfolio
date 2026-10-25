// Shared Tailwind classes for the picture cards (projects, team), modelled on
// caymarkauctions.com: the card lifts with a soft shadow and green edge on hover, and the
// picture inside zooms in slowly within its frame. Hover only applies on mouse devices.
export const liftCard =
  'group/card flex flex-col overflow-hidden rounded-xl border border-pine-800/10 bg-card/90 shadow-[0_10px_30px_rgba(11,43,38,0.08)] ' +
  'transition-[transform,box-shadow,border-color] duration-500 ease-soft ' +
  'hover:-translate-y-1 hover:border-primary hover:shadow-[0_20px_40px_-14px_rgba(5,31,32,0.28)] ' +
  'motion-reduce:transition-none motion-reduce:hover:translate-y-0'

export const zoomOnHover =
  'transition-transform duration-[1.2s] ease-soft group-hover/card:scale-[1.03] motion-reduce:transition-none'
