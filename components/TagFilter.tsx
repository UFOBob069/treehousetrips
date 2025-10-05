'use client'

interface TagFilterProps {
  tags: string[]
  selectedTags: string[]
  onTagToggle: (tag: string) => void
}

export default function TagFilter({ tags, selectedTags, onTagToggle }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagToggle(tag)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedTags.includes(tag)
              ? 'bg-forest-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
