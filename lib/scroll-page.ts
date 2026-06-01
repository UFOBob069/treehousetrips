/** Scroll window to top — use after route changes where scroll must reset (e.g. /create). */
export function scrollPageToTop(behavior: ScrollBehavior = 'auto') {
  if (typeof window === 'undefined') return
  window.scrollTo({ top: 0, left: 0, behavior })
}
