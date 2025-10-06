import { NextRequest, NextResponse } from 'next/server'
import { JSDOM } from 'jsdom'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    
    if (!url || !url.includes('airbnb.com')) {
      return NextResponse.json(
        { error: 'Invalid Airbnb URL' },
        { status: 400 }
      )
    }

    // Use fetch to get the page
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
    
    // Debug: Find all elements that might contain location
    const locationCandidates: Array<{
      selector: string
      text: string
      className: string
      tagName: string
    }> = []
    const locationSelectors = [
      '.s1qk96pm',
      '[class*="location"]',
      '[class*="address"]',
      '[class*="place"]',
      'h1',
      'h2',
      'h3',
      '[data-testid*="location"]',
      '[data-testid*="address"]'
    ]
    
    locationSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector)
      elements.forEach(el => {
        const text = el.textContent?.trim()
        if (text && text.length > 5 && text.length < 100) {
          locationCandidates.push({
            selector,
            text,
            className: el.className,
            tagName: el.tagName
          })
        }
      })
    })
    
    // Debug: Find all images
    const imageCandidates: Array<{
      src: string | null
      dataOriginalUri: string | null
      className: string
      alt: string | null
      id: string | null
    }> = []
    const allImages = document.querySelectorAll('img')
    allImages.forEach(img => {
      const src = img.getAttribute('src')
      const dataOriginalUri = img.getAttribute('data-original-uri')
      const className = img.className
      
      if (src || dataOriginalUri) {
        imageCandidates.push({
          src,
          dataOriginalUri,
          className,
          alt: img.getAttribute('alt'),
          id: img.getAttribute('id')
        })
      }
    })
    
    // Debug: Find title elements
    const titleCandidates: Array<{
      selector: string
      text: string
      className: string
      tagName: string
    }> = []
    const titleSelectors = ['h1', 'h2', 'title', '[class*="title"]', '[data-testid*="title"]']
    titleSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector)
      elements.forEach(el => {
        const text = el.textContent?.trim()
        if (text && text.length > 5) {
          titleCandidates.push({
            selector,
            text,
            className: el.className,
            tagName: el.tagName
          })
        }
      })
    })
    
    // Enhanced logging for debugging
    const debugInfo = {
      url,
      htmlLength: html.length,
      locationCandidates: locationCandidates.slice(0, 10),
      imageCandidates: imageCandidates.slice(0, 20),
      titleCandidates: titleCandidates.slice(0, 10),
      hasMuscacheImages: imageCandidates.some(img => img.src?.includes('muscache.com') || img.dataOriginalUri?.includes('muscache.com')),
      
      // Specific element searches
      s1qk96pmElements: Array.from(document.querySelectorAll('.s1qk96pm')).map(el => ({
        text: el.textContent?.trim(),
        className: el.className,
        tagName: el.tagName
      })),
      
      i33bb1jElements: Array.from(document.querySelectorAll('.i33bb1j')).map(el => ({
        src: el.getAttribute('src'),
        dataOriginalUri: el.getAttribute('data-original-uri'),
        className: el.className,
        tagName: el.tagName
      })),
      
      muscacheImages: imageCandidates.filter(img => 
        img.src?.includes('muscache.com') || img.dataOriginalUri?.includes('muscache.com')
      ),
      
      // Check for specific patterns
      titleWithLocation: titleCandidates.filter(t => t.text.includes(' - ')),
      imagesWithDataOriginalUri: imageCandidates.filter(img => img.dataOriginalUri),
      
      // Raw HTML snippets for debugging
      firstH1: document.querySelector('h1')?.outerHTML?.substring(0, 200),
      firstImage: document.querySelector('img')?.outerHTML?.substring(0, 200),
      firstLocationDiv: document.querySelector('.s1qk96pm')?.outerHTML?.substring(0, 200)
    }
    
    console.log('=== DEBUG SCRAPER RESULTS ===')
    console.log('URL:', url)
    console.log('HTML Length:', html.length)
    console.log('Location Candidates:', locationCandidates.slice(0, 5))
    console.log('Image Candidates:', imageCandidates.slice(0, 5))
    console.log('Title Candidates:', titleCandidates.slice(0, 5))
    console.log('Has Muscache Images:', debugInfo.hasMuscacheImages)
    console.log('S1QK96PM Elements:', debugInfo.s1qk96pmElements)
    console.log('I33BB1J Elements:', debugInfo.i33bb1jElements)
    console.log('Muscache Images:', debugInfo.muscacheImages)
    console.log('================================')
    
    return NextResponse.json(debugInfo)
    
  } catch (error) {
    console.error('Debug scraping error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to debug scrape Airbnb listing', 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
