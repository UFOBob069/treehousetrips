import propertiesData from '@/data/properties.json'
import type { BrowseProperty } from '@/lib/property-browse'
import { BREAK_SECTIONS } from '@/lib/home-content'
import HeroSection from './HeroSection'
import CollectionCarousel from './CollectionCarousel'
import FeaturedStays from './FeaturedStays'
import DestinationGrid from './DestinationGrid'
import EditorialStorySection from './EditorialStorySection'
import CinematicBreakSection from './CinematicBreakSection'
import SeasonalCollections from './SeasonalCollections'
import TravelerMoments from './TravelerMoments'
import HomeCTA from './HomeCTA'

const properties = propertiesData as BrowseProperty[]

export default function HomePage() {
  return (
    <div className="bg-cream -mt-px">
      <HeroSection />
      <CollectionCarousel />
      <FeaturedStays properties={properties} />
      <CinematicBreakSection
        image={BREAK_SECTIONS[0].image}
        quote={BREAK_SECTIONS[0].quote}
      />
      <DestinationGrid />
      <EditorialStorySection />
      <SeasonalCollections />
      <CinematicBreakSection
        image={BREAK_SECTIONS[1].image}
        quote={BREAK_SECTIONS[1].quote}
      />
      <TravelerMoments />
      <HomeCTA />
    </div>
  )
}
