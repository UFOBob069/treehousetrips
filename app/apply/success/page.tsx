import { CheckCircle, Mail, Phone, Clock } from 'lucide-react'
import Link from 'next/link'

export default function ApplySuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted Successfully!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your interest in joining Treehouse Stays. We've received your application and payment.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">What Happens Next?</h2>
            <div className="space-y-4 text-left">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-forest-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-forest-600">1</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Application Review</h3>
                  <p className="text-gray-600 text-sm">Our team will review your application within 2-3 business days.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-forest-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-forest-600">2</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Virtual Property Tour</h3>
                  <p className="text-gray-600 text-sm">If approved, we'll schedule a virtual tour of your property.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-forest-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-forest-600">3</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Onboarding</h3>
                  <p className="text-gray-600 text-sm">Receive your welcome package and start earning premium rates!</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
            <p className="text-blue-700 text-sm mb-4">
              If you have any questions about your application, don't hesitate to reach out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:applications@treehousetrips.com"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Mail size={16} />
                Email Support
              </a>
              <a
                href="tel:+1-555-TREEHOUSE"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Phone size={16} />
                Call Us
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-forest-600 text-white rounded-lg hover:bg-forest-700 transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/properties"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

