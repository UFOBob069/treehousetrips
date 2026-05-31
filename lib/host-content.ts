/** Host landing page — editorial copy and imagery from /public */

import { SITE_IMAGES } from '@/lib/site-images'

export const HOST_HERO_IMAGE = SITE_IMAGES.hostHero

export const WHY_LIST_POINTS = [
  {
    title: 'Travelers come for treehouses',
    copy: 'Guests arrive with intent — they are not browsing generic vacation rentals. They want canopy nights, rope bridges, and forest mornings.',
    image: '/collection-rainforest-hideaways-900.png',
  },
  {
    title: 'Niche beats buried',
    copy: 'On broad platforms, unique stays disappear in the noise. A focused marketplace gives your property room to breathe and be remembered.',
    image: '/destination-lakeside-treehouse-dock-800.png',
  },
  {
    title: 'Emotion drives bookings',
    copy: 'Treehouse travelers choose experiences, not square footage. Story-driven listings perform better where discovery is curated, not commoditized.',
    image: '/collection-interior-bedroom-windows-900.png',
  },
] as const

export const HOST_BENEFITS = [
  {
    id: 'direct',
    title: 'Direct Communication',
    copy: 'Build relationships with interested travelers — conversations that feel personal, not transactional.',
    image: '/host-benefit-direct-communication-800.png',
  },
  {
    id: 'curated',
    title: 'Curated Discovery',
    copy: 'Stand out in a marketplace built around extraordinary stays, not thousands of lookalike listings.',
    image: '/host-benefit-curated-discovery-800.png',
  },
  {
    id: 'premium',
    title: 'Premium Presentation',
    copy: 'Showcase your treehouse with cinematic imagery and storytelling that matches the magic of the stay.',
    image: '/host-benefit-premium-presentation-800.png',
  },
  {
    id: 'intent',
    title: 'High-Intent Travelers',
    copy: 'Reach guests actively searching for memorable treehouse experiences — not accidental clicks.',
    image: '/host-benefit-high-intent-travelers-800.png',
  },
  {
    id: 'niche',
    title: 'Niche Visibility',
    copy: 'Avoid competing with urban apartments and beach condos. Your category is the entire point.',
    image: '/host-benefit-niche-visibility-800.png',
  },
  {
    id: 'shareable',
    title: 'More Shareable',
    copy: 'Beautiful listings travelers actually send to friends — the kind of stays that spread by word of mouth.',
    image: '/host-benefit-shareable-listings-800.png',
  },
] as const

export const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Apply',
    copy: 'Create your listing and share your treehouse story — photos, vibe, and what makes your stay unforgettable.',
  },
  {
    step: '02',
    title: 'Get Featured',
    copy: 'We showcase your property in a premium, visual-first environment built for discovery.',
  },
  {
    step: '03',
    title: 'Connect With Travelers',
    copy: 'Interested guests reach out directly to learn more and book — you stay in control of the relationship.',
  },
] as const

export const EXAMPLE_LISTINGS = [
  {
    name: 'Forest Canopy Retreat',
    location: 'Pacific Northwest',
    tagline: 'Mist, cedar, and morning light',
    image: '/destination-pacific-northwest-800.png',
  },
  {
    name: 'Off-Grid Cabin',
    location: 'Big Sur, California',
    tagline: 'Solar-powered serenity among the redwoods',
    image: '/collection-off-grid-escapes-900.png',
  },
  {
    name: 'Luxury Glass Treehouse',
    location: 'Asheville, North Carolina',
    tagline: 'Elevated design above the canopy',
    image: '/collection-interior-bedroom-windows-900.png',
  },
  {
    name: 'Family Adventure Stay',
    location: 'Smoky Mountains',
    tagline: 'Platforms, bridges, and stories for years',
    image: '/story-suspension-bridge-family-memories-1000.png',
  },
] as const

export const HOST_STORIES = [
  {
    quote:
      'Guests find us because they want a treehouse — not because they filtered by price on a generic site.',
    name: 'Elena R.',
    detail: 'Redwood canopy retreat · Oregon',
  },
  {
    quote:
      'Our listing finally looks like the experience feels. People message us excited before they even ask about dates.',
    name: 'James & Priya',
    detail: 'Off-grid hideaway · California',
  },
] as const
