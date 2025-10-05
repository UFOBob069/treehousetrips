'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from 'firebase/auth'
import { onAuthStateChange } from '@/lib/auth'
import { getUser, createUser, User as FirestoreUser } from '@/lib/firestore'

interface AuthContextType {
  user: User | null
  firestoreUser: FirestoreUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>
  signUp: (email: string, password: string, displayName?: string) => Promise<{ user: User | null; error: string | null }>
  signOut: () => Promise<{ error: string | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [firestoreUser, setFirestoreUser] = useState<FirestoreUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user)
      
      if (user) {
        // Get user data from Firestore
        const { data: userData, error } = await getUser(user.uid)
        if (userData) {
          setFirestoreUser(userData)
        } else if (error === 'User not found') {
          // Create user in Firestore if doesn't exist
          const { id, error: createError } = await createUser({
            email: user.email!,
            displayName: user.displayName || undefined,
            photoURL: user.photoURL || undefined,
            isHost: false,
          })
          
          if (id && !createError) {
            setFirestoreUser({
              id,
              email: user.email!,
              displayName: user.displayName || undefined,
              photoURL: user.photoURL || undefined,
              isHost: false,
              createdAt: new Date() as any,
              updatedAt: new Date() as any,
            })
          }
        }
      } else {
        setFirestoreUser(null)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { signIn: signInUser } = await import('@/lib/auth')
    return await signInUser(email, password)
  }

  const signUp = async (email: string, password: string, displayName?: string) => {
    const { signUp: signUpUser } = await import('@/lib/auth')
    return await signUpUser(email, password, displayName)
  }

  const signOut = async () => {
    const { signOutUser } = await import('@/lib/auth')
    return await signOutUser()
  }

  const value = {
    user,
    firestoreUser,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

