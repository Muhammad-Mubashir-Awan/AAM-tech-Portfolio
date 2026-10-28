import { createContext, useCallback, useContext, useState } from 'react'
import { XIcon } from 'lucide-react'
import { asset, company } from '../data.js'
import ProjectForm, { emptyForm } from './ProjectForm.jsx'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'

// Any "Contact Us" / "Start your project" button calls the function from this context
const OpenContext = createContext(() => {})
export const useProjectModal = () => useContext(OpenContext)

// The "Start a project" pop-up, built on the shadcn Dialog (Radix): it keeps keyboard focus
// inside, closes on Esc or a click outside, locks page scrolling and returns focus to the
// button that opened it.
export function ProjectModalProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [openedAt, setOpenedAt] = useState(0)
  // Kept here rather than in the form, so a half-written brief survives closing the pop-up
  const [form, setForm] = useState(emptyForm)

  // openModal({ service, budget, timeline }) pre-fills those answers. Buttons that pass
  // openModal straight to onClick hand it a click event instead, which is ignored.
  const openModal = useCallback((answers) => {
    if (answers && Object.getPrototypeOf(answers) === Object.prototype) {
      const picked = Object.fromEntries(Object.entries(answers).filter(([k, v]) => v && k in emptyForm))
      setForm((f) => ({ ...f, ...picked }))
    }
    setOpenedAt(Date.now())
    setOpen(true)
  }, [])

  return (
    <OpenContext.Provider value={openModal}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          // Start in the first field rather than on the close button
          onOpenAutoFocus={(e) => {
            e.preventDefault()
            document.getElementById('pf-name')?.focus()
          }}
          className="flex max-h-[calc(100dvh-2rem)] w-[min(760px,calc(100%-2rem))] max-w-none flex-col gap-0 overflow-hidden rounded-[18px] border-border bg-card p-0 shadow-[0_30px_80px_-20px_rgba(5,31,32,0.55)] sm:max-w-none"
        >
          <header className="flex items-center gap-4 border-b border-border bg-linear-to-r from-primary to-pine-800 py-4 pr-4 pl-5 text-pine-100 sm:pr-5 sm:pl-6">
            <img className="h-auto w-9 flex-none sm:w-11" src={asset('logo-mark-dark.png')} alt="" />
            <div>
              <DialogTitle className="m-0 font-display text-[1.05rem] font-bold text-pine-100 sm:text-[1.2rem]">
                Start a project with {company.name}
              </DialogTitle>
              <DialogDescription className="mt-0.5 mb-0 text-[0.85rem] text-pine-100/85">
                Tell us about your idea — we reply within 24 hours.
              </DialogDescription>
            </div>
            <DialogClose
              aria-label="Close"
              className="ml-auto grid size-[38px] flex-none cursor-pointer place-items-center rounded-[10px] bg-pine-100/15 text-pine-100 transition-colors hover:bg-pine-100/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine-100"
            >
              <XIcon className="size-[18px]" strokeWidth={2.2} />
            </DialogClose>
          </header>
          <div className="overflow-y-auto overscroll-contain">
            <ProjectForm openedAt={openedAt} form={form} setForm={setForm} />
          </div>
        </DialogContent>
      </Dialog>
    </OpenContext.Provider>
  )
}
