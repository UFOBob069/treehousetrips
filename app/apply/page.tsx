'use client'

import { useState } from 'react'
import { ArrowLeft, Upload, MapPin, DollarSign, Users, Bed, Bath, Wifi, Car, Coffee, Shield, Mountain, Waves, Star } from 'lucide-react'
import Link from 'next/link'

interface ApplicationData {
  // Host Information
  hostName: string
  hostEmail: string
  hostPhone: string
  hostBio: string
  
  // Property Information
  propertyName: string
  propertyDescription: string
  propertyLocation: string
  propertyAddress: string
  propertyLat: number
  propertyLng: number
  
  // Property Details
  guests: number
  bedrooms: number
  bathrooms: number
  pricePerNight: number
  
  // Amenities
  amenities: string[]
  
  // Images
  images: File[]
  
  // Additional Information
  airbnbUrl: string
  existingRating: number
  yearsHosting: number
  specialFeatures: string
  accessibility: string
  houseRules: string
}

export default function ApplyPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ApplicationData>({
    hostName: '',
    hostEmail: '',
    hostPhone: '',
    hostBio: '',
    propertyName: '',
    propertyDescription: '',
    propertyLocation: '',
    propertyAddress: '',
    propertyLat: 0,
    propertyLng: 0,
    guests: 1,
    bedrooms: 1,
    bathrooms: 1,
    pricePerNight: 0,
    amenities: [],
    images: [],
    airbnbUrl: '',
    existingRating: 0,
    yearsHosting: 0,
    specialFeatures: '',
    accessibility: '',
    houseRules: ''
  })

  const availableAmenities = [
    { id: 'wifi', name: 'WiFi', icon: <Wifi className="w-5 h-5" /> },
    { id: 'parking', name: 'Free Parking', icon: <Car className="w-5 h-5" /> },
    { id: 'kitchen', name: 'Kitchen', icon: <Coffee className="w-5 h-5" /> },
    { id: 'security', name: 'Security Cameras', icon: <Shield className="w-5 h-5" /> },
    { id: 'mountain_views', name: 'Mountain Views', icon: <Mountain className="w-5 h-5" /> },
    { id: 'nature_sounds', name: 'Nature Sounds', icon: <Waves className="w-5 h-5" /> },
    { id: 'hot_tub', name: 'Hot Tub', icon: <Waves className="w-5 h-5" /> },
    { id: 'fireplace', name: 'Fireplace', icon: <Waves className="w-5 h-5" /> }
  ]

  const handleInputChange = (field: keyof ApplicationData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAmenityToggle = (amenityId: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }))
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Create Stripe checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationData: formData,
          successUrl: `${window.location.origin}/apply/success`,
          cancelUrl: `${window.location.origin}/apply`
        }),
      })

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Error creating checkout session:', error)
      setIsSubmitting(false)
    }
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/list-your-treehouse"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to List Your Treehouse
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Apply to List Your Treehouse</h1>
          <p className="text-gray-600">Join our exclusive network of exceptional treehouse owners</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">Step {currentStep} of 4</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-forest-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Host Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.hostName}
                    onChange={(e) => handleInputChange('hostName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.hostEmail}
                    onChange={(e) => handleInputChange('hostEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.hostPhone}
                    onChange={(e) => handleInputChange('hostPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Years Hosting</label>
                  <input
                    type="number"
                    value={formData.yearsHosting}
                    onChange={(e) => handleInputChange('yearsHosting', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Host Bio</label>
                <textarea
                  value={formData.hostBio}
                  onChange={(e) => handleInputChange('hostBio', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
                  placeholder="Tell us about yourself and your hosting philosophy..."
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Property Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Name *</label>
                  <input
                    type="text"
                    value={formData.propertyName}
                    onChange={(e) => handleInputChange('propertyName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
                    placeholder="e.g., Sky High Sanctuary"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Description *</label>
                  <textarea
                    value={formData.propertyDescription}
                    onChange={(e) => handleInputChange('propertyDescription', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
                    placeholder="Describe your treehouse, its unique features, and what makes it special..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                    <input
                      type="text"
                      value={formData.propertyLocation}
                      onChange={(e) => handleInputChange('propertyLocation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
                      placeholder="e.g., Portland, Oregon"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price per Night *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        value={formData.pricePerNight}
                        onChange={(e) => handleInputChange('pricePerNight', parseInt(e.target.value) || 0)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
                        placeholder="450"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                  <input
                    type="text"
                    value={formData.propertyAddress}
                    onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
                    placeholder="Full address (will be kept private)"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Guests *</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={formData.guests}
                        onChange={(e) => handleInputChange('guests', parseInt(e.target.value) || 1)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms *</label>
                    <div className="relative">
                      <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={formData.bedrooms}
                        onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 1)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms *</label>
                    <div className="relative">
                      <Bath className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={formData.bathrooms}
                        onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value) || 1)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Treehouse Features & Amenities</h2>
              
              {/* Basic Amenities */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {availableAmenities.map((amenity) => (
                    <button
                      key={amenity.id}
                      type="button"
                      onClick={() => handleAmenityToggle(amenity.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        formData.amenities.includes(amenity.id)
                          ? 'border-forest-500 bg-forest-50 text-forest-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        {amenity.icon}
                        <span className="text-sm font-medium">{amenity.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Features */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What makes your treehouse unique? *
                </label>
                <textarea
                  value={formData.specialFeatures}
                  onChange={(e) => handleInputChange('specialFeatures', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
                  placeholder="Describe the unique features that make your treehouse special (e.g., zip line, rope bridges, hot tub, tree integration, etc.)"
                  required
                />
              </div>

              {/* Important Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Access Information
                  </label>
                  <textarea
                    value={formData.accessibility}
                    onChange={(e) => handleInputChange('accessibility', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
                    placeholder="How do guests access your treehouse? (stairs, ladder, terrain, etc.)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    House Guidelines
                  </label>
                  <textarea
                    value={formData.houseRules}
                    onChange={(e) => handleInputChange('houseRules', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
                    placeholder="Any specific rules or guidelines for guests?"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Photos & Final Details</h2>
              
              {/* Photo Upload */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-4">Property Photos *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">Upload high-quality photos of your treehouse</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="bg-forest-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-forest-700 transition-colors"
                  >
                    Choose Photos
                  </label>
                </div>
                
                {formData.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Information */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Existing Airbnb URL</label>
                  <input
                    type="url"
                    value={formData.airbnbUrl}
                    onChange={(e) => handleInputChange('airbnbUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
                    placeholder="https://airbnb.com/rooms/your-listing"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Rating (if applicable)</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={formData.existingRating}
                      onChange={(e) => handleInputChange('existingRating', parseFloat(e.target.value) || 0)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
                      min="0"
                      max="5"
                      step="0.1"
                    />
                    <span className="text-gray-500">out of 5 stars</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-forest-600 text-white rounded-lg hover:bg-forest-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-2 bg-forest-600 text-white rounded-lg hover:bg-forest-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <DollarSign size={16} />
                    Submit Application & Pay $50
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Application Fee Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-blue-900">Application Fee</h3>
              <p className="mt-1 text-blue-700">
                A one-time application fee of $50 is required to process your submission. 
                This fee covers our review process and helps ensure only serious applicants apply.
              </p>
              <ul className="mt-2 text-sm text-blue-600">
                <li>• Comprehensive application review</li>
                <li>• Virtual property tour (if needed)</li>
                <li>• Onboarding materials and support</li>
                <li>• Refunded if not approved</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
