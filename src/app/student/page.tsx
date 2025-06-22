import Link from 'next/link'

export default function StudentIntro() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-teal-900 to-purple-900">
      <div className="max-w-lg w-full bg-gradient-to-br from-green-800/80 via-teal-800/80 to-purple-800/80 rounded-2xl p-8 shadow-2xl animate-fade-in">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-4xl">🎓</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Вітаю, юний маг!</h1>
            <p className="text-white/80">Давай разом знайдемо твій шлях до успіху!</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <p className="text-white/60">
            Цей магічний тест допоможе тобі:
          </p>
          <ul className="space-y-2 text-white/80">
            <li className="flex items-center gap-2">
              <span className="text-yellow-400">✨</span>
              Відкрити свої таланти та сильні сторони
            </li>
            <li className="flex items-center gap-2">
              <span className="text-yellow-400">✨</span>
              Знайти професії, які найкраще підходять тобі
            </li>
            <li className="flex items-center gap-2">
              <span className="text-yellow-400">✨</span>
              Отримати персоналізовані рекомендації
            </li>
            <li className="flex items-center gap-2">
              <span className="text-yellow-400">✨</span>
              Дізнатися, які навички варто розвивати
            </li>
          </ul>
        </div>

        <div className="mb-8">
          <p className="text-white/60 text-sm mt-2">Готовий почати? Натисни кнопку нижче!</p>
        </div>

        <Link href="/student/survey">
          <button className="w-full p-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold hover:shadow-lg transition-all duration-300 text-lg">
            Почати магічний тест
          </button>
        </Link>
      </div>
    </main>
  )
} 