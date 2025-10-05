'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { getPropertiesByOwner, getUser } from '@/lib/firestore'
import { Property, User } from '@/lib/firestore'
import { 
  Home, 
  Plus, 
  Edit, 
  Eye, 
  Star, 
  MapPin,
  Users,
  Settings,
  AlertCircle,
  MessageCircle
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      loadProperties()
      loadUserData()
    }
  }, [user])

  const loadProperties = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      console.log('Loading properties for user:', user.uid)
      const userProperties = await getPropertiesByOwner(user.uid)
      console.log('Loaded properties:', userProperties)
      setProperties(userProperties)
    } catch (err) {
      console.error('Error loading properties:', err)
      setError(`Failed to load your properties: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const loadUserData = async () => {
    if (!user) return
    
    try {
      const { data } = await getUser(user.uid)
      if (data) {
        setUserData(data)
      }
    } catch (err) {
      console.error('Error loading user data:', err)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Sign In</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to access your dashboard.</p>
          <Link
            href="/create"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Host Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user.displayName || user.email}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Home className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">
                  {properties.filter(p => p.isPublished).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Edit className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {properties.filter(p => !p.isPublished).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${userData?.hasActiveSubscription ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Settings className={`h-6 w-6 ${userData?.hasActiveSubscription ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Subscription</p>
                <p className={`text-sm font-bold ${userData?.hasActiveSubscription ? 'text-blue-600' : 'text-gray-400'}`}>
                  {userData?.hasActiveSubscription ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/create"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-6 w-6 text-primary-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">List New Property</h3>
                  <p className="text-sm text-gray-600">Add a new treehouse to your portfolio</p>
                </div>
              </Link>

              <Link
                href="/messages"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MessageCircle className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Messages</h3>
                  <p className="text-sm text-gray-600">Chat with interested travelers</p>
                </div>
              </Link>

              <Link
                href="/profile"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Settings className="h-6 w-6 text-primary-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Profile Settings</h3>
                  <p className="text-sm text-gray-600">Update your host profile</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Properties List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Your Properties</h2>
              {properties.filter(p => !p.isPublished).length > 0 && (
                <div className="text-sm text-gray-600">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                    {properties.filter(p => !p.isPublished).length} pending review
                  </span>
                </div>
              )}
            </div>
            {properties.filter(p => !p.isPublished).length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                Pending properties can be edited until they're approved and published.
              </p>
            )}
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading your properties...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
              <p className="text-red-600">{error}</p>
              <button
                onClick={loadProperties}
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Retry
              </button>
            </div>
          ) : properties.length === 0 ? (
            <div className="p-6 text-center">
              <Home className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Yet</h3>
              <p className="text-gray-600 mb-4">Start by listing your first treehouse property.</p>
              <Link
                href="/create"
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                List Your First Property
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {properties.map((property) => (
                <div key={property.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        {property.images && property.images.length > 0 && (
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="h-16 w-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{property.title}</h3>
                          <div className="flex items-center text-gray-600 mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">{property.location}</span>
                          </div>
                          <div className="flex items-center mt-2 space-x-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Users className="h-4 w-4 mr-1" />
                              {property.guests} guests
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Star className="h-4 w-4 mr-1" />
                              {property.bedrooms} bed • {property.bathrooms} bath
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        property.isPaid && property.subscriptionStatus === 'active'
                          ? 'bg-green-100 text-green-800'
                          : property.subscriptionStatus === 'expired'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {property.isPaid && property.subscriptionStatus === 'active' 
                          ? 'Active' 
                          : property.subscriptionStatus === 'expired'
                          ? 'Expired'
                          : 'Pending Payment'}
                      </span>
                      {property.subscriptionEndDate && (
                        <span className="text-xs text-gray-500">
                          Expires: {new Date(property.subscriptionEndDate.seconds * 1000).toLocaleDateString()}
                        </span>
                      )}
                      
                      <div className="flex space-x-1">
                        <button 
                          className="p-2 text-gray-400 hover:text-gray-600"
                          title="View property"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-2 text-gray-400 hover:text-gray-600"
                          title={property.isPublished ? "Edit property" : "Edit pending property"}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {!property.isPaid && (
                          <button 
                            onClick={() => {
                              // Redirect to payment for this property
                              router.push(`/pay/${property.id}`)
                            }}
                            className="px-3 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700"
                            title="Pay listing fee to activate"
                          >
                            Pay $50
                          </button>
                        )}
                        {property.subscriptionStatus === 'expired' && (
                          <button 
                            onClick={() => {
                              router.push(`/pay/${property.id}`)
                            }}
                            className="px-3 py-1 text-xs bg-orange-600 text-white rounded hover:bg-orange-700"
                            title="Renew listing for another year"
                          >
                            Renew
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
