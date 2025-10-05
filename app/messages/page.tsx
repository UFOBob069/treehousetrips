'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Conversation } from '@/lib/firestore'
import MessagingInbox from '@/components/MessagingInbox'
import ConversationView from '@/components/ConversationView'
import { MessageCircle } from 'lucide-react'

export default function MessagesPage() {
  const { user } = useAuth()
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
          <p className="text-gray-600">Please sign in to access your messages.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">
            Manage conversations with travelers interested in your properties.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {selectedConversation ? (
            <ConversationView
              conversation={selectedConversation}
              onBack={() => setSelectedConversation(null)}
            />
          ) : (
            <div className="p-6">
              <MessagingInbox onSelectConversation={setSelectedConversation} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
