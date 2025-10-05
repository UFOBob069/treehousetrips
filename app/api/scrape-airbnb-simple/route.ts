import { NextRequest, NextResponse } from 'next/server'
import { JSDOM } from 'jsdom'

interface ScrapedListing {
  title: string
  description: string
  location: string
  price: number
  images: string[]
  guests: number
  bedrooms: number
  bathrooms: number
  amenities: string[]
  hostName: string
  hostAvatar: string
  rating: number
  reviewCount: number
  lat?: number
  lng?: number
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    
    if (!url || !url.includes('airbnb.com')) {
      return NextResponse.json(
        { error: 'Invalid Airbnb URL' },
        { status: 400 }
      )
    }

    // Use fetch instead of Puppeteer for better compatibility
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const html = await response.text()
    
    // Parse with JSDOM
    const dom = new JSDOM(html)
    const document = dom.window.document
    
    // Try to extract from JSON-LD structured data first
    const jsonLdData = extractFromJsonLd(html)
    console.log('JSON-LD Data found:', jsonLdData)
    
    // Extract listing data
    const scrapedData: ScrapedListing = {
      title: jsonLdData.title || extractTitle(document),
      description: jsonLdData.description || extractDescription(document),
      location: jsonLdData.location || extractLocation(document),
      price: extractPrice(document),
      images: jsonLdData.images || extractImages(document),
      guests: extractGuests(document),
      bedrooms: extractBedrooms(document),
      bathrooms: extractBathrooms(document),
      amenities: extractAmenities(document),
      hostName: extractHostName(document),
      hostAvatar: extractHostAvatar(document),
      rating: jsonLdData.rating || extractRating(document),
      reviewCount: jsonLdData.reviewCount || extractReviewCount(document),
      lat: jsonLdData.lat || extractLatitude(document),
      lng: jsonLdData.lng || extractLongitude(document)
    }
    
    return NextResponse.json({ data: scrapedData })
    
  } catch (error) {
    console.error('Scraping error:', error)
    return NextResponse.json(
      { error: 'Failed to scrape Airbnb listing. Please try again or enter details manually.' },
      { status: 500 }
    )
  }
}

// Helper function to extract from JSON-LD structured data
function extractFromJsonLd(html: string): Partial<ScrapedListing> {
  try {
    // Find JSON-LD script tags
    const jsonLdMatches = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)
    
    if (!jsonLdMatches) {
      return {}
    }
    
    for (const match of jsonLdMatches) {
      try {
        // Extract JSON content
        const jsonMatch = match.match(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/s)
        if (!jsonMatch) continue
        
        const jsonContent = jsonMatch[1].trim()
        const data = JSON.parse(jsonContent)
        
        // Check if this is a VacationRental or Product
        if (data['@type'] === 'VacationRental' || data['@type'] === 'Product') {
          const result: Partial<ScrapedListing> = {}
          
          if (data.name) result.title = data.name
          if (data.image && Array.isArray(data.image)) result.images = data.image
          if (data.address) {
            console.log('JSON-LD address data:', data.address)
            // Build full location from address components
            const locationParts = []
            if (data.address.addressLocality) locationParts.push(data.address.addressLocality)
            if (data.address.addressRegion) locationParts.push(data.address.addressRegion)
            if (data.address.addressCountry) locationParts.push(data.address.addressCountry)
            
            if (locationParts.length > 0) {
              result.location = locationParts.join(', ')
              console.log('Found location from JSON-LD address:', result.location)
            } else {
              console.log('JSON-LD address found but no components extracted')
            }
          } else {
            console.log('No address found in JSON-LD data')
          }
          
          // If we only got city, try to find full location in the HTML
          if (result.location && result.location.split(',').length === 1) {
            console.log('Only got city from JSON-LD, will try HTML fallback')
          }
          if (data.aggregateRating) {
            result.rating = data.aggregateRating.ratingValue
            result.reviewCount = parseInt(data.aggregateRating.ratingCount)
          }
          if (data.description) result.description = data.description
          if (data.latitude && data.longitude) {
            result.lat = data.latitude
            result.lng = data.longitude
          }
          
          return result
        }
      } catch (parseError) {
        continue
      }
    }
    
    return {}
  } catch (error) {
    return {}
  }
}

// Helper functions to extract data
function extractTitle(document: Document): string {
  // Try multiple selectors for title
  const selectors = [
    'h1[data-testid="listing-title"]',
    'h1._14i3z6h',
    'h1[class*="title"]',
    'h1',
    'title'
  ]
  
  for (const selector of selectors) {
    const element = document.querySelector(selector)
    if (element?.textContent?.trim()) {
      let title = element.textContent.trim()
      
      // Split title and location if they're combined
      // Pattern: "Property Name - Treehouses for Rent in Location"
      const titleLocationMatch = title.match(/^(.+?)\s*-\s*Treehouses for Rent in (.+)$/)
      if (titleLocationMatch) {
        // Return just the property name (first part)
        return titleLocationMatch[1].trim()
      }
      
      // Pattern: "Property Name - Location"
      const simpleMatch = title.match(/^(.+?)\s*-\s*(.+)$/)
      if (simpleMatch) {
        // Check if the second part looks like a location (contains commas or common location words)
        const secondPart = simpleMatch[2].trim()
        if (secondPart.includes(',') || 
            secondPart.includes('Texas') || 
            secondPart.includes('United States') ||
            secondPart.includes('State') ||
            secondPart.includes('Country')) {
          // Return just the property name
          return simpleMatch[1].trim()
        }
      }
      
      return title
    }
  }
  
  return 'Untitled Property'
}

function extractDescription(document: Document): string {
  const selectors = [
    '[data-testid="listing-description"]',
    '._1y6fhhr',
    '[class*="description"]',
    'meta[name="description"]'
  ]
  
  for (const selector of selectors) {
    const element = document.querySelector(selector)
    if (element) {
      const text = element.textContent?.trim() || element.getAttribute('content')
      if (text && text.length > 10) {
        return text
      }
    }
  }
  
  return 'No description available'
}

function extractLocation(document: Document): string {
  const selectors = [
    '.s1qk96pm', // Current Airbnb location class
    '[data-testid="listing-location"]',
    '._1y6fhhr',
    '[class*="location"]',
    'h2'
  ]
  
  for (const selector of selectors) {
    const element = document.querySelector(selector)
    if (element?.textContent?.trim()) {
      return element.textContent.trim()
    }
  }
  
  // Fallback: look in title area for location
  const titleElements = document.querySelectorAll('h1, h2, h3')
  for (const element of titleElements) {
    const text = element.textContent?.trim() || ''
    
    // Pattern: "Property Name - Treehouses for Rent in Location"
    const titleLocationMatch = text.match(/^(.+?)\s*-\s*Treehouses for Rent in (.+)$/)
    if (titleLocationMatch) {
      return titleLocationMatch[2].trim()
    }
    
    // Pattern: "Property Name - Location" (check if second part looks like location)
    const simpleMatch = text.match(/^(.+?)\s*-\s*(.+)$/)
    if (simpleMatch) {
      const secondPart = simpleMatch[2].trim()
      if (secondPart.includes(',') || 
          secondPart.includes('Texas') || 
          secondPart.includes('United States') ||
          secondPart.includes('State') ||
          secondPart.includes('Country')) {
        return secondPart
      }
    }
  }
  
  return 'Location not specified'
}

function extractPrice(document: Document): number {
  const selectors = [
    '[data-testid="price"]',
    '._1y6fhhr',
    '[class*="price"]',
    '[class*="cost"]'
  ]
  
  for (const selector of selectors) {
    const element = document.querySelector(selector)
    if (element?.textContent) {
      const priceMatch = element.textContent.match(/[\d,]+/)
      if (priceMatch) {
        return parseInt(priceMatch[0].replace(/,/g, ''))
      }
    }
  }
  
  return 0
}

function extractImages(document: Document): string[] {
  const images: string[] = []
  
  // Try multiple selectors for images
  const selectors = [
    'img[data-original-uri*="muscache.com"]', // Original URI with muscache (highest quality)
    'img[src*="muscache.com"]', // Current Airbnb image hosting
    'img[class*="i33bb1j"]', // Current Airbnb image class
    'img[fetchpriority="high"]', // High priority images
    'img[elementtiming="LCP-target"]', // Largest contentful paint images
    'img[data-original-uri]', // Images with original URI
    'img[data-testid="listing-image"]',
    'img[class*="image"]',
    'img[src*="airbnb"]',
    'img'
  ]
  
  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector)
    elements.forEach(img => {
      // Prioritize data-original-uri (higher quality), then src
      const originalUri = img.getAttribute('data-original-uri')
      const src = img.getAttribute('src')
      
      // Use original-uri if available and it's from muscache.com
      if (originalUri && originalUri.includes('muscache.com')) {
        images.push(originalUri)
      }
      // Fallback to src if it's from muscache.com
      else if (src && src.includes('muscache.com')) {
        images.push(src)
      }
      // Accept other Airbnb images as fallback
      else if (src && 
          !src.includes('data:image') && 
          !src.includes('placeholder') &&
          !src.includes('icon') &&
          !src.includes('logo') &&
          (src.includes('airbnb') || src.includes('muscache'))) {
        images.push(src)
      }
    })
    
    if (images.length > 0) break
  }
  
  return [...new Set(images)].slice(0, 10) // Remove duplicates and limit to 10
}

function extractGuests(document: Document): number {
  const capacityText = document.body.textContent || ''
  const match = capacityText.match(/(\d+)\s*guests?/i)
  return match ? parseInt(match[1]) : 2 // Default to 2 guests
}

function extractBedrooms(document: Document): number {
  const capacityText = document.body.textContent || ''
  const match = capacityText.match(/(\d+)\s*bedrooms?/i)
  return match ? parseInt(match[1]) : 1 // Default to 1 bedroom
}

function extractBathrooms(document: Document): number {
  const capacityText = document.body.textContent || ''
  const match = capacityText.match(/(\d+)\s*bathrooms?/i)
  return match ? parseInt(match[1]) : 1 // Default to 1 bathroom
}

function extractAmenities(document: Document): string[] {
  const amenities: string[] = []
  
  // Common amenities to look for
  const commonAmenities = [
    'WiFi', 'Kitchen', 'Parking', 'Pool', 'Hot tub', 'Air conditioning',
    'Heating', 'Washer', 'Dryer', 'TV', 'Cable TV', 'Internet',
    'Laptop friendly workspace', 'Pets allowed', 'Smoking allowed'
  ]
  
  const bodyText = document.body.textContent?.toLowerCase() || ''
  
  commonAmenities.forEach(amenity => {
    if (bodyText.includes(amenity.toLowerCase())) {
      amenities.push(amenity)
    }
  })
  
  return amenities.slice(0, 10) // Limit to 10 amenities
}

function extractHostName(document: Document): string {
  const selectors = [
    '[data-testid="host-name"]',
    '[class*="host"]',
    '[class*="owner"]'
  ]
  
  for (const selector of selectors) {
    const element = document.querySelector(selector)
    if (element?.textContent?.trim()) {
      return element.textContent.trim()
    }
  }
  
  return 'Host'
}

function extractHostAvatar(document: Document): string {
  const selectors = [
    '[data-testid="host-avatar"] img',
    '[class*="host"] img',
    '[class*="avatar"] img'
  ]
  
  for (const selector of selectors) {
    const element = document.querySelector(selector)
    const src = element?.getAttribute('src')
    if (src && !src.includes('data:image')) {
      return src
    }
  }
  
  return ''
}

function extractRating(document: Document): number {
  // Try to find rating in various places
  const selectors = [
    '[data-testid="listing-rating"]',
    '[class*="rating"]',
    '[aria-label*="rating"]',
    '[aria-label*="stars"]'
  ]
  
  for (const selector of selectors) {
    const element = document.querySelector(selector)
    if (element) {
      const text = element.textContent || element.getAttribute('aria-label') || ''
      const match = text.match(/(\d+\.?\d*)/)
      if (match) {
        return parseFloat(match[1])
      }
    }
  }
  
  // Fallback: search in body text
  const ratingText = document.body.textContent || ''
  const match = ratingText.match(/(\d+\.?\d*)\s*(?:stars?|rating)/i)
  return match ? parseFloat(match[1]) : 0
}

function extractReviewCount(document: Document): number {
  // Try to find review count in various places
  const selectors = [
    '[data-testid="listing-reviews"]',
    '[class*="review"]',
    '[aria-label*="review"]'
  ]
  
  for (const selector of selectors) {
    const element = document.querySelector(selector)
    if (element) {
      const text = element.textContent || element.getAttribute('aria-label') || ''
      const match = text.match(/(\d+)/)
      if (match) {
        return parseInt(match[1])
      }
    }
  }
  
  // Fallback: search in body text
  const reviewText = document.body.textContent || ''
  const match = reviewText.match(/(\d+)\s*reviews?/i)
  return match ? parseInt(match[1]) : 0
}

function extractLatitude(document: Document): number | undefined {
  const latElement = document.querySelector('meta[property="airbnb:latitude"]') ||
                    document.querySelector('meta[name="latitude"]')
  
  const latText = latElement?.getAttribute('content')
  return latText ? parseFloat(latText) : undefined
}

function extractLongitude(document: Document): number | undefined {
  const lngElement = document.querySelector('meta[property="airbnb:longitude"]') ||
                    document.querySelector('meta[name="longitude"]')
  
  const lngText = lngElement?.getAttribute('content')
  return lngText ? parseFloat(lngText) : undefined
}
