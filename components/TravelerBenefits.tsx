import { MapPin, Star, Shield, Heart, Users, Camera } from 'lucide-react'

export default function TravelerBenefits() {
  const benefits = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Unique Locations",
      description: "Discover treehouses in breathtaking locations you never knew existed, from mountain peaks to forest canopies."
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Verified Quality",
      description: "Every property is personally inspected by our team to ensure exceptional quality and authentic treehouse experiences."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Safe & Secure",
      description: "All bookings are processed through trusted platforms with full insurance coverage and safety compliance."
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Memorable Experiences",
      description: "Create unforgettable memories with family and friends in some of the world's most unique accommodations."
    }
  ]

  const experiences = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Instagram-Worthy",
      description: "Every treehouse offers stunning photo opportunities and unique architectural features."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Perfect for Groups",
      description: "From romantic getaways to family adventures, find the perfect treehouse for your group size."
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-forest-50 to-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose <span className="text-forest-600">Treehouse Trips?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're passionate about connecting travelers with extraordinary treehouse experiences 
            that create lasting memories and stories to tell for years to come.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-forest-600 mx-auto mb-4 shadow-sm">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Experience Highlights */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Perfect for Every Occasion</h3>
            <p className="text-gray-600">Whether you're planning a romantic escape or a family adventure</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {experiences.map((experience, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-forest-100 rounded-lg flex items-center justify-center text-forest-600">
                  {experience.icon}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{experience.title}</h4>
                  <p className="text-gray-600">{experience.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <a
              href="/properties"
              className="bg-forest-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-forest-700 transition-colors"
            >
              Browse All Properties
            </a>
            <a
              href="/about"
              className="bg-white text-forest-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-forest-600"
            >
              Learn Our Story
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

