import type { MetadataRoute } from 'next'
import properties from '@/data/properties.json'
import { slugify } from '@/lib/property-browse'
import { getSiteUrl } from '@/lib/site-url'

const STATIC_PATHS = [
  '',
  '/properties',
  '/about',
  '/create',
  '/list-your-treehouse',
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl()
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === '' || path === '/properties' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : path === '/properties' ? 0.9 : 0.7,
  }))

  const propertyEntries: MetadataRoute.Sitemap = properties.map((p) => {
    const slug = 'slug' in p && typeof p.slug === 'string' && p.slug ? p.slug : slugify(p.name)
    return {
      url: `${base}/properties/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }
  })

  return [...staticEntries, ...propertyEntries]
}
