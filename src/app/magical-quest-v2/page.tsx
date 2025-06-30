'use client';

import Link from 'next/link'
import { useTranslation } from 'react-i18next';

export default function MagicalQuestIntro() {
  const { t } = useTranslation('magical-quest-v2');

  return (
    <main className="min-h-screen w-full flex items-center justify-center relative overflow-x-hidden">
      {/* Blue gradient background, always behind content */}
      <div className="fixed inset-0 w-full h-full bg-gradient-to-b from-white to-blue-200 -z-10" aria-hidden="true" />
      <div className="flex flex-col items-center w-full max-w-md">
        {/* Header with crown and CareerGG */}
        <div className="flex items-center gap-2 mb-8 mt-4">
          <span className="text-3xl">👑</span>
          <span className="text-2xl font-bold text-gray-700">CareerGG</span>
        </div>
        {/* Main card */}
        <div className="w-full bg-white rounded-2xl p-8 shadow-xl flex flex-col items-center">
          <span className="text-5xl mb-4">🧹</span>
          <h1 className="text-2xl font-bold text-gray-700 mb-2 text-center">{t('intro.title')}</h1>
          <p className="text-gray-600 text-center mb-2">{t('intro.subtitle')}</p>
        </div>
        <div className="mt-8 mb-8">
          <p className="text-gray-700 text-center text-base">{t('intro.progress')}</p>
        </div>
        <Link
          href="/magical-quest-v2/survey"
          className="w-full p-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all duration-300 text-lg flex justify-center items-center text-center"
        >
          {t('intro.start')}
        </Link>
      </div>
    </main>
  )
} 