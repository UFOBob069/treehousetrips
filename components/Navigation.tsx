'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X, Search, User, LogOut, Settings, Home, MessageCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from './AuthModal'
import LocationSearch from './LocationSearch'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const userMenuRef = useRef<HTMLDivElement>(null)
  const isBrowsePage = pathname?.startsWith('/properties')
  const isHostMarketingRoute =
    pathname === '/list-your-treehouse' || pathname === '/create'
  const isImmersiveLanding =
    pathname === '/' || (isHostMarketingRoute && !user)
  const transparentNav = isImmersiveLanding && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const navShell = transparentNav
    ? 'fixed top-0 left-0 right-0 z-50 bg-transparent border-b border-transparent'
    : isImmersiveLanding
      ? 'fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-md border-b border-stone-200/40 shadow-sm'
      : 'sticky top-0 z-50 bg-cream/95 backdrop-blur-md border-b border-stone-200/40 shadow-sm'

  const linkClass = transparentNav
    ? 'text-white/90 hover:text-white'
    : 'text-stone-700 hover:text-forest-800'

  const logoClass = transparentNav
    ? 'font-serif text-xl text-white tracking-tight'
    : 'font-serif text-xl text-forest-900 tracking-tight'

  return (
    <nav className={navShell}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className={logoClass}>Treehouse Trips</span>
            </Link>
          </div>

          {/* Search lives on /properties browse bar */}
          {!isBrowsePage && !isImmersiveLanding && (
            <div className="flex-1 max-w-lg mx-8 hidden md:block">
              <Link
                href="/properties"
                className="relative flex items-center w-full pl-10 pr-4 py-2 border border-stone-200/80 rounded-full text-sm text-stone-500 hover:border-forest-500/40 hover:bg-stone-100/50 transition-colors bg-white/80"
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                Search treehouses…
              </Link>
            </div>
          )}
          {(isBrowsePage || isImmersiveLanding) && <div className="flex-1 hidden md:block" aria-hidden />}
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/" className={`${linkClass} px-3 py-2 text-sm font-medium transition-colors`}>
                Home
              </Link>
              <Link href="/properties" className={`${linkClass} px-3 py-2 text-sm font-medium transition-colors`}>
                Browse
              </Link>
              <Link
                href="/create"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  transparentNav
                    ? 'bg-white/15 text-white border border-white/25 hover:bg-white/25'
                    : 'bg-forest-800 text-white hover:bg-forest-700'
                }`}
              >
                List Your Treehouse
              </Link>
              <Link href="/about" className={`${linkClass} px-3 py-2 text-sm font-medium transition-colors`}>
                About
              </Link>
              
              {/* User Menu */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors ${linkClass}`}
                  >
                    <User size={18} />
                    <span>{user.displayName || user.email}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <div className="font-medium">{user.displayName || 'User'}</div>
                        <div className="text-gray-500">{user.email}</div>
                      </div>
                      <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Home size={16} className="mr-3" />
                        Dashboard
                      </Link>
                      <Link
                        href="/messages"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <MessageCircle size={16} className="mr-3" />
                        Messages
                      </Link>
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings size={16} className="mr-3" />
                        Profile Settings
                      </Link>
                      <button
                        onClick={() => {
                          signOut()
                          setShowUserMenu(false)
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut size={16} className="mr-3" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${linkClass}`}
                >
                  Sign In
                </button>
              )}
            </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 transition-colors ${transparentNav ? 'text-white' : 'text-stone-700 hover:text-forest-800'}`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-forest-600 block px-3 py-2 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/properties" 
              className="text-gray-700 hover:text-forest-600 block px-3 py-2 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Browse Properties
            </Link>
            <Link 
              href="/create" 
              className="bg-forest-800 text-white block px-4 py-2 rounded-full text-base font-medium hover:bg-forest-700 transition-colors mx-3 mb-3"
              onClick={() => setIsOpen(false)}
            >
              List Your Treehouse
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-forest-600 block px-3 py-2 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            
            {/* Mobile Auth Section */}
            <div className="border-t pt-3 mt-3">
              {user ? (
                <div className="px-3">
                  <div className="text-sm text-gray-600 mb-3">
                    <div className="font-medium">{user.displayName || 'User'}</div>
                    <div className="text-gray-500">{user.email}</div>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center text-gray-700 hover:text-forest-600 block px-3 py-2 text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    <Home size={18} className="mr-3" />
                    Dashboard
                  </Link>
                  <Link
                    href="/messages"
                    className="flex items-center text-gray-700 hover:text-forest-600 block px-3 py-2 text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    <MessageCircle size={18} className="mr-3" />
                    Messages
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center text-gray-700 hover:text-forest-600 block px-3 py-2 text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings size={18} className="mr-3" />
                    Profile Settings
                  </Link>
                  <button
                    onClick={() => {
                      signOut()
                      setIsOpen(false)
                    }}
                    className="flex items-center w-full text-gray-700 hover:text-forest-600 px-3 py-2 text-base font-medium"
                  >
                    <LogOut size={18} className="mr-3" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowAuthModal(true)
                    setIsOpen(false)
                  }}
                  className="flex items-center text-gray-700 hover:text-forest-600 px-3 py-2 text-base font-medium"
                >
                  <User size={18} className="mr-3" />
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </nav>
  )
}
