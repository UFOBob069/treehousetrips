'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createProperty, getProperty, Property, updateProperty, type BookingLink } from '@/lib/firestore'
import ListingImageManager from '@/components/host/ListingImageManager'
import { MapPin, Link, Edit3, Save, Eye, Loader2, CheckCircle, AlertCircle, ArrowRight, ChevronLeft } from 'lucide-react'
import AddressAutocomplete from './AddressAutocomplete'
import { BROWSE_CATEGORIES, slugify } from '@/lib/property-browse'

interface ScrapedData {
  title: string
  description: string
  location: string
  price: number
  images: string[]
  guests: number
  bedrooms: number
  bathrooms: number
  amenities: string[]
  hostName: string
  hostAvatar: string
  rating: number
  reviewCount: number
  lat?: number
  lng?: number
}

interface HostOnboardingFormProps {
  mode: 'import' | 'scratch'
  editPropertyId?: string
  onSuccess: (propertyTitle: string, propertyId: string) => void
  onBack?: () => void
}

interface ListingFormData {
  title: string
  slug: string
  description: string
  location: string
  exactAddress: string
  price: number
  contactEmail: string
  contactPhone: string
  showContactEmail: boolean
  showContactPhone: boolean
  airbnbUrl: string
  websiteUrl: string
  bookingLinks: BookingLink[]
  images: string[]
  tags: string[]
  guests: number
  bedrooms: number
  bathrooms: number
  rating: number
  reviewCount: number
  lat?: number
  lng?: number
  isPublished: boolean
  isPaid: boolean
  subscriptionStatus: 'active' | 'expired' | 'pending' | 'canceled'
}

const createEmptyFormData = (email = ''): ListingFormData => ({
  title: '',
  slug: '',
  description: '',
  location: '',
  exactAddress: '',
  price: 0,
  contactEmail: email,
  contactPhone: '',
  showContactEmail: false,
  showContactPhone: false,
  airbnbUrl: '',
  websiteUrl: '',
  bookingLinks: [],
  images: [],
  tags: [],
  guests: 0,
  bedrooms: 0,
  bathrooms: 0,
  rating: 0,
  reviewCount: 0,
  isPublished: false,
  isPaid: false,
  subscriptionStatus: 'pending',
})

function propertyToFormData(property: Property, fallbackEmail = ''): ListingFormData {
  return {
    title: property.title || '',
    slug: property.slug || '',
    description: property.description || '',
    location: property.location || '',
    exactAddress: property.exactAddress || '',
    price: property.price ?? 0,
    contactEmail: property.contactEmail || fallbackEmail,
    contactPhone: property.contactPhone || '',
    showContactEmail: property.showContactEmail ?? false,
    showContactPhone: property.showContactPhone ?? false,
    airbnbUrl: property.airbnbUrl || '',
    websiteUrl: property.websiteUrl || '',
    bookingLinks: property.bookingLinks || [],
    images: property.images || [],
    tags: property.tags || [],
    guests: property.guests ?? 0,
    bedrooms: property.bedrooms ?? 0,
    bathrooms: property.bathrooms ?? 0,
    rating: 0,
    reviewCount: 0,
    lat: property.lat,
    lng: property.lng,
    isPublished: property.isPublished ?? false,
    isPaid: property.isPaid ?? false,
    subscriptionStatus: property.subscriptionStatus || 'pending',
  }
}

export default function HostOnboardingForm({
  mode,
  editPropertyId,
  onSuccess,
  onBack,
}: HostOnboardingFormProps) {
  const { user } = useAuth()
  const isEditing = Boolean(editPropertyId)
  const [step, setStep] = useState<'url' | 'edit' | 'preview'>(
    isEditing || mode === 'scratch' ? 'edit' : 'url'
  )
  const [loadingExisting, setLoadingExisting] = useState(isEditing)
  const [airbnbUrl, setAirbnbUrl] = useState('')
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null)
  const [editedData, setEditedData] = useState<Partial<Property>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState<ListingFormData>(() =>
    createEmptyFormData(user?.email || '')
  )

  useEffect(() => {
    if (!editPropertyId || !user) return

    let cancelled = false
    async function loadExisting() {
      if (!editPropertyId) return
      setLoadingExisting(true)
      setError('')
      try {
        const { data, error: loadError } = await getProperty(editPropertyId)
        if (cancelled) return
        if (loadError || !data) {
          setError(loadError || 'Listing not found')
          return
        }
        if (!user || data.ownerId !== user.uid) {
          setError('You do not have permission to edit this listing.')
          return
        }
        setFormData(propertyToFormData(data, user.email || ''))
        setStep('edit')
      } catch {
        if (!cancelled) setError('Failed to load listing')
      } finally {
        if (!cancelled) setLoadingExisting(false)
      }
    }
    loadExisting()
    return () => {
      cancelled = true
    }
  }, [editPropertyId, user])

  const toggleTag = (tag: string) => {
    setFormData((prev) => {
      const exists = prev.tags.includes(tag)
      return {
        ...prev,
        tags: exists ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
      }
    })
  }

  const handleScrape = async () => {
    if (!airbnbUrl) return
    
    setLoading(true)
    setError('')
    
    try {
      // First, let's debug what we can actually scrape
      const debugResponse = await fetch('/api/test-scraper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: airbnbUrl })
      })
      
      const debugResult = await debugResponse.json()
      console.log('=== DEBUG RESULT ===')
      console.log('Location Tests:', debugResult.locationTests)
      console.log('Image Tests:', debugResult.imageTests)
      console.log('Title Tests:', debugResult.titleTests)
      console.log('Raw HTML:', debugResult.rawHTML)
      console.log('===================')
      
      // Try the improved scraper first
      let response = await fetch('/api/scrape-airbnb-improved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: airbnbUrl })
      })
      
      let result = await response.json()
      
      // If improved scraper fails, try the simple version
      if (result.error) {
        response = await fetch('/api/scrape-airbnb-simple', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: airbnbUrl })
        })
        
        result = await response.json()
      }
      
      // If simple scraper fails, try the Puppeteer version
      if (result.error) {
        response = await fetch('/api/scrape-airbnb', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: airbnbUrl })
        })
        
        result = await response.json()
      }
      
      if (result.error) {
        setError(result.error)
        return
      }
      
      setScrapedData(result.data)
      
      // Pre-populate form with scraped data
      setFormData({
        ...createEmptyFormData(user?.email || ''),
        title: result.data.title,
        description: result.data.description,
        location: result.data.location,
        exactAddress: result.data.location,
        price: result.data.price,
        airbnbUrl: airbnbUrl,
        images: result.data.images,
        tags: result.data.amenities,
        guests: result.data.guests,
        bedrooms: result.data.bedrooms,
        bathrooms: result.data.bathrooms,
        rating: result.data.rating,
        reviewCount: result.data.reviewCount,
        ...(typeof result.data.lat === 'number' &&
        typeof result.data.lng === 'number' &&
        Number.isFinite(result.data.lat) &&
        Number.isFinite(result.data.lng)
          ? { lat: result.data.lat, lng: result.data.lng }
          : {}),
      })

      setStep('edit')
    } catch (err) {
      setError('Failed to scrape Airbnb listing. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!user) {
      setError('You must be logged in to submit a listing')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      console.log('Submitting property with data:', formData)
      
      const propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'> = {
        title: formData.title.trim(),
        ...(formData.slug.trim() ? { slug: slugify(formData.slug) } : {}),
        description: formData.description.trim(),
        location: formData.location.trim(),
        price: formData.price,
        contactEmail: formData.contactEmail.trim(),
        images: formData.images.filter(img => img.trim() !== ''),
        tags: formData.tags.filter(tag => tag.trim() !== ''),
        guests: formData.guests,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        isPublished: formData.isPublished,
        isPaid: formData.isPaid,
        ownerId: user.uid,
        ...(formData.exactAddress.trim() ? { exactAddress: formData.exactAddress.trim() } : {}),
        ...(formData.contactPhone.trim() ? { contactPhone: formData.contactPhone.trim() } : {}),
        showContactEmail: formData.showContactEmail,
        showContactPhone: formData.showContactPhone,
        ...(formData.airbnbUrl.trim() ? { airbnbUrl: formData.airbnbUrl.trim() } : {}),
        ...(formData.websiteUrl.trim() ? { websiteUrl: formData.websiteUrl.trim() } : {}),
        ...(formData.bookingLinks.length > 0
          ? {
              bookingLinks: formData.bookingLinks.filter(
                (l) => l.label.trim() && l.url.trim()
              ),
            }
          : {}),
        ...(formData.subscriptionStatus ? { subscriptionStatus: formData.subscriptionStatus } : {}),
        ...(typeof formData.lat === 'number' &&
        typeof formData.lng === 'number' &&
        !Number.isNaN(formData.lat) &&
        !Number.isNaN(formData.lng)
          ? { lat: formData.lat, lng: formData.lng }
          : {}),
      }

      console.log('Property data to submit:', propertyData)

      if (isEditing && editPropertyId) {
        const { error: updateError } = await updateProperty(editPropertyId, propertyData)
        if (updateError) {
          setError(`Failed to update property: ${updateError}`)
          return
        }
        setSuccess(true)
        setTimeout(() => {
          onSuccess(formData.title, editPropertyId)
        }, 1200)
        return
      }

      const { id, error } = await createProperty(propertyData)

      if (error) {
        console.error('Error creating property:', error)
        setError(`Failed to create property: ${error}`)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        onSuccess(formData.title, id || '')
      }, 2000)
    } catch (err) {
      console.error('Unexpected error:', err)
      setError(`Failed to create property listing: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const addTag = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }))
    }
  }

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }))
  }

  const addBookingLink = () => {
    setFormData((prev) => ({
      ...prev,
      bookingLinks: [...prev.bookingLinks, { label: '', url: '' }],
    }))
  }

  const updateBookingLink = (index: number, field: 'label' | 'url', value: string) => {
    setFormData((prev) => ({
      ...prev,
      bookingLinks: prev.bookingLinks.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      ),
    }))
  }

  const removeBookingLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      bookingLinks: prev.bookingLinks.filter((_, i) => i !== index),
    }))
  }

  if (loadingExisting) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-forest-800" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isEditing ? 'Listing updated' : 'Listing created successfully!'}
          </h2>
          <p className="text-gray-600">
            {isEditing
              ? 'Your changes have been saved.'
              : 'Your treehouse listing has been submitted for review.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-forest-800 to-forest-700 px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {isEditing ? 'Edit your listing' : 'Create your listing'}
              </h1>
              <p className="text-forest-100">
                {isEditing
                  ? 'Update photos, description, and details for your treehouse'
                  : mode === 'import'
                    ? 'Import your Airbnb listing and customize it for Treehouse Trips'
                    : 'Fill in your treehouse details step by step'}
              </p>
            </div>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="text-sm text-forest-100 hover:text-white underline shrink-0"
              >
                Change method
              </button>
            )}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            {mode === 'import' && (
              <div className={`flex items-center ${step === 'url' ? 'text-forest-800' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'url' ? 'bg-forest-800 text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span className="ml-2 font-medium hidden sm:inline">Import</span>
              </div>
            )}
            <div className={`flex items-center ${step === 'edit' ? 'text-forest-800' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'edit' ? 'bg-forest-800 text-white' : 'bg-gray-200'}`}>
                {mode === 'import' ? 2 : 1}
              </div>
              <span className="ml-2 font-medium hidden sm:inline">Details</span>
            </div>
            <div className={`flex items-center ${step === 'preview' ? 'text-forest-800' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'preview' ? 'bg-forest-800 text-white' : 'bg-gray-200'}`}>
                {mode === 'import' ? 3 : 2}
              </div>
              <span className="ml-2 font-medium hidden sm:inline">Preview</span>
            </div>
          </div>
        </div>

        {/* Step 1: URL Input */}
        {step === 'url' && (
          <div className="p-6">
            <div className="text-center mb-8">
              <Link className="mx-auto h-12 w-12 text-forest-800 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Import Your Airbnb Listing</h2>
              <p className="text-gray-600">Paste your Airbnb listing URL below to automatically import all the details</p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Airbnb Listing URL
                </label>
                <div className="flex">
                  <input
                    type="url"
                    value={airbnbUrl}
                    onChange={(e) => setAirbnbUrl(e.target.value)}
                    placeholder="https://www.airbnb.com/rooms/..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-forest-600 focus:border-transparent"
                  />
                  <button
                    onClick={handleScrape}
                    disabled={loading || !airbnbUrl}
                    className="px-6 py-3 bg-forest-800 text-white rounded-r-lg hover:bg-forest-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Import'
                    )}
                  </button>
                </div>
                
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center mb-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-red-700">{error}</span>
                  </div>
                  <button
                    onClick={() => setStep('edit')}
                    className="text-sm text-forest-800 hover:text-forest-700 underline"
                  >
                    Continue with manual entry instead
                  </button>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">What gets imported?</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Property title and description</li>
                  <li>• Location and pricing information</li>
                  <li>• All property images</li>
                  <li>• Guest capacity, bedrooms, bathrooms</li>
                  <li>• Amenities and features</li>
                  <li>• Host information</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Edit Form */}
        {step === 'edit' && (
          <div className="p-6 pb-0">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === 'scratch' ? 'Your Listing Details' : 'Edit Your Listing'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Fill in your property information, then continue to preview when you are ready.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => {
                        const title = e.target.value
                        // If the user hasn't chosen a slug, keep it in sync with title.
                        const shouldSyncSlug = !prev.slug.trim() || prev.slug.trim() === slugify(prev.title)
                        return {
                          ...prev,
                          title,
                          slug: shouldSyncSlug ? slugify(title) : prev.slug,
                        }
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page name (share link)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 whitespace-nowrap hidden sm:inline">
                      /properties/
                    </span>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, slug: slugify(e.target.value) }))
                      }
                      placeholder="my-treehouse"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-600 focus:border-transparent"
                      inputMode="text"
                      autoComplete="off"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    This becomes your shareable link: <span className="font-medium">/properties/{formData.slug || 'your-page-name'}</span>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exact Address (for map placement)
                  </label>
                  <AddressAutocomplete
                    value={formData.exactAddress}
                    onChange={(address, coordinates) => {
                      setFormData((prev) => {
                        const next = { ...prev, exactAddress: address }
                        if (coordinates) {
                          next.lat = coordinates[1]
                          next.lng = coordinates[0]
                        }
                        return next
                      })
                    }}
                    placeholder="Start typing your address..."
                    className=""
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Start typing to get address suggestions powered by Mapbox
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price per night</label>
                  <input
                    type="text"
                    value={formData.price === 0 ? '' : formData.price.toString()}
                    onChange={(e) => {
                      const value = e.target.value
                      setFormData(prev => ({
                        ...prev,
                        price: value === '' ? 0 : parseInt(value) || 0,
                      }))
                    }}
                    placeholder="Enter price"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-600 focus:border-transparent"
                  />
                </div>

                <div className="space-y-4 pt-2">
                  <h4 className="text-sm font-medium text-gray-900">Contact information</h4>
                  <p className="text-xs text-gray-500">
                    Used for platform messaging. Email and phone are only shown to signed-in guests,
                    and only if you enable the options below.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact email</label>
                      <input
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-600 focus:border-transparent"
                        required
                      />
                      <label className="mt-2 flex items-start gap-2 text-sm text-stone-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.showContactEmail}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, showContactEmail: e.target.checked }))
                          }
                          className="mt-0.5 h-4 w-4 rounded border-stone-300 text-forest-800 focus:ring-forest-600"
                        />
                        <span>Show email to signed-in guests (listing &amp; messages)</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact phone</label>
                      <input
                        type="tel"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                        placeholder="+1 (555) 123-4567"
                        autoComplete="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-600 focus:border-transparent"
                      />
                      <label className="mt-2 flex items-start gap-2 text-sm text-stone-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.showContactPhone}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, showContactPhone: e.target.checked }))
                          }
                          className="mt-0.5 h-4 w-4 rounded border-stone-300 text-forest-800 focus:ring-forest-600"
                        />
                        <span>Show phone to signed-in guests (listing &amp; messages)</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-2 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900">Where guests can book</h4>
                  <p className="text-xs text-gray-500">
                    Airbnb is optional. Add any other links you use (direct booking, VRBO, your website).
                  </p>

                  <div className="rounded-xl border border-forest-200 bg-forest-50/60 p-4 space-y-2">
                    <label className="block text-sm font-medium text-forest-900">
                      Your website URL <span className="font-normal text-stone-600">(SEO backlink)</span>
                    </label>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      We link to your site from your public listing — a real backlink from a
                      treehouse-focused page that can help your search rankings.
                    </p>
                    <input
                      type="url"
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData((prev) => ({ ...prev, websiteUrl: e.target.value }))}
                      placeholder="https://yourtreehouse.com"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white focus:ring-2 focus:ring-forest-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Airbnb listing URL</label>
                    <input
                      type="url"
                      value={formData.airbnbUrl}
                      onChange={(e) => setFormData((prev) => ({ ...prev, airbnbUrl: e.target.value }))}
                      placeholder="https://airbnb.com/rooms/…"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-600 focus:border-transparent"
                    />
                  </div>
                  {formData.bookingLinks.map((link, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-2 items-start">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => updateBookingLink(index, 'label', e.target.value)}
                        placeholder="Label (e.g. Book direct)"
                        className="sm:w-40 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-forest-600 focus:border-transparent"
                      />
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateBookingLink(index, 'url', e.target.value)}
                        placeholder="https://…"
                        className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-forest-600 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeBookingLink(index)}
                        className="text-sm text-red-600 hover:text-red-800 px-2 py-2"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addBookingLink}
                    className="text-sm font-medium text-forest-800 hover:text-forest-700"
                  >
                    + Add another booking link
                  </button>
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Property Details</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                    <input
                      type="number"
                      value={formData.guests}
                      onChange={(e) => setFormData(prev => ({ ...prev, guests: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                    <input
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                    <input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-600 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Amenities/Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority categories
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    These are the main ways travelers browse. Select everything that fits.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {BROWSE_CATEGORIES.map((cat) => {
                      const primaryTag = cat.tags[0]
                      const active = formData.tags.includes(primaryTag)
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleTag(primaryTag)}
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                            active
                              ? 'bg-forest-800 text-white border-forest-800'
                              : 'bg-white border-gray-300 text-gray-700 hover:border-forest-400'
                          }`}
                        >
                          <span aria-hidden>{cat.icon}</span>
                          {cat.label}
                        </button>
                      )
                    })}
                  </div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-forest-100 text-primary-800 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(index)}
                          className="ml-2 text-forest-800 hover:text-primary-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add amenity (press Enter)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addTag(e.currentTarget.value)
                        e.currentTarget.value = ''
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-600 focus:border-transparent"
                  />
                </div>

                {user && (
                  <ListingImageManager
                    images={formData.images}
                    onChange={(images) => setFormData((prev) => ({ ...prev, images }))}
                    userId={user.uid}
                    propertyId={editPropertyId}
                  />
                )}
              </div>
            </div>

            {/* Step actions — preview CTA at bottom of form */}
            <div className="sticky bottom-0 -mx-6 mt-2 px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
              {mode === 'import' ? (
                <button
                  type="button"
                  onClick={() => setStep('url')}
                  className="inline-flex items-center justify-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to Airbnb import
                </button>
              ) : (
                <span className="hidden sm:block" />
              )}
              <button
                type="button"
                onClick={() => setStep('preview')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-forest-800 text-white rounded-lg font-semibold hover:bg-forest-700 shadow-sm"
              >
                <Eye className="h-5 w-5" />
                Continue to preview
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Preview */}
        {step === 'preview' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Preview Your Listing</h2>
              <button
                onClick={() => setStep('edit')}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{formData.title}</h3>
                  <p className="text-gray-600 mb-4">{formData.description}</p>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {formData.location}
                  </div>
                  {formData.exactAddress && (
                    <div className="text-sm text-gray-500 mb-4">
                      📍 {formData.exactAddress}
                    </div>
                  )}
                  <div className="text-2xl font-bold text-forest-800">${formData.price}/night</div>
                  <div className="mt-4 space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium text-gray-700">Email:</span>{' '}
                      {formData.contactEmail || '—'}
                      {formData.showContactEmail ? ' (visible when signed in)' : ' (hidden)'}
                    </p>
                    {formData.contactPhone.trim() && (
                      <p>
                        <span className="font-medium text-gray-700">Phone:</span>{' '}
                        {formData.contactPhone}
                        {formData.showContactPhone ? ' (visible when signed in)' : ' (hidden)'}
                      </p>
                    )}
                    {(formData.airbnbUrl || formData.websiteUrl || formData.bookingLinks.length > 0) && (
                      <div className="pt-2">
                        <span className="font-medium text-gray-700">Booking links:</span>
                        <ul className="mt-1 list-disc list-inside">
                          {formData.websiteUrl.trim() && <li>Your website (backlink)</li>}
                          {formData.airbnbUrl.trim() && <li>Airbnb</li>}
                          {formData.bookingLinks.map((l, i) =>
                            l.label.trim() ? <li key={i}>{l.label}</li> : null
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Rating and Reviews */}
                  {(formData.rating > 0 || formData.reviewCount > 0) && (
                    <div className="flex items-center mt-4">
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="font-medium text-gray-900">{formData.rating}</span>
                      </div>
                      {formData.reviewCount > 0 && (
                        <span className="text-gray-600 ml-2">({formData.reviewCount} reviews)</span>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{formData.guests}</div>
                      <div className="text-sm text-gray-600">Guests</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{formData.bedrooms}</div>
                      <div className="text-sm text-gray-600">Bedrooms</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{formData.bathrooms}</div>
                      <div className="text-sm text-gray-600">Bathrooms</div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-forest-100 text-primary-800 rounded text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-700">{error}</span>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/test-firestore', { method: 'POST' })
                      const result = await response.json()
                      console.log('Firestore test result:', result)
                      if (result.success) {
                        alert('Firestore connection successful!')
                      } else {
                        alert(`Firestore test failed: ${result.error}`)
                      }
                    } catch (err) {
                      console.error('Firestore test error:', err)
                      alert('Firestore test failed')
                    }
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
                >
                  Test Firestore
                </button>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setStep('edit')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Back to Edit
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center px-6 py-2 bg-forest-800 text-white rounded-lg hover:bg-forest-700 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {loading ? 'Submitting...' : 'Submit Listing'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
