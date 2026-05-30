import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './firebase'

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export async function uploadListingImage(
  file: File,
  userId: string,
  propertyId?: string
): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Please upload a JPEG, PNG, WebP, or GIF image.')
  }
  if (file.size > MAX_BYTES) {
    throw new Error('Each image must be under 5 MB.')
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_') || 'photo.jpg'
  const path = propertyId
    ? `properties/${propertyId}/${Date.now()}-${safeName}`
    : `temp/${userId}/${Date.now()}-${safeName}`

  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file, {
    customMetadata: { ownerId: userId },
  })
  return getDownloadURL(storageRef)
}
