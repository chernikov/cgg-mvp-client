'use client'

import { useEffect, useState } from 'react'
import { db } from '../../config/firebase'
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore'
import SecurityTest from './security-test'
import ConfigTest from './config-test'
import BulkWriteTest from './bulk-write-test'
import StorageTest from './storage-test'

interface TestData {
  id: string
  message?: string
  timestamp?: string
  user?: string
  [key: string]: unknown
}

interface WriteTestResult {
  success: boolean
  operation: string
  time: number
  error?: string
}

export default function TestFirebase() {
  const [status, setStatus] = useState('Перевіряємо підключення...')
  const [data, setData] = useState<TestData[]>([])
  const [error, setError] = useState<string | null>(null)
  const [allCollections, setAllCollections] = useState<string[]>([])
  const [writeTests, setWriteTests] = useState<WriteTestResult[]>([])
  const [isRealTimeListening, setIsRealTimeListening] = useState(false)
  const [performanceMetrics, setPerformanceMetrics] = useState<{
    readTime: number | null
    writeTime: number | null
    updateTime: number | null
    deleteTime: number | null
  }>({
    readTime: null,
    writeTime: null,
    updateTime: null,
    deleteTime: null
  })

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
      const startTime = performance.now()
      
      const testData = {
        message: 'Test message',
        timestamp: new Date().toISOString(),
        user: 'test-user'
      }
      
      await addDoc(collection(db, 'test'), testData)
      
      const endTime = performance.now()
      const writeTime = endTime - startTime
      
      setPerformanceMetrics(prev => ({ ...prev, writeTime }))
      setStatus('✅ Тестові дані додано!')
      
      // Оновити список
      testFirebaseConnection()
        } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Add Data Error:', err)
    }
  }

  // Комплексна перевірка операцій запису
  const runWriteTests = async () => {
    const results: WriteTestResult[] = []
    setStatus('🧪 Запускаємо тести запису...')
    
    // Тест 1: Додавання документа (addDoc)
    try {
      const startTime = performance.now()
      const testDoc = {
        test_type: 'addDoc_test',
        message: 'Test додавання документа',
        timestamp: serverTimestamp(),
        random_id: Math.random().toString(36).substring(7)
      }
      
      const docRef = await addDoc(collection(db, 'write_tests'), testDoc)
      const endTime = performance.now()
      
      results.push({
        success: true,
        operation: 'addDoc',
        time: endTime - startTime
      })
      
      // Тест 2: Оновлення документа (updateDoc)
      const updateStartTime = performance.now()
      await updateDoc(docRef, {
        updated: true,
        update_timestamp: serverTimestamp()
      })
      const updateEndTime = performance.now()
      
      results.push({
        success: true,
        operation: 'updateDoc',
        time: updateEndTime - updateStartTime
      })
      
      // Тест 3: Встановлення документа з ID (setDoc)
      const setStartTime = performance.now()
      const customId = `test_${Date.now()}`
      await setDoc(doc(db, 'write_tests', customId), {
        test_type: 'setDoc_test',
        message: 'Test встановлення документа з custom ID',
        timestamp: serverTimestamp(),
        custom_id: customId
      })
      const setEndTime = performance.now()
      
      results.push({
        success: true,
        operation: 'setDoc',
        time: setEndTime - setStartTime
      })
      
      // Тест 4: Видалення документа (deleteDoc)
      const deleteStartTime = performance.now()
      await deleteDoc(docRef)
      const deleteEndTime = performance.now()
      
      results.push({
        success: true,
        operation: 'deleteDoc',
        time: deleteEndTime - deleteStartTime
      })
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      results.push({
        success: false,
        operation: 'write_tests',
        time: 0,
        error: errorMessage
      })
    }
    
    setWriteTests(results)
    setStatus('🧪 Тести запису завершено!')
  }

  // Тест реального часу (Real-time listener)
  const toggleRealTimeListener = () => {
    if (isRealTimeListening) {
      setIsRealTimeListening(false)
      setStatus('⏹️ Real-time listener зупинено')
    } else {
      setIsRealTimeListening(true)
      setStatus('▶️ Real-time listener запущено')
      
      const unsubscribe = onSnapshot(collection(db, 'test'), (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setData(docs)
        setStatus(`🔄 Real-time оновлення: ${docs.length} документів`)
      }, (err) => {
        setError(`Real-time listener error: ${err.message}`)
        setIsRealTimeListening(false)
      })
      
      // Зберігаємо unsubscribe функцію для cleanup
      setTimeout(() => {
        if (isRealTimeListening) {
          unsubscribe()
          setIsRealTimeListening(false)
          setStatus('⏹️ Real-time listener автоматично зупинено через 30 секунд')
        }
      }, 30000)
    }
  }

  // Тест продуктивності читання
  const testReadPerformance = async () => {
    try {
      setStatus('📊 Тестуємо продуктивність читання...')
      
      const startTime = performance.now()
      const snapshot = await getDocs(collection(db, 'test'))
      const endTime = performance.now()
      
      const readTime = endTime - startTime
      setPerformanceMetrics(prev => ({ ...prev, readTime }))
      
      setStatus(`📊 Читання завершено за ${readTime.toFixed(2)}ms (${snapshot.size} документів)`)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
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
      
      for (const collectionName of possibleCollections) {        try {
          const collectionRef = collection(db, collectionName)
          const snapshot = await getDocs(collectionRef)
          if (!snapshot.empty) {
            foundCollections.push(`${collectionName} (${snapshot.size} документів)`)
          }
        } catch (error) {
          console.log(`Колекція ${collectionName} не існує або недоступна`, error)
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
    <div className="min-h-screen bg-gray-100 p-8">      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔥 Firebase Test Page</h1>
        
        <ConfigTest />
        
        <StorageTest />
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Статус підключення:</h2>
          <p className="text-lg">{status}</p>
          
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <strong>Помилка:</strong> {error}
            </div>
          )}
        </div>        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Основні дії:</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <button 
              onClick={testFirebaseConnection}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              🔄 Перевірити підключення
            </button>
            <button 
              onClick={addTestData}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              ➕ Додати тестові дані
            </button>
            <button 
              onClick={checkAllCollections}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
            >
              🔍 Перевірити колекції
            </button>
            <button 
              onClick={runWriteTests}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
            >
              🧪 Тести запису
            </button>
            <button 
              onClick={testReadPerformance}
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition-colors"
            >
              📊 Тест читання
            </button>
            <button 
              onClick={toggleRealTimeListener}
              className={`px-4 py-2 rounded transition-colors ${
                isRealTimeListening 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-orange-500 hover:bg-orange-600'
              } text-white`}
            >
              {isRealTimeListening ? '⏹️ Зупинити RT' : '▶️ Real-time'}
            </button>
          </div>
        </div>        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Метрики продуктивності:</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-blue-50 rounded border">
              <div className="text-sm text-gray-600">Читання</div>
              <div className="text-lg font-semibold">
                {performanceMetrics.readTime ? `${performanceMetrics.readTime.toFixed(2)}ms` : '-'}
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded border">
              <div className="text-sm text-gray-600">Запис</div>
              <div className="text-lg font-semibold">
                {performanceMetrics.writeTime ? `${performanceMetrics.writeTime.toFixed(2)}ms` : '-'}
              </div>
            </div>
            <div className="p-3 bg-yellow-50 rounded border">
              <div className="text-sm text-gray-600">Оновлення</div>
              <div className="text-lg font-semibold">
                {performanceMetrics.updateTime ? `${performanceMetrics.updateTime.toFixed(2)}ms` : '-'}
              </div>
            </div>
            <div className="p-3 bg-red-50 rounded border">
              <div className="text-sm text-gray-600">Видалення</div>
              <div className="text-lg font-semibold">
                {performanceMetrics.deleteTime ? `${performanceMetrics.deleteTime.toFixed(2)}ms` : '-'}
              </div>
            </div>
          </div>
        </div>

        {writeTests.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Результати тестів запису:</h2>
            <div className="space-y-3">
              {writeTests.map((test, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded border-l-4 ${
                    test.success 
                      ? 'bg-green-50 border-green-400' 
                      : 'bg-red-50 border-red-400'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {test.success ? '✅' : '❌'} {test.operation}
                    </span>
                    <span className="text-sm text-gray-600">
                      {test.time.toFixed(2)}ms
                    </span>
                  </div>
                  {test.error && (
                    <div className="text-sm text-red-600 mt-1">
                      Помилка: {test.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

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
        </div>

        <BulkWriteTest />

        <SecurityTest />

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-semibold text-yellow-800 mb-3">Firebase Console посилання:</h3>
          <div className="space-y-2">
            <a 
              href="https://console.firebase.google.com/project/cgg-mvp-01/firestore" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-blue-600 underline hover:text-blue-800"
            >
              🔗 Відкрити Firestore Database
            </a>
            <a 
              href="https://console.firebase.google.com/project/cgg-mvp-01/firestore/rules" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-blue-600 underline hover:text-blue-800"
            >
              🔒 Правила безпеки Firestore
            </a>
            <a 
              href="https://console.firebase.google.com/project/cgg-mvp-01/usage" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-blue-600 underline hover:text-blue-800"
            >
              📊 Використання і квоти
            </a>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-semibold text-blue-800 mb-3">Інформація про тестування:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Тести запису</strong> - перевіряють addDoc, updateDoc, setDoc, deleteDoc</li>
            <li>• <strong>Real-time listener</strong> - тестує onSnapshot для відстеження змін в реальному часі</li>
            <li>• <strong>Метрики продуктивності</strong> - вимірюють час виконання операцій</li>
            <li>• <strong>Перевірка колекцій</strong> - сканує наявні колекції та їх розмір</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
