'use client'

import { useState } from 'react'
import { db } from '../../config/firebase'
import { collection, addDoc, writeBatch, doc } from 'firebase/firestore'

interface BulkTestResult {
  operation: string
  count: number
  totalTime: number
  averageTime: number
  success: boolean
  error?: string
}

export default function BulkWriteTest() {
  const [results, setResults] = useState<BulkTestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [recordCount, setRecordCount] = useState(10)

  const runBulkWriteTest = async () => {
    setIsRunning(true)
    const newResults: BulkTestResult[] = []

    // Тест 1: Послідовний запис (addDoc)
    try {
      const startTime = performance.now()
      
      for (let i = 0; i < recordCount; i++) {
        await addDoc(collection(db, 'bulk_test'), {
          test_type: 'sequential_write',
          index: i,
          message: `Sequential test record ${i}`,
          timestamp: new Date(),
          random_data: Math.random().toString(36).substring(7)
        })
      }
      
      const endTime = performance.now()
      const totalTime = endTime - startTime
      
      newResults.push({
        operation: 'Sequential Write (addDoc)',
        count: recordCount,
        totalTime,
        averageTime: totalTime / recordCount,
        success: true
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      newResults.push({
        operation: 'Sequential Write (addDoc)',
        count: 0,
        totalTime: 0,
        averageTime: 0,
        success: false,
        error: errorMessage
      })
    }

    // Тест 2: Batch запис
    try {
      const startTime = performance.now()
      const batch = writeBatch(db)
      
      for (let i = 0; i < recordCount; i++) {
        const docRef = doc(collection(db, 'bulk_test'))
        batch.set(docRef, {
          test_type: 'batch_write',
          index: i,
          message: `Batch test record ${i}`,
          timestamp: new Date(),
          random_data: Math.random().toString(36).substring(7)
        })
      }
      
      await batch.commit()
      
      const endTime = performance.now()
      const totalTime = endTime - startTime
      
      newResults.push({
        operation: 'Batch Write',
        count: recordCount,
        totalTime,
        averageTime: totalTime / recordCount,
        success: true
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      newResults.push({
        operation: 'Batch Write',
        count: 0,
        totalTime: 0,
        averageTime: 0,
        success: false,
        error: errorMessage
      })
    }

    // Тест 3: Паралельний запис (Promise.all)
    try {
      const startTime = performance.now()
      
      const promises = Array.from({ length: recordCount }, (_, i) => 
        addDoc(collection(db, 'bulk_test'), {
          test_type: 'parallel_write',
          index: i,
          message: `Parallel test record ${i}`,
          timestamp: new Date(),
          random_data: Math.random().toString(36).substring(7)
        })
      )
      
      await Promise.all(promises)
      
      const endTime = performance.now()
      const totalTime = endTime - startTime
      
      newResults.push({
        operation: 'Parallel Write (Promise.all)',
        count: recordCount,
        totalTime,
        averageTime: totalTime / recordCount,
        success: true
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      newResults.push({
        operation: 'Parallel Write (Promise.all)',
        count: 0,
        totalTime: 0,
        averageTime: 0,
        success: false,
        error: errorMessage
      })
    }

    setResults(newResults)
    setIsRunning(false)
  }

  const clearResults = () => {
    setResults([])
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">📊 Тест масового запису</h2>
      
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <label className="font-medium">
            Кількість записів:
            <input
              type="number"
              value={recordCount}
              onChange={(e) => setRecordCount(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max="100"
              className="ml-2 px-3 py-1 border rounded w-20"
              disabled={isRunning}
            />
          </label>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={runBulkWriteTest}
            disabled={isRunning}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isRunning ? '🔄 Тестуємо...' : '🚀 Запустити тест'}
          </button>
          
          <button
            onClick={clearResults}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            🗑️ Очистити
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Результати тестів:</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Операція</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Записів</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Загальний час</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Середній час</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Статус</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index} className={result.success ? '' : 'bg-red-50'}>
                    <td className="border border-gray-300 px-4 py-2 font-medium">
                      {result.operation}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {result.count}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {result.totalTime.toFixed(2)}ms
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {result.averageTime.toFixed(2)}ms
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {result.success ? (
                        <span className="text-green-600 font-semibold">✅ Успішно</span>
                      ) : (
                        <span className="text-red-600 font-semibold">❌ Помилка</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {results.some(r => !r.success) && (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <h4 className="font-semibold text-red-800 mb-2">Помилки:</h4>
              {results.filter(r => !r.success).map((result, index) => (
                <div key={index} className="text-sm text-red-700">
                  <strong>{result.operation}:</strong> {result.error}
                </div>
              ))}
            </div>
          )}

          {results.length > 1 && results.every(r => r.success) && (
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Порівняння швидкості:</h4>
              <div className="text-sm text-blue-700">
                <p>
                  <strong>Найшвидший:</strong> {
                    results.reduce((fastest, current) => 
                      current.totalTime < fastest.totalTime ? current : fastest
                    ).operation
                  } ({results.reduce((fastest, current) => 
                    current.totalTime < fastest.totalTime ? current : fastest
                  ).totalTime.toFixed(2)}ms)
                </p>
                <p>
                  <strong>Найповільніший:</strong> {
                    results.reduce((slowest, current) => 
                      current.totalTime > slowest.totalTime ? current : slowest
                    ).operation
                  } ({results.reduce((slowest, current) => 
                    current.totalTime > slowest.totalTime ? current : slowest
                  ).totalTime.toFixed(2)}ms)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h4 className="font-semibold text-yellow-800 mb-2">Інформація про тести:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• <strong>Sequential Write</strong> - послідовний запис по одному документу</li>
          <li>• <strong>Batch Write</strong> - групове записування в одній транзакції (до 500 документів)</li>
          <li>• <strong>Parallel Write</strong> - паралельний запис використовуючи Promise.all</li>
          <li>• Batch write зазвичай найефективніший для великої кількості документів</li>
        </ul>
      </div>
    </div>
  )
}
