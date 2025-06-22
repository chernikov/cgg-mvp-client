'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { ProfessionMatch } from '@/types/survey';

export default function StepResultClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [stepIndex, setStepIndex] = useState(0);
  const [stepMatches, setStepMatches] = useState<unknown[]>([]);

  useEffect(() => {
    const step = Number(searchParams.get("step")) || 0;
    setStepIndex(step);
    setStepMatches(JSON.parse(localStorage.getItem(`stepMatches_${step}`) || '[]'));
  }, [searchParams]);

  const handleContinue = () => {
    if (stepIndex < 2) {
      router.push(`/magical-quest/survey?step=${stepIndex + 1}`);
    } else {
      router.push('/magical-quest/results');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-teal-900 to-purple-900">
      <div className="max-w-lg w-full bg-gradient-to-br from-green-800/80 via-teal-800/80 to-purple-800/80 rounded-2xl p-8 shadow-2xl animate-fade-in">
        <h1 className="text-2xl font-bold text-white mb-4">Результати кроку {stepIndex + 1}</h1>
        {/* AI matches for this step */}
        {stepMatches.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-green-200 mb-2">Професії, які рекомендує ШІ:</h2>
            <ul className="space-y-4">
              {stepMatches.map((match: unknown, idx: number) => {
                const m = match as ProfessionMatch;
                return (
                  <li key={idx} className="bg-white/10 rounded-lg p-4">
                    <div className="text-lg font-bold text-yellow-300 mb-1">{m.title} <span className="text-white/70">({m.matchPercentage}%)</span></div>
                    <div className="text-green-100 text-sm mb-1">Причини: {m.fitReasons?.join(', ')}</div>
                    <div className="text-green-100 text-sm mb-1">Сильні сторони: {m.strongSkills?.join(', ')}</div>
                    <div className="text-green-100 text-sm mb-1">Навички для розвитку: {m.skillsToImprove?.join(', ')}</div>
                    {m.salaryRange && (
                      <div className="text-green-100 text-sm mb-1">Зарплата: Junior {m.salaryRange.junior}, Mid {m.salaryRange.mid}, Senior {m.salaryRange.senior}</div>
                    )}
                    {m.education && (
                      <div className="text-green-100 text-sm mb-1">Освіта: Офлайн: {m.education.offline?.join(', ')}, Онлайн: {m.education.online?.join(', ')}</div>
                    )}
                    <div className="text-green-100 text-sm">Наступні кроки: {m.nextSteps?.join(', ')}</div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        <button
          onClick={handleContinue}
          className="w-full p-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-all duration-300 text-lg"
        >
          Продовжити
        </button>
      </div>
    </main>
  );
} 