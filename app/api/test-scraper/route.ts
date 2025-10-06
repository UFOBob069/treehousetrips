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

    console.log('=== TEST SCRAPER START ===')
    console.log('URL:', url)

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
    console.log('HTML Length:', html.length)
    
    // Parse with JSDOM
    const dom = new JSDOM(html)
    const document = dom.window.document
    
    // Test specific selectors
    const results = {
      url,
      htmlLength: html.length,
      
      // Test location selectors
      locationTests: {
        s1qk96pm: {
          selector: '.s1qk96pm',
          found: document.querySelectorAll('.s1qk96pm').length,
          elements: Array.from(document.querySelectorAll('.s1qk96pm')).map(el => ({
            text: el.textContent?.trim(),
            className: el.className,
            outerHTML: el.outerHTML?.substring(0, 200)
          }))
        },
        s1qk96pmPartial: {
          selector: '[class*="s1qk96pm"]',
          found: document.querySelectorAll('[class*="s1qk96pm"]').length,
          elements: Array.from(document.querySelectorAll('[class*="s1qk96pm"]')).map(el => ({
            text: el.textContent?.trim(),
            className: el.className,
            outerHTML: el.outerHTML?.substring(0, 200)
          }))
        }
      },
      
      // Test image selectors
      imageTests: {
        i33bb1j: {
          selector: '.i33bb1j',
          found: document.querySelectorAll('.i33bb1j').length,
          elements: Array.from(document.querySelectorAll('.i33bb1j')).map(el => ({
            src: el.getAttribute('src'),
            dataOriginalUri: el.getAttribute('data-original-uri'),
            className: el.className,
            outerHTML: el.outerHTML?.substring(0, 200)
          }))
        },
        muscacheImages: {
          selector: 'img[src*="muscache.com"]',
          found: document.querySelectorAll('img[src*="muscache.com"]').length,
          elements: Array.from(document.querySelectorAll('img[src*="muscache.com"]')).map(el => ({
            src: el.getAttribute('src'),
            dataOriginalUri: el.getAttribute('data-original-uri'),
            className: el.className
          }))
        },
        dataOriginalUri: {
          selector: 'img[data-original-uri]',
          found: document.querySelectorAll('img[data-original-uri]').length,
          elements: Array.from(document.querySelectorAll('img[data-original-uri]')).map(el => ({
            src: el.getAttribute('src'),
            dataOriginalUri: el.getAttribute('data-original-uri'),
            className: el.className
          }))
        },
        propertyImages: {
          selector: 'img[src*="miso/Hosting"]',
          found: document.querySelectorAll('img[src*="miso/Hosting"]').length,
          elements: Array.from(document.querySelectorAll('img[src*="miso/Hosting"]')).map(el => ({
            src: el.getAttribute('src'),
            dataOriginalUri: el.getAttribute('data-original-uri'),
            className: el.className
          }))
        }
      },
      
      // Test title selectors
      titleTests: {
        h1: {
          selector: 'h1',
          found: document.querySelectorAll('h1').length,
          elements: Array.from(document.querySelectorAll('h1')).map(el => ({
            text: el.textContent?.trim(),
            className: el.className,
            outerHTML: el.outerHTML?.substring(0, 200)
          }))
        }
      },
      
      // Test rating selectors
      ratingTests: {
        ariaHidden: {
          selector: 'div[aria-hidden="true"]',
          found: document.querySelectorAll('div[aria-hidden="true"]').length,
          elements: Array.from(document.querySelectorAll('div[aria-hidden="true"]')).map(el => ({
            text: el.textContent?.trim(),
            className: el.className,
            outerHTML: el.outerHTML?.substring(0, 200)
          }))
        }
      },
      
      // Raw HTML snippets
      rawHTML: {
        firstH1: document.querySelector('h1')?.outerHTML?.substring(0, 300),
        firstImage: document.querySelector('img')?.outerHTML?.substring(0, 300),
        firstLocationDiv: document.querySelector('.s1qk96pm')?.outerHTML?.substring(0, 300)
      }
    }
    
    console.log('=== TEST SCRAPER RESULTS ===')
    console.log('Location Tests:', results.locationTests)
    console.log('Image Tests:', results.imageTests)
    console.log('Title Tests:', results.titleTests)
    console.log('Raw HTML:', results.rawHTML)
    console.log('=== TEST SCRAPER END ===')
    
    return NextResponse.json(results)
    
  } catch (error) {
    console.error('Test scraping error:', error)
    return NextResponse.json(
      { error: 'Failed to test scrape Airbnb listing', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
