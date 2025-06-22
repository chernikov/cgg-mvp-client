'use client'

import { useEffect, useState } from 'react'
import { db } from '../../config/firebase'
import { collection, getDocs, addDoc } from 'firebase/firestore'

interface TestData {
  id: string
  message?: string
  timestamp?: string
  user?: string
  [key: string]: unknown
}

export default function TestFirebase() {
  const [status, setStatus] = useState('Перевіряємо підключення...')
  const [data, setData] = useState<TestData[]>([])
  const [error, setError] = useState<string | null>(null)
  const [allCollections, setAllCollections] = useState<string[]>([])

  useEffect(() => {
    testFirebaseConnection()
  }, [])

  const testFirebaseConnection = async () => {
    try {
      setStatus('🔄 Тестуємо підключення до Firebase...')
      
      // Спробуємо отримати дані з колекції
      const testCollection = collection(db, 'test')
      const snapshot = await getDocs(testCollection)
      
      setStatus('✅ Firebase підключення працює!')
      
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setData(docs)
        } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      setStatus('❌ Помилка підключення до Firebase')
      console.error('Firebase Error:', err)
    }
  }

  const addTestData = async () => {
    try {
      const testData = {
        message: 'Test message',
        timestamp: new Date().toISOString(),
        user: 'test-user'
      }
      
      await addDoc(collection(db, 'test'), testData)
      setStatus('✅ Тестові дані додано!')
      
      // Оновити список
      testFirebaseConnection()
        } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Add Data Error:', err)
    }
  }

  const checkAllCollections = async () => {
    try {
      setStatus('🔍 Перевіряємо всі колекції...')
      
      // Список можливих колекцій з вашого коду
      const possibleCollections = [
        'surveys',
        'survey_responses', 
        'test',
        'users',
        'magical_quest_responses',
        'student_responses',
        'parent_responses',
        'teacher_responses'
      ]
      
      const foundCollections: string[] = []
      
      for (const collectionName of possibleCollections) {
        try {
          const collectionRef = collection(db, collectionName)
          const snapshot = await getDocs(collectionRef)
          if (!snapshot.empty) {
            foundCollections.push(`${collectionName} (${snapshot.size} документів)`)
          }
        } catch (err) {
          console.log(`Колекція ${collectionName} не існує або недоступна`)
        }
      }
      
      setAllCollections(foundCollections)
      setStatus(`✅ Знайдено ${foundCollections.length} колекцій`)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      setStatus('❌ Помилка при перевірці колекцій')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔥 Firebase Test Page</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Статус підключення:</h2>
          <p className="text-lg">{status}</p>
          
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <strong>Помилка:</strong> {error}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Дії:</h2>
          <button 
            onClick={testFirebaseConnection}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-4 hover:bg-blue-600"
          >
            🔄 Перевірити підключення
          </button>
          <button 
            onClick={addTestData}
            className="bg-green-500 text-white px-4 py-2 rounded mr-4 hover:bg-green-600"
          >
            ➕ Додати тестові дані
          </button>
          <button 
            onClick={checkAllCollections}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            🔍 Перевірити колекції
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Дані з Firestore:</h2>
          {data.length > 0 ? (
            <div className="space-y-2">
              {data.map((item, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded border">
                  <pre className="text-sm">{JSON.stringify(item, null, 2)}</pre>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Немає даних або ще завантажується...</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Всі колекції в Firestore:</h2>
          {allCollections.length > 0 ? (
            <div className="space-y-2">
              {allCollections.map((collection, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded border">
                  {collection}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Немає доступних колекцій або ще перевіряється...</p>
          )}
        </div>        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-semibold text-yellow-800">Firebase Console посилання:</h3>
          <a 
            href="https://console.firebase.google.com/project/cgg-mvp-01/firestore" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            🔗 Відкрити Firestore Database
          </a>
        </div>
      </div>
    </div>
  )
}
