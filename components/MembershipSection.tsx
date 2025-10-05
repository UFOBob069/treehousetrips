'use client'

import { useState } from 'react'
import { Check, Star, Shield, Users, MessageCircle } from 'lucide-react'
import StripeCheckout from './StripeCheckout'

export default function MembershipSection() {
  const [showCheckout, setShowCheckout] = useState(false)

  const benefits = [
    {
      icon: <Star className="w-6 h-6" />,
      title: "Exclusive Access",
      description: "Access to hand-selected, invite-only treehouse properties not available to the general public."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Curated Quality",
      description: "Every property is personally vetted by our team for exceptional quality and unique experiences."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Direct Host Access",
      description: "Connect directly with property hosts for personalized service and special arrangements."
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Priority Support",
      description: "Get priority customer support and assistance with bookings and special requests."
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-forest-50 to-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Join the <span className="text-forest-600">Exclusive</span> Community
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get access to the world's most exceptional treehouse rentals. 
            Our invite-only membership ensures you experience only the finest properties.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Benefits */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <div className="text-5xl font-bold text-forest-600 mb-2">$50</div>
              <div className="text-xl text-gray-600">per year</div>
            </div>
            
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-forest-100 rounded-lg flex items-center justify-center text-forest-600">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Membership Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Membership</h3>
              <div className="text-4xl font-bold text-forest-600 mb-2">$50<span className="text-lg text-gray-600">/year</span></div>
              <p className="text-gray-600">Cancel anytime</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-forest-600" />
                <span className="text-gray-700">Access to all exclusive properties</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-forest-600" />
                <span className="text-gray-700">Direct host communication</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-forest-600" />
                <span className="text-gray-700">Priority booking assistance</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-forest-600" />
                <span className="text-gray-700">Exclusive member events</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-forest-600" />
                <span className="text-gray-700">24/7 customer support</span>
              </div>
            </div>

            {showCheckout ? (
              <StripeCheckout />
            ) : (
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full bg-forest-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-forest-700 transition-colors"
              >
                Join Now - $50/year
              </button>
            )}

            <p className="text-xs text-gray-500 text-center mt-4">
              Secure payment processed by Stripe. Cancel anytime.
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-8">Trusted by treehouse enthusiasts worldwide</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
            <div className="text-2xl font-bold text-gray-400">500+</div>
            <div className="text-2xl font-bold text-gray-400">Members</div>
            <div className="text-2xl font-bold text-gray-400">50+</div>
            <div className="text-2xl font-bold text-gray-400">Properties</div>
          </div>
        </div>
      </div>
    </section>
  )
}
