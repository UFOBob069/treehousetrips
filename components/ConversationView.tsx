'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Send, User, MessageCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getMessages, createMessage, markMessagesAsRead } from '@/lib/firestore'
import { Conversation, Message } from '@/lib/firestore'

interface ConversationViewProps {
  conversation: Conversation
  onBack: () => void
}

export default function ConversationView({ conversation, onBack }: ConversationViewProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (conversation.id) {
      loadMessages()
    }
  }, [conversation.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (conversation.id && user) {
      markMessagesAsRead(conversation.id, user.uid)
    }
  }, [conversation.id, user])

  const loadMessages = async () => {
    if (!conversation.id) return

    try {
      setLoading(true)
      const { data, error: msgError } = await getMessages(conversation.id)
      
      if (msgError) {
        throw new Error(msgError)
      }

      setMessages(data || [])
    } catch (err: any) {
      console.error('Error loading messages:', err)
      setError(err.message || 'Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim() || !user || !conversation.id) return

    setSending(true)
    setError('')

    try {
      const { error: msgError } = await createMessage({
        conversationId: conversation.id,
        senderId: user.uid,
        senderName: user.displayName || user.email || 'User',
        content: newMessage.trim(),
        isRead: false,
      })

      if (msgError) {
        throw new Error(msgError)
      }

      setNewMessage('')
      // Reload messages to get the new one
      await loadMessages()
    } catch (err: any) {
      console.error('Error sending message:', err)
      setError(err.message || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatMessageTime = (timestamp: any) => {
    if (!timestamp) return ''
    
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const otherUser = conversation.hostId === user?.uid ? conversation.travelerName : conversation.hostName

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-white">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{otherUser}</h3>
            <p className="text-sm text-gray-600">{conversation.propertyTitle}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.senderId === user?.uid
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwn
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwn ? 'text-primary-100' : 'text-gray-500'
                    }`}
                  >
                    {formatMessageTime(message.createdAt)}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {newMessage.length}/500 characters
        </div>
      </form>
    </div>
  )
}
