'use client'

import { useState } from 'react'
import { Check, DollarSign, Users, Shield, Star, TrendingUp, Mail, Phone } from 'lucide-react'

export default function ListYourTreehousePage() {
  const [showApplication, setShowApplication] = useState(false)
  const [showLearnMore, setShowLearnMore] = useState(false)

  const handleApplyToHost = () => {
    window.location.href = '/apply'
  }

  const handleLearnMore = () => {
    setShowLearnMore(true)
  }

  const handleEmailContact = () => {
    window.location.href = 'mailto:partnerships@treehousetrips.com?subject=Treehouse Listing Application'
  }

  const handleScheduleCall = () => {
    window.location.href = 'https://calendly.com/treehousetrips/consultation'
  }
  const benefits = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Premium Pricing",
      description: "Earn up to 30% more than typical vacation rental platforms through our exclusive network.",
      details: [
        "No commission fees on direct bookings",
        "Premium rate positioning",
        "Exclusive guest base willing to pay more"
      ]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Direct Communication",
      description: "Build direct relationships with guests without platform intermediaries.",
      details: [
        "Direct guest contact information",
        "Personalized guest relationships",
        "Repeat booking opportunities",
        "Custom pricing and packages"
      ]
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "AI Discoverability",
      description: "Get found by AI assistants and travel planning tools when travelers ask for unique accommodations.",
      details: [
        "Featured in ChatGPT, Claude, and other AI travel recommendations",
        "Niche market positioning for better AI visibility",
        "Specialized treehouse category recognition",
        "Future-proof discovery as AI becomes primary search method"
      ]
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Low Operating Costs",
      description: "Minimal fees and maximum profit retention compared to major platforms.",
      details: [
        "Only $50 annual membership fee",
        "No per-booking commissions",
        "No hidden fees or surprise charges",
        "Keep 100% of direct booking revenue"
      ]
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Niche Market Advantage",
      description: "Stand out in the specialized treehouse market with targeted marketing.",
      details: [
        "Specialized treehouse-focused audience",
        "Reduced competition from generic rentals",
        "Higher conversion rates from qualified leads",
        "Premium positioning in unique accommodation space"
      ]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Quality Guest Vetting",
      description: "Our application process ensures only serious, respectful guests reach your property.",
      details: [
        "Pre-screened guest applications",
        "Quality over quantity approach",
        "Reduced property damage risk",
        "Better guest-to-host matching"
      ]
    }
  ]

  const requirements = [
    "Unique architectural design or exceptional location",
    "Professional photography showcasing the property",
    "Minimum 4.5-star rating on existing platforms",
    "Commitment to providing exceptional guest experiences",
    "Responsive communication and guest service",
    "Safety compliance and proper insurance coverage"
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Application Modal */}
      {showApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Apply to List Your Treehouse</h2>
                <button 
                  onClick={() => setShowApplication(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Application Process</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>Submit your property details and photos</li>
                    <li>Our team will review your application</li>
                    <li>Schedule a virtual property tour</li>
                    <li>Receive approval and onboarding materials</li>
                    <li>Start earning premium rates!</li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">What You'll Need</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>High-quality photos of your treehouse</li>
                    <li>Property description and amenities</li>
                    <li>Location details and access instructions</li>
                    <li>Insurance and safety documentation</li>
                    <li>Previous guest reviews (if available)</li>
                  </ul>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={handleApplyToHost}
                    className="flex-1 bg-forest-600 text-white py-3 rounded-lg font-semibold hover:bg-forest-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Mail size={18} />
                    Start Application
                  </button>
                  <button 
                    onClick={handleScheduleCall}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone size={18} />
                    Schedule Call
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Learn More Modal */}
      {showLearnMore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Learn More About Our Platform</h2>
                <button 
                  onClick={() => setShowLearnMore(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Our Mission</h3>
                  <p className="text-gray-700">
                    We connect exceptional treehouse owners with discerning travelers who value unique, 
                    high-quality experiences. Our curated platform ensures only the finest properties 
                    make it to our network.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Why Choose Treehouse Stays?</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li><strong>Premium Pricing:</strong> Earn up to 30% more than other platforms</li>
                    <li><strong>Quality Guests:</strong> Vetted travelers who respect your property</li>
                    <li><strong>Full Support:</strong> 24/7 assistance and marketing support</li>
                    <li><strong>Exclusive Network:</strong> Join a community of top-tier hosts</li>
                    <li><strong>Easy Management:</strong> Streamlined booking and communication</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Success Stories</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 italic">
                      "Since joining Treehouse Stays, we've increased our revenue by 45% and 
                      consistently receive higher-quality guests who truly appreciate our unique property."
                    </p>
                    <p className="text-sm text-gray-600 mt-2">- Sarah & Mike, Oregon Treehouse Owners</p>
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={handleApplyToHost}
                    className="flex-1 bg-forest-600 text-white py-3 rounded-lg font-semibold hover:bg-forest-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Mail size={18} />
                    Get Started
                  </button>
                  <button 
                    onClick={() => setShowLearnMore(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-forest-50 to-primary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Share Your <span className="text-forest-600">Treehouse</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8">
              Join our exclusive network of exceptional treehouse owners and earn premium rates 
              from discerning travelers who value unique experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleApplyToHost}
                className="bg-forest-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-forest-700 transition-colors"
              >
                Apply to List Your Property
              </button>
              <button 
                onClick={handleLearnMore}
                className="bg-white text-forest-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-forest-600"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why List with Treehouse Stays?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our exclusive platform connects you with premium travelers and provides 
              the tools you need to maximize your treehouse's potential.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mb-4 text-forest-600">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 mb-4">{benefit.description}</p>
                <ul className="space-y-2">
                  {benefit.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start">
                      <Check className="w-4 h-4 text-forest-600 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Discoverability Section */}
      <section className="bg-gradient-to-r from-forest-600 to-primary-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Future-Proof Your Business with AI
            </h2>
            <p className="text-xl text-forest-100 max-w-3xl mx-auto">
              As AI becomes the primary way people discover travel accommodations, 
              being part of a specialized niche platform gives you a significant advantage.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">AI Assistant Recommendations</h3>
              <p className="text-forest-100 mb-6">
                When travelers ask AI assistants like ChatGPT or Claude for "unique treehouse stays," 
                our specialized platform gets recommended over generic rental sites.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-white">
                  <Check className="w-5 h-5 text-forest-200 mr-3 flex-shrink-0" />
                  <span>Featured in AI travel planning conversations</span>
                </li>
                <li className="flex items-center text-white">
                  <Check className="w-5 h-5 text-forest-200 mr-3 flex-shrink-0" />
                  <span>Niche market positioning for better AI visibility</span>
                </li>
                <li className="flex items-center text-white">
                  <Check className="w-5 h-5 text-forest-200 mr-3 flex-shrink-0" />
                  <span>Specialized category recognition</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Competitive Advantage</h3>
              <p className="text-forest-100 mb-6">
                While generic platforms compete for broad searches, you'll be found 
                when people specifically look for treehouse experiences.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-white">
                  <Check className="w-5 h-5 text-forest-200 mr-3 flex-shrink-0" />
                  <span>Reduced competition from generic rentals</span>
                </li>
                <li className="flex items-center text-white">
                  <Check className="w-5 h-5 text-forest-200 mr-3 flex-shrink-0" />
                  <span>Higher conversion rates from qualified leads</span>
                </li>
                <li className="flex items-center text-white">
                  <Check className="w-5 h-5 text-forest-200 mr-3 flex-shrink-0" />
                  <span>Premium positioning in unique accommodation space</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Communication & Cost Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Direct Communication & Cost Savings</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Build lasting relationships with guests while keeping more of your revenue
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-forest-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-forest-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Direct Guest Relationships</h3>
                  <p className="text-gray-600 mb-3">
                    No more platform intermediaries. Communicate directly with your guests and build lasting relationships.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-forest-600 mr-2 flex-shrink-0" />
                      Direct guest contact information
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-forest-600 mr-2 flex-shrink-0" />
                      Personalized guest relationships
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-forest-600 mr-2 flex-shrink-0" />
                      Repeat booking opportunities
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-forest-600 mr-2 flex-shrink-0" />
                      Custom pricing and packages
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-forest-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-forest-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Maximum Revenue Retention</h3>
                  <p className="text-gray-600 mb-3">
                    Keep more of your hard-earned money with our low-cost model compared to major platforms.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-semibold text-gray-900">Major Platforms</div>
                        <div className="text-red-600">15-20% commission</div>
                        <div className="text-red-600">+ Service fees</div>
                        <div className="text-red-600">+ Processing fees</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Treehouse Stays</div>
                        <div className="text-green-600">$50/year only</div>
                        <div className="text-green-600">No commissions</div>
                        <div className="text-green-600">Keep 100% of bookings</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-forest-50 to-primary-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Revenue Comparison</h3>
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">Monthly Revenue: $5,000</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Major Platform (15% commission)</span>
                      <span className="text-red-600">-$750</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Treehouse Stays ($50/year)</span>
                      <span className="text-green-600">-$4.17</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Net Revenue Difference</span>
                        <span className="text-green-600">+$745.83/month</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-forest-600 mb-2">$8,950</div>
                  <div className="text-gray-600">Additional annual revenue</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">
              See how our hosts have transformed their treehouse businesses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">+45%</div>
                  <div className="text-sm text-gray-600">Revenue Increase</div>
                </div>
              </div>
              <p className="text-gray-600">
                "Since joining Treehouse Stays, we've seen a 45% increase in revenue and 
                consistently higher-quality guests who truly appreciate our unique property."
              </p>
              <div className="mt-4 text-sm font-medium text-gray-900">- Sarah & Mike, Oregon</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <Star className="w-8 h-8 text-yellow-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">4.9★</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
              </div>
              <p className="text-gray-600">
                "The guests we get through Treehouse Stays are incredible. They're respectful, 
                appreciative, and often become repeat visitors. Our ratings have never been higher."
              </p>
              <div className="mt-4 text-sm font-medium text-gray-900">- David, North Carolina</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <Users className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">85%</div>
                  <div className="text-sm text-gray-600">Repeat Bookings</div>
                </div>
              </div>
              <p className="text-gray-600">
                "The exclusive nature of the platform attracts guests who are serious about 
                unique experiences. We've built lasting relationships with many of our guests."
              </p>
              <div className="mt-4 text-sm font-medium text-gray-900">- Emma, California</div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Requirements</h2>
            <p className="text-xl text-gray-600">
              We maintain high standards to ensure exceptional experiences for our guests
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="space-y-4">
              {requirements.map((requirement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-forest-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{requirement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="bg-forest-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Ready to Get Started?</h2>
          <p className="text-xl text-forest-100 mb-8">
            Join our exclusive network and start earning premium rates from quality travelers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleEmailContact}
              className="bg-white text-forest-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <Mail size={20} />
              Submit Application
            </button>
            <button 
              onClick={handleScheduleCall}
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-forest-600 transition-colors flex items-center justify-center gap-2"
            >
              <Phone size={20} />
              Schedule Consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
