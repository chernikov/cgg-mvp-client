'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ProfessionMatch } from '@/types/survey'
import { useTranslation } from 'react-i18next'
import { db, auth } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

export default function Results() {
  const router = useRouter()
  const { i18n, t } = useTranslation('magical-quest-v2');
  const [matches, setMatches] = useState<ProfessionMatch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedMatches = localStorage.getItem('surveyMatches')
    const storedResponses = localStorage.getItem('surveyResponses')
    if (storedMatches) {
      setMatches(JSON.parse(storedMatches))
      setLoading(false)
      // Save to Firestore if not already saved
      if (storedResponses && !localStorage.getItem('magicalQuestSaved')) {
        addDoc(collection(db, 'magical_quest_surveys'), {
          userId: auth.currentUser?.uid || 'anonymous',
          responses: JSON.parse(storedResponses),
          matches: JSON.parse(storedMatches),
          timestamp: new Date().toISOString(),
          language: i18n.language,
          tryMagicHistory: []
        }).then(docRef => {
          localStorage.setItem('magicalQuestSaved', 'true');
          localStorage.setItem('magicalQuestDocId', docRef.id);
        });
      }
    } else {
      router.push('/magical-quest')
    }
  }, [router, i18n.language])

  const handleTryMagic = () => {
    // Ensure matches and responses are in localStorage for the next page
    // (They should already be, but this is defensive)
    const responses = localStorage.getItem('surveyResponses');
    if (responses) {
      localStorage.setItem('surveyResponses', responses);
    }
    localStorage.setItem('surveyMatches', JSON.stringify(matches));
    router.push('/magical-quest-v2/try-magic');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

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
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">{t('results.title')}</h1>
          {matches.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-blue-600 mb-2">{t('results.subtitle')}</h2>
              <ul className="space-y-4">
                {matches.map((match, idx) => (
                  <li key={idx} className="bg-blue-50 rounded-lg p-4">
                    <div className="text-lg font-bold text-blue-700 mb-1">{match.title} <span className="text-gray-500">({match.matchPercentage}%)</span></div>
                    <div className="text-blue-800 text-sm mb-1">{t('results.reasons')}: {Array.isArray(match.fitReasons) && match.fitReasons.join(', ')}</div>
                    <div className="text-blue-800 text-sm mb-1">{t('results.strongSkills')}: {Array.isArray(match.strongSkills) && match.strongSkills.join(', ')}</div>
                    <div className="text-blue-800 text-sm mb-1">{t('results.skillsToDevelop')}: {Array.isArray(match.skillsToImprove) && match.skillsToImprove.join(', ')}</div>
                    {match.salaryRange && (
                      <div className="text-blue-800 text-sm mb-1">{t('results.salary')}: Junior {match.salaryRange?.junior}, Mid {match.salaryRange?.mid}, Senior {match.salaryRange?.senior}</div>
                    )}
                    {match.education && (
                      <div className="text-blue-800 text-sm mb-1">{t('results.education')}: {t('results.offline')}: {Array.isArray(match.education?.offline) && match.education.offline.join(', ')}, {t('results.online')}: {Array.isArray(match.education?.online) && match.education.online.join(', ')}</div>
                    )}
                    <div className="text-blue-800 text-sm">{t('results.nextSteps')}: {Array.isArray(match.nextSteps) && match.nextSteps.join(', ')}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button
            onClick={handleTryMagic}
            className="w-full p-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all duration-300 text-lg"
          >
            {t('results.tryMagic')}
          </button>
        </div>
      </div>
    </main>
  )
} 