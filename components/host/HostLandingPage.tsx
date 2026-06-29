'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from '@/components/AuthModal'
import { ListingMode } from '@/components/ListingMethodChooser'
import { HOST_PRICE } from '@/lib/host-content'
import { scrollPageToTop } from '@/lib/scroll-page'
import HostHeroSection from './HostHeroSection'
import HostGetStartedSection from './HostGetStartedSection'
import HostPricingSection from './HostPricingSection'
import HostDiscoveryBenefitsSection from './HostDiscoveryBenefitsSection'
import HostChannelsSection from './HostChannelsSection'
import WhyHostsJoinSection from './WhyHostsJoinSection'
import HowItWorks from './HowItWorks'
import FeaturedHostListings from './FeaturedHostListings'
import SignupCTASection from './SignupCTASection'
import HostStickyCTA from './HostStickyCTA'

export default function HostLandingPage() {
  const router = useRouter()
  const pathname = usePathname()
  const onCreateRoute = pathname === '/create'
  const { user, loading: authLoading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup')
  const [showStickyCta, setShowStickyCta] = useState(false)

  useEffect(() => {
    scrollPageToTop()
  }, [])

  const scrollToGetStarted = useCallback(() => {
    document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const handleCreateListing = useCallback(() => {
    if (user) {
      scrollToGetStarted()
      return
    }
    setAuthMode('signup')
    setShowAuthModal(true)
  }, [user, scrollToGetStarted])

  const handleListClick = useCallback(() => {
    if (onCreateRoute) {
      scrollToGetStarted()
      return
    }
    router.push('/create')
  }, [onCreateRoute, router, scrollToGetStarted])

  const handleSignIn = useCallback(() => {
    setAuthMode('login')
    setShowAuthModal(true)
  }, [])

  const handleSelectMode = (mode: ListingMode) => {
    router.push(`/create?mode=${mode}`)
  }

  useEffect(() => {
    const onScroll = () => {
      const cta = document.getElementById('get-started')
      if (!cta) return
      const rect = cta.getBoundingClientRect()
      setShowStickyCta(rect.top > window.innerHeight)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!user || !showAuthModal) return
    setShowAuthModal(false)
    if (onCreateRoute) {
      scrollToGetStarted()
    } else {
      router.push('/create')
    }
  }, [user, showAuthModal, onCreateRoute, scrollToGetStarted, router])

  const stickyLabel = user ? `Continue your listing — ${HOST_PRICE}` : `List your treehouse — ${HOST_PRICE}`

  return (
    <div className="bg-cream -mt-px">
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authMode}
      />

      <HostHeroSection onListClick={handleListClick} />
      <HostGetStartedSection
        onCreateListing={handleCreateListing}
        onSignIn={handleSignIn}
        authLoading={authLoading}
      />
      <HostPricingSection />
      <HostDiscoveryBenefitsSection />
      <HostChannelsSection />
      <WhyHostsJoinSection />
      <HowItWorks />
      <FeaturedHostListings />
      <SignupCTASection
        onCreateListing={handleCreateListing}
        onSignIn={handleSignIn}
        onSelectMode={handleSelectMode}
        authLoading={authLoading}
      />

      <HostStickyCTA
        visible={showStickyCta && !authLoading}
        label={stickyLabel}
        onClick={scrollToGetStarted}
      />
    </div>
  )
}
