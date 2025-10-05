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
    
    // Extract listing data with detailed logging
    console.log('=== IMPROVED SCRAPER DEBUG ===')
    console.log('URL:', url)
    console.log('HTML Length:', html.length)
    
    // Try to extract from JSON-LD structured data first
    const jsonLdData = extractFromJsonLd(html)
    console.log('JSON-LD Data found:', jsonLdData)
    
    const title = jsonLdData.title || extractTitle(document)
    const location = jsonLdData.location || extractLocation(document)
    const images = jsonLdData.images || extractImages(document)
    
    console.log('Extracted Title:', title)
    console.log('Extracted Location:', location)
    console.log('Extracted Images Count:', images.length)
    console.log('First Image:', images[0])
    
    // Check for specific elements
    const s1qk96pmElements = document.querySelectorAll('.s1qk96pm')
    const i33bb1jElements = document.querySelectorAll('.i33bb1j')
    
    console.log('S1QK96PM Elements Found:', s1qk96pmElements.length)
    s1qk96pmElements.forEach((el, i) => {
      console.log(`S1QK96PM[${i}]:`, el.textContent?.trim())
    })
    
    console.log('I33BB1J Elements Found:', i33bb1jElements.length)
    i33bb1jElements.forEach((el, i) => {
      console.log(`I33BB1J[${i}]:`, {
        src: el.getAttribute('src'),
        dataOriginalUri: el.getAttribute('data-original-uri'),
        className: el.className
      })
    })
    
    const scrapedData: ScrapedListing = {
      title,
      description: jsonLdData.description || extractDescription(document),
      location,
      price: extractPrice(document),
      images,
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
    
    console.log('Final Scraped Data:', {
      title: scrapedData.title,
      location: scrapedData.location,
      imageCount: scrapedData.images.length,
      firstImage: scrapedData.images[0],
      rating: scrapedData.rating,
      reviewCount: scrapedData.reviewCount
    })
    console.log('================================')
    
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
  console.log('=== EXTRACTING FROM JSON-LD ===')
  
  try {
    // Find JSON-LD script tags
    const jsonLdMatches = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)
    
    if (!jsonLdMatches) {
      console.log('No JSON-LD found')
      return {}
    }
    
    console.log(`Found ${jsonLdMatches.length} JSON-LD scripts`)
    
    for (const match of jsonLdMatches) {
      try {
        // Extract JSON content
        const jsonMatch = match.match(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/s)
        if (!jsonMatch) continue
        
        const jsonContent = jsonMatch[1].trim()
        console.log('JSON-LD content preview:', jsonContent.substring(0, 200))
        
        const data = JSON.parse(jsonContent)
        console.log('Parsed JSON-LD:', data)
        
        // Check if this is a VacationRental or Product
        if (data['@type'] === 'VacationRental' || data['@type'] === 'Product') {
          const result: Partial<ScrapedListing> = {}
          
          if (data.name) {
            result.title = data.name
            console.log('Found title:', data.name)
          }
          
          if (data.image && Array.isArray(data.image)) {
            result.images = data.image
            console.log('Found images:', data.image.length)
          }
          
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
            console.log('Found rating:', data.aggregateRating.ratingValue)
            console.log('Found review count:', data.aggregateRating.ratingCount)
          }
          
          if (data.description) {
            result.description = data.description
            console.log('Found description:', data.description.substring(0, 100))
          }
          
          if (data.latitude && data.longitude) {
            result.lat = data.latitude
            result.lng = data.longitude
            console.log('Found coordinates:', data.latitude, data.longitude)
          }
          
          console.log('JSON-LD extraction result:', result)
          return result
        }
      } catch (parseError) {
        console.log('Failed to parse JSON-LD:', parseError)
        continue
      }
    }
    
    console.log('No valid JSON-LD found')
    return {}
  } catch (error) {
    console.log('JSON-LD extraction error:', error)
    return {}
  }
}

// Helper functions to extract data
function extractTitle(document: Document): string {
  // Look for title in multiple places, excluding "Airbnb" from the title
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
      
      // Remove "Airbnb" from title if it appears
      title = title.replace(/\s*-\s*Airbnb\s*$/, '').replace(/\s*Airbnb\s*$/, '')
      
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
      
      if (title && title !== 'Airbnb') {
        return title
      }
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
  console.log('=== EXTRACTING LOCATION ===')
  
  // Try multiple approaches to find location
  const locationSelectors = [
    '.s1qk96pm', // Specific class you mentioned
    '[class*="s1qk96pm"]', // In case it's nested
    '[data-testid="listing-location"]',
    '[class*="location"]',
    '[class*="address"]',
    '[class*="place"]',
    // New selectors based on actual HTML structure
    'div[aria-hidden="true"]', // Rating divs might contain location
    '[class*="location"]',
    '[class*="address"]',
    '[class*="place"]',
    'h2', // Location might be in h2
    'h3', // Or h3
    // Try to find any text that looks like a full address
    'span', 'div', 'p'
  ]
  
  console.log('Trying location selectors:', locationSelectors)
  
  for (const selector of locationSelectors) {
    const elements = document.querySelectorAll(selector)
    console.log(`Selector "${selector}": Found ${elements.length} elements`)
    
    for (const element of elements) {
      const text = element.textContent?.trim()
      if (text) {
        console.log(`Element text: "${text}"`)
        
        // Look for patterns that indicate a full address
        const hasComma = text.includes(',')
        const hasState = /(Texas|California|Florida|New York|Illinois|Pennsylvania|Ohio|Georgia|North Carolina|Michigan|New Jersey|Virginia|Washington|Arizona|Massachusetts|Tennessee|Indiana|Missouri|Maryland|Wisconsin|Colorado|Minnesota|South Carolina|Alabama|Louisiana|Kentucky|Oregon|Oklahoma|Connecticut|Utah|Iowa|Nevada|Arkansas|Mississippi|Kansas|New Mexico|Nebraska|West Virginia|Idaho|Hawaii|New Hampshire|Maine|Montana|Rhode Island|Delaware|South Dakota|North Dakota|Alaska|Vermont|Wyoming)/i.test(text)
        const hasCountry = /(United States|USA|Canada|Mexico|UK|United Kingdom|France|Germany|Italy|Spain|Australia|Japan|China|India|Brazil)/i.test(text)
        const hasZipCode = /\d{5}(-\d{4})?/.test(text)
        
        console.log('Location analysis:', { hasComma, hasState, hasCountry, hasZipCode })
        
        // If it looks like a full address (has comma, state, or country)
        if ((hasComma || hasState || hasCountry) && text.length > 5 && text.length < 200) {
          console.log('Found full location:', text)
          return text
        }
      }
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
    
    // Look for patterns like "City, State, Country"
    if (text.includes(',') && text.length > 10 && text.length < 100) {
      return text
    }
  }
  
  // Final fallback: search the entire body text for location patterns
  console.log('=== SEARCHING BODY TEXT FOR LOCATION ===')
  const bodyText = document.body.textContent || ''
  
  // Look for common location patterns in the body text
  const locationPatterns = [
    // City, State, Country patterns (most specific first)
    /([A-Z][a-z]+(?: [A-Z][a-z]+)*),\s*([A-Z][a-z]+(?: [A-Z][a-z]+)*),\s*(United States|USA|Canada|Mexico|UK|United Kingdom|France|Germany|Italy|Spain|Australia|Japan|China|India|Brazil)/gi,
    // City, State patterns
    /([A-Z][a-z]+(?: [A-Z][a-z]+)*),\s*(Texas|California|Florida|New York|Illinois|Pennsylvania|Ohio|Georgia|North Carolina|Michigan|New Jersey|Virginia|Washington|Arizona|Massachusetts|Tennessee|Indiana|Missouri|Maryland|Wisconsin|Colorado|Minnesota|South Carolina|Alabama|Louisiana|Kentucky|Oregon|Oklahoma|Connecticut|Utah|Iowa|Nevada|Arkansas|Mississippi|Kansas|New Mexico|Nebraska|West Virginia|Idaho|Hawaii|New Hampshire|Maine|Montana|Rhode Island|Delaware|South Dakota|North Dakota|Alaska|Vermont|Wyoming)/gi,
    // General City, State patterns
    /([A-Z][a-z]+(?: [A-Z][a-z]+)*),\s*([A-Z][a-z]+(?: [A-Z][a-z]+)*)/g
  ]
  
  for (const pattern of locationPatterns) {
    const matches = bodyText.match(pattern)
    if (matches && matches.length > 0) {
      // Find the longest match (most complete address)
      const longestMatch = matches.reduce((a, b) => a.length > b.length ? a : b)
      console.log('Found location pattern in body text:', longestMatch)
      return longestMatch.trim()
    }
  }
  
  // Additional search for specific location text patterns
  console.log('=== SEARCHING FOR SPECIFIC LOCATION PATTERNS ===')
  
  // Look for text that contains common location indicators
  const locationIndicators = [
    'Texas', 'California', 'Florida', 'New York', 'Illinois', 'Pennsylvania',
    'Ohio', 'Georgia', 'North Carolina', 'Michigan', 'New Jersey', 'Virginia',
    'Washington', 'Arizona', 'Massachusetts', 'Tennessee', 'Indiana', 'Missouri',
    'Maryland', 'Wisconsin', 'Colorado', 'Minnesota', 'South Carolina', 'Alabama',
    'Louisiana', 'Kentucky', 'Oregon', 'Oklahoma', 'Connecticut', 'Utah', 'Iowa',
    'Nevada', 'Arkansas', 'Mississippi', 'Kansas', 'New Mexico', 'Nebraska',
    'West Virginia', 'Idaho', 'Hawaii', 'New Hampshire', 'Maine', 'Montana',
    'Rhode Island', 'Delaware', 'South Dakota', 'North Dakota', 'Alaska', 'Vermont', 'Wyoming'
  ]
  
  for (const indicator of locationIndicators) {
    const regex = new RegExp(`([A-Z][a-z]+(?: [A-Z][a-z]+)*),\\s*${indicator}(?:,\\s*(United States|USA|Canada|Mexico))?`, 'gi')
    const matches = bodyText.match(regex)
    if (matches && matches.length > 0) {
      const bestMatch = matches[0]
      console.log('Found location with indicator:', bestMatch)
      return bestMatch.trim()
    }
  }
  
  console.log('No full location found, using fallback')
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
  console.log('=== EXTRACTING IMAGES ===')
  const images: string[] = []
  
  // Try multiple selectors for images, focusing on the patterns you mentioned
  const selectors = [
    'img[data-original-uri*="muscache.com"]', // Original URI with muscache (highest quality)
    'img[src*="muscache.com"]', // Current Airbnb image hosting
    'img[class*="i33bb1j"]', // Specific class you mentioned
    'img[fetchpriority="high"]', // High priority images (usually main photos)
    'img[elementtiming="LCP-target"]', // Largest contentful paint images
    'img[data-original-uri]', // Any images with original URI
    'img[src*="airbnb"]',
    'img'
  ]
  
  console.log('Trying image selectors:', selectors)
  
  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector)
    console.log(`Selector "${selector}": Found ${elements.length} elements`)
    
    elements.forEach((img, index) => {
      const originalUri = img.getAttribute('data-original-uri')
      const src = img.getAttribute('src')
      
      console.log(`Image[${index}] with "${selector}":`, {
        src: src?.substring(0, 100),
        dataOriginalUri: originalUri?.substring(0, 100),
        className: img.className
      })
      
      // Filter out user profile images and platform assets
      const isUserProfile = src?.includes('UserProfile') || originalUri?.includes('UserProfile')
      const isPlatformAsset = src?.includes('platform-assets') || originalUri?.includes('platform-assets')
      const isPropertyImage = src?.includes('miso/Hosting') || originalUri?.includes('miso/Hosting')
      
      console.log('Image filters:', { isUserProfile, isPlatformAsset, isPropertyImage })
      
      // Prioritize data-original-uri (higher quality), then src
      if (originalUri && originalUri.includes('muscache.com') && !isUserProfile && !isPlatformAsset) {
        console.log('Adding image (data-original-uri):', originalUri)
        images.push(originalUri)
      }
      // Fallback to src if it's from muscache.com and not user profile
      else if (src && src.includes('muscache.com') && !isUserProfile && !isPlatformAsset) {
        console.log('Adding image (src):', src)
        images.push(src)
      }
      // Accept other Airbnb images as fallback
      else if (src && 
          !src.includes('data:image') && 
          !src.includes('placeholder') &&
          !src.includes('icon') &&
          !src.includes('logo') &&
          !src.includes('UserProfile') &&
          !src.includes('platform-assets') &&
          (src.includes('airbnb') || src.includes('muscache'))) {
        console.log('Adding image (fallback):', src)
        images.push(src)
      }
    })
    
    if (images.length > 0) {
      console.log(`Found ${images.length} images with selector "${selector}"`)
      break
    }
  }
  
  console.log('Final images:', images.slice(0, 3))
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
  console.log('=== EXTRACTING RATING ===')
  
  // Try to find rating in various places
  const selectors = [
    'div[aria-hidden="true"]', // Your specific format: <div aria-hidden="true">4.94</div>
    '[data-testid="listing-rating"]',
    '[class*="rating"]',
    '[aria-label*="rating"]',
    '[aria-label*="stars"]'
  ]
  
  console.log('Trying rating selectors:', selectors)
  
  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector)
    console.log(`Selector "${selector}": Found ${elements.length} elements`)
    
    elements.forEach((element, index) => {
      const text = element.textContent?.trim() || ''
      console.log(`Rating[${index}] with "${selector}":`, text)
      
      // Look for numeric rating (like 4.94)
      const match = text.match(/(\d+\.?\d*)/)
      if (match) {
        const rating = parseFloat(match[1])
        console.log('Found rating:', rating)
        return rating
      }
    })
  }
  
  // Fallback: search in body text
  const ratingText = document.body.textContent || ''
  const match = ratingText.match(/(\d+\.?\d*)\s*(?:stars?|rating)/i)
  console.log('Fallback rating match:', match)
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
