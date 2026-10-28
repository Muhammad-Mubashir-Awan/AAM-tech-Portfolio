import { useEffect } from 'react'

const SITE = 'AAM Technology'
const HOME_TITLE = 'AAM Technology — Websites & Digital Solutions'

// Sets the browser tab title for the current page, e.g. "Our Work — AAM Technology"
export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE}` : HOME_TITLE
  }, [title])
}
