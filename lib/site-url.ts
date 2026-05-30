/** Canonical site origin for sitemaps, robots, and llms.txt links. */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '')
  if (fromEnv) return fromEnv

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`
  }

  return 'https://treehousetrips.com'
}
