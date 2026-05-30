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
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <MessageCircle className="h-16 w-16 text-stone-300 mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-forest-950 mb-2">Sign in required</h2>
          <p className="text-stone-600">Please sign in to access your messages.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <p className="text-moss text-sm tracking-widest uppercase mb-1">Inbox</p>
          <h1 className="font-serif text-3xl text-forest-950 tracking-tight mb-2">Messages</h1>
          <p className="text-stone-600">
            Manage conversations with travelers interested in your properties.
          </p>
        </div>

        <div className="bg-[#fffcf7] rounded-2xl border border-stone-200/60 shadow-[0_8px_30px_rgba(26,43,26,0.08)] overflow-hidden">
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
