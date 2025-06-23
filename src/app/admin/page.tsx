export default function AdminPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">🛠️ Адміністування</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-3">📊 Тести</h2>
          <p className="text-gray-600 mb-4">Управління тестами та анкетами</p>
          <a href="/admin/tests" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block">
            Перейти
          </a>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-3">📝 Менеджер питань</h2>
          <p className="text-gray-600 mb-4">Редагування та міграція питань</p>
          <a href="/admin/questions" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 inline-block">
            Перейти
          </a>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-3">👥 Користувачі</h2>
          <p className="text-gray-600 mb-4">Управління користувачами системи</p>
          <a href="/admin/users" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 inline-block">
            Перейти
          </a>
        </div>
      </div>
    </div>
  );
}
