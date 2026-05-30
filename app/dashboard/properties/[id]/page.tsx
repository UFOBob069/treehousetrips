'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  AlertCircle,
  ArrowLeft,
  Bath,
  Bed,
  Edit,
  ExternalLink,
  Home,
  MapPin,
  Users,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getProperty, Property } from '@/lib/firestore'

export default function HostPropertyPreviewPage() {
  const params = useParams()
  const propertyId = params.id as string
  const { user } = useAuth()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!propertyId) {
        setError('Invalid listing.')
        setLoading(false)
        return
      }
      const { data, error: loadError } = await getProperty(propertyId)
      if (cancelled) return
      if (loadError || !data) {
        setError(loadError || 'Listing not found')
      } else if (user && data.ownerId !== user.uid) {
        setError('You do not have permission to view this listing.')
      } else {
        setProperty(data)
      }
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [propertyId, user])

  const publicPath = property
    ? `/properties/${property.slug || property.id}`
    : null

  return (
    <div className="pb-12">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm text-stone-600 hover:text-forest-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        {loading ? (
          <p className="text-center text-gray-500 py-12">Loading preview…</p>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800">
            <AlertCircle className="mb-2 h-5 w-5" />
            {error}
          </div>
        ) : property ? (
          <>
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="font-serif text-2xl text-forest-950">{property.title}</h1>
                <p className="mt-1 flex items-center gap-1 text-stone-600">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {property.location}
                </p>
                {!property.isPublished ? (
                  <p className="mt-2 text-sm text-amber-800 bg-amber-50 inline-block px-2 py-1 rounded">
                    Not published yet — this is your host preview only.
                  </p>
                ) : null}
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/properties/${property.id}/edit`}
                  className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white/80 px-4 py-2 text-sm font-medium text-forest-900 hover:bg-stone-100/80"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Link>
                {property.isPublished && publicPath ? (
                  <Link
                    href={publicPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-forest-800 px-4 py-2 text-sm font-medium text-white hover:bg-forest-700"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Public page
                  </Link>
                ) : null}
              </div>
            </div>

            {property.images?.[0] ? (
              <img
                src={property.images[0]}
                alt=""
                className="mb-6 h-64 w-full rounded-xl object-cover"
              />
            ) : (
              <div className="mb-6 flex h-48 items-center justify-center rounded-xl bg-stone-100">
                <Home className="h-12 w-12 text-stone-400" />
              </div>
            )}

            <div className="mb-6 flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="inline-flex items-center gap-1">
                <Users className="h-4 w-4" />
                {property.guests} guests
              </span>
              <span className="inline-flex items-center gap-1">
                <Bed className="h-4 w-4" />
                {property.bedrooms} beds
              </span>
              <span className="inline-flex items-center gap-1">
                <Bath className="h-4 w-4" />
                {property.bathrooms} baths
              </span>
              {property.price ? (
                <span className="font-medium text-gray-900">${property.price}/night</span>
              ) : null}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="font-semibold text-gray-900">Description</h2>
              <p className="mt-3 whitespace-pre-wrap text-gray-700">{property.description}</p>
            </div>

            {property.tags?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {property.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-forest-50 px-3 py-1 text-xs font-medium text-forest-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  )
}
