'use client'

import { TreePine, Star, Heart, Zap, Mountain, Waves } from 'lucide-react'

interface TreehouseBadgeProps {
  type: 'treehouse' | 'unique' | 'romantic' | 'eco' | 'views' | 'nature'
  size?: 'sm' | 'md' | 'lg'
}

export default function TreehouseBadge({ type, size = 'sm' }: TreehouseBadgeProps) {
  const badgeConfig = {
    treehouse: {
      icon: <TreePine className="w-4 h-4" />,
      label: 'Treehouse',
      color: 'text-green-600 bg-green-100',
      borderColor: 'border-green-200'
    },
    unique: {
      icon: <Star className="w-4 h-4" />,
      label: 'Unique',
      color: 'text-yellow-600 bg-yellow-100',
      borderColor: 'border-yellow-200'
    },
    romantic: {
      icon: <Heart className="w-4 h-4" />,
      label: 'Romantic',
      color: 'text-pink-600 bg-pink-100',
      borderColor: 'border-pink-200'
    },
    eco: {
      icon: <Zap className="w-4 h-4" />,
      label: 'Eco',
      color: 'text-blue-600 bg-blue-100',
      borderColor: 'border-blue-200'
    },
    views: {
      icon: <Mountain className="w-4 h-4" />,
      label: 'Views',
      color: 'text-purple-600 bg-purple-100',
      borderColor: 'border-purple-200'
    },
    nature: {
      icon: <Waves className="w-4 h-4" />,
      label: 'Nature',
      color: 'text-teal-600 bg-teal-100',
      borderColor: 'border-teal-200'
    }
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  const config = badgeConfig[type]

  return (
    <div className={`inline-flex items-center gap-1 rounded-full border ${config.color} ${config.borderColor} ${sizeClasses[size]} font-medium`}>
      {config.icon}
      <span>{config.label}</span>
    </div>
  )
}

