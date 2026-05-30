'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getPropertiesByOwner } from '@/lib/firestore'
import { Property } from '@/lib/firestore'
import { 
  Home, 
  Plus, 
  Edit, 
  Eye, 
  MapPin,
  Users,
  Bed,
  Bath,
  Settings,
  AlertCircle,
  MessageCircle,
  CreditCard,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import {
  getPropertySubscriptionState,
  SubscribePropertyButton,
} from '@/components/host/SubscribePropertyButton'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuth()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      loadProperties()
    }
  }, [user])

  const loadProperties = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      console.log('Loading properties for user:', user.uid)
      const userProperties = await getPropertiesByOwner(user.uid)
      console.log('Loaded properties:', userProperties)
      setProperties(userProperties)
    } catch (err) {
      console.error('Error loading properties:', err)
      setError(`Failed to load your properties: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const activeSubscriptionCount = properties.filter(
    (p) => getPropertySubscriptionState(p) === 'active'
  ).length
  const needsSubscriptionCount = properties.filter(
    (p) => getPropertySubscriptionState(p) !== 'active'
  ).length
  const showSubscriptionCta = properties.length > 0 && needsSubscriptionCount > 0

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="mx-auto h-12 w-12 text-stone-400 mb-4" />
          <h2 className="font-serif text-2xl text-forest-950 mb-2">Please sign in</h2>
          <p className="text-stone-600 mb-6">You need to be logged in to access your dashboard.</p>
          <Link
            href="/create"
            className="inline-flex rounded-full bg-forest-800 text-white px-6 py-3 text-sm font-medium hover:bg-forest-700 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    )
  }


  return (
    <div className="pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-moss text-sm tracking-widest uppercase mb-1">Host</p>
            <h1 className="font-serif text-3xl text-forest-950 tracking-tight">Dashboard</h1>
            <p className="text-stone-600 mt-2">Welcome back, {user.displayName || user.email}</p>
          </div>
          <Link
            href="/dashboard/subscriptions"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-800 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-forest-700 transition-colors"
          >
            <CreditCard className="h-4 w-4" />
            Listing subscriptions
          </Link>
        </div>

        {showSubscriptionCta ? (
          <div className="mb-8 rounded-2xl border border-amber-muted/30 bg-gradient-to-r from-amber-warm/20 to-forest-50 p-5 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">
                    Your next step
                  </p>
                  <h2 className="font-serif text-lg text-forest-950">
                    Activate {needsSubscriptionCount === 1 ? 'your listing' : `${needsSubscriptionCount} listings`} — $50/year each
                  </h2>
                  <p className="mt-1 text-sm text-stone-600 max-w-xl">
                    Subscriptions put your treehouse on the map for travelers searching Treehouse Trips.
                    No commission on Airbnb bookings — one flat annual fee per property.
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/subscriptions"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-800 px-5 py-3 text-sm font-medium text-white hover:bg-forest-700 whitespace-nowrap"
              >
                View plans &amp; activate
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : null}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#fffcf7] rounded-2xl border border-stone-200/60 shadow-[0_8px_30px_rgba(26,43,26,0.06)] p-6">
            <div className="flex items-center">
              <div className="p-2 bg-forest-100 rounded-xl">
                <Home className="h-6 w-6 text-forest-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-stone-600">Total Properties</p>
                <p className="text-2xl font-serif text-forest-950">{properties.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#fffcf7] rounded-2xl border border-stone-200/60 shadow-[0_8px_30px_rgba(26,43,26,0.06)] p-6">
            <div className="flex items-center">
              <div className="p-2 bg-forest-100 rounded-xl">
                <Eye className="h-6 w-6 text-forest-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-stone-600">Published</p>
                <p className="text-2xl font-serif text-forest-950">
                  {properties.filter(p => p.isPublished).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#fffcf7] rounded-2xl border border-stone-200/60 shadow-[0_8px_30px_rgba(26,43,26,0.06)] p-6">
            <div className="flex items-center">
              <div className="p-2 bg-amber-warm/30 rounded-xl">
                <Edit className="h-6 w-6 text-amber-muted" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-stone-600">Pending</p>
                <p className="text-2xl font-serif text-forest-950">
                  {properties.filter(p => !p.isPublished).length}
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard/subscriptions"
            className="bg-[#fffcf7] rounded-2xl border border-stone-200/60 shadow-[0_8px_30px_rgba(26,43,26,0.06)] p-6 hover:ring-2 hover:ring-forest-300/50 transition-shadow block"
          >
            <div className="flex items-center">
              <div
                className={`p-2 rounded-lg ${
                  properties.length > 0 && activeSubscriptionCount === properties.length
                    ? 'bg-green-100'
                    : needsSubscriptionCount > 0
                      ? 'bg-amber-100'
                      : 'bg-stone-100'
                }`}
              >
                <CreditCard
                  className={`h-6 w-6 ${
                    properties.length > 0 && activeSubscriptionCount === properties.length
                      ? 'text-forest-700'
                      : needsSubscriptionCount > 0
                        ? 'text-amber-muted'
                        : 'text-stone-400'
                  }`}
                />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-stone-600">Listing subscriptions</p>
                <p className="text-sm font-medium text-forest-950">
                  {properties.length === 0
                    ? 'None yet'
                    : `${activeSubscriptionCount} of ${properties.length} active`}
                </p>
                {needsSubscriptionCount > 0 ? (
                  <p className="text-xs text-amber-700 mt-0.5">Tap to activate →</p>
                ) : properties.length > 0 ? (
                  <p className="text-xs text-green-700 mt-0.5">Manage renewals →</p>
                ) : null}
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#fffcf7] rounded-2xl border border-stone-200/60 shadow-[0_8px_30px_rgba(26,43,26,0.06)] mb-8">
          <div className="px-6 py-4 border-b border-stone-200/60">
            <h2 className="font-serif text-lg text-forest-950">Quick actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/dashboard/subscriptions"
                className={`flex items-center p-4 border rounded-2xl transition-colors ${
                  showSubscriptionCta
                    ? 'border-forest-300/60 bg-forest-50 hover:bg-forest-100/80'
                    : 'border-stone-200/60 hover:bg-stone-100/50'
                }`}
              >
                <CreditCard className="h-6 w-6 text-forest-700 mr-3" />
                <div>
                  <h3 className="font-medium text-forest-950">Subscriptions</h3>
                  <p className="text-sm text-stone-600">
                    {showSubscriptionCta ? 'Activate listings — $50/yr' : 'Plans & billing per property'}
                  </p>
                </div>
              </Link>

              <Link
                href="/create"
                className="flex items-center p-4 border border-stone-200/60 rounded-2xl hover:bg-stone-100/50 transition-colors"
              >
                <Plus className="h-6 w-6 text-forest-700 mr-3" />
                <div>
                  <h3 className="font-medium text-forest-950">List new property</h3>
                  <p className="text-sm text-stone-600">Add a new treehouse to your portfolio</p>
                </div>
              </Link>

              <Link
                href="/messages"
                className="flex items-center p-4 border border-stone-200/60 rounded-2xl hover:bg-stone-100/50 transition-colors"
              >
                <MessageCircle className="h-6 w-6 text-moss mr-3" />
                <div>
                  <h3 className="font-medium text-forest-950">Messages</h3>
                  <p className="text-sm text-stone-600">Chat with interested travelers</p>
                </div>
              </Link>

              <Link
                href="/profile"
                className="flex items-center p-4 border border-stone-200/60 rounded-2xl hover:bg-stone-100/50 transition-colors"
              >
                <Settings className="h-6 w-6 text-forest-700 mr-3" />
                <div>
                  <h3 className="font-medium text-forest-950">Profile settings</h3>
                  <p className="text-sm text-stone-600">Update your host profile</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Properties List */}
        <div className="bg-[#fffcf7] rounded-2xl border border-stone-200/60 shadow-[0_8px_30px_rgba(26,43,26,0.06)]">
          <div className="px-6 py-4 border-b border-stone-200/60">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg text-forest-950">Your properties</h2>
              {properties.filter(p => !p.isPublished).length > 0 && (
                <div className="text-sm text-stone-600">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                    {properties.filter(p => !p.isPublished).length} pending review
                  </span>
                </div>
              )}
            </div>
            {properties.filter(p => !p.isPublished).length > 0 && (
              <p className="text-sm text-stone-600 mt-2">
                Pending properties can be edited until they&apos;re approved and published.
              </p>
            )}
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-forest-200 border-t-forest-700 mx-auto"></div>
              <p className="text-stone-600 mt-2">Loading your properties…</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
              <p className="text-red-600">{error}</p>
              <button
                onClick={loadProperties}
                className="mt-4 px-4 py-2 rounded-full bg-forest-800 text-white text-sm font-medium hover:bg-forest-700"
              >
                Retry
              </button>
            </div>
          ) : properties.length === 0 ? (
            <div className="p-6 text-center">
              <Home className="mx-auto h-12 w-12 text-stone-400 mb-4" />
              <h3 className="font-serif text-lg text-forest-950 mb-2">No properties yet</h3>
              <p className="text-stone-600 mb-4">Start by listing your first treehouse property.</p>
              <Link
                href="/create"
                className="inline-flex rounded-full bg-forest-800 text-white px-6 py-3 text-sm font-medium hover:bg-forest-700 transition-colors"
              >
                List Your First Property
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-stone-200/60">
              {properties.map((property) => (
                <div key={property.id} className="p-6">
                  <div className="flex items-stretch justify-between gap-4">
                    <div className="flex min-w-0 flex-1 gap-4">
                        {property.images && property.images.length > 0 ? (
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="h-20 w-28 shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-lg bg-stone-100">
                            <Home className="h-8 w-8 text-stone-400" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1 py-0.5">
                          <h3 className="font-serif text-lg text-forest-950">{property.title}</h3>
                          <div className="mt-1 flex items-center text-stone-600">
                            <MapPin className="mr-1 h-4 w-4 shrink-0" />
                            <span className="truncate text-sm">{property.location}</span>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-600">
                            <span className="inline-flex items-center gap-1">
                              <Users className="h-4 w-4 shrink-0" />
                              {property.guests} guests
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Bed className="h-4 w-4 shrink-0" />
                              {property.bedrooms} {property.bedrooms === 1 ? 'bed' : 'beds'}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Bath className="h-4 w-4 shrink-0" />
                              {property.bathrooms} {property.bathrooms === 1 ? 'bath' : 'baths'}
                            </span>
                          </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        property.isPaid && property.subscriptionStatus === 'active'
                          ? 'bg-green-100 text-green-800'
                          : property.subscriptionStatus === 'expired'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {property.isPaid && property.subscriptionStatus === 'active' 
                          ? 'Active' 
                          : property.subscriptionStatus === 'expired'
                          ? 'Expired'
                          : 'Pending Payment'}
                      </span>
                      {property.subscriptionEndDate && (
                        <span className="text-xs text-stone-500">
                          Expires: {new Date(property.subscriptionEndDate.seconds * 1000).toLocaleDateString()}
                        </span>
                      )}
                      
                      <div className="flex space-x-1">
                        {property.id ? (
                          <>
                            <Link
                              href={`/dashboard/properties/${property.id}`}
                              className="p-2 text-stone-400 hover:text-forest-800"
                              title="View listing preview"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <Link
                              href={`/dashboard/properties/${property.id}/edit`}
                              className="p-2 text-stone-400 hover:text-forest-800"
                              title={property.isPublished ? 'Edit property' : 'Edit pending property'}
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                          </>
                        ) : null}
                        {getPropertySubscriptionState(property) !== 'active' && property.id ? (
                          <SubscribePropertyButton
                            propertyId={property.id}
                            propertyTitle={property.title}
                            label={
                              property.subscriptionStatus === 'expired' ? 'Renew $50/yr' : 'Pay $50/yr'
                            }
                            variant={
                              property.subscriptionStatus === 'expired' ? 'renew' : 'primary'
                            }
                            className="shrink-0"
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
