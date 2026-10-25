import Reveal from './Reveal.jsx'

export default function SectionHeader({ eyebrow, title, text }) {
  return (
    <Reveal className="mx-auto mb-14 max-w-160 text-center">
      <p className="eyebrow justify-center">{eyebrow}</p>
      <h2>{title}</h2>
      {text && <p className="text-[1.05rem]">{text}</p>}
    </Reveal>
  )
}
