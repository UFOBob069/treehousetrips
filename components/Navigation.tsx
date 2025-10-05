'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, Search, User, LogOut, Settings, Home, MessageCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from './AuthModal'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, signOut } = useAuth()
  const userMenuRef = useRef<HTMLDivElement>(null)

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

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-forest-600">🌲 Treehouse Trips</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search treehouses..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
              />
            </div>
          </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/" className="text-gray-700 hover:text-forest-600 px-3 py-2 text-sm font-medium transition-colors">
                Home
              </Link>
              <Link href="/properties" className="text-gray-700 hover:text-forest-600 px-3 py-2 text-sm font-medium transition-colors">
                Browse
              </Link>
              <Link href="/create" className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                List Your Treehouse
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-forest-600 px-3 py-2 text-sm font-medium transition-colors">
                About
              </Link>
              
              {/* User Menu */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-forest-600 px-3 py-2 text-sm font-medium transition-colors"
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
                  className="text-gray-700 hover:text-forest-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-forest-600 p-2"
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
              className="bg-primary-600 text-white block px-4 py-2 rounded-lg text-base font-medium hover:bg-primary-700 transition-colors mx-3 mb-3"
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
    </nav>
  )
}
