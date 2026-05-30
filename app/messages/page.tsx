'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Conversation } from '@/lib/firestore'
import MessagingInbox from '@/components/MessagingInbox'
import ConversationView from '@/components/ConversationView'
import SignInGate from '@/components/SignInGate'

export default function MessagesPage() {
  const { user } = useAuth()
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

  if (!user) {
    return (
      <SignInGate
        contextLine="Message hosts about stays you love, or reply to travelers interested in your treehouse."
        authMessage="Sign in to view and send messages on Treehouse Trips."
      />
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
