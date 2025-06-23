'use client'

import { useState, useEffect } from 'react'

interface ConfigCheck {
  key: string
  value: string | undefined
  isSet: boolean
  isValid: boolean
  description: string
}

export default function ConfigTest() {
  const [configChecks, setConfigChecks] = useState<ConfigCheck[]>([])

  useEffect(() => {
    checkFirebaseConfig()
  }, [])

  const checkFirebaseConfig = () => {
    const checks: ConfigCheck[] = [
      {
        key: 'NEXT_PUBLIC_FIREBASE_API_KEY',
        value: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        isSet: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        isValid: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_API_KEY.length > 10,
        description: 'API ключ для аутентифікації з Firebase'
      },
      {
        key: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
        value: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        isSet: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        isValid: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN && process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN.includes('.firebaseapp.com'),
        description: 'Домен для аутентифікації Firebase'
      },
      {
        key: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
        value: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        isSet: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        isValid: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID.length > 3,
        description: 'ID проекту Firebase'
      },
      {
        key: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
        value: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        isSet: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        isValid: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET && process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET.includes('.appspot.com'),
        description: 'Bucket для Firebase Storage'
      },
      {
        key: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
        value: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        isSet: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        isValid: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID && /^\d+$/.test(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
        description: 'ID відправника для Firebase Cloud Messaging'
      },
      {
        key: 'NEXT_PUBLIC_FIREBASE_APP_ID',
        value: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        isSet: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        isValid: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID && process.env.NEXT_PUBLIC_FIREBASE_APP_ID.includes(':'),
        description: 'ID додатку Firebase'
      }
    ]

    setConfigChecks(checks)
  }

  const maskValue = (value: string | undefined, maskLength: number = 4): string => {
    if (!value) return 'Не встановлено'
    if (value.length <= maskLength * 2) return '*'.repeat(value.length)
    return value.substring(0, maskLength) + '*'.repeat(value.length - maskLength * 2) + value.substring(value.length - maskLength)
  }

  const overallStatus = configChecks.every(check => check.isValid)

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">⚙️ Перевірка конфігурації Firebase</h2>
      
      <div className="mb-4">
        <div className={`p-3 rounded ${overallStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <span className="font-semibold">
            {overallStatus ? '✅ Конфігурація правильна' : '❌ Проблеми з конфігурацією'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {configChecks.map((check, index) => (
          <div
            key={index}
            className={`p-4 rounded border-l-4 ${
              check.isValid
                ? 'bg-green-50 border-green-400'
                : check.isSet
                ? 'bg-yellow-50 border-yellow-400'
                : 'bg-red-50 border-red-400'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <span className="text-lg mr-2">
                    {check.isValid ? '✅' : check.isSet ? '⚠️' : '❌'}
                  </span>
                  <span className="font-medium text-sm">
                    {check.key}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  {check.description}
                </p>
                <div className="text-sm font-mono bg-gray-100 p-2 rounded">
                  {maskValue(check.value)}
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                check.isValid
                  ? 'bg-green-100 text-green-800'
                  : check.isSet
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {check.isValid ? 'OK' : check.isSet ? 'INVALID' : 'MISSING'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <h4 className="font-semibold text-blue-800 mb-2">Як виправити проблеми:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Створіть файл <code className="bg-blue-100 px-1 rounded">.env.local</code> в корні проекту</li>
          <li>• Додайте всі необхідні змінні з префіксом <code className="bg-blue-100 px-1 rounded">NEXT_PUBLIC_</code></li>
          <li>• Отримайте значення з Firebase Console → Project Settings → General</li>
          <li>• Перезапустіть сервер розробки після додавання змінних</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded">
        <h4 className="font-semibold text-gray-800 mb-2">Приклад .env.local файлу:</h4>
        <pre className="text-xs text-gray-700 bg-gray-100 p-3 rounded overflow-x-auto">
{`NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456`}
        </pre>
      </div>
    </div>
  )
}
