"use client";

import { useState } from 'react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    aiModel: 'gpt-4-turbo-preview',
    maxTokens: 2000,
    temperature: 0.7,
    language: 'uk',
    maxResponseTime: 30000,
    enableLogging: true,
    enableCache: false,
    cacheExpiryHours: 24
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      // Тут би був код для збереження налаштувань
      await new Promise(resolve => setTimeout(resolve, 1000)); // Симуляція збереження
      
      console.log('Settings saved:', settings);
      setMessage('✅ Налаштування збережено успішно!');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Settings save error:', error);
      setMessage('❌ Помилка збереження налаштувань');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    setSettings({
      aiModel: 'gpt-4-turbo-preview',
      maxTokens: 2000,
      temperature: 0.7,
      language: 'uk',
      maxResponseTime: 30000,
      enableLogging: true,
      enableCache: false,
      cacheExpiryHours: 24
    });
    setMessage('⚠️ Налаштування скинуто до значень за замовчуванням');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">⚙️ Налаштування системи</h1>
        <p className="text-lg text-gray-600">Конфігурація AI сервісу та системних параметрів</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('✅') ? 'bg-green-100 text-green-700' : 
          message.includes('❌') ? 'bg-red-100 text-red-700' : 
          'bg-yellow-100 text-yellow-700'
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-8">
        {/* AI Налаштування */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">🤖</span>
            Налаштування AI
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Модель AI
              </label>
              <select
                value={settings.aiModel}
                onChange={(e) => setSettings({...settings, aiModel: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="gpt-4-turbo-preview">GPT-4 Turbo Preview</option>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Максимальна кількість токенів
              </label>
              <input
                type="number"
                value={settings.maxTokens}
                onChange={(e) => setSettings({...settings, maxTokens: parseInt(e.target.value)})}
                min="100"
                max="4000"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature (креативність)
              </label>
              <input
                type="range"
                value={settings.temperature}
                onChange={(e) => setSettings({...settings, temperature: parseFloat(e.target.value)})}
                min="0"
                max="1"
                step="0.1"
                className="w-full"
              />
              <div className="text-sm text-gray-500 mt-1">
                Поточне значення: {settings.temperature}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Максимальний час відповіді (мс)
              </label>
              <input
                type="number"
                value={settings.maxResponseTime}
                onChange={(e) => setSettings({...settings, maxResponseTime: parseInt(e.target.value)})}
                min="5000"
                max="60000"
                step="1000"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Системні налаштування */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">🔧</span>
            Системні налаштування
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Мова за замовчуванням
              </label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({...settings, language: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="uk">Українська</option>
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Час кешу (години)
              </label>
              <input
                type="number"
                value={settings.cacheExpiryHours}
                onChange={(e) => setSettings({...settings, cacheExpiryHours: parseInt(e.target.value)})}
                min="1"
                max="168"
                disabled={!settings.enableCache}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableLogging"
                checked={settings.enableLogging}
                onChange={(e) => setSettings({...settings, enableLogging: e.target.checked})}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="enableLogging" className="ml-2 text-sm font-medium text-gray-700">
                Увімкнути логування AI запитів
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableCache"
                checked={settings.enableCache}
                onChange={(e) => setSettings({...settings, enableCache: e.target.checked})}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="enableCache" className="ml-2 text-sm font-medium text-gray-700">
                Увімкнути кешування відповідей
              </label>
            </div>
          </div>
        </div>

        {/* Дії */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">💾</span>
            Дії
          </h2>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {saving ? '💾 Збереження...' : '💾 Зберегти налаштування'}
            </button>

            <button
              onClick={resetToDefaults}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 font-medium"
            >
              🔄 Скинути до значень за замовчуванням
            </button>

            <button
              onClick={() => {
                console.log('Current settings:', settings);
                alert('Поточні налаштування виведені в консоль');
              }}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-medium"
            >
              🔍 Переглянути в консолі
            </button>
          </div>
        </div>

        {/* Інформація про стан */}
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">ℹ️ Інформація</h3>
          <div className="grid gap-4 md:grid-cols-2 text-sm">
            <div>
              <span className="text-blue-700 font-medium">API ключ OpenAI:</span>
              <span className="ml-2 text-blue-600">
                {process.env.NEXT_PUBLIC_OPENAI_API_KEY ? '✅ Налаштовано' : '❌ Не налаштовано'}
              </span>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Firebase:</span>
              <span className="ml-2 text-blue-600">
                {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Підключено' : '❌ Не підключено'}
              </span>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Поточна модель:</span>
              <span className="ml-2 text-blue-600">{settings.aiModel}</span>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Логування:</span>
              <span className="ml-2 text-blue-600">
                {settings.enableLogging ? '✅ Увімкнено' : '❌ Вимкнено'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
