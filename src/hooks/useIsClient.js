import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

// false while a page is being built ahead of time and while React takes over that HTML in the
// browser, then true. Anything that depends on the visitor's browser (saved choices, reduced
// motion) waits for true, so the built HTML and the browser's first render always match.
export default function useIsClient() {
  return useSyncExternalStore(subscribe, () => true, () => false)
}
