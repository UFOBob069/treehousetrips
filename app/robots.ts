import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site-url'

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/dashboard',
        '/profile',
        '/messages',
        '/saved',
        '/pay/',
        '/payment',
        '/preview',
        '/confirmation',
        '/apply',
      ],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
