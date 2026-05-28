import { notFound } from 'next/navigation'
import PropertyDetail from '@/components/PropertyDetail'
import { slugify } from '@/lib/property-browse'

interface Property {
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
  ownerId: string
  title: string
  contactEmail: string
  isPublished: boolean
  exactAddress?: string
}

async function loadProperties(): Promise<Property[]> {
  const mod = await import('@/data/properties.json')
  return (mod.default || []) as Property[]
}

async function getProperty(idOrSlug: string): Promise<Property | null> {
  const properties = await loadProperties()
  return (
    properties.find((p) => p.id === idOrSlug) ||
    properties.find((p) => p.slug === idOrSlug) ||
    properties.find((p) => slugify(p.name) === idOrSlug) ||
    null
  )
}

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = await getProperty(params.id)

  if (!property) {
    notFound()
  }

  return <PropertyDetail property={property} />
}

export async function generateStaticParams() {
  const properties = await loadProperties()
  return properties.map((property) => ({
    id: property.slug || slugify(property.name) || property.id,
  }))
}
