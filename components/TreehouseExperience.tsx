'use client'

import { useState } from 'react'
import { TreePine, Mountain, Moon, Sun, Coffee, Camera, Heart, Users, BookOpen, Compass } from 'lucide-react'

interface TreehouseExperienceProps {
  property: {
    id: string
    name: string
    location: string
    specialFeatures?: string
  }
}

export default function TreehouseExperience({ property }: TreehouseExperienceProps) {
  const [activeExperience, setActiveExperience] = useState(0)

  const dailyExperiences = [
    {
      time: "6:00 AM",
      icon: <Sun className="w-6 h-6" />,
      title: "Sunrise in the Canopy",
      description: "Wake up to the first light filtering through the forest canopy, with birds beginning their morning chorus.",
      color: "from-yellow-400 to-orange-500"
    },
    {
      time: "8:00 AM",
      icon: <Coffee className="w-6 h-6" />,
      title: "Treetop Coffee",
      description: "Enjoy your morning coffee on the deck, surrounded by the peaceful sounds of the forest waking up.",
      color: "from-amber-500 to-yellow-600"
    },
    {
      time: "10:00 AM",
      icon: <Compass className="w-6 h-6" />,
      title: "Forest Exploration",
      description: "Venture down to explore the forest floor, following nature trails and discovering hidden gems.",
      color: "from-green-500 to-emerald-600"
    },
    {
      time: "2:00 PM",
      icon: <Camera className="w-6 h-6" />,
      title: "Photography Session",
      description: "Capture the magical forest moments from your unique elevated perspective.",
      color: "from-purple-500 to-pink-600"
    },
    {
      time: "6:00 PM",
      icon: <Heart className="w-6 h-6" />,
      title: "Romantic Sunset",
      description: "Watch the sunset paint the sky from your private treetop vantage point.",
      color: "from-pink-500 to-red-600"
    },
    {
      time: "9:00 PM",
      icon: <Moon className="w-6 h-6" />,
      title: "Stargazing",
      description: "End the day with unparalleled stargazing, far from city lights and pollution.",
      color: "from-blue-500 to-indigo-600"
    }
  ]

  const uniqueActivities = [
    {
      icon: <TreePine className="w-8 h-8" />,
      title: "Tree Climbing",
      description: "Learn to climb the living trees that support your treehouse",
      difficulty: "Beginner Friendly"
    },
    {
      icon: <Mountain className="w-8 h-8" />,
      title: "Canopy Walks",
      description: "Walk among the treetops on specially designed walkways",
      difficulty: "All Levels"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Forest Meditation",
      description: "Practice mindfulness surrounded by ancient trees",
      difficulty: "Peaceful"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Wildlife Watching",
      description: "Observe forest animals from your elevated hideaway",
      difficulty: "Family Friendly"
    }
  ]

  const seasonalHighlights = [
    {
      season: "Spring",
      color: "from-green-400 to-emerald-500",
      highlights: ["New growth", "Bird migration", "Wildflower blooms", "Fresh air"]
    },
    {
      season: "Summer",
      color: "from-yellow-400 to-orange-500",
      highlights: ["Full canopy", "Long days", "Wildlife activity", "Cool breezes"]
    },
    {
      season: "Fall",
      color: "from-orange-400 to-red-500",
      highlights: ["Colorful foliage", "Harvest season", "Migration", "Crisp air"]
    },
    {
      season: "Winter",
      color: "from-blue-400 to-indigo-500",
      highlights: ["Snow-covered branches", "Clear views", "Cozy atmosphere", "Winter wildlife"]
    }
  ]

  return (
    <div className="space-y-8">

      {/* Unique Activities */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Treehouse-Specific Activities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {uniqueActivities.map((activity, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-forest-100 rounded-full flex items-center justify-center text-forest-600 flex-shrink-0">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{activity.title}</h4>
                  <p className="text-gray-600 mb-3">{activity.description}</p>
                  <span className="inline-block px-3 py-1 bg-forest-100 text-forest-700 rounded-full text-sm font-medium">
                    {activity.difficulty}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seasonal Highlights */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Year-Round Magic</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {seasonalHighlights.map((season, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${season.color} flex items-center justify-center text-white mx-auto mb-4`}>
                <span className="text-lg font-bold">{season.season[0]}</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3 text-center">{season.season}</h4>
              <ul className="space-y-2">
                {season.highlights.map((highlight, highlightIndex) => (
                  <li key={highlightIndex} className="text-sm text-gray-600 text-center">
                    • {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Special Features Highlight */}
      {property.specialFeatures && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Heart className="w-6 h-6 text-purple-600" />
            What Makes This Treehouse Extraordinary
          </h3>
          <p className="text-gray-700 leading-relaxed text-lg">{property.specialFeatures}</p>
        </div>
      )}
    </div>
  )
}
