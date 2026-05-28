import Link from 'next/link'
import Image from 'next/image'
import { DESTINATIONS } from '@/lib/home-content'

export default function DestinationGrid() {
  return (
    <section className="py-16 md:py-24 bg-forest-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 md:mb-12">
        <p className="text-amber-warm/80 text-sm tracking-widest uppercase mb-2">Destinations</p>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight">
          Explore by place
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {DESTINATIONS.map((dest, i) => (
            <Link
              key={dest.id}
              href={dest.href}
              className={`group relative overflow-hidden rounded-2xl md:rounded-3xl ${
                i === 0 ? 'col-span-2 row-span-2 aspect-square md:aspect-auto md:min-h-[320px]' : 'aspect-[4/5]'
              }`}
            >
              <Image
                src={dest.image}
                alt={dest.name}
                fill
                className="object-cover image-hover-zoom"
                sizes={i === 0 ? '(max-width: 768px) 100vw, 40vw' : '(max-width: 768px) 50vw, 20vw'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                <h3
                  className={`font-serif text-white ${
                    i === 0 ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'
                  }`}
                >
                  {dest.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
