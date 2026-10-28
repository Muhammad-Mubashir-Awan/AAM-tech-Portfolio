import HoverField from './HoverField.jsx'

// The centred header at the top of every page except Home
export default function PageHead({ eyebrow, title, intro, children }) {
  return (
    <section id="top" className="relative overflow-hidden pt-[130px] pb-10 sm:pt-[170px]">
      <HoverField />
      <div className="wrap relative z-[1] text-center">
        <p className="eyebrow justify-center">{eyebrow}</p>
        <h1 className="text-glow mx-auto max-w-[900px] text-[clamp(2.4rem,6vw,4.4rem)]">{title}</h1>
        <p className="text-glow mx-auto mb-8 max-w-160 text-[1.1rem]">{intro}</p>
        {children && <div className="flex flex-wrap justify-center gap-4">{children}</div>}
      </div>
    </section>
  )
}
