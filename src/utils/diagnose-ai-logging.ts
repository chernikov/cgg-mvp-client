import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, query, limit, Timestamp } from 'firebase/firestore'

/**
 * Діагностика Firebase та AI логування
 */
export async function diagnoseAILogging() {
  console.log('🔍 Starting AI Logging Diagnostics...')
  
  const results = {
    firebaseConnection: false,
    collectionAccess: false,
    writePermission: false,
    readPermission: false,
    errors: [] as string[]
  }

  try {
    // 1. Перевіряємо з'єднання з Firebase
    console.log('📡 Testing Firebase connection...')
    if (!db) {
      throw new Error('Firebase db object is null or undefined')
    }
    console.log('✅ Firebase connection established')
    results.firebaseConnection = true

    // 2. Перевіряємо доступ до колекції ai_logs
    console.log('📂 Testing ai_logs collection access...')
    const logsRef = collection(db, 'ai_logs')
    console.log('✅ ai_logs collection reference created')
    results.collectionAccess = true

    // 3. Перевіряємо права на читання
    console.log('📖 Testing read permissions...')
    try {
      const testQuery = query(logsRef, limit(1))
      const snapshot = await getDocs(testQuery)
      console.log('✅ Read permission successful, docs count:', snapshot.size)
      results.readPermission = true
    } catch (readError) {
      console.error('❌ Read permission failed:', readError)
      results.errors.push(`Read error: ${readError instanceof Error ? readError.message : 'Unknown'}`)
    }

    // 4. Перевіряємо права на запис
    console.log('✍️ Testing write permissions...')
    try {
      const testDoc = {
        test: true,
        timestamp: Timestamp.now(),
        message: 'Diagnostic test document',
        createdAt: new Date().toISOString()
      }
      
      const docRef = await addDoc(logsRef, testDoc)
      console.log('✅ Write permission successful, doc ID:', docRef.id)
      results.writePermission = true
      
      // Можемо видалити тестовий документ
      // await deleteDoc(docRef) // Розкоментуйте якщо хочете видалити тестові документи
      
    } catch (writeError) {
      console.error('❌ Write permission failed:', writeError)
      results.errors.push(`Write error: ${writeError instanceof Error ? writeError.message : 'Unknown'}`)
    }

  } catch (error) {
    console.error('❌ General diagnostics error:', error)
    results.errors.push(`General error: ${error instanceof Error ? error.message : 'Unknown'}`)
  }

  // Звіт
  console.log('📋 Diagnostics Results:')
  console.log('   🔗 Firebase Connection:', results.firebaseConnection ? '✅' : '❌')
  console.log('   📂 Collection Access:', results.collectionAccess ? '✅' : '❌')
  console.log('   📖 Read Permission:', results.readPermission ? '✅' : '❌')
  console.log('   ✍️ Write Permission:', results.writePermission ? '✅' : '❌')
  
  if (results.errors.length > 0) {
    console.log('❌ Errors found:')
    results.errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error}`)
    })
  }

  return results
}

/**
 * Перевіряє Firebase правила безпеки
 */
export function checkFirebaseRules() {
  console.log('🔐 Firebase Security Rules Information:')
  console.log('For ai_logs collection, ensure you have rules like:')
  console.log(`
// Allow authenticated users to create AI logs
match /ai_logs/{document} {
  allow create: if request.auth != null;
  allow read: if request.auth != null;
  // Only admins can read all logs
  allow read: if request.auth != null && 
    exists(/databases/$(database)/documents/admins/$(request.auth.uid));
}
  `)
  
  console.log('📝 Or more permissive for testing:')
  console.log(`
// Temporary permissive rules for testing
match /ai_logs/{document} {
  allow read, write: if true; // WARNING: This is for testing only!
}
  `)
}
