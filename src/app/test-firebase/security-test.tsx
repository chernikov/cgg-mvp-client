'use client'

import { useState } from 'react'
import { db } from '../../config/firebase'
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where
} from 'firebase/firestore'

interface SecurityTestResult {
  operation: string
  allowed: boolean
  error?: string
  description: string
}

export default function SecurityTest() {
  const [testResults, setTestResults] = useState<SecurityTestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runSecurityTests = async () => {
    setIsRunning(true)
    const results: SecurityTestResult[] = []

    // Тест 1: Спроба читання без аутентифікації
    try {
      await getDocs(collection(db, 'surveys'))
      results.push({
        operation: 'Read surveys collection',
        allowed: true,
        description: 'Читання колекції surveys без аутентифікації'
      })    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      results.push({
        operation: 'Read surveys collection',
        allowed: false,
        error: errorMessage,
        description: 'Читання колекції surveys без аутентифікації'
      })
    }

    // Тест 2: Спроба запису без аутентифікації
    try {
      await addDoc(collection(db, 'surveys'), {
        test: true,
        timestamp: new Date()
      })
      results.push({
        operation: 'Write to surveys collection',
        allowed: true,
        description: 'Запис у колекцію surveys без аутентифікації'
      })    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      results.push({
        operation: 'Write to surveys collection',
        allowed: false,
        error: errorMessage,
        description: 'Запис у колекцію surveys без аутентифікації'
      })
    }

    // Тест 3: Спроба читання test колекції
    try {
      await getDocs(collection(db, 'test'))
      results.push({
        operation: 'Read test collection',
        allowed: true,
        description: 'Читання test колекції (має бути дозволено)'
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      results.push({
        operation: 'Read test collection',
        allowed: false,
        error: errorMessage,
        description: 'Читання test колекції (має бути дозволено)'
      })
    }

    // Тест 4: Спроба запису в test колекцію
    try {
      await addDoc(collection(db, 'test'), {
        security_test: true,
        timestamp: new Date()
      })
      results.push({
        operation: 'Write to test collection',
        allowed: true,
        description: 'Запис у test колекцію (має бути дозволено)'
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      results.push({
        operation: 'Write to test collection',
        allowed: false,
        error: errorMessage,
        description: 'Запис у test колекцію (має бути дозволено)'
      })
    }

    // Тест 5: Спроба читання колекції users
    try {
      await getDocs(collection(db, 'users'))
      results.push({
        operation: 'Read users collection',
        allowed: true,
        description: 'Читання колекції users'
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      results.push({
        operation: 'Read users collection',
        allowed: false,
        error: errorMessage,
        description: 'Читання колекції users'
      })
    }

    // Тест 6: Спроба оновлення існуючого документа
    try {
      // Спочатку спробуємо створити документ
      const docRef = doc(db, 'test', 'security-test-doc')
      await setDoc(docRef, { test: true })
      
      // Потім спробуємо його оновити
      await updateDoc(docRef, { updated: true })
      
      results.push({
        operation: 'Update document',
        allowed: true,
        description: 'Оновлення існуючого документа'
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      results.push({
        operation: 'Update document',
        allowed: false,
        error: errorMessage,
        description: 'Оновлення існуючого документа'
      })
    }

    // Тест 7: Спроба видалення документа
    try {
      const docRef = doc(db, 'test', 'security-test-doc')
      await deleteDoc(docRef)
      
      results.push({
        operation: 'Delete document',
        allowed: true,
        description: 'Видалення документа'
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      results.push({
        operation: 'Delete document',
        allowed: false,
        error: errorMessage,
        description: 'Видалення документа'
      })
    }

    // Тест 8: Спроба запиту з where умовою
    try {
      const q = query(collection(db, 'test'), where('test', '==', true))
      await getDocs(q)
      
      results.push({
        operation: 'Query with where clause',
        allowed: true,
        description: 'Запит з where умовою'
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      results.push({
        operation: 'Query with where clause',
        allowed: false,
        error: errorMessage,
        description: 'Запит з where умовою'
      })
    }

    setTestResults(results)
    setIsRunning(false)
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">🔒 Тести безпеки Firebase</h2>
      
      <div className="mb-6">
        <button
          onClick={runSecurityTests}
          disabled={isRunning}
          className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 disabled:bg-gray-400 mr-4"
        >
          {isRunning ? '🔄 Тестуємо...' : '🧪 Запустити тести безпеки'}
        </button>
        
        <button
          onClick={clearResults}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          🗑️ Очистити результати
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Результати тестів:</h3>
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded border-l-4 ${
                result.allowed
                  ? 'bg-green-50 border-green-400'
                  : 'bg-red-50 border-red-400'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="text-lg mr-2">
                      {result.allowed ? '✅' : '❌'}
                    </span>
                    <span className="font-medium">
                      {result.operation}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {result.description}
                  </p>
                  {result.error && (
                    <div className="text-sm text-red-600 bg-red-100 p-2 rounded">
                      <strong>Помилка:</strong> {result.error}
                    </div>
                  )}
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  result.allowed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {result.allowed ? 'ДОЗВОЛЕНО' : 'ЗАБОРОНЕНО'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <h4 className="font-semibold text-blue-800 mb-2">Про тести безпеки:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Тести перевіряють правила безпеки Firestore без аутентифікації</li>
          <li>• Червоні результати (❌) вказують на заборонені операції</li>
          <li>• Зелені результати (✅) вказують на дозволені операції</li>
          <li>• Переконайтеся, що тестові операції дозволені, а продакшн операції захищені</li>
        </ul>
      </div>
    </div>
  )
}
