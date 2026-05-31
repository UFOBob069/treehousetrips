/** Editorial homepage content — imagery from /public */

import { SITE_IMAGES } from '@/lib/site-images'

export const HERO_IMAGE = SITE_IMAGES.hero

export const COLLECTIONS = [
  {
    id: 'romantic',
    title: 'Romantic Retreats',
    subtitle: 'Canopy nights for two',
    image: '/collection-couple-coffee-deck-900.png',
    href: '/properties?collection=romantic',
  },
  {
    id: 'family',
    title: 'Family Adventures',
    subtitle: 'Memories above the forest floor',
    image: '/collection-family-adventures-900.png',
    href: '/properties?collection=family',
  },
  {
    id: 'off-grid',
    title: 'Off-Grid Escapes',
    subtitle: 'Unplug. Breathe. Belong.',
    image: '/collection-off-grid-escapes-900.png',
    href: '/properties?collection=off-grid',
  },
  {
    id: 'luxury',
    title: 'Luxury Treehouses',
    subtitle: 'Elevated in every sense',
    image: '/collection-interior-bedroom-windows-900.png',
    href: '/properties?collection=luxury',
  },
  {
    id: 'forest',
    title: 'Rainforest Hideaways',
    subtitle: 'Moss, mist, and morning light',
    image: '/collection-rainforest-hideaways-900.png',
    href: '/properties?collection=forest',
  },
] as const

export const DESTINATIONS = [
  {
    id: 'pnw',
    name: 'Pacific Northwest',
    image: '/destination-pacific-northwest-800.png',
    href: '/properties?search=Oregon',
  },
  {
    id: 'smokies',
    name: 'Smoky Mountains',
    image: '/destination-smoky-mountains-blue-haze-800.png',
    href: '/properties?search=Carolina',
  },
  {
    id: 'colorado',
    name: 'Colorado',
    image: '/destination-colorado-winter-firepit-800.png',
    href: '/properties?search=Colorado',
  },
  {
    id: 'redwoods',
    name: 'Redwoods',
    image: '/destination-redwoods-800.png',
    href: '/properties?search=California',
  },
  {
    id: 'rainforest',
    name: 'Rainforests',
    image: '/destination-rainforests-800.png',
    href: '/properties?collection=forest',
  },
] as const

export const STORIES = [
  {
    title: 'Wake up above the forest floor',
    copy: 'Golden light spills across the deck while the forest wakes below.',
    image: '/story-sunrise-deck-scene-1000.png',
  },
  {
    title: 'Disconnect from the world',
    copy: 'A reading nook, soft rain, and nowhere else you need to be.',
    image: '/story-reading-nook-relief-1000.png',
  },
  {
    title: 'Romantic nights under the canopy',
    copy: 'Firelight, shared blankets, and slow evenings by the pit.',
    image: '/story-outdoor-fire-pit-connection-1000.png',
  },
  {
    title: 'Adventures kids never forget',
    copy: 'Suspension bridges, laughter, and memories that last for years.',
    image: '/story-suspension-bridge-family-memories-1000.png',
  },
] as const

export const SEASONAL = [
  {
    id: 'fall',
    title: 'Fall Escapes',
    image: '/seasonal-fall-700.png',
    href: '/properties',
  },
  {
    id: 'rainy',
    title: 'Rainy Weekend Retreats',
    image: '/collection-hot-tub-forest-900.png',
    href: '/properties?collection=hot-tub',
  },
  {
    id: 'winter',
    title: 'Winter Treehouses',
    image: '/seasonal-winter-700.png',
    href: '/properties',
  },
  {
    id: 'summer',
    title: 'Summer Forest Adventures',
    image: '/seasonal-summer-700.png',
    href: '/properties?collection=adventure',
  },
] as const

export const BREAK_SECTIONS = [
  {
    image: '/quote-break-treehouse-waterfall-v2-1920.png',
    quote: 'Some places don’t just host you — they change you.',
  },
  {
    image: '/quote-break-treehouse-waterfall-1920.png',
    quote: 'The forest remembers every story told from a treehouse deck.',
  },
] as const

export const TRAVELER_MOMENTS = [
  {
    image: '/traveler-moment-hot-tubs-v2-600.png',
    caption: 'Soak under the stars',
    author: '@canopy.collective',
    placement: 'md:col-span-5 md:row-span-2 md:col-start-1 md:row-start-1',
    mobileAspect: 'aspect-[4/5]',
  },
  {
    image: '/traveler-moment-stargazing-deck-600x750.png',
    caption: 'First light through the redwoods',
    author: '@canopy.collective',
    placement: 'md:col-span-4 md:row-span-1 md:col-start-6 md:row-start-1',
    mobileAspect: 'aspect-[3/4]',
  },
  {
    image: '/traveler-moment-pet-friendly-600.png',
    caption: 'Bring the whole pack',
    author: '@treetop.family',
    placement: 'md:col-span-3 md:row-span-1 md:col-start-10 md:row-start-1',
    mobileAspect: 'aspect-square',
  },
  {
    image: '/traveler-moment-canopy-bridge-600x750.png',
    caption: 'Morning on the canopy bridge',
    author: '@mist.and.moss',
    placement: 'md:col-span-3 md:row-span-1 md:col-start-6 md:row-start-2',
    mobileAspect: 'aspect-[4/5]',
  },
  {
    image: '/traveler-moment-reading-nook-600x750.png',
    caption: 'Rain on cedar, a book, nowhere to be',
    author: '@mist.and.moss',
    placement: 'md:col-span-2 md:row-span-1 md:col-start-9 md:row-start-2',
    mobileAspect: 'aspect-[3/4]',
  },
  {
    image: '/traveler-moment-morning-coffee-600x750.png',
    caption: 'Slow starts above the forest floor',
    author: '@slow.forest',
    placement: 'md:col-span-2 md:row-span-1 md:col-start-11 md:row-start-2',
    mobileAspect: 'aspect-[4/5]',
  },
] as const
