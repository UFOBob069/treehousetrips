import Image from 'next/image'
import { STORIES } from '@/lib/home-content'

export default function EditorialStorySection() {
  return (
    <section className="py-16 md:py-28 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 md:mb-16 text-center md:text-left">
        <p className="text-moss text-sm tracking-widest uppercase mb-2">Why treehouse stays</p>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-forest-950 tracking-tight max-w-2xl mx-auto md:mx-0">
          More than a place to sleep
        </h2>
      </div>

      <div className="space-y-16 md:space-y-24">
        {STORIES.map((story, i) => {
          const reversed = i % 2 === 1
          return (
            <div
              key={story.title}
              className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8 md:gap-12 items-center ${
                reversed ? 'md:flex-row-reverse' : 'md:flex-row'
              }`}
            >
              <div className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-[5/4] rounded-3xl overflow-hidden shadow-[0_24px_60px_rgba(26,43,26,0.12)]">
                <Image
                  src={story.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="w-full md:w-1/2 md:py-8 flex flex-col justify-center">
                <h3 className="font-serif text-2xl md:text-4xl text-forest-950 leading-snug tracking-tight">
                  {story.title}
                </h3>
                <p className="mt-4 text-stone-600 text-base md:text-lg leading-relaxed max-w-md">
                  {story.copy}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
