import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
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

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    
    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
    
    // Navigate to the Airbnb listing
    await page.goto(url, { waitUntil: 'networkidle2' })
    
    // Wait for content to load
    await page.waitForTimeout(3000)
    
    // Get the page content
    const content = await page.content()
    await browser.close()
    
    // Parse with JSDOM
    const dom = new JSDOM(content)
    const document = dom.window.document
    
    // Extract listing data
    const scrapedData: ScrapedListing = {
      title: extractTitle(document),
      description: extractDescription(document),
      location: extractLocation(document),
      price: extractPrice(document),
      images: extractImages(document),
      guests: extractGuests(document),
      bedrooms: extractBedrooms(document),
      bathrooms: extractBathrooms(document),
      amenities: extractAmenities(document),
      hostName: extractHostName(document),
      hostAvatar: extractHostAvatar(document),
      rating: extractRating(document),
      reviewCount: extractReviewCount(document),
      lat: extractLatitude(document),
      lng: extractLongitude(document)
    }
    
    return NextResponse.json({ data: scrapedData })
    
  } catch (error) {
    console.error('Scraping error:', error)
    return NextResponse.json(
      { error: 'Failed to scrape Airbnb listing' },
      { status: 500 }
    )
  }
}

// Helper functions to extract data
function extractTitle(document: Document): string {
  const titleElement = document.querySelector('h1[data-testid="listing-title"]') ||
                      document.querySelector('h1') ||
                      document.querySelector('title')
  return titleElement?.textContent?.trim() || ''
}

function extractDescription(document: Document): string {
  const descElement = document.querySelector('[data-testid="listing-description"]') ||
                     document.querySelector('.listing-description') ||
                     document.querySelector('meta[name="description"]')
  return descElement?.textContent?.trim() || descElement?.getAttribute('content') || ''
}

function extractLocation(document: Document): string {
  const locationElement = document.querySelector('.s1qk96pm') || // Current Airbnb location class
                          document.querySelector('[data-testid="listing-location"]') ||
                          document.querySelector('.listing-location') ||
                          document.querySelector('h2')
  return locationElement?.textContent?.trim() || ''
}

function extractPrice(document: Document): number {
  const priceElement = document.querySelector('[data-testid="price"]') ||
                      document.querySelector('.price') ||
                      document.querySelector('[data-testid="listing-price"]')
  
  const priceText = priceElement?.textContent || ''
  const priceMatch = priceText.match(/[\d,]+/)
  return priceMatch ? parseInt(priceMatch[0].replace(/,/g, '')) : 0
}

function extractImages(document: Document): string[] {
  const images: string[] = []
  
  // Try current Airbnb image selectors first
  const selectors = [
    'img[data-original-uri*="muscache.com"]', // Original URI with muscache (highest quality)
    'img[src*="muscache.com"]', // Current Airbnb image hosting
    'img[class*="i33bb1j"]', // Current Airbnb image class
    'img[fetchpriority="high"]', // High priority images
    'img[elementtiming="LCP-target"]', // Largest contentful paint images
    'img[data-original-uri]', // Images with original URI
    'img[data-testid="listing-image"]',
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
  const capacityElement = document.querySelector('[data-testid="listing-capacity"]') ||
                         document.querySelector('.listing-capacity')
  
  const text = capacityElement?.textContent || ''
  const match = text.match(/(\d+)\s*guests?/i)
  return match ? parseInt(match[1]) : 0
}

function extractBedrooms(document: Document): number {
  const capacityElement = document.querySelector('[data-testid="listing-capacity"]') ||
                         document.querySelector('.listing-capacity')
  
  const text = capacityElement?.textContent || ''
  const match = text.match(/(\d+)\s*bedrooms?/i)
  return match ? parseInt(match[1]) : 0
}

function extractBathrooms(document: Document): number {
  const capacityElement = document.querySelector('[data-testid="listing-capacity"]') ||
                         document.querySelector('.listing-capacity')
  
  const text = capacityElement?.textContent || ''
  const match = text.match(/(\d+)\s*bathrooms?/i)
  return match ? parseInt(match[1]) : 0
}

function extractAmenities(document: Document): string[] {
  const amenities: string[] = []
  
  // Try data-testid first
  const amenityElements = document.querySelectorAll('[data-testid="amenity"]')
  amenityElements.forEach(el => {
    const amenity = el.textContent?.trim()
    if (amenity) amenities.push(amenity)
  })
  
  // Fallback to any amenity-like elements
  if (amenities.length === 0) {
    const fallbackElements = document.querySelectorAll('.amenity, .facility')
    fallbackElements.forEach(el => {
      const amenity = el.textContent?.trim()
      if (amenity) amenities.push(amenity)
    })
  }
  
  return amenities.slice(0, 20) // Limit to 20 amenities
}

function extractHostName(document: Document): string {
  const hostElement = document.querySelector('[data-testid="host-name"]') ||
                     document.querySelector('.host-name') ||
                     document.querySelector('[data-testid="listing-host"]')
  return hostElement?.textContent?.trim() || ''
}

function extractHostAvatar(document: Document): string {
  const avatarElement = document.querySelector('[data-testid="host-avatar"] img') ||
                       document.querySelector('.host-avatar img') ||
                       document.querySelector('[data-testid="listing-host"] img')
  return avatarElement?.getAttribute('src') || ''
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