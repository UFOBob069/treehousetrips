/** Editorial homepage content — imagery-first, minimal copy */

export const HERO_IMAGE =
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a8fe05?w=1920&q=85'

export const COLLECTIONS = [
  {
    id: 'romantic',
    title: 'Romantic Retreats',
    subtitle: 'Canopy nights for two',
    image: 'https://images.unsplash.com/photo-1518173941125-8b84c33f1799?w=900&q=80',
    href: '/properties?collection=romantic',
  },
  {
    id: 'family',
    title: 'Family Adventures',
    subtitle: 'Memories above the forest floor',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80',
    href: '/properties?collection=family',
  },
  {
    id: 'off-grid',
    title: 'Off-Grid Escapes',
    subtitle: 'Unplug. Breathe. Belong.',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&q=80',
    href: '/properties?collection=off-grid',
  },
  {
    id: 'luxury',
    title: 'Luxury Treehouses',
    subtitle: 'Elevated in every sense',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&q=80',
    href: '/properties?collection=luxury',
  },
  {
    id: 'forest',
    title: 'Rainforest Hideaways',
    subtitle: 'Moss, mist, and morning light',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=80',
    href: '/properties?collection=forest',
  },
] as const

export const DESTINATIONS = [
  {
    id: 'pnw',
    name: 'Pacific Northwest',
    image: 'https://images.unsplash.com/photo-1501785880391-215778c125de?w=800&q=80',
    href: '/properties?search=Oregon',
  },
  {
    id: 'smokies',
    name: 'Smoky Mountains',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    href: '/properties?search=Carolina',
  },
  {
    id: 'colorado',
    name: 'Colorado',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    href: '/properties?search=Colorado',
  },
  {
    id: 'redwoods',
    name: 'Redwoods',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
    href: '/properties?search=California',
  },
  {
    id: 'rainforest',
    name: 'Rainforests',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a8fe05?w=800&q=80',
    href: '/properties?collection=forest',
  },
] as const

export const STORIES = [
  {
    title: 'Wake up above the forest floor',
    copy: 'Morning mist drifts through the canopy while coffee steams on your private deck.',
    image: 'https://images.unsplash.com/photo-1518173941125-8b84c33f1799?w=1000&q=80',
  },
  {
    title: 'Disconnect from the world',
    copy: 'No traffic. No timelines. Just wind in the leaves and stars through the skylight.',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1000&q=80',
  },
  {
    title: 'Romantic nights under the canopy',
    copy: 'Firelight, hot tubs, and treehouses built for slow evenings together.',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1000&q=80',
  },
  {
    title: 'Adventures kids never forget',
    copy: 'Rope bridges, zip lines, and secret platforms waiting to be explored.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&q=80',
  },
] as const

export const SEASONAL = [
  {
    id: 'fall',
    title: 'Fall Escapes',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80',
    href: '/properties',
  },
  {
    id: 'rainy',
    title: 'Rainy Weekend Retreats',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a8fe05?w=700&q=80',
    href: '/properties?collection=hot-tub',
  },
  {
    id: 'winter',
    title: 'Winter Treehouses',
    image: 'https://images.unsplash.com/photo-1518173941125-8b84c33f1799?w=700&q=80',
    href: '/properties',
  },
  {
    id: 'summer',
    title: 'Summer Forest Adventures',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=700&q=80',
    href: '/properties?collection=adventure',
  },
] as const

export const BREAK_SECTIONS = [
  {
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=85',
    quote: 'Some places don’t just host you — they change you.',
  },
  {
    image: 'https://images.unsplash.com/photo-1518173941125-8b84c33f1799?w=1920&q=85',
    quote: 'The forest remembers every story told from a treehouse deck.',
  },
] as const

export const TRAVELER_MOMENTS = [
  {
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
    caption: 'First light through the redwoods',
    author: '@canopy.collective',
  },
  {
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a8fe05?w=600&q=80',
    caption: 'Rain on cedar, coffee in hand',
    author: '@mist.and.moss',
  },
  {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    caption: 'Kids discovered the zip line at dawn',
    author: '@treetop.family',
  },
  {
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80',
    caption: 'Off-grid, on purpose',
    author: '@slow.forest',
  },
] as const
