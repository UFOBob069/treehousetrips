import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  or,
  writeBatch,
} from 'firebase/firestore'
import { db } from './firebase'

// Collection names
export const COLLECTIONS = {
  PROPERTIES: 'properties',
  USERS: 'users',
  BOOKINGS: 'bookings',
  PAYMENTS: 'payments',
  CONVERSATIONS: 'conversations',
  MESSAGES: 'messages',
} as const

// Property types
export interface Property {
  id?: string
  title: string
  description: string
  location: string
  exactAddress?: string
  price: number
  contactEmail: string
  airbnbUrl?: string
  images: string[]
  tags: string[]
  guests: number
  bedrooms: number
  bathrooms: number
  lat?: number
  lng?: number
  isPublished: boolean
  isPaid: boolean
  subscriptionStartDate?: Timestamp
  subscriptionEndDate?: Timestamp
  subscriptionStatus?: 'active' | 'expired' | 'pending' | 'canceled'
  stripePaymentId?: string
  stripeSubscriptionId?: string
  stripeCustomerId?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  ownerId: string
}

export interface User {
  id?: string
  email: string
  displayName?: string
  photoURL?: string
  isHost: boolean
  userType?: 'host' | 'traveler' | 'both'
  hasActiveSubscription?: boolean
  subscriptionStatus?: 'active' | 'inactive' | 'expired'
  subscriptionStartDate?: Timestamp
  subscriptionEndDate?: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Booking {
  id?: string
  propertyId: string
  guestId: string
  hostId: string
  checkIn: Timestamp
  checkOut: Timestamp
  guests: number
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Property operations
export const createProperty = async (propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.PROPERTIES), {
      ...propertyData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return { id: docRef.id, error: null }
  } catch (error: any) {
    return { id: null, error: error.message }
  }
}

export const getProperty = async (id: string) => {
  try {
    const docRef = doc(db, COLLECTIONS.PROPERTIES, id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { data: { id: docSnap.id, ...docSnap.data() } as Property, error: null }
    } else {
      return { data: null, error: 'Property not found' }
    }
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}

export const getProperties = async (filters?: {
  isPublished?: boolean
  ownerId?: string
  limit?: number
}) => {
  try {
    let q = query(collection(db, COLLECTIONS.PROPERTIES))
    
    if (filters?.isPublished !== undefined) {
      q = query(q, where('isPublished', '==', filters.isPublished))
    }
    
    if (filters?.ownerId) {
      q = query(q, where('ownerId', '==', filters.ownerId))
    }
    
    if (filters?.limit) {
      q = query(q, limit(filters.limit))
    }
    
    q = query(q, orderBy('createdAt', 'desc'))
    
    const querySnapshot = await getDocs(q)
    const properties = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Property[]
    
    return { data: properties, error: null }
  } catch (error: any) {
    return { data: [], error: error.message }
  }
}

export const updateProperty = async (id: string, updates: Partial<Property>) => {
  try {
    const docRef = doc(db, COLLECTIONS.PROPERTIES, id)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

export const deleteProperty = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.PROPERTIES, id))
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

// User operations
export const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.USERS), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return { id: docRef.id, error: null }
  } catch (error: any) {
    return { id: null, error: error.message }
  }
}

export const getUser = async (id: string) => {
  try {
    const docRef = doc(db, COLLECTIONS.USERS, id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { data: { id: docSnap.id, ...docSnap.data() } as User, error: null }
    } else {
      return { data: null, error: 'User not found' }
    }
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}

// Get properties by owner
export const getPropertiesByOwner = async (ownerId: string) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.PROPERTIES),
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Property[]
  } catch (error: any) {
    throw new Error(`Failed to get properties: ${error.message}`)
  }
}

// User operations
export const updateUser = async (userId: string, userData: Partial<User>) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId)
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Real-time listeners
export const subscribeToProperties = (
  callback: (properties: Property[]) => void,
  filters?: { isPublished?: boolean; ownerId?: string }
) => {
  let q = query(collection(db, COLLECTIONS.PROPERTIES))
  
  if (filters?.isPublished !== undefined) {
    q = query(q, where('isPublished', '==', filters.isPublished))
  }
  
  if (filters?.ownerId) {
    q = query(q, where('ownerId', '==', filters.ownerId))
  }
  
  q = query(q, orderBy('createdAt', 'desc'))
  
  return onSnapshot(q, (querySnapshot) => {
    const properties = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Property[]
    callback(properties)
  })
}

// Messaging interfaces
export interface Conversation {
  id?: string
  propertyId: string
  hostId: string
  travelerId: string
  propertyTitle: string
  hostName: string
  travelerName: string
  lastMessage?: string
  lastMessageAt?: Timestamp
  lastMessageBy?: string
  unreadCount?: { [userId: string]: number }
  isActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Message {
  id?: string
  conversationId: string
  senderId: string
  senderName: string
  content: string
  isRead: boolean
  createdAt: Timestamp
}

// Messaging operations
export const createConversation = async (conversationData: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.CONVERSATIONS), {
      ...conversationData,
      unreadCount: { [conversationData.hostId]: 0, [conversationData.travelerId]: 0 },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return { id: docRef.id, error: null }
  } catch (error: any) {
    return { id: null, error: error.message }
  }
}

export const getConversationsByUser = async (userId: string) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.CONVERSATIONS),
      or(
        where('hostId', '==', userId),
        where('travelerId', '==', userId)
      ),
      orderBy('lastMessageAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    const conversations = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Conversation[]
    
    return { data: conversations, error: null }
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}

export const getConversation = async (conversationId: string) => {
  try {
    const docRef = doc(db, COLLECTIONS.CONVERSATIONS, conversationId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { data: { id: docSnap.id, ...docSnap.data() } as Conversation, error: null }
    } else {
      return { data: null, error: 'Conversation not found' }
    }
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}

export const createMessage = async (messageData: Omit<Message, 'id' | 'createdAt'>) => {
  try {
    const messageRef = await addDoc(collection(db, COLLECTIONS.MESSAGES), {
      ...messageData,
      createdAt: serverTimestamp(),
    })
    
    // Update conversation with last message
    const conversationRef = doc(db, COLLECTIONS.CONVERSATIONS, messageData.conversationId)
    const conversationSnap = await getDoc(conversationRef)
    
    if (conversationSnap.exists()) {
      const conversationData = conversationSnap.data() as Conversation
      const otherUserId = conversationData.hostId === messageData.senderId 
        ? conversationData.travelerId 
        : conversationData.hostId
      
      await updateDoc(conversationRef, {
        lastMessage: messageData.content,
        lastMessageAt: serverTimestamp(),
        lastMessageBy: messageData.senderId,
        [`unreadCount.${otherUserId}`]: (conversationData.unreadCount?.[otherUserId] || 0) + 1,
        updatedAt: serverTimestamp(),
      })
    }
    
    return { id: messageRef.id, error: null }
  } catch (error: any) {
    return { id: null, error: error.message }
  }
}

export const getMessages = async (conversationId: string) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.MESSAGES),
      where('conversationId', '==', conversationId),
      orderBy('createdAt', 'asc')
    )
    
    const querySnapshot = await getDocs(q)
    const messages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Message[]
    
    return { data: messages, error: null }
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}

export const markMessagesAsRead = async (conversationId: string, userId: string) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.MESSAGES),
      where('conversationId', '==', conversationId),
      where('senderId', '!=', userId),
      where('isRead', '==', false)
    )
    
    const querySnapshot = await getDocs(q)
    const batch = writeBatch(db)
    
    querySnapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { isRead: true })
    })
    
    await batch.commit()
    
    // Reset unread count for this user
    const conversationRef = doc(db, COLLECTIONS.CONVERSATIONS, conversationId)
    await updateDoc(conversationRef, {
      [`unreadCount.${userId}`]: 0,
      updatedAt: serverTimestamp(),
    })
    
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

