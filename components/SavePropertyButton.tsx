'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import type { BrowseProperty } from '@/lib/property-browse'
import { useSaves } from '@/contexts/SavesContext'

type SavePropertyButtonProps = {
  property: BrowseProperty
  className?: string
  iconClassName?: string
  onRequireSignIn?: () => void
}

export default function SavePropertyButton({
  property,
  className = '',
  iconClassName = 'h-4 w-4',
  onRequireSignIn,
}: SavePropertyButtonProps) {
  const router = useRouter()
  const { isSaved, toggleSave } = useSaves()
  const [busy, setBusy] = useState(false)
  const saved = isSaved(property.id)

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    setBusy(true)
    const { error, requiresSignIn } = await toggleSave(property)
    setBusy(false)

    if (requiresSignIn) {
      if (onRequireSignIn) {
        onRequireSignIn()
      } else {
        router.push('/saved?signin=1')
      }
      return
    }
    if (error) {
      console.error(error)
    }
  }

  return (
    <button
      type="button"
      aria-label={saved ? 'Remove from saved' : 'Save treehouse'}
      aria-pressed={saved}
      disabled={busy}
      onClick={handleClick}
      className={className}
    >
      <Heart
        className={`${iconClassName} transition-colors ${
          saved ? 'fill-red-500 text-red-500' : ''
        }`}
      />
    </button>
  )
}
