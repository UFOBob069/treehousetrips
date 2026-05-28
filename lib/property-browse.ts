export interface BrowseProperty {
  id: string
  slug?: string
  name: string
  description: string
  location: string
  lat: number
  lng: number
  airbnbUrl: string
  hostEmail: string
  images: string[]
  tags: string[]
  price: string
  guests: number
  bedrooms: number
  bathrooms: number
}

export type BrowseView = 'map' | 'grid' | 'list'
export type SortOption = 'recommended' | 'price-asc' | 'price-desc' | 'guests-desc'

export interface BrowseFilters {
  searchQuery: string
  selectedCategories: string[]
  guestMin: number | null
  petsOnly: boolean
  secondaryTags: string[]
}

export const BROWSE_CATEGORIES = [
  { id: 'forest', label: 'Forest', icon: '🌲', tags: ['Redwoods', 'Forest', 'Eco-Friendly'] },
  { id: 'hot-tub', label: 'Hot Tub', icon: '🔥', tags: ['Hot Tub'] },
  { id: 'adventure', label: 'Adventure', icon: '🌉', tags: ['Adventure', 'Zip Line', 'Multiple Platforms'] },
  { id: 'off-grid', label: 'Off Grid', icon: '⚡', tags: ['Off-the-Grid', 'Solar Powered', 'Eco-Friendly'] },
  { id: 'luxury', label: 'Luxury', icon: '💎', tags: ['Luxury'] },
  { id: 'romantic', label: 'Romantic', icon: '💕', tags: ['Romantic'] },
  { id: 'family', label: 'Family', icon: '👨‍👩‍👧', tags: ['Family-Friendly'] },
  { id: 'stargazing', label: 'Stargazing', icon: '🌌', tags: ['Stargazing', 'Romantic', 'Off-the-Grid'] },
] as const

/** Shown in the horizontal category scroller */
export const PRIMARY_BROWSE_CATEGORY_IDS = [
  'forest',
  'hot-tub',
  'adventure',
  'off-grid',
  'luxury',
  'family',
] as const

/** Romantic, stargazing, etc. — surfaced in More Filters */
export const SECONDARY_BROWSE_CATEGORIES = BROWSE_CATEGORIES.filter(
  (c) => !PRIMARY_BROWSE_CATEGORY_IDS.includes(c.id as (typeof PRIMARY_BROWSE_CATEGORY_IDS)[number])
)

const EMOTIONAL_BY_TAG: Record<string, string> = {
  Luxury: 'Elevated canopy escape',
  Romantic: 'Perfect for couples',
  'Off-the-Grid': 'Completely off-grid',
  'Eco-Friendly': 'Forest canopy views',
  'Hot Tub': 'Great rainy weekend stay',
  'Family-Friendly': 'Kids love this one',
  Stargazing: 'Fall asleep under the stars',
  Adventure: 'Built for explorers',
  'Zip Line': 'Adventure at your doorstep',
  Redwoods: 'Ancient redwood setting',
  'Solar Powered': 'Sun-powered serenity',
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function parsePrice(price: string): number {
  const n = parseInt(price.replace(/[^0-9]/g, ''), 10)
  return Number.isFinite(n) ? n : 0
}

export function getEmotionalDescriptor(property: BrowseProperty): string {
  for (const tag of property.tags) {
    if (EMOTIONAL_BY_TAG[tag]) return EMOTIONAL_BY_TAG[tag]
  }
  if (property.guests >= 6) return 'Room for the whole crew'
  if (property.guests <= 2) return 'Intimate forest retreat'
  return 'A stay above the ordinary'
}

export function propertyMatchesPets(property: BrowseProperty): boolean {
  const haystack = [
    ...property.tags,
    property.description,
    property.name,
  ].join(' ').toLowerCase()
  return /pet|dog|cat|pup/.test(haystack)
}

export function filterBrowseProperties(
  properties: BrowseProperty[],
  filters: BrowseFilters
): BrowseProperty[] {
  let result = [...properties]
  const q = filters.searchQuery.trim().toLowerCase()

  if (q) {
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    )
  }

  if (filters.selectedCategories.length > 0) {
    const tagSet = new Set<string>()
    filters.selectedCategories.forEach((catId) => {
      const cat = BROWSE_CATEGORIES.find((c) => c.id === catId)
      cat?.tags.forEach((t) => tagSet.add(t))
    })
    result = result.filter((p) => p.tags.some((t) => tagSet.has(t)))
  }

  if (filters.secondaryTags.length > 0) {
    result = result.filter((p) =>
      filters.secondaryTags.some((t) => p.tags.includes(t))
    )
  }

  if (filters.guestMin !== null) {
    result = result.filter((p) => p.guests >= filters.guestMin!)
  }

  if (filters.petsOnly) {
    result = result.filter(propertyMatchesPets)
  }

  return result
}

export function sortBrowseProperties(
  properties: BrowseProperty[],
  sort: SortOption
): BrowseProperty[] {
  const sorted = [...properties]
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price))
    case 'price-desc':
      return sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price))
    case 'guests-desc':
      return sorted.sort((a, b) => b.guests - a.guests)
    default:
      return sorted
  }
}

export function getAllTags(properties: BrowseProperty[]): string[] {
  const primaryTags = new Set<string>(BROWSE_CATEGORIES.flatMap((c) => [...c.tags]))
  return Array.from(
    new Set(properties.flatMap((p) => p.tags).filter((t) => !primaryTags.has(t)))
  ).sort()
}
