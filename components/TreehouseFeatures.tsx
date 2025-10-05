'use client'

import { useState } from 'react'
import { TreePine, Mountain, Waves, Zap, Shield, Heart, Star, Compass, Camera, Users, Clock, MapPin } from 'lucide-react'

interface TreehouseFeaturesProps {
  property: {
    id: string
    name: string
    location: string
    tags: string[]
    specialFeatures?: string
    accessibility?: string
    houseRules?: string
  }
}

export default function TreehouseFeatures({ property }: TreehouseFeaturesProps) {
  const [activeFeature, setActiveFeature] = useState(0)

  const treehouseFeatures = [
    {
      icon: <TreePine className="w-6 h-6" />,
      title: "Tree Integration",
      description: "Built around living trees",
      details: "This treehouse is carefully constructed to work with the natural growth of the trees, creating a living, breathing structure that grows with the forest.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <Mountain className="w-6 h-6" />,
      title: "Elevated Views",
      description: "Panoramic forest vistas",
      details: "Wake up to breathtaking views of the surrounding forest canopy, with floor-to-ceiling windows that bring the outside in.",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: <Waves className="w-6 h-6" />,
      title: "Nature Sounds",
      description: "Forest symphony soundtrack",
      details: "Fall asleep to the gentle sounds of wind through leaves, distant bird calls, and the peaceful rhythm of the forest.",
      color: "from-teal-500 to-green-600"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Eco-Friendly",
      description: "Sustainable living",
      details: "Solar-powered, composting toilets, and rainwater collection systems make this a truly eco-conscious retreat.",
      color: "from-yellow-500 to-orange-600"
    }
  ]

  const uniqueAmenities = [
    { icon: <TreePine className="w-5 h-5" />, name: "Living Tree Integration", category: "Architecture" },
    { icon: <Mountain className="w-5 h-5" />, name: "Canopy Views", category: "Views" },
    { icon: <Waves className="w-5 h-5" />, name: "Nature Soundscape", category: "Experience" },
    { icon: <Zap className="w-5 h-5" />, name: "Solar Power", category: "Eco" },
    { icon: <Shield className="w-5 h-5" />, name: "Tree Safety System", category: "Safety" },
    { icon: <Heart className="w-5 h-5" />, name: "Romantic Setting", category: "Experience" },
    { icon: <Star className="w-5 h-5" />, name: "Stargazing Deck", category: "Views" },
    { icon: <Compass className="w-5 h-5" />, name: "Forest Navigation", category: "Adventure" }
  ]

  const experienceHighlights = [
    {
      icon: <Camera className="w-5 h-5" />,
      title: "Photography Paradise",
      description: "Perfect for capturing magical forest moments"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Unique Gatherings",
      description: "Host unforgettable events in the treetops"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Digital Detox",
      description: "Disconnect and reconnect with nature"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Adventure Base",
      description: "Perfect launch point for forest exploration"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Key Treehouse Features */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Treehouse Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {treehouseFeatures.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-white flex-shrink-0`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Features */}
      {property.specialFeatures && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-600" />
            What Makes This Treehouse Unique
          </h3>
          <p className="text-gray-700 leading-relaxed">{property.specialFeatures}</p>
        </div>
      )}

      {/* Important Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {property.accessibility && (
          <div className="bg-blue-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Access Information
            </h4>
            <p className="text-gray-700 text-sm">{property.accessibility}</p>
          </div>
        )}
        
        {property.houseRules && (
          <div className="bg-green-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-green-600" />
              House Guidelines
            </h4>
            <p className="text-gray-700 text-sm">{property.houseRules}</p>
          </div>
        )}
      </div>
    </div>
  )
}
