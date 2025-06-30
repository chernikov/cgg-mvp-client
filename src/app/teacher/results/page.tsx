"use client";
import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

interface Profession {
  title: string;
  fit_reasons: string[];
  strong_skills: string[];
  skills_to_improve: string[];
  education_offline: string[];
  education_online: string[];
  next_steps: string[];
}

export default function TeacherResultsPage() {
  const { t } = useTranslation('teacher');

  // Example static data for three professions using translation keys
  const exampleResults = [
    {
      professionKey: 'career_consultant',
      matchPercentage: 92,
      salaryRange: {
        junior: '20 000₴',
        mid: '35 000₴',
        senior: '50 000₴'
      }
    },
    {
      professionKey: 'education_methodologist',
      matchPercentage: 87,
      salaryRange: {
        junior: '18 000₴',
        mid: '30 000₴',
        senior: '45 000₴'
      }
    },
    {
      professionKey: 'extracurricular_coordinator',
      matchPercentage: 81,
      salaryRange: {
        junior: '16 000₴',
        mid: '28 000₴',
        senior: '40 000₴'
      }
    }
  ];

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-teal-900 to-purple-900">
      <div className="max-w-lg w-full bg-gradient-to-br from-green-800/80 via-teal-800/80 to-purple-800/80 rounded-2xl p-8 shadow-2xl animate-fade-in">
        <h1 className="text-2xl font-bold text-white mb-4">
          {t('results.title')}
        </h1>
        <div className="mb-8">
          <h2 className="text-xl font-bold text-green-200 mb-2">
            {t('results.subtitle')}
          </h2>
          <ul className="space-y-4">
            {exampleResults.map((match, idx) => {
              const profession = t(`results.professions.${match.professionKey}`, { returnObjects: true }) as Profession;
              return (
                <li key={idx} className="bg-white/10 rounded-lg p-4">
                  <div className="text-lg font-bold text-yellow-300 mb-1">
                    {profession.title} <span className="text-white/70">({match.matchPercentage}%)</span>
                  </div>
                  <div className="text-green-100 text-sm mb-1">
                    {t('results.reasons')} {profession.fit_reasons.join(', ')}
                  </div>
                  <div className="text-green-100 text-sm mb-1">
                    {t('results.strong_skills')} {profession.strong_skills.join(', ')}
                  </div>
                  <div className="text-green-100 text-sm mb-1">
                    {t('results.skills_to_improve')} {profession.skills_to_improve.join(', ')}
                  </div>
                  <div className="text-green-100 text-sm mb-1">
                    {t('results.salary')} Junior {match.salaryRange.junior}, Mid {match.salaryRange.mid}, Senior {match.salaryRange.senior}
                  </div>
                  <div className="text-green-100 text-sm mb-1">
                    {t('results.education')} Офлайн: {profession.education_offline.join(', ')}, Онлайн: {profession.education_online.join(', ')}
                  </div>
                  <div className="text-green-100 text-sm">
                    {t('results.next_steps')} {profession.next_steps.join(', ')}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <Link
          href="/"
          className="w-full block text-center p-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-all duration-300 text-lg"
        >
          {t('results.back_home')}
        </Link>
      </div>
    </main>
  );
} 