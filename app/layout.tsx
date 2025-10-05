import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Treehouse Trips - Curated Luxury Treehouse Rentals',
  description: 'Discover the world\'s most exclusive, hand-selected treehouse vacation rentals. Invite-only access to the finest treehouse properties.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
