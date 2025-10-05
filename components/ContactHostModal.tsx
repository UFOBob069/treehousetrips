'use client'

import { useState } from 'react'
import { X, Send, MessageCircle, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createConversation, createMessage } from '@/lib/firestore'
import { Property } from '@/lib/firestore'

interface ContactHostModalProps {
  isOpen: boolean
  onClose: () => void
  property: Property
  onSuccess?: () => void
}

export default function ContactHostModal({ isOpen, onClose, property, onSuccess }: ContactHostModalProps) {
  const { user } = useAuth()
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setError('Please sign in to contact the host')
      return
    }

    if (!message.trim()) {
      setError('Please enter a message')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Create conversation
      const { id: conversationId, error: convError } = await createConversation({
        propertyId: property.id!,
        hostId: property.ownerId,
        travelerId: user.uid,
        propertyTitle: property.title,
        hostName: property.contactEmail, // We'll update this when we get host data
        travelerName: user.displayName || user.email || 'Traveler',
        isActive: true,
      })

      if (convError) {
        throw new Error(convError)
      }

      // Create initial message
      const { error: msgError } = await createMessage({
        conversationId: conversationId!,
        senderId: user.uid,
        senderName: user.displayName || user.email || 'Traveler',
        content: message.trim(),
        isRead: false,
      })

      if (msgError) {
        throw new Error(msgError)
      }

      setSuccess(true)
      setMessage('')
      
      if (onSuccess) {
        onSuccess()
      }

      // Close modal after 2 seconds
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 2000)

    } catch (err: any) {
      console.error('Error sending message:', err)
      setError(err.message || 'Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Contact Host</h2>
                <p className="text-sm text-gray-600">{property.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Message Sent!</h3>
              <p className="text-gray-600">
                Your message has been sent to the host. They'll respond through our messaging system.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!user ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 text-sm">
                    Please sign in to contact the host. This keeps your email private and secure.
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>Sending as: {user.displayName || user.email}</span>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hi! I'm interested in your treehouse. Could you tell me more about availability and pricing?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows={4}
                  maxLength={500}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {message.length}/500 characters
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !user || !message.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
