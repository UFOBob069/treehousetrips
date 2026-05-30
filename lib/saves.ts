import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type { BrowseProperty } from './property-browse'
import { slugify } from './property-browse'

export type SavedPropertySnapshot = {
  propertyId: string
  slug: string
  name: string
  location: string
  price: string
  image: string
  guests: number
  bedrooms: number
  bathrooms: number
  savedAt: Timestamp
}

function savesCollection(userId: string) {
  return collection(db, 'users', userId, 'saves')
}

export function snapshotFromDetailProperty(property: {
  id: string
  name: string
  title?: string
  location: string
  images: string[]
  price: string | number
  guests: number
  bedrooms: number
  bathrooms: number
  slug?: string
}): Omit<SavedPropertySnapshot, 'savedAt'> {
  const name = property.title || property.name
  const price =
    typeof property.price === 'string' ? property.price : `$${property.price}/night`
  return {
    propertyId: property.id,
    slug: property.slug || slugify(name) || property.id,
    name,
    location: property.location,
    price,
    image: property.images[0] || '',
    guests: property.guests,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
  }
}

export function snapshotFromBrowseProperty(property: BrowseProperty): Omit<SavedPropertySnapshot, 'savedAt'> {
  return {
    propertyId: property.id,
    slug: property.slug || slugify(property.name) || property.id,
    name: property.name,
    location: property.location,
    price: property.price,
    image: property.images[0] || '',
    guests: property.guests,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
  }
}

export function savedSnapshotToBrowseProperty(save: SavedPropertySnapshot): BrowseProperty {
  return {
    id: save.propertyId,
    slug: save.slug,
    name: save.name,
    description: '',
    location: save.location,
    lat: 0,
    lng: 0,
    airbnbUrl: '',
    hostEmail: '',
    images: save.image ? [save.image] : [],
    tags: [],
    price: save.price,
    guests: save.guests,
    bedrooms: save.bedrooms,
    bathrooms: save.bathrooms,
  }
}

export async function saveProperty(
  userId: string,
  snapshot: Omit<SavedPropertySnapshot, 'savedAt'>
): Promise<{ error: string | null }> {
  try {
    const ref = doc(db, 'users', userId, 'saves', snapshot.propertyId)
    await setDoc(ref, {
      ...snapshot,
      savedAt: serverTimestamp(),
    })
    return { error: null }
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : 'Could not save listing' }
  }
}

export async function unsaveProperty(
  userId: string,
  propertyId: string
): Promise<{ error: string | null }> {
  try {
    await deleteDoc(doc(db, 'users', userId, 'saves', propertyId))
    return { error: null }
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : 'Could not remove save' }
  }
}

export async function getUserSaves(userId: string): Promise<{
  data: SavedPropertySnapshot[]
  error: string | null
}> {
  try {
    const snap = await getDocs(savesCollection(userId))
    const data = snap.docs.map((d) => d.data() as SavedPropertySnapshot)
    data.sort((a, b) => {
      const aSec = a.savedAt?.seconds ?? 0
      const bSec = b.savedAt?.seconds ?? 0
      return bSec - aSec
    })
    return { data, error: null }
  } catch (error: unknown) {
    return { data: [], error: error instanceof Error ? error.message : 'Could not load saves' }
  }
}

export function subscribeUserSaves(
  userId: string,
  onData: (saves: SavedPropertySnapshot[]) => void,
  onError?: (message: string) => void
) {
  return onSnapshot(
    savesCollection(userId),
    (snap) => {
      const data = snap.docs.map((d) => d.data() as SavedPropertySnapshot)
      data.sort((a, b) => {
        const aSec = a.savedAt?.seconds ?? 0
        const bSec = b.savedAt?.seconds ?? 0
        return bSec - aSec
      })
      onData(data)
    },
    (err) => onError?.(err.message)
  )
}
