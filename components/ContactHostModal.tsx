'use client'

import { useState } from 'react'
import { X, Send, MessageCircle, User, Mail, Phone } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createConversation, createMessage } from '@/lib/firestore'
import { Property } from '@/lib/firestore'
import { canViewHostContactInfo } from '@/lib/host-contact-visibility'

interface ContactHostModalProps {
  isOpen: boolean
  onClose: () => void
  property: Property
  onSuccess?: () => void
  /** Opens sign-in when guest tries to message without an account. */
  onRequestSignIn?: () => void
}

export default function ContactHostModal({
  isOpen,
  onClose,
  property,
  onSuccess,
  onRequestSignIn,
}: ContactHostModalProps) {
  const { user } = useAuth()
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const email = property.contactEmail?.trim()
  const phone = property.contactPhone?.trim()
  const showEmail = Boolean(user && property.showContactEmail && email)
  const showPhone = Boolean(user && property.showContactPhone && phone)
  const hasHostContact = canViewHostContactInfo(property, Boolean(user))

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
      const { id: conversationId, error: convError } = await createConversation({
        propertyId: property.id!,
        hostId: property.ownerId,
        travelerId: user.uid,
        propertyTitle: property.title,
        hostName: property.contactEmail,
        travelerName: user.displayName || user.email || 'Traveler',
        isActive: true,
      })

      if (convError) {
        throw new Error(convError)
      }

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

      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 2000)
    } catch (err: unknown) {
      console.error('Error sending message:', err)
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm p-4 sm:items-center">
      <div className="bg-[#fffcf7] rounded-3xl border border-stone-200/60 shadow-[0_24px_60px_rgba(26,43,26,0.15)] max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-forest-100 rounded-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-forest-800" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-forest-950">Message host</h2>
                <p className="text-sm text-stone-600">{property.title}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-stone-400 hover:text-stone-700 rounded-full p-1"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-forest-700" />
              </div>
              <h3 className="font-serif text-lg text-forest-950 mb-2">Message sent</h3>
              <p className="text-stone-600 text-sm">
                Your message was sent through Treehouse Trips. The host can reply in Messages.
              </p>
            </div>
          ) : !user ? (
            <div className="space-y-4 py-2">
              <div className="bg-forest-50 border border-forest-200/80 rounded-xl p-4">
                <p className="text-forest-900 text-sm leading-relaxed">
                  Sign in to send a message. Your email stays private until you reach out — hosts reply in
                  Messages.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-stone-200/80 text-stone-700 rounded-full hover:bg-stone-100/80 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    onRequestSignIn?.()
                  }}
                  className="flex-1 px-4 py-2.5 bg-forest-800 text-white rounded-full hover:bg-forest-700 transition-colors text-sm font-medium"
                >
                  Sign in
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-stone-100/80 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <User className="h-4 w-4" />
                  <span>Sending as: {user.displayName || user.email}</span>
                </div>
              </div>

              {hasHostContact && (
                <div className="rounded-xl border border-stone-200/80 bg-white p-4 space-y-2">
                  <p className="text-xs font-medium text-moss uppercase tracking-wide">
                    Host contact (shared by host)
                  </p>
                  {showEmail && email && (
                    <a
                      href={`mailto:${email}`}
                      className="flex items-center gap-2 text-sm text-forest-800 hover:underline"
                    >
                      <Mail className="h-4 w-4 shrink-0 text-stone-400" />
                      {email}
                    </a>
                  )}
                  {showPhone && phone && (
                    <a
                      href={`tel:${phone.replace(/\s/g, '')}`}
                      className="flex items-center gap-2 text-sm text-forest-800 hover:underline"
                    >
                      <Phone className="h-4 w-4 shrink-0 text-stone-400" />
                      {phone}
                    </a>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-2">
                  Your message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hi! I'm interested in your treehouse. Could you tell me more about availability?"
                  className="w-full px-3 py-2 border border-stone-200/80 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-forest-600/30 resize-none text-stone-800"
                  rows={4}
                  maxLength={500}
                />
                <div className="text-xs text-stone-500 mt-1">{message.length}/500 characters</div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200/80 rounded-xl p-3">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-stone-200/80 text-stone-700 rounded-full hover:bg-stone-100/80 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !user || !message.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-forest-800 text-white rounded-full hover:bg-forest-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {loading ? 'Sending…' : 'Send message'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
