import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export async function POST() {
  try {
    console.log('Testing Firestore connection...')
    
    // Test adding a simple document
    const testDoc = await addDoc(collection(db, 'test'), {
      message: 'Firestore test',
      timestamp: serverTimestamp(),
      testId: Date.now()
    })
    
    console.log('Test document created with ID:', testDoc.id)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Firestore connection successful',
      testDocId: testDoc.id
    })
  } catch (error: any) {
    console.error('Firestore test failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      details: error
    }, { status: 500 })
  }
}
