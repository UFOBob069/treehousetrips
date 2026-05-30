'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import HostOnboardingForm from '@/components/HostOnboardingForm'

export default function EditPropertyPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading } = useAuth()
  const propertyId = params.id as string

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-forest-200 border-t-forest-700" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-4">
        <p className="text-stone-600">
          <Link href="/create" className="text-forest-800 underline">
            Sign in
          </Link>{' '}
          to edit your listing.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-4xl px-4 pt-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
      </div>
      <HostOnboardingForm
        mode="scratch"
        editPropertyId={propertyId}
        onBack={() => router.push('/dashboard')}
        onSuccess={() => router.push('/dashboard')}
      />
    </div>
  )
}
