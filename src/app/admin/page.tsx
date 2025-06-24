export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🛠️ Панель адміністратора</h1>
          <p className="text-lg text-gray-600">Керування системою професійної орієнтації</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">📊</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Управління тестами</h2>
            </div>
            <p className="text-gray-600 mb-6">Створення, редагування та налаштування анкет і тестів професійної орієнтації</p>
            <a href="/admin/tests" className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-block text-center font-medium">
              Перейти до тестів
            </a>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">❓</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Банк питань</h2>
            </div>
            <p className="text-gray-600 mb-6">Редагування питань, варіантів відповідей та міграція даних між версіями</p>
            <a href="/admin/questions" className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors inline-block text-center font-medium">
              Керувати питаннями
            </a>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">👥</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Користувачі</h2>
            </div>
            <p className="text-gray-600 mb-6">Перегляд та модерація користувачів системи, управління правами доступу</p>
            <a href="/admin/users" className="w-full bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors inline-block text-center font-medium">
              Переглянути користувачів
            </a>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">📈</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Результати тестування</h2>
            </div>
            <p className="text-gray-600 mb-6">Аналіз статистики проходження тестів, результати професійної орієнтації</p>
            <a href="/admin/test-results" className="w-full bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition-colors inline-block text-center font-medium">
              Переглянути результати
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">AI Аналітика</h2>
            </div>
            <p className="text-gray-600 mb-6">Моніторинг роботи штучного інтелекту, логи запитів та продуктивність</p>
            <a href="/admin/ai-logs" className="w-full bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors inline-block text-center font-medium">
              Переглянути AI логи
            </a>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Налаштування системи</h2>
            </div>
            <p className="text-gray-600 mb-6">Конфігурація системи, налаштування AI, управління базою даних</p>
            <a href="/admin/settings" className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors inline-block text-center font-medium">
              Налаштування
            </a>
          </div>
        </div>
        
        {/* Швидка статистика */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">📊 Швидка статистика</h3>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
              <div className="text-sm text-gray-600">Всього користувачів</div>
              <div className="text-2xl font-bold text-blue-600">-</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
              <div className="text-sm text-gray-600">Пройдено тестів</div>
              <div className="text-2xl font-bold text-green-600">-</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
              <div className="text-sm text-gray-600">AI запитів сьогодні</div>
              <div className="text-2xl font-bold text-yellow-600">-</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
              <div className="text-sm text-gray-600">Активних питань</div>
              <div className="text-2xl font-bold text-purple-600">-</div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">* Статистика оновлюється в реальному часі. Для детальної аналітики використовуйте відповідні розділи.</p>
        </div>
      </div>
    </div>
  );
}
