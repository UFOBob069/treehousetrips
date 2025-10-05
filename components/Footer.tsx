export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-forest-400 mb-4">🌲 Treehouse Trips</h3>
            <p className="text-gray-300 mb-4">
              Curated, invite-only access to the world's most exceptional treehouse vacation rentals.
            </p>
            <p className="text-sm text-gray-400">
              All bookings and payments are processed through Airbnb. We are not responsible for booking transactions.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="/create" className="text-gray-300 hover:text-white transition-colors">List Your Treehouse</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-white transition-colors">About</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-gray-300">hello@treehousetrips.com</li>
              <li className="text-gray-300">+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Treehouse Trips. All rights reserved. | 
            <span className="ml-2 text-xs text-gray-500">
              All bookings processed through Airbnb. We are not responsible for booking transactions.
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}
