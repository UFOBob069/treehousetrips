'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, User, Clock, ArrowRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getConversationsByUser, markMessagesAsRead } from '@/lib/firestore'
import { Conversation } from '@/lib/firestore'

interface MessagingInboxProps {
  onSelectConversation: (conversation: Conversation) => void
}

export default function MessagingInbox({ onSelectConversation }: MessagingInboxProps) {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      loadConversations()
    }
  }, [user])

  const loadConversations = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error: convError } = await getConversationsByUser(user.uid)
      
      if (convError) {
        throw new Error(convError)
      }

      setConversations(data || [])
    } catch (err: any) {
      console.error('Error loading conversations:', err)
      setError(err.message || 'Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  const handleConversationClick = async (conversation: Conversation) => {
    try {
      // Mark messages as read
      await markMessagesAsRead(conversation.id!, user!.uid)
      
      // Update local state
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversation.id 
            ? { ...conv, unreadCount: { ...conv.unreadCount, [user!.uid]: 0 } }
            : conv
        )
      )
      
      onSelectConversation(conversation)
    } catch (err) {
      console.error('Error marking messages as read:', err)
      // Still open the conversation even if marking as read fails
      onSelectConversation(conversation)
    }
  }

  const formatTime = (timestamp: any) => {
    if (!timestamp) return ''
    
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadConversations}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Messages Yet</h3>
        <p className="text-gray-600">
          When travelers contact you about your properties, their messages will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const unreadCount = conversation.unreadCount?.[user?.uid || ''] || 0
        const isUnread = unreadCount > 0
        
        return (
          <div
            key={conversation.id}
            onClick={() => handleConversationClick(conversation)}
            className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
              isUnread ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 truncate">
                    {conversation.propertyTitle}
                  </h4>
                  {isUnread && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <User className="h-4 w-4" />
                  <span>{conversation.travelerName}</span>
                </div>
                
                {conversation.lastMessage && (
                  <p className="text-sm text-gray-700 truncate">
                    {conversation.lastMessage}
                  </p>
                )}
              </div>
              
              <div className="flex flex-col items-end gap-1 ml-4">
                {conversation.lastMessageAt && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(conversation.lastMessageAt)}</span>
                  </div>
                )}
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
