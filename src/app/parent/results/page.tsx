"use client";
import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function ParentResultsPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'uk' ? 'uk' : 'en';

  // Example static data for three professions
  const exampleResults = [
    {
      title: lang === 'uk' ? 'Карʼєрний консультант для підлітків' : 'Teen Career Consultant',
      matchPercentage: 90,
      fitReasons: [
        lang === 'uk' ? 'Ви активно підтримуєте дитину у виборі професії' : 'You actively support your child in career choice',
        lang === 'uk' ? 'Ви цікавитесь сучасними підходами до профорієнтації' : 'You are interested in modern career guidance approaches'
      ],
      strongSkills: [
        lang === 'uk' ? 'Комунікація' : 'Communication',
        lang === 'uk' ? 'Підтримка' : 'Support'
      ],
      skillsToImprove: [
        lang === 'uk' ? 'Використання цифрових інструментів' : 'Using digital tools'
      ],
      salaryRange: {
        junior: '18 000₴',
        mid: '30 000₴',
        senior: '45 000₴'
      },
      education: {
        offline: [lang === 'uk' ? 'Педагогічний університет' : 'Pedagogical University'],
        online: [lang === 'uk' ? 'Курси для батьків' : 'Parenting courses']
      },
      nextSteps: [
        lang === 'uk' ? 'Ознайомитись з сучасними платформами для профорієнтації' : 'Explore modern career guidance platforms',
        lang === 'uk' ? 'Відвідати вебінар для батьків' : 'Attend a webinar for parents'
      ]
    },
    {
      title: lang === 'uk' ? 'Координатор сімейних освітніх програм' : 'Family Education Program Coordinator',
      matchPercentage: 85,
      fitReasons: [
        lang === 'uk' ? 'Ви організовуєте освітні заходи для сімʼї' : 'You organize educational activities for your family',
        lang === 'uk' ? 'Ви прагнете до розвитку дитини' : 'You strive for your child\'s development'
      ],
      strongSkills: [
        lang === 'uk' ? 'Організація' : 'Organization',
        lang === 'uk' ? 'Мотивація' : 'Motivation'
      ],
      skillsToImprove: [
        lang === 'uk' ? 'Пошук партнерських програм' : 'Finding partnership programs'
      ],
      salaryRange: {
        junior: '16 000₴',
        mid: '28 000₴',
        senior: '40 000₴'
      },
      education: {
        offline: [lang === 'uk' ? 'Університет менеджменту' : 'University of Management'],
        online: [lang === 'uk' ? 'Курси з організації заходів' : 'Event organization courses']
      },
      nextSteps: [
        lang === 'uk' ? 'Організувати сімейний проєкт' : 'Organize a family project',
        lang === 'uk' ? 'Залучити дитину до гуртків' : 'Engage your child in clubs'
      ]
    },
    {
      title: lang === 'uk' ? 'Партнер освітніх ініціатив' : 'Educational Initiatives Partner',
      matchPercentage: 80,
      fitReasons: [
        lang === 'uk' ? 'Ви підтримуєте інновації в освіті' : 'You support innovation in education',
        lang === 'uk' ? 'Ви відкриті до нових ідей' : 'You are open to new ideas'
      ],
      strongSkills: [
        lang === 'uk' ? 'Креативність' : 'Creativity',
        lang === 'uk' ? 'Гнучкість' : 'Flexibility'
      ],
      skillsToImprove: [
        lang === 'uk' ? 'Нетворкінг' : 'Networking'
      ],
      salaryRange: {
        junior: '15 000₴',
        mid: '25 000₴',
        senior: '35 000₴'
      },
      education: {
        offline: [lang === 'uk' ? 'Інститут інноваційної освіти' : 'Institute of Innovative Education'],
        online: [lang === 'uk' ? 'Курси з інновацій' : 'Innovation courses']
      },
      nextSteps: [
        lang === 'uk' ? 'Долучитись до спільноти батьків' : 'Join a parent community',
        lang === 'uk' ? 'Взяти участь у спільних проєктах' : 'Participate in joint projects'
      ]
    }
  ];

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-teal-900 to-purple-900">
      <div className="max-w-lg w-full bg-gradient-to-br from-green-800/80 via-teal-800/80 to-purple-800/80 rounded-2xl p-8 shadow-2xl animate-fade-in">
        <h1 className="text-2xl font-bold text-white mb-4">
          {lang === 'uk' ? 'Приклад результатів опитування' : 'Example Survey Results'}
        </h1>
        <div className="mb-8">
          <h2 className="text-xl font-bold text-green-200 mb-2">
            {lang === 'uk' ? 'Професії, які рекомендує система:' : 'Professions recommended by the system:'}
          </h2>
          <ul className="space-y-4">
            {exampleResults.map((match, idx) => (
              <li key={idx} className="bg-white/10 rounded-lg p-4">
                <div className="text-lg font-bold text-yellow-300 mb-1">{match.title} <span className="text-white/70">({match.matchPercentage}%)</span></div>
                <div className="text-green-100 text-sm mb-1">{lang === 'uk' ? 'Причини:' : 'Reasons:'} {match.fitReasons.join(', ')}</div>
                <div className="text-green-100 text-sm mb-1">{lang === 'uk' ? 'Сильні сторони:' : 'Strong skills:'} {match.strongSkills.join(', ')}</div>
                <div className="text-green-100 text-sm mb-1">{lang === 'uk' ? 'Навички для розвитку:' : 'Skills to improve:'} {match.skillsToImprove.join(', ')}</div>
                <div className="text-green-100 text-sm mb-1">{lang === 'uk' ? 'Зарплата:' : 'Salary:'} Junior {match.salaryRange.junior}, Mid {match.salaryRange.mid}, Senior {match.salaryRange.senior}</div>
                <div className="text-green-100 text-sm mb-1">{lang === 'uk' ? 'Освіта:' : 'Education:'} Офлайн: {match.education.offline.join(', ')}, Онлайн: {match.education.online.join(', ')}</div>
                <div className="text-green-100 text-sm">{lang === 'uk' ? 'Наступні кроки:' : 'Next steps:'} {match.nextSteps.join(', ')}</div>
              </li>
            ))}
          </ul>
        </div>
        <Link
          href="/"
          className="w-full block text-center p-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-all duration-300 text-lg"
        >
          {lang === 'uk' ? 'На головну' : 'Back Home'}
        </Link>
      </div>
    </main>
  );
} 