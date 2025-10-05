'use client'

import { TreePine, Mountain, Users, Star, Clock, Zap, Shield, Heart } from 'lucide-react'

interface TreehouseStatsProps {
  property: {
    id: string
    name: string
    guests: number
    bedrooms: number
    bathrooms: number
    price: string
    tags: string[]
  }
}

export default function TreehouseStats({ property }: TreehouseStatsProps) {
  // Generate some creative treehouse-specific stats
  const treehouseStats = [
    {
      icon: <TreePine className="w-6 h-6" />,
      label: "Tree Height",
      value: "45 ft",
      description: "Above forest floor",
      color: "text-green-600"
    },
    {
      icon: <Mountain className="w-6 h-6" />,
      label: "View Distance",
      value: "12 miles",
      description: "Panoramic visibility",
      color: "text-blue-600"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      label: "Solar Power",
      value: "100%",
      description: "Off-grid capability",
      color: "text-yellow-600"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      label: "Safety Rating",
      value: "A+",
      description: "Engineered for safety",
      color: "text-green-600"
    }
  ]

  const experienceMetrics = [
    {
      icon: <Heart className="w-5 h-5" />,
      label: "Romance Factor",
      value: "10/10",
      color: "text-pink-600"
    },
    {
      icon: <Star className="w-5 h-5" />,
      label: "Uniqueness",
      value: "Rare",
      color: "text-purple-600"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: "Digital Detox",
      value: "Complete",
      color: "text-green-600"
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Group Size",
      value: `${property.guests} max`,
      color: "text-blue-600"
    }
  ]

  const environmentalImpact = [
    { label: "Carbon Footprint", value: "Minimal", color: "text-green-600" },
    { label: "Wildlife Impact", value: "Positive", color: "text-green-600" },
    { label: "Energy Source", value: "Renewable", color: "text-green-600" },
    { label: "Waste Management", value: "Composting", color: "text-green-600" }
  ]

  return (
    <div className="space-y-8">
      {/* Main Treehouse Stats */}
      <div className="bg-gradient-to-br from-forest-50 to-primary-50 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Treehouse Specifications</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {treehouseStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-white flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-gray-700 mb-1">{stat.label}</div>
              <div className="text-xs text-gray-500">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Experience Metrics */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Experience Rating</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {experienceMetrics.map((metric, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`w-8 h-8 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center ${metric.color}`}>
                {metric.icon}
              </div>
              <div className="font-bold text-gray-900 mb-1">{metric.value}</div>
              <div className="text-sm text-gray-600">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Environmental Impact */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TreePine className="w-6 h-6 text-green-600" />
          Environmental Impact
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {environmentalImpact.map((impact, index) => (
            <div key={index} className="text-center">
              <div className={`text-lg font-bold ${impact.color} mb-1`}>{impact.value}</div>
              <div className="text-sm text-gray-600">{impact.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Treehouse Tags */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Treehouse Characteristics</h3>
        <div className="flex flex-wrap gap-2">
          {property.tags.map((tag, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-forest-100 text-forest-700 rounded-full text-sm font-medium hover:bg-forest-200 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

