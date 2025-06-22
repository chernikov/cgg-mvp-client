"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function TeacherIntroPage() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const lang = i18n.language === 'uk' ? 'uk' : 'en';
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-teal-900 to-purple-900">
      <div className="max-w-lg w-full bg-gradient-to-br from-green-800/80 via-teal-800/80 to-purple-800/80 rounded-2xl p-8 shadow-2xl animate-fade-in flex flex-col items-center">
        <h1 className="text-2xl font-bold text-yellow-200 mb-4 text-center">
          {lang === 'uk'
            ? 'Вітаємо у магічній гільдії профорієнтації для вчителів!'
            : 'Welcome to the Magical Career Guidance Guild for Teachers!'}
        </h1>
        <p className="mb-4 text-gray-200 text-center">
          {lang === 'uk'
            ? 'Цей розділ допоможе вам краще зрозуміти потреби учнів та знайти сучасні підходи до профорієнтації.'
            : 'This section will help you better understand students’ needs and discover modern approaches to career guidance.'}
        </p>
        <p className="mb-4 text-gray-200 text-center">
          {lang === 'uk'
            ? 'Відповідайте на питання, щоб отримати персоналізовані рекомендації та інструменти для підтримки ваших учнів.'
            : 'Answer the questions to receive personalized recommendations and tools to support your students.'}
        </p>
        <button
          className="mt-4 px-6 py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-all duration-300 text-lg"
          onClick={() => router.push('/teacher/survey')}
        >
          {lang === 'uk' ? 'Почати' : 'Start'}
        </button>
      </div>
    </main>
  );
} 