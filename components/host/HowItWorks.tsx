import { HOW_IT_WORKS } from '@/lib/host-content'

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-cream-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-moss text-sm tracking-widest uppercase mb-2">Simple path</p>
          <h2 className="font-serif text-3xl md:text-4xl text-forest-950 tracking-tight">
            How it works
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-10 max-w-5xl mx-auto">
          {HOW_IT_WORKS.map((step) => (
            <div key={step.step} className="text-center md:text-left">
              <span className="font-serif text-4xl text-forest-800/25">{step.step}</span>
              <h3 className="mt-2 font-serif text-xl md:text-2xl text-forest-950">{step.title}</h3>
              <p className="mt-3 text-stone-600 text-sm md:text-base leading-relaxed">
                {step.copy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
