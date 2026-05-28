import Image from 'next/image'

interface CinematicBreakSectionProps {
  image: string
  quote: string
}

export default function CinematicBreakSection({ image, quote }: CinematicBreakSectionProps) {
  return (
    <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden">
      <Image
        src={image}
        alt=""
        fill
        className="object-cover home-ken-burns"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-forest-950/50" />
      <blockquote className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <p className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-snug tracking-tight italic">
          &ldquo;{quote}&rdquo;
        </p>
      </blockquote>
    </section>
  )
}
