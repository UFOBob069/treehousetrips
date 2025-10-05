import { Star, Shield, Users, Heart } from 'lucide-react'

export default function AboutPage() {
  const values = [
    {
      icon: <Star className="w-8 h-8" />,
      title: "Curated Excellence",
      description: "Every property is personally inspected and vetted by our team to ensure exceptional quality and unique experiences."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Trusted Network",
      description: "We work exclusively with verified hosts who share our commitment to providing outstanding hospitality."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Curated Selection",
      description: "Our careful curation ensures every property offers a unique and authentic treehouse experience."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Passion for Trees",
      description: "We believe in the magic of treehouses and their ability to reconnect us with nature in the most beautiful way."
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-forest-50 to-primary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-forest-600">Treehouse Trips</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto">
              We're passionate about helping travelers discover extraordinary treehouse experiences 
              that create unforgettable memories and stories to last a lifetime.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Story</h2>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              Treehouse Trips was born from a simple belief: that everyone deserves to experience the magic of sleeping among the treetops. 
              After years of searching for exceptional treehouse rentals and often being disappointed by the quality and authenticity of what was available, 
              we decided to create a platform that would help travelers find truly special treehouse experiences.
            </p>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              Our founder, a lifelong treehouse enthusiast and hospitality industry veteran, spent two years personally visiting and vetting treehouse properties 
              around the world. From luxury eco-retreats in Costa Rica to rustic cabins in the Pacific Northwest, each property was carefully evaluated for 
              quality, uniqueness, and the genuine treehouse experience it offered.
            </p>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              Today, Treehouse Trips operates as a curated platform that connects travelers with exceptional treehouse properties. 
              Our visitors enjoy access to hand-selected properties, direct communication with hosts, and the peace of mind that comes from knowing 
              every property has been personally vetted for quality and authenticity.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do and every property we select.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center text-forest-600 mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Curation Process */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Curation Process</h2>
          
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-8 h-8 bg-forest-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Initial Discovery</h3>
                <p className="text-gray-600">
                  We discover potential properties through extensive research, host networks, and recommendations from our community.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-8 h-8 bg-forest-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Personal Inspection</h3>
                <p className="text-gray-600">
                  Every property is personally visited by our team to assess quality, safety, and the authentic treehouse experience.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-8 h-8 bg-forest-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Host Vetting</h3>
                <p className="text-gray-600">
                  We thoroughly vet each host to ensure they share our commitment to exceptional hospitality and guest experience.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-8 h-8 bg-forest-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ongoing Monitoring</h3>
                <p className="text-gray-600">
                  We continuously monitor guest feedback and property quality to ensure our standards are maintained.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-forest-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Experience the Extraordinary?
          </h2>
          <p className="text-xl text-forest-100 mb-8">
            Start your journey and discover treehouse rentals that will create memories to last a lifetime.
          </p>
          <a
            href="/properties"
            className="inline-block bg-white text-forest-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Search Properties
          </a>
        </div>
      </section>
    </div>
  )
}
