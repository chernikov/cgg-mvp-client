'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ProfessionMatch } from '@/types/survey'

export default function TryMagicResults() {
  const router = useRouter()
  const [matches, setMatches] = useState<ProfessionMatch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedResult = localStorage.getItem('tryMagicResult')
    if (storedResult) {
      const parsed = JSON.parse(storedResult)
      setMatches(parsed.matches || [])
      setLoading(false)
    } else {
      router.push('/student/try-magic')
    }
  }, [router])

  const handleStartAgain = () => {
    router.push('/student')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-teal-900 to-purple-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-teal-900 to-purple-900">
      <div className="max-w-lg w-full bg-gradient-to-br from-green-800/80 via-teal-800/80 to-purple-800/80 rounded-2xl p-8 shadow-2xl animate-fade-in">
        <h1 className="text-2xl font-bold text-white mb-4">Результати магії</h1>
        {matches.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-green-200 mb-2">Професії, які рекомендує ШІ:</h2>
            <ul className="space-y-4">
              {matches.map((match, idx) => (
                <li key={idx} className="bg-white/10 rounded-lg p-4">
                  <div className="text-lg font-bold text-yellow-300 mb-1">{match.title} <span className="text-white/70">({match.matchPercentage}%)</span></div>
                  {match.fitReasons && (
                    <div className="text-green-100 text-sm mb-1">Причини: {Array.isArray(match.fitReasons) && match.fitReasons.join(', ')}</div>
                  )}
                  {match.strongSkills && (
                    <div className="text-green-100 text-sm mb-1">Сильні сторони: {Array.isArray(match.strongSkills) && match.strongSkills.join(', ')}</div>
                  )}
                  {match.skillsToImprove && (
                    <div className="text-green-100 text-sm mb-1">Навички для розвитку: {Array.isArray(match.skillsToImprove) && match.skillsToImprove.join(', ')}</div>
                  )}
                  {match.salaryRange && (
                    <div className="text-green-100 text-sm mb-1">Зарплата: Junior {match.salaryRange.junior}, Mid {match.salaryRange.mid}, Senior {match.salaryRange.senior}</div>
                  )}
                  {match.education && (
                    <div className="text-green-100 text-sm mb-1">Освіта: Офлайн: {Array.isArray(match.education.offline) && match.education.offline.join(', ')}, Онлайн: {Array.isArray(match.education.online) && match.education.online.join(', ')}</div>
                  )}
                  {match.nextSteps && (
                    <div className="text-green-100 text-sm">Наступні кроки: {Array.isArray(match.nextSteps) && match.nextSteps.join(', ')}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          onClick={handleStartAgain}
          className="w-full p-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-all duration-300 text-lg mt-4"
        >
          Почати спочатку
        </button>
      </div>
    </main>
  )
} 