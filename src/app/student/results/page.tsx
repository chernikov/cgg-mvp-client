'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { analyzeSurveyResponses } from '@/lib/openai'
import type { ProfessionMatch } from '@/types/survey'

export default function Results() {
  const router = useRouter()
  const { t, i18n } = useTranslation('student')
  const [matches, setMatches] = useState<ProfessionMatch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const regenerateResults = async () => {
      const storedResponses = localStorage.getItem('surveyResponses')
      const storedMatches = localStorage.getItem('surveyMatches')
      
      if (storedResponses && storedMatches) {
        const responses = JSON.parse(storedResponses)
        const currentMatches = JSON.parse(storedMatches)
        
        // Check if we need to regenerate based on language
        const storedLanguage = localStorage.getItem('surveyLanguage')
        
        if (storedLanguage !== i18n.language) {
          // Language changed, regenerate AI responses
          try {
            const result = await analyzeSurveyResponses(responses, i18n.language)
            setMatches(result.matches)
            localStorage.setItem('surveyMatches', JSON.stringify(result.matches))
            localStorage.setItem('surveyLanguage', i18n.language)
          } catch (error) {
            console.error('Error regenerating results:', error)
            // Fallback to stored matches if regeneration fails
            setMatches(currentMatches)
          }
        } else {
          // Same language, use stored matches
          setMatches(currentMatches)
        }
      } else {
        router.push('/student/survey')
        return
      }
      
      setLoading(false)
    }

    regenerateResults()
  }, [router, i18n.language])

  const handleTryMagic = () => {
    router.push('/student/try-magic')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-teal-900 to-purple-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-green-900 via-teal-900 to-purple-900">
      <div className="max-w-4xl mx-auto">
        <div className="animate-fade-in bg-gradient-to-br from-green-800/80 via-teal-800/80 to-purple-800/80 rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">{t('results.title')}</h1>

          <div className="space-y-6">
            {matches.map((match, index) => (
              <div
                key={index}
                className="animate-slide-in bg-white/5 rounded-xl p-6"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">{match.title}</h2>
                  <span className="text-yellow-400 text-lg font-bold">{match.matchPercentage}%</span>
                </div>
                
                {match.fitReasons && (
                  <div className="mb-4">
                    <h3 className="text-green-300 font-semibold mb-2">{t('results.reasons')}:</h3>
                    <ul className="list-disc list-inside text-white/80">
                      {match.fitReasons.map((reason, i) => (
                        <li key={i}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {match.strongSkills && (
                  <div className="mb-4">
                    <h3 className="text-green-300 font-semibold mb-2">{t('results.strongSkills')}:</h3>
                    <ul className="list-disc list-inside text-white/80">
                      {match.strongSkills.map((skill, i) => (
                        <li key={i}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {match.skillsToImprove && match.skillsToImprove.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-green-300 font-semibold mb-2">{t('results.skillsToDevelop')}:</h3>
                    <ul className="list-disc list-inside text-white/80">
                      {match.skillsToImprove.map((skill, i) => (
                        <li key={i}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {match.salaryRange && (
                  <div className="mb-4">
                    <h3 className="text-green-300 font-semibold mb-2">{t('results.salary')}:</h3>
                    <div className="text-white/80">
                      <p>Junior: {match.salaryRange.junior}</p>
                      <p>Mid: {match.salaryRange.mid}</p>
                      <p>Senior: {match.salaryRange.senior}</p>
                    </div>
                  </div>
                )}

                {match.education && (
                  <div className="mb-4">
                    <h3 className="text-green-300 font-semibold mb-2">{t('results.education')}:</h3>
                    <div className="text-white/80">
                      <p className="font-semibold">{t('results.offline')}:</p>
                      <ul className="list-disc list-inside">
                        {match.education.offline.map((edu, i) => (
                          <li key={i}>{edu}</li>
                        ))}
                      </ul>
                      <p className="font-semibold mt-2">{t('results.online')}:</p>
                      <ul className="list-disc list-inside">
                        {match.education.online.map((edu, i) => (
                          <li key={i}>{edu}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {match.nextSteps && (
                  <div>
                    <h3 className="text-green-300 font-semibold mb-2">{t('results.nextSteps')}:</h3>
                    <ul className="list-disc list-inside text-white/80">
                      {match.nextSteps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleTryMagic}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {t('results.tryMagic')}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
} 