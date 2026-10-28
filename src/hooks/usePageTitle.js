import { useEffect } from 'react'
import { pageTitle } from '../seo.js'

// Sets the browser tab title for the current page, e.g. "Our Work — AAM Technology"
export default function usePageTitle(title) {
  useEffect(() => {
    document.title = pageTitle(title)
  }, [title])
}
