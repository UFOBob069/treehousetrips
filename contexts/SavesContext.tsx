'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  saveProperty,
  savedSnapshotToBrowseProperty,
  snapshotFromBrowseProperty,
  subscribeUserSaves,
  unsaveProperty,
  type SavedPropertySnapshot,
} from '@/lib/saves'
import type { BrowseProperty } from '@/lib/property-browse'

type SavesContextType = {
  savedIds: Set<string>
  savedProperties: BrowseProperty[]
  loading: boolean
  isSaved: (propertyId: string) => boolean
  toggleSave: (property: BrowseProperty) => Promise<{ error: string | null; requiresSignIn?: boolean }>
}

const SavesContext = createContext<SavesContextType | undefined>(undefined)

export function useSaves() {
  const ctx = useContext(SavesContext)
  if (!ctx) {
    throw new Error('useSaves must be used within SavesProvider')
  }
  return ctx
}

export function SavesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [saves, setSaves] = useState<SavedPropertySnapshot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setSaves([])
      setLoading(false)
      return
    }

    setLoading(true)
    const unsub = subscribeUserSaves(
      user.uid,
      (data) => {
        setSaves(data)
        setLoading(false)
      },
      () => setLoading(false)
    )

    return () => unsub()
  }, [user])

  const savedIds = useMemo(() => new Set(saves.map((s) => s.propertyId)), [saves])

  const savedProperties = useMemo(
    () => saves.map(savedSnapshotToBrowseProperty),
    [saves]
  )

  const isSaved = useCallback((propertyId: string) => savedIds.has(propertyId), [savedIds])

  const toggleSave = useCallback(
    async (property: BrowseProperty) => {
      if (!user) {
        return { error: null, requiresSignIn: true }
      }

      const propertyId = property.id
      if (savedIds.has(propertyId)) {
        return unsaveProperty(user.uid, propertyId)
      }

      return saveProperty(user.uid, snapshotFromBrowseProperty(property))
    },
    [user, savedIds]
  )

  const value = useMemo(
    () => ({
      savedIds,
      savedProperties,
      loading,
      isSaved,
      toggleSave,
    }),
    [savedIds, savedProperties, loading, isSaved, toggleSave]
  )

  return <SavesContext.Provider value={value}>{children}</SavesContext.Provider>
}
