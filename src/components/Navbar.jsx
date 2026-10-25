import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { MenuIcon } from 'lucide-react'
import { asset, company } from '../data.js'
import { useProjectModal } from './ProjectModal.jsx'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

// Home, the Services section on the home page (works from any page), and the other pages
const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/#services', label: 'Services', section: true },
  { to: '/about', label: 'About Us' },
  { to: '/work', label: 'Our Work' },
]

// Desktop links: an underline grows from the centre on hover and marks the current page
const deskLink = (active) =>
  cn(
    'relative font-medium text-muted-foreground transition-colors hover:text-foreground',
    "after:absolute after:inset-x-0 after:-bottom-1.5 after:h-0.5 after:scale-x-0 after:rounded-xs after:bg-primary after:transition-transform after:duration-250 after:content-[''] hover:after:scale-x-100 motion-reduce:after:transition-none",
    active && 'text-foreground after:scale-x-100',
  )

const menuLink = (active) =>
  cn('rounded-lg px-3 py-3 text-lg font-medium text-muted-foreground hover:bg-secondary hover:text-foreground', active && 'bg-secondary text-foreground')

function NavLinks({ linkClass, onNavigate }) {
  return LINKS.map((l) =>
    l.section ? (
      <Link key={l.to} to={l.to} className={linkClass(false)} onClick={onNavigate}>{l.label}</Link>
    ) : (
      <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => linkClass(isActive)} onClick={onNavigate}>
        {l.label}
      </NavLink>
    ),
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const openProjectForm = useProjectModal()
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the phone menu on any page change (including the browser's Back button)
  useEffect(() => setOpen(false), [pathname, hash, key])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b border-transparent transition-[background-color,border-color] duration-300',
        scrolled && 'border-border bg-background/85 backdrop-blur-md',
      )}
    >
      <div className="wrap flex h-[72px] items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]">
        <Link to="/" aria-label={company.name} className="flex items-center gap-2.5 justify-self-start">
          <img className="h-[30px] w-auto" src={asset('logo-mark-light.png')} alt="" />
          <span className="text-[0.85rem] font-semibold tracking-[0.32em] uppercase">Technology</span>
        </Link>

        <nav className="hidden items-center gap-8 text-[0.95rem] md:flex">
          <NavLinks linkClass={deskLink} />
        </nav>

        <Button size="sm" onClick={openProjectForm} className="hidden justify-self-end md:inline-flex">
          Contact Us
        </Button>

        {/* Phone menu: slides in from the right */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button type="button" aria-label="Open menu" className="grid size-10 cursor-pointer place-items-center rounded-lg text-foreground md:hidden">
              <MenuIcon className="size-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(320px,85vw)] gap-0 border-border bg-background px-4 pt-16">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <nav className="grid gap-1">
              <NavLinks linkClass={menuLink} onNavigate={() => setOpen(false)} />
            </nav>
            <Button
              className="mt-6 w-full"
              onClick={() => {
                setOpen(false)
                openProjectForm()
              }}
            >
              Contact Us
            </Button>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
