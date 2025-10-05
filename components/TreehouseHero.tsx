'use client'

import { TreePine, Mountain, Star, Heart, Zap, Users, Clock, MapPin } from 'lucide-react'

interface TreehouseHeroProps {
  property: {
    id: string
    name: string
    location: string
    price: string
    guests: number
    bedrooms: number
    bathrooms: number
    tags: string[]
  }
}

export default function TreehouseHero({ property }: TreehouseHeroProps) {
  const quickStats = [
    {
      icon: <TreePine className="w-5 h-5" />,
      label: "Tree Height",
      value: "45 ft",
      color: "text-green-600"
    },
    {
      icon: <Mountain className="w-5 h-5" />,
      label: "View Distance",
      value: "12 miles",
      color: "text-blue-600"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      label: "Solar Power",
      value: "100%",
      color: "text-yellow-600"
    },
    {
      icon: <Heart className="w-5 h-5" />,
      label: "Romance Factor",
      value: "10/10",
      color: "text-pink-600"
    }
  ]

  const experienceHighlights = [
    "Wake up in the treetops",
    "Panoramic forest views",
    "Nature soundscape",
    "Stargazing deck",
    "Eco-friendly living",
    "Digital detox paradise"
  ]

  return (
    <div className="bg-gradient-to-br from-forest-50 via-primary-50 to-amber-50 rounded-2xl p-8 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Main Info */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TreePine className="w-6 h-6 text-green-600" />
            <span className="text-sm font-medium text-green-600 uppercase tracking-wide">Premium Treehouse</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {property.name}
          </h1>
          
          <div className="flex items-center text-gray-600 mb-6">
            <MapPin size={18} className="mr-2" />
            <span>{property.location}</span>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <Star size={20} className="fill-yellow-400 text-yellow-400" />
            <span className="text-lg font-semibold">4.9</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600 underline cursor-pointer">28 reviews</span>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {quickStats.map((stat, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                <div className={`flex items-center gap-2 mb-1 ${stat.color}`}>
                  {stat.icon}
                  <span className="text-sm font-medium">{stat.label}</span>
                </div>
                <div className="text-xl font-bold text-gray-900">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Experience Highlights */}
          <div className="bg-white/40 backdrop-blur-sm rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Experience Highlights</h3>
            <div className="grid grid-cols-2 gap-2">
              {experienceHighlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-forest-500 rounded-full"></div>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Price & Booking */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-gray-900 mb-2">{property.price}</div>
            <div className="text-gray-600">per night</div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Guests</span>
              <span className="font-medium">{property.guests} max</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Bedrooms</span>
              <span className="font-medium">{property.bedrooms}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Bathrooms</span>
              <span className="font-medium">{property.bathrooms}</span>
            </div>
          </div>

          {/* Treehouse Tags */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Treehouse Features</h4>
            <div className="flex flex-wrap gap-2">
              {property.tags.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-forest-100 text-forest-700 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Special Treehouse Benefits */}
          <div className="bg-gradient-to-r from-forest-50 to-primary-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Treehouse Benefits</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-forest-500 rounded-full"></div>
                <span>Direct guest communication</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-forest-500 rounded-full"></div>
                <span>No platform commissions</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-forest-500 rounded-full"></div>
                <span>AI-discoverable listing</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-forest-500 rounded-full"></div>
                <span>Niche market positioning</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

