/**
 * Marketing images served from /public.
 * Prefer sized variants (-900, -800, -1920) over -original.
 */
export function publicImage(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

export const SITE_IMAGES = {
  hero: '/cinematic-rain-lit-treehouse-1920.png',
  heroCompact: '/tree-house-trips-main-hero.png',
  listingFallback: '/collection-rainforest-hideaways-900.png',
  checkoutProduct: '/collection-interior-bedroom-windows-900.png',
  hostHero: '/quote-break-treehouse-waterfall-v2-1920.png',
  hostMarketplace: '/host-benefit-premium-presentation-800.png',
} as const
