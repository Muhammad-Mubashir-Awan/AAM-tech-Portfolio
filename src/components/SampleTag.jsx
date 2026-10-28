// Marks placeholder content (data.js items with `sample: true`). Those items only render while
// running `npm run dev`, so this tag never reaches the live site.
export default function SampleTag({ className = '' }) {
  return (
    <span className={`inline-block rounded-sm border border-dashed border-pine-600/50 px-1.5 py-0.5 text-[0.65rem] font-semibold tracking-wider text-pine-600 uppercase ${className}`}>
      Sample
    </span>
  )
}
