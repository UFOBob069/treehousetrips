import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Handle the case where path might be ['data', 'properties.json']
    const pathArray = params.path
    let filePath: string
    
    if (pathArray[0] === 'data' && pathArray.length > 1) {
      // Remove the first 'data' from the path
      filePath = join(process.cwd(), 'data', ...pathArray.slice(1))
    } else {
      filePath = join(process.cwd(), 'data', ...pathArray)
    }
    
    const fileContent = await readFile(filePath, 'utf-8')
    
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Error reading data file:', error)
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}
