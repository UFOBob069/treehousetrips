import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-forest-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          <div className="max-w-sm">
            <Link href="/" className="font-serif text-2xl text-white tracking-tight">
              Treehouse Trips
            </Link>
            <p className="mt-4 text-sm text-white/60 leading-relaxed">
              Curated canopy escapes for those who seek wonder above the forest floor.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-10 gap-y-4 text-sm">
            <Link href="/properties" className="text-white/70 hover:text-white transition-colors">
              Explore stays
            </Link>
            <Link href="/create" className="text-white/70 hover:text-white transition-colors">
              List your treehouse
            </Link>
            <Link href="/about" className="text-white/70 hover:text-white transition-colors">
              About
            </Link>
          </nav>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Treehouse Trips</p>
          <p className="max-w-md">
            Bookings are processed through Airbnb. We are not responsible for booking transactions.
          </p>
        </div>
      </div>
    </footer>
  )
}
