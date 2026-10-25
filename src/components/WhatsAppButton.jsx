import { useLocation } from 'react-router-dom'
import { whatsappAndroidLink, whatsappLink } from '../data.js'

// Which greeting in data.js to use for the current page
const pageFor = (pathname) =>
  ['work', 'about'].find((page) => pathname.startsWith(`/${page}`)) || 'home'

// The WhatsApp glyph, drawn in currentColor so it can be reused at any size
export function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24z" />
    </svg>
  )
}

// A link that starts a WhatsApp chat. Android goes straight to the app (or the
// Play Store if it isn't installed); everyone else uses the wa.me link.
export function WhatsAppLink({ page, ...props }) {
  const openApp = (e) => {
    if (!/Android/i.test(navigator.userAgent)) return
    e.preventDefault()
    window.location.href = whatsappAndroidLink(page)
  }

  return <a href={whatsappLink(page)} target="_blank" rel="noopener noreferrer" onClick={openApp} {...props} />
}

// Floating "chat on WhatsApp" button, bottom-right on every page
export default function WhatsAppButton() {
  const { pathname } = useLocation()

  return (
    <WhatsAppLink
      page={pageFor(pathname)}
      aria-label="Chat with us on WhatsApp"
      // Above the page, below the navbar. A soft ring pulses three times after the page loads.
      className="group/wa fixed right-4 bottom-4 z-40 grid size-13 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_10px_25px_-8px_rgba(37,211,102,0.6),0_4px_12px_rgba(0,0,0,0.25)] transition-[transform,box-shadow] duration-200 before:pointer-events-none before:absolute before:inset-0 before:animate-ring before:rounded-full before:border-2 before:border-[#25d366] before:opacity-0 before:content-[''] hover:scale-108 hover:shadow-[0_14px_30px_-8px_rgba(37,211,102,0.7),0_6px_16px_rgba(0,0,0,0.25)] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-pine-600 md:right-6 md:bottom-6 md:size-14 motion-reduce:transition-none motion-reduce:before:animate-none"
    >
      <WhatsAppIcon className="size-[30px]" />
      {/* Hover label to the left of the button (computers only) */}
      <span className="pointer-events-none absolute right-[calc(100%+12px)] hidden translate-x-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[0.85rem] font-medium whitespace-nowrap text-foreground opacity-0 shadow-[0_6px_18px_rgba(20,23,42,0.12)] transition-[opacity,transform] duration-200 group-hover/wa:translate-x-0 group-hover/wa:opacity-100 group-focus-visible/wa:translate-x-0 group-focus-visible/wa:opacity-100 md:block">
        Chat on WhatsApp
      </span>
    </WhatsAppLink>
  )
}
