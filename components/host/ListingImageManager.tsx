'use client'

import { useRef, useState } from 'react'
import { Link2, Upload, Loader2, ImageIcon } from 'lucide-react'
import { uploadListingImage } from '@/lib/storage-upload'

interface ListingImageManagerProps {
  images: string[]
  onChange: (images: string[]) => void
  userId: string
  propertyId?: string
  maxImages?: number
}

export default function ListingImageManager({
  images,
  onChange,
  userId,
  propertyId,
  maxImages = 12,
}: ListingImageManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [urlDraft, setUrlDraft] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const addUrl = () => {
    const url = urlDraft.trim()
    if (!url) return
    try {
      new URL(url)
    } catch {
      setError('Enter a valid image URL (https://…)')
      return
    }
    if (images.includes(url)) {
      setError('This image is already added.')
      return
    }
    if (images.length >= maxImages) {
      setError(`Maximum ${maxImages} images.`)
      return
    }
    onChange([...images, url])
    setUrlDraft('')
    setError('')
  }

  const removeAt = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return
    setUploading(true)
    setError('')
    try {
      const next = [...images]
      for (const file of Array.from(files)) {
        if (next.length >= maxImages) break
        const url = await uploadListingImage(file, userId, propertyId)
        if (!next.includes(url)) next.push(url)
      }
      onChange(next)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Photos</label>
        <p className="text-xs text-stone-500 mb-3">
          Image URLs are preferred (fastest). You can also upload files — we store them securely
          on Firebase.
        </p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {images.map((image, index) => (
            <div key={`${image}-${index}`} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white text-xs hover:bg-black/70"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-stone-200/80 bg-stone-50/80 p-3 space-y-2">
        <p className="text-xs font-medium text-stone-600 flex items-center gap-1.5">
          <Link2 className="h-3.5 w-3.5" />
          Add image URL (recommended)
        </p>
        <div className="flex gap-2">
          <input
            type="url"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addUrl()
              }
            }}
            placeholder="https://…"
            className="flex-1 min-w-0 rounded-lg border border-stone-200/80 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/30"
            disabled={images.length >= maxImages}
          />
          <button
            type="button"
            onClick={addUrl}
            disabled={!urlDraft.trim() || images.length >= maxImages}
            className="shrink-0 rounded-lg bg-forest-800 px-3 py-2 text-sm font-medium text-white hover:bg-forest-700 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-stone-300/80 bg-white p-4">
        <p className="text-xs font-medium text-stone-600 flex items-center gap-1.5 mb-2">
          <Upload className="h-3.5 w-3.5" />
          Or upload from your device
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || images.length >= maxImages}
          className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
          {uploading ? 'Uploading…' : 'Choose files'}
        </button>
        <p className="mt-2 text-xs text-stone-400">JPEG, PNG, WebP, or GIF · up to 5 MB each</p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
