'use client'

import { FileEdit, Link2, ArrowRight } from 'lucide-react'

export type ListingMode = 'scratch' | 'import'

interface ListingMethodChooserProps {
  onSelect: (mode: ListingMode) => void
  title?: string
  subtitle?: string
  variant?: 'default' | 'prominent'
}

export default function ListingMethodChooser({
  onSelect,
  title = 'How would you like to create your listing?',
  subtitle = 'Choose one option below to get started.',
  variant = 'default',
}: ListingMethodChooserProps) {
  const isProminent = variant === 'prominent'

  return (
    <div className={`w-full mx-auto ${isProminent ? 'max-w-4xl' : 'max-w-3xl'}`}>
      <div className={`text-center ${isProminent ? 'mb-10' : 'mb-8'}`}>
        {isProminent && (
          <p className="text-sm font-semibold uppercase tracking-wide text-forest-600 mb-3">
            Step 1 — Choose how to build your listing
          </p>
        )}
        <h2
          className={`font-bold text-gray-900 mb-2 ${
            isProminent ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'
          }`}
        >
          {title}
        </h2>
        <p className={`text-gray-600 ${isProminent ? 'text-lg' : ''}`}>{subtitle}</p>
      </div>

      <div
        className={
          isProminent
            ? 'bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8'
            : ''
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Option A */}
          <button
            type="button"
            onClick={() => onSelect('scratch')}
            className={`group text-left flex flex-col h-full rounded-2xl border-2 transition-all bg-white ${
              isProminent
                ? 'border-gray-200 hover:border-forest-500 hover:shadow-lg p-8'
                : 'border-gray-200 hover:border-forest-500 hover:shadow-lg p-6'
            }`}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-600 text-white text-sm font-bold">
                A
              </span>
              <div
                className={`rounded-full bg-forest-100 text-forest-600 flex items-center justify-center group-hover:bg-forest-600 group-hover:text-white transition-colors ${
                  isProminent ? 'w-14 h-14' : 'w-12 h-12'
                }`}
              >
                <FileEdit className={isProminent ? 'w-7 h-7' : 'w-6 h-6'} />
              </div>
            </div>
            <h3 className={`font-bold text-gray-900 mb-2 ${isProminent ? 'text-xl' : 'text-lg'}`}>
              Start from scratch
            </h3>
            <p className={`text-gray-600 flex-1 ${isProminent ? 'text-base' : 'text-sm'}`}>
              Build your listing manually — add photos, description, amenities, and pricing yourself.
              Best if you are not on Airbnb yet.
            </p>
            <span
              className={`mt-6 inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-colors ${
                isProminent
                  ? 'bg-forest-600 text-white px-5 py-3 group-hover:bg-forest-700'
                  : 'text-forest-600 group-hover:text-forest-700 mt-4'
              }`}
            >
              Start blank listing
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>

          {/* OR divider — desktop */}
          <div
            className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            aria-hidden
          >
            <span className="bg-white border-2 border-gray-200 text-gray-500 text-sm font-bold px-3 py-1.5 rounded-full shadow-sm">
              OR
            </span>
          </div>

          {/* OR divider — mobile */}
          <div className="md:hidden flex items-center gap-3" aria-hidden>
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-sm font-bold">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Option B */}
          <button
            type="button"
            onClick={() => onSelect('import')}
            className={`group text-left flex flex-col h-full rounded-2xl border-2 transition-all bg-white ${
              isProminent
                ? 'border-forest-200 hover:border-forest-500 hover:shadow-lg p-8 ring-1 ring-forest-100'
                : 'border-gray-200 hover:border-forest-500 hover:shadow-lg p-6'
            }`}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-600 text-white text-sm font-bold">
                B
              </span>
              <div
                className={`rounded-full bg-forest-100 text-forest-600 flex items-center justify-center group-hover:bg-forest-600 group-hover:text-white transition-colors ${
                  isProminent ? 'w-14 h-14' : 'w-12 h-12'
                }`}
              >
                <Link2 className={isProminent ? 'w-7 h-7' : 'w-6 h-6'} />
              </div>
              {isProminent && (
                <span className="ml-auto text-xs font-semibold uppercase tracking-wide bg-forest-50 text-forest-700 px-2.5 py-1 rounded-full border border-forest-200">
                  Fastest
                </span>
              )}
            </div>
            <h3 className={`font-bold text-gray-900 mb-2 ${isProminent ? 'text-xl' : 'text-lg'}`}>
              Import from Airbnb
            </h3>
            <p className={`text-gray-600 flex-1 ${isProminent ? 'text-base' : 'text-sm'}`}>
              Paste your Airbnb URL and we will pull in photos, description, capacity, and amenities
              for you to review and edit.
            </p>
            <span
              className={`mt-6 inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-colors ${
                isProminent
                  ? 'bg-forest-600 text-white px-5 py-3 group-hover:bg-forest-700'
                  : 'text-forest-600 group-hover:text-forest-700 mt-4'
              }`}
            >
              Import my Airbnb listing
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
