'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from '@/components/AuthModal'
import { ListingMode } from '@/components/ListingMethodChooser'
import HostHeroSection from './HostHeroSection'
import WhyListSection from './WhyListSection'
import BenefitCards from './BenefitCards'
import AIDiscoverySection from './AIDiscoverySection'
import CuratedMarketplaceSection from './CuratedMarketplaceSection'
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

  const scrollToGetStarted = useCallback(() => {
    document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleListClick = useCallback(() => {
    if (user) {
      scrollToGetStarted()
      return
    }
    scrollToGetStarted()
  }, [user, scrollToGetStarted])

  const handleCreateListing = () => {
    if (user) {
      if (onCreateRoute) {
        scrollToGetStarted()
      } else {
        router.push('/create#get-started')
      }
      return
    }
    setAuthMode('signup')
    setShowAuthModal(true)
  }

  const handleSignIn = () => {
    setAuthMode('login')
    setShowAuthModal(true)
  }

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
      router.push('/create#get-started')
    }
  }, [user, showAuthModal, onCreateRoute, scrollToGetStarted, router])

  return (
    <div className="bg-cream -mt-px">
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authMode}
      />

      <HostHeroSection onListClick={handleListClick} />
      <WhyListSection />
      <BenefitCards />
      <AIDiscoverySection />
      <CuratedMarketplaceSection />
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
        label={user ? 'Continue your listing' : 'List your treehouse'}
        onClick={handleListClick}
      />
    </div>
  )
}
