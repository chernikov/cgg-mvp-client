"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function ParentIntroPage() {
  const router = useRouter();
  const { t } = useTranslation('parent');
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-teal-900 to-purple-900">
      <div className="max-w-lg w-full bg-gradient-to-br from-green-800/80 via-teal-800/80 to-purple-800/80 rounded-2xl p-8 shadow-2xl animate-fade-in flex flex-col items-center">
        <h1 className="text-2xl font-bold text-yellow-200 mb-4 text-center">
          {t('intro.title')}
        </h1>
        <p className="mb-4 text-gray-200 text-center">
          {t('intro.subtitle1')}
        </p>
        <p className="mb-4 text-gray-200 text-center">
          {t('intro.subtitle2')}
        </p>
        <button
          className="mt-4 px-6 py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-all duration-300 text-lg"
          onClick={() => router.push('/parent/survey')}
        >
          {t('intro.start')}
        </button>
      </div>
    </main>
  );
} 