import Link from 'next/link'
import { Star, Shield, Users, Heart } from 'lucide-react'
import { ui } from '@/lib/app-ui'

export default function AboutPage() {
  const values = [
    {
      icon: <Star className="h-7 w-7" />,
      title: 'Curated excellence',
      description:
        'Every property is personally inspected and vetted by our team to ensure exceptional quality and unique experiences.',
    },
    {
      icon: <Shield className="h-7 w-7" />,
      title: 'Trusted network',
      description:
        'We work with verified hosts who share our commitment to outstanding hospitality.',
    },
    {
      icon: <Users className="h-7 w-7" />,
      title: 'Curated selection',
      description:
        'Our careful curation ensures every property offers a unique and authentic treehouse experience.',
    },
    {
      icon: <Heart className="h-7 w-7" />,
      title: 'Passion for trees',
      description:
        'We believe in the magic of treehouses and their ability to reconnect us with nature in the most beautiful way.',
    },
  ]

  const curationSteps = [
    {
      title: 'Initial discovery',
      copy: 'We discover potential properties through extensive research, host networks, and recommendations from our community.',
    },
    {
      title: 'Personal inspection',
      copy: 'Every property is personally visited by our team to assess quality, safety, and the authentic treehouse experience.',
    },
    {
      title: 'Host vetting',
      copy: 'We thoroughly vet each host to ensure they share our commitment to exceptional hospitality and guest experience.',
    },
    {
      title: 'Ongoing monitoring',
      copy: 'We continuously monitor guest feedback and property quality to ensure our standards are maintained.',
    },
  ]

  return (
    <div className="min-h-screen">
      <section className="border-b border-stone-200/60 bg-gradient-to-b from-forest-50/80 to-cream py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className={`${ui.label} mb-4`}>Our story</p>
          <h1 className="font-serif text-4xl tracking-tight text-forest-950 md:text-5xl lg:text-6xl">
            About Treehouse Trips
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-stone-600 md:text-xl">
            We help travelers discover extraordinary treehouse stays — curated, personal, and rooted in
            a love of the canopy.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className={`${ui.headingSection} mb-8 text-2xl md:text-3xl`}>Our story</h2>

          <div className="space-y-6 text-base leading-relaxed text-stone-700 md:text-lg">
            <p>
              Treehouse Trips was born from a simple belief: that everyone deserves to experience the magic
              of sleeping among the treetops. After years of searching for exceptional treehouse rentals and
              often being disappointed by the quality and authenticity of what was available, we decided to
              create a platform that would help travelers find truly special treehouse experiences.
            </p>
            <p>
              Our founder, a lifelong treehouse enthusiast and hospitality industry veteran, spent two years
              personally visiting and vetting treehouse properties around the world. From luxury eco-retreats
              in Costa Rica to rustic cabins in the Pacific Northwest, each property was carefully evaluated
              for quality, uniqueness, and the genuine treehouse experience it offered.
            </p>
            <p>
              Today, Treehouse Trips connects travelers with exceptional treehouse properties. Visitors enjoy
              hand-selected listings, direct communication with hosts, and the peace of mind that comes from
              knowing every property has been vetted for quality and authenticity.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-stone-200/60 bg-cream-dark py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center md:mb-16">
            <p className={`${ui.label} mb-2`}>What we stand for</p>
            <h2 className="font-serif text-3xl tracking-tight text-forest-950 md:text-4xl">Our values</h2>
            <p className="mx-auto mt-4 max-w-2xl text-stone-600">
              These principles guide everything we do and every property we select.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className={`${ui.iconBox} mx-auto mb-4 h-14 w-14 rounded-full`}>{value.icon}</div>
                <h3 className="font-serif text-xl text-forest-950">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-600 md:text-base">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className={`${ui.label} mb-2`}>Quality first</p>
            <h2 className="font-serif text-3xl tracking-tight text-forest-950 md:text-4xl">
              Our curation process
            </h2>
          </div>

          <div className="space-y-8">
            {curationSteps.map((step, index) => (
              <div key={step.title} className="flex items-start gap-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-800 font-serif text-sm text-white">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-serif text-xl text-forest-950">{step.title}</h3>
                  <p className="mt-2 leading-relaxed text-stone-600">{step.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-forest-950 py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl tracking-tight text-white md:text-4xl">
            Ready to experience the extraordinary?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-stone-300">
            Start your journey and discover treehouse rentals that create memories to last a lifetime.
          </p>
          <Link href="/properties" className={`${ui.btnPrimary} mt-8 bg-white text-forest-900 hover:bg-cream`}>
            Search properties
          </Link>
        </div>
      </section>
    </div>
  )
}
