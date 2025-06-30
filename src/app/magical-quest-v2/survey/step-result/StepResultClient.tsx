'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { ProfessionMatch } from '@/types/survey';
import { useTranslation } from 'react-i18next';

export default function StepResultClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [stepIndex, setStepIndex] = useState(0);
  const [stepMatches, setStepMatches] = useState<unknown[]>([]);
  const { t } = useTranslation('magical-quest-v2');

  useEffect(() => {
    const step = Number(searchParams.get("step")) || 0;
    setStepIndex(step);
    setStepMatches(JSON.parse(localStorage.getItem(`stepMatches_${step}`) || '[]'));
  }, [searchParams]);

  const handleContinue = () => {
    if (stepIndex < 2) {
      router.push(`/magical-quest-v2/survey?step=${stepIndex + 1}`);
    } else {
      router.push('/magical-quest-v2/results');
    }
  };

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
        <div className="w-full bg-white rounded-2xl p-8 shadow-xl flex flex-col items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">{t('survey.result.title')} {stepIndex + 1}</h1>
          {/* AI matches for this step */}
          {stepMatches.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-blue-600 mb-2">{t('survey.result.aiProfessions')}</h2>
              <ul className="space-y-4">
                {stepMatches.map((match: unknown, idx: number) => {
                  const m = match as ProfessionMatch;
                  return (
                    <li key={idx} className="bg-blue-50 rounded-lg p-4">
                      <div className="text-lg font-bold text-blue-700 mb-1">{m.title} <span className="text-gray-500">({m.matchPercentage}%)</span></div>
                      <div className="text-blue-800 text-sm mb-1">{t('survey.result.reasons')} {m.fitReasons?.join(', ')}</div>
                      <div className="text-blue-800 text-sm mb-1">{t('survey.result.strongSkills')} {m.strongSkills?.join(', ')}</div>
                      <div className="text-blue-800 text-sm mb-1">{t('survey.result.skillsToImprove')} {m.skillsToImprove?.join(', ')}</div>
                      {m.salaryRange && (
                        <div className="text-blue-800 text-sm mb-1">{t('survey.result.salary')} Junior {m.salaryRange.junior}, Mid {m.salaryRange.mid}, Senior {m.salaryRange.senior}</div>
                      )}
                      {m.education && (
                        <div className="text-blue-800 text-sm mb-1">{t('survey.result.education')} {t('results.offline')}: {m.education.offline?.join(', ')}, {t('results.online')}: {m.education.online?.join(', ')}</div>
                      )}
                      <div className="text-blue-800 text-sm">{t('survey.result.nextSteps')} {m.nextSteps?.join(', ')}</div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          <button
            onClick={handleContinue}
            className="w-full p-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all duration-300 text-lg"
          >
            {t('survey.result.continue')}
          </button>
        </div>
      </div>
    </main>
  );
} 