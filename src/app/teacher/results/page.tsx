"use client";
import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function TeacherResultsPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'uk' ? 'uk' : 'en';

  // Example static data for three professions
  const exampleResults = [
    {
      title: lang === 'uk' ? 'Карʼєрний консультант' : 'Career Consultant',
      matchPercentage: 92,
      fitReasons: [
        lang === 'uk' ? 'Ви маєте досвід роботи з учнями' : 'You have experience working with students',
        lang === 'uk' ? 'Ви цікавитесь сучасними професіями' : 'You are interested in modern professions'
      ],
      strongSkills: [
        lang === 'uk' ? 'Комунікація' : 'Communication',
        lang === 'uk' ? 'Аналіз' : 'Analysis'
      ],
      skillsToImprove: [
        lang === 'uk' ? 'Використання AI-інструментів' : 'Using AI tools'
      ],
      salaryRange: {
        junior: '20 000₴',
        mid: '35 000₴',
        senior: '50 000₴'
      },
      education: {
        offline: [lang === 'uk' ? 'Педагогічний університет' : 'Pedagogical University'],
        online: [lang === 'uk' ? 'Курси профорієнтації' : 'Career Guidance Courses']
      },
      nextSteps: [
        lang === 'uk' ? 'Ознайомитись з сучасними AI-інструментами' : 'Explore modern AI tools',
        lang === 'uk' ? 'Відвідати профорієнтаційний семінар' : 'Attend a career guidance seminar'
      ]
    },
    {
      title: lang === 'uk' ? 'Методист з освіти' : 'Education Methodologist',
      matchPercentage: 87,
      fitReasons: [
        lang === 'uk' ? 'Ви маєте глибокі знання у своїй предметній області' : 'You have deep knowledge in your subject area',
        lang === 'uk' ? 'Ви прагнете вдосконалювати навчальний процес' : 'You strive to improve the educational process'
      ],
      strongSkills: [
        lang === 'uk' ? 'Організація' : 'Organization',
        lang === 'uk' ? 'Креативність' : 'Creativity'
      ],
      skillsToImprove: [
        lang === 'uk' ? 'Впровадження нових технологій' : 'Implementing new technologies'
      ],
      salaryRange: {
        junior: '18 000₴',
        mid: '30 000₴',
        senior: '45 000₴'
      },
      education: {
        offline: [lang === 'uk' ? 'Педагогічний інститут' : 'Pedagogical Institute'],
        online: [lang === 'uk' ? 'Курси з інновацій в освіті' : 'Courses on educational innovation']
      },
      nextSteps: [
        lang === 'uk' ? 'Взяти участь у тренінгу з інновацій' : 'Participate in an innovation training',
        lang === 'uk' ? 'Підготувати власний освітній проєкт' : 'Prepare your own educational project'
      ]
    },
    {
      title: lang === 'uk' ? 'Координатор позашкільної освіти' : 'Extracurricular Education Coordinator',
      matchPercentage: 81,
      fitReasons: [
        lang === 'uk' ? 'Ви активно залучаєте учнів до позакласних заходів' : 'You actively involve students in extracurricular activities',
        lang === 'uk' ? 'Ви маєте організаторські здібності' : 'You have organizational skills'
      ],
      strongSkills: [
        lang === 'uk' ? 'Лідерство' : 'Leadership',
        lang === 'uk' ? 'Мотивація' : 'Motivation'
      ],
      skillsToImprove: [
        lang === 'uk' ? 'Пошук партнерів для проєктів' : 'Finding project partners'
      ],
      salaryRange: {
        junior: '16 000₴',
        mid: '28 000₴',
        senior: '40 000₴'
      },
      education: {
        offline: [lang === 'uk' ? 'Університет менеджменту' : 'University of Management'],
        online: [lang === 'uk' ? 'Курси з лідерства' : 'Leadership courses']
      },
      nextSteps: [
        lang === 'uk' ? 'Організувати новий гурток або секцію' : 'Organize a new club or section',
        lang === 'uk' ? 'Залучити учнів до волонтерських проєктів' : 'Engage students in volunteer projects'
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