import propertiesData from '@/data/properties.json'
import PropertiesBrowseClient from '@/components/properties/PropertiesBrowseClient'
import type { BrowseProperty } from '@/lib/property-browse'

const properties = propertiesData as BrowseProperty[]

export default function PropertiesPage() {
  return <PropertiesBrowseClient initialProperties={properties} />
}
