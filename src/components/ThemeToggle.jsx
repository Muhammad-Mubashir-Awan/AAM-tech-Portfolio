const SUN = <path d="M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
const MOON = <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />

// One button: shows the mode you'll switch to (moon while it's light, sun while it's dark).
// A "system" choice saved by an earlier version of the site counts as whatever the device is showing.
export default function ThemeToggle({ value, onChange }) {
  const light = value === 'system' ? window.matchMedia('(prefers-color-scheme: light)').matches : value === 'light'
  const next = light ? 'dark' : 'light'
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      onClick={() => onChange(next)}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {light ? MOON : SUN}
      </svg>
    </button>
  )
}
