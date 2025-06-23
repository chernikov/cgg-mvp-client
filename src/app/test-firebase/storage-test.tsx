'use client'

import { useState } from 'react'
import { storage } from '../../config/firebase'
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage'

export default function StorageTest() {
  const [status, setStatus] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const testStorageConnection = async () => {
    setIsLoading(true)
    setStatus('🔄 Тестуємо підключення до Firebase Storage...')

    try {
      // Створюємо тестовий файл
      const testData = new Blob(['Hello Firebase Storage!'], { type: 'text/plain' })
      const testRef = ref(storage, 'test/connection-test.txt')
      
      // Завантажуємо файл
      await uploadBytes(testRef, testData)
      setStatus('✅ Файл успішно завантажено!')

      // Отримуємо URL для завантаження
      const downloadURL = await getDownloadURL(testRef)
      setStatus(`✅ Storage працює! URL: ${downloadURL}`)
        } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Storage error:', error)
      setStatus(`❌ Помилка Storage: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  const checkStorageConfig = () => {
    const config = {
      bucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    }
    
    setStatus(`📋 Конфігурація:
    Project ID: ${config.projectId || '❌ MISSING'}
    Storage Bucket: ${config.bucket || '❌ MISSING'}`)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">🗄️ Тест Firebase Storage</h2>
      
      <div className="flex gap-3 mb-4">
        <button
          onClick={checkStorageConfig}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          📋 Перевірити конфігурацію
        </button>
        
        <button
          onClick={testStorageConnection}
          disabled={isLoading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {isLoading ? '🔄 Тестуємо...' : '🧪 Тест підключення'}
        </button>
      </div>

      {status && (
        <div className="bg-gray-50 border rounded p-4">
          <pre className="whitespace-pre-wrap text-sm">{status}</pre>
        </div>
      )}

      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h4 className="font-semibold text-yellow-800 mb-2">Інформація:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Storage bucket повинен мати формат: project-id.appspot.com</li>
          <li>• Переконайтеся, що Firebase Storage увімкнений в консолі</li>
          <li>• Перевірте правила безпеки Storage</li>
        </ul>
      </div>
    </div>
  )
}
