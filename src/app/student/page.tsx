'use client'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export default function StudentIntro() {
  const { t } = useTranslation('student')
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-teal-900 to-purple-900">
      <div className="max-w-lg w-full bg-gradient-to-br from-green-800/80 via-teal-800/80 to-purple-800/80 rounded-2xl p-8 shadow-2xl animate-fade-in">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-4xl">🎓</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{t('intro.title')}</h1>
            <p className="text-white/80">{t('intro.subtitle')}</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <p className="text-white/60">{t('intro.benefitsTitle', 'This magical test will help you:')}</p>
          <ul className="space-y-2 text-white/80">
            <li className="flex items-center gap-2">
              <span className="text-yellow-400">✨</span>
              {t('intro.benefit1', 'Discover your talents and strengths')}
            </li>
            <li className="flex items-center gap-2">
              <span className="text-yellow-400">✨</span>
              {t('intro.benefit2', 'Find professions that suit you best')}
            </li>
            <li className="flex items-center gap-2">
              <span className="text-yellow-400">✨</span>
              {t('intro.benefit3', 'Get personalized recommendations')}
            </li>
            <li className="flex items-center gap-2">
              <span className="text-yellow-400">✨</span>
              {t('intro.benefit4', 'Learn which skills to develop')}
            </li>
          </ul>
        </div>

        <div className="mb-8">
          <p className="text-white/60 text-sm mt-2">{t('intro.cta', 'Ready to start? Click the button below!')}</p>
        </div>

        <Link href="/student/survey">
          <button className="w-full p-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold hover:shadow-lg transition-all duration-300 text-lg">
            {t('intro.start', 'Start the magical test')}
          </button>
        </Link>
      </div>
    </main>
  )
} 