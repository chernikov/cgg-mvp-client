'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ProfessionMatch } from '@/types/survey'
import { useTranslation } from 'react-i18next'

export default function TryMagicResults() {
  const router = useRouter()
  const { t } = useTranslation('magical-quest-v2')
  const [matches, setMatches] = useState<ProfessionMatch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedResult = localStorage.getItem('tryMagicResultV2')
    if (storedResult) {
      const parsed = JSON.parse(storedResult)
      setMatches(parsed.matches || [])
      setLoading(false)
    } else {
      router.push('/magical-quest-v2/try-magic')
    }
  }, [router])

  const handleStartAgain = () => {
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-200">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-400"></div>
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
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">{t('tryMagicResults.title')}</h1>
          {matches.length > 0 && (
            <div className="mb-8 w-full">
              <h2 className="text-xl font-bold text-blue-600 mb-2 text-center">{t('tryMagicResults.recommendedProfessions')}</h2>
              <ul className="space-y-6">
                {matches.map((match, idx) => (
                  <li key={idx} className="bg-blue-50 rounded-xl p-6 shadow flex flex-col mb-2">
                    <div className="text-lg font-bold text-blue-700 mb-1">{match.title} <span className="text-gray-500">({match.matchPercentage}%)</span></div>
                    <div className="text-gray-700 text-sm mb-1"><span className="font-semibold">{t('tryMagicResults.reasons')}</span> {Array.isArray(match.fitReasons) ? match.fitReasons.join(', ') : match.fitReasons}</div>
                    <div className="text-gray-700 text-sm mb-1"><span className="font-semibold">{t('tryMagicResults.strongSkills')}</span> {Array.isArray(match.strongSkills) ? match.strongSkills.join(', ') : match.strongSkills}</div>
                    <div className="text-gray-700 text-sm mb-1"><span className="font-semibold">{t('tryMagicResults.skillsToImprove')}</span> {Array.isArray(match.skillsToImprove) ? match.skillsToImprove.join(', ') : match.skillsToImprove}</div>
                    {match.salaryRange && (
                      <div className="text-gray-700 text-sm mb-1"><span className="font-semibold">{t('tryMagicResults.salaryRange')}</span> Junior {match.salaryRange.junior}, Mid {match.salaryRange.mid}, Senior {match.salaryRange.senior}</div>
                    )}
                    {match.education && (
                      <div className="text-gray-700 text-sm mb-1"><span className="font-semibold">{t('tryMagicResults.education')}</span> {t('tryMagicResults.offline')}: {Array.isArray(match.education.offline) ? match.education.offline.join(', ') : match.education.offline}, {t('tryMagicResults.online')}: {Array.isArray(match.education.online) ? match.education.online.join(', ') : match.education.online}</div>
                    )}
                    <div className="text-gray-700 text-sm"><span className="font-semibold">{t('tryMagicResults.nextSteps')}</span> {Array.isArray(match.nextSteps) ? match.nextSteps.join(', ') : match.nextSteps}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button
            onClick={handleStartAgain}
            className="w-full p-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all duration-300 text-lg"
          >
            {t('tryMagicResults.startAgain')}
          </button>
        </div>
      </div>
    </main>
  )
} 