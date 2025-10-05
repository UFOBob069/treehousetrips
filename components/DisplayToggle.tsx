'use client'

import { Map, List } from 'lucide-react'

interface DisplayToggleProps {
  displayMode: 'map' | 'table'
  onDisplayModeChange: (mode: 'map' | 'table') => void
}

export default function DisplayToggle({ displayMode, onDisplayModeChange }: DisplayToggleProps) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onDisplayModeChange('map')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          displayMode === 'map'
            ? 'bg-white text-forest-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Map size={16} />
        Map
      </button>
      <button
        onClick={() => onDisplayModeChange('table')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          displayMode === 'table'
            ? 'bg-white text-forest-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <List size={16} />
        Table
      </button>
    </div>
  )
}

