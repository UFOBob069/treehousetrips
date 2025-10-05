'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { updateUser } from '@/lib/firestore'
import { User } from '@/lib/firestore'
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Save,
  Edit,
  Camera,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
    isHost: false
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        displayName: user.displayName || '',
        email: user.email || '',
        phone: '',
        bio: '',
        location: '',
        website: '',
        isHost: false
      })
    }
  }, [user])

  const handleSave = async () => {
    if (!user) return
    
    setSaving(true)
    setMessage('')
    
    try {
      const updatedUser: Partial<User> = {
        displayName: profileData.displayName,
        email: profileData.email,
        isHost: profileData.isHost,
        updatedAt: new Date() as any
      }
      
      await updateUser(user.uid, updatedUser)
      setMessage('Profile updated successfully!')
      setIsEditing(false)
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Sign In</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to access your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            message.includes('successfully') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.includes('successfully') ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center text-primary-600 hover:text-primary-700"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt="Profile"
                          className="h-20 w-20 rounded-full object-cover"
                        />
                      ) : (
                        <UserIcon className="h-8 w-8 text-primary-600" />
                      )}
                    </div>
                    {isEditing && (
                      <button className="absolute -bottom-1 -right-1 bg-primary-600 text-white p-1 rounded-full hover:bg-primary-700">
                        <Camera className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {profileData.displayName || 'Your Name'}
                    </h3>
                    <p className="text-gray-600">{profileData.email}</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={profileData.displayName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="City, State, Country"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                      rows={4}
                      placeholder="Tell us about yourself..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      value={profileData.website}
                      onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="https://yourwebsite.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isHost"
                      checked={profileData.isHost}
                      onChange={(e) => setProfileData(prev => ({ ...prev, isHost: e.target.checked }))}
                      disabled={!isEditing}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isHost" className="ml-2 text-sm text-gray-700">
                      I am a host
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setIsEditing(false)
                        setProfileData({
                          displayName: user.displayName || '',
                          email: user.email || '',
                          phone: '',
                          bio: '',
                          location: '',
                          website: '',
                          isHost: false
                        })
                      }}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Account</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Member since {new Date().toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {user.email}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
              </div>
              <div className="p-6">
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
