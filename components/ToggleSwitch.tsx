'use client'

import { Grid3X3, List } from 'lucide-react'

interface ToggleSwitchProps {
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
}

export default function ToggleSwitch({ viewMode, onViewModeChange }: ToggleSwitchProps) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onViewModeChange('grid')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          viewMode === 'grid'
            ? 'bg-white text-forest-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Grid3X3 size={16} />
        Grid
      </button>
      <button
        onClick={() => onViewModeChange('list')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          viewMode === 'list'
            ? 'bg-white text-forest-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <List size={16} />
        List
      </button>
    </div>
  )
}
