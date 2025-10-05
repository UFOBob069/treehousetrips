import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-forest-50 to-primary-50 min-h-screen flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            Escape to the
            <span className="block text-forest-600">Treetops</span>
            <span className="block">Unforgettable Adventures Await</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover hand-picked treehouse escapes that offer unique experiences, 
            breathtaking views, and memories that last a lifetime.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              href="/properties"
              className="bg-forest-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-forest-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              Browse Properties
              <ArrowRight size={20} />
            </Link>
            
            <Link 
              href="/create"
              className="bg-white text-forest-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-forest-600 flex items-center gap-2"
            >
              List Your Treehouse
              <Star size={20} />
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-forest-600 mb-2">50+</div>
              <div className="text-gray-600">Unique Properties</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-forest-600 mb-2">100%</div>
              <div className="text-gray-600">Verified Quality</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-forest-600 mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
