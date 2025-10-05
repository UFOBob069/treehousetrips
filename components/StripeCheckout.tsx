'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setMessage('')

    // In a real implementation, you would create a payment intent on your server
    // For demo purposes, we'll show a success message
    setTimeout(() => {
      setMessage('Payment successful! Welcome to Treehouse Stays!')
      setIsLoading(false)
    }, 2000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border border-gray-300 rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-forest-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-forest-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : 'Pay $50/year'}
      </button>
      
      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('successful') 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}
    </form>
  )
}

export default function StripeCheckout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  )
}
