import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { asset, company } from '../data.js'
import ProjectForm from './ProjectForm.jsx'

// Any "Contact Us" / "Start your project" button calls the function from this context
const OpenContext = createContext(() => {})
export const useProjectModal = () => useContext(OpenContext)

export function ProjectModalProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [prefill, setPrefill] = useState(null)
  // openModal({ service, budget, timeline }) pre-fills those answers. Buttons that pass
  // openModal straight to onClick hand it a click event instead, which is ignored.
  const openModal = useCallback((answers) => {
    const isAnswers = answers && Object.getPrototypeOf(answers) === Object.prototype
    setPrefill(isAnswers ? answers : null)
    setOpen(true)
  }, [])
  const close = useCallback(() => setOpen(false), [])

  return (
    <OpenContext.Provider value={openModal}>
      {children}
      <ProjectModal open={open} onClose={close} prefill={prefill} />
    </OpenContext.Provider>
  )
}

// The "Start a project" pop-up. A native <dialog> keeps keyboard focus inside it, closes on
// Esc and puts the focus back on the button that opened it when it closes.
function ProjectModal({ open, onClose, prefill }) {
  const dialogRef = useRef(null)
  const [openedAt, setOpenedAt] = useState(0)
  const pressedOnBackdrop = useRef(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      setOpenedAt(Date.now())
      dialog.showModal()
      document.documentElement.classList.add('modal-open') // no page scrolling behind it
      // Start in the first field rather than on the close button
      dialog.querySelector('input[name="name"]')?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  // The dialog's own "close" event arrives a moment after it closes (and can be held back in a
  // background tab), so every way of closing updates the state straight away. The events
  // stay as a backup; running this twice is harmless.
  const closeModal = useCallback(() => {
    if (dialogRef.current?.open) dialogRef.current.close()
    document.documentElement.classList.remove('modal-open')
    onClose()
  }, [onClose])

  useEffect(() => {
    const dialog = dialogRef.current
    // Esc fires "cancel" right away, then the browser closes the dialog itself
    const onCancel = () => closeModal()
    // A late "close" from an earlier closing must not shut a pop-up that's been reopened since
    const onNativeClose = () => {
      if (!dialog.open) closeModal()
    }
    dialog.addEventListener('cancel', onCancel)
    dialog.addEventListener('close', onNativeClose)
    return () => {
      dialog.removeEventListener('cancel', onCancel)
      dialog.removeEventListener('close', onNativeClose)
    }
  }, [closeModal])

  // Close on a click outside the panel — but not when a text selection that started inside
  // the form is released over the backdrop
  const onMouseDown = (e) => { pressedOnBackdrop.current = e.target === e.currentTarget }
  const onClick = (e) => {
    if (e.target === e.currentTarget && pressedOnBackdrop.current) closeModal()
  }

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby="project-modal-title"
      onMouseDown={onMouseDown}
      onClick={onClick}
    >
      <div className="modal__panel">
        <header className="modal__header">
          <img className="modal__mark" src={asset('logo-mark-dark.png')} alt="" />
          <div>
            <h2 id="project-modal-title" className="modal__title">Start a project with {company.name}</h2>
            <p className="modal__subtitle">Tell us about your idea — we reply within 24 hours.</p>
          </div>
          <button type="button" className="modal__close" aria-label="Close" onClick={closeModal}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </header>
        {/* Always mounted, so a half-written brief survives closing the pop-up by accident */}
        <div className="modal__body"><ProjectForm openedAt={openedAt} prefill={prefill} /></div>
      </div>
    </dialog>
  )
}
