/** Host landing page — editorial copy and imagery from /public */

import { SITE_IMAGES } from '@/lib/site-images'

export const HOST_HERO_IMAGE = SITE_IMAGES.hostHero

export const HOST_PRICE = '$50/year' as const

export const WHY_HOSTS_JOIN = [
  {
    id: 'reach',
    title: 'Reach Travelers Looking Specifically For Treehouses',
    copy: 'Not generic vacation rentals — guests who already want canopy nights, rope bridges, and forest mornings.',
    image: '/host-benefit-high-intent-travelers-800.png',
  },
  {
    id: 'airbnb',
    title: 'Keep Your Existing Airbnb Listing',
    copy: 'No exclusivity required. Treehouse Trips is another channel — your Airbnb, Vrbo, and direct bookings stay exactly as they are.',
    image: '/host-benefit-curated-discovery-800.png',
  },
  {
    id: 'direct',
    title: 'Direct Inquiries',
    copy: 'Connect directly with interested guests through in-app messaging — personal conversations, not a black-box algorithm.',
    image: '/host-benefit-direct-communication-800.png',
  },
  {
    id: 'pricing',
    title: 'Only $50 Per Year',
    copy: 'Simple pricing. No commissions. No booking fees. Even one serious inquiry can make the year.',
    image: '/host-benefit-shareable-listings-800.png',
  },
] as const

export const DISCOVERY_CHANNELS = [
  'Airbnb',
  'Vrbo',
  'Direct website',
  'Instagram',
  'Treehouse Trips',
] as const

export const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Create your listing',
    copy: 'Share your photos, story, and booking links — scratch or import from Airbnb. Edit everything before you publish.',
  },
  {
    step: '02',
    title: 'Go live for $50/year',
    copy: 'One flat annual fee per treehouse. No commissions on stays you book elsewhere.',
  },
  {
    step: '03',
    title: 'Connect with travelers',
    copy: 'Interested guests discover you here and reach out directly. You stay in control of pricing and bookings.',
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
