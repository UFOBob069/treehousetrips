import MembershipSection from '@/components/MembershipSection'

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Become a <span className="text-forest-600">Premium Member</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our exclusive community and gain access to the world's most exceptional treehouse rentals.
          </p>
        </div>
      </div>
      
      <MembershipSection />
      
      {/* FAQ Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How does the membership work?
              </h3>
              <p className="text-gray-600">
                For $50/year, you get exclusive access to our curated collection of treehouse properties. 
                All bookings are still processed through Airbnb, but you get priority access and direct host communication.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I cancel my membership?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your membership at any time. Your access will remain active until the end of your current billing period.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What makes these properties exclusive?
              </h3>
              <p className="text-gray-600">
                Each property is personally vetted by our team for exceptional quality, unique features, and outstanding host service. 
                Many are not publicly listed or have limited availability.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How do I book a property?
              </h3>
              <p className="text-gray-600">
                Once you're a member, you can browse our exclusive properties and book directly through Airbnb using the provided links. 
                You'll also have access to direct host communication for special requests.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
