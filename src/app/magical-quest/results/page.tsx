'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ProfessionMatch, SurveyResponse } from '@/types/survey'
import { useTranslation } from 'react-i18next'
import { useSaveTestResult } from '@/hooks/useQuestions'
import testResultsService from '@/services/test-results.service'
import surveyUtils from '@/utils/survey.utils'
import firebaseTestUtils from '@/utils/firebase-test.utils'
import DebugLogger from '@/components/DebugLogger'

export default function Results() {
  const router = useRouter()
  const { i18n } = useTranslation();
  const [matches, setMatches] = useState<ProfessionMatch[]>([])
  const [loading, setLoading] = useState(true)
  const { saveTestResult, isSaving } = useSaveTestResult()

  useEffect(() => {
    console.log('🎯 MagicalQuest Results: Component mounted')
    
    // Перевіряємо з'єднання з Firebase
    firebaseTestUtils.logFirebaseConfig()
    firebaseTestUtils.testConnection().then(connected => {
      console.log('🔗 Firebase connection status:', connected)
      if (connected) {
        firebaseTestUtils.checkTestResultsCollection()
      }
    })
    
    const storedMatches = localStorage.getItem('surveyMatches')
    const storedResponses = localStorage.getItem('surveyResponses')
    
    console.log('📂 Loading stored data from localStorage:')
    console.log('   - surveyMatches:', storedMatches ? 'Found' : 'Not found')
    console.log('   - surveyResponses:', storedResponses ? 'Found' : 'Not found')
    
    if (storedMatches) {
      const matchesData = JSON.parse(storedMatches)
      console.log('🎲 Parsed matches data:', matchesData)
      setMatches(matchesData)
      setLoading(false)
      
      // Зберігаємо результати в новому форматі, якщо ще не збережено
      const alreadySaved = localStorage.getItem('magicalQuestSaved')
      console.log('💾 Check if already saved:', alreadySaved)
      
      if (storedResponses && !alreadySaved) {
        console.log('🚀 Starting save process for magical quest results')
        
        const responses: SurveyResponse[] = JSON.parse(storedResponses)
        console.log('📋 Parsed responses:', responses)
        
        const userId = testResultsService.generateUserId()
        console.log('🆔 Generated user ID:', userId)
        
        const completionTime = surveyUtils.calculateCompletionTime('magical-quest')
        console.log('⏱️ Calculated completion time:', completionTime, 'seconds')
        
        const userMetadata = surveyUtils.loadUserMetadata()
        console.log('👤 Loaded user metadata:', userMetadata)
        
        const resultData = {
          userId,
          userType: 'student' as const, // За замовчуванням для магічного квесту
          questionnaireId: 'magical-quest',
          questionnaireName: 'Магічний квест професій',
          responses,
          matches: matchesData,
          metadata: {
            completionTime,
            ...userMetadata,
            additionalData: {
              language: i18n.language,
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent,
              ...userMetadata.additionalData
            }
          }
        }
        
        console.log('📦 Final result data to save:', resultData)
        
        saveTestResult(resultData).then((resultId) => {
          localStorage.setItem('magicalQuestSaved', 'true')
          localStorage.setItem('magicalQuestResultId', resultId)
          console.log('✅ Magical quest result saved with ID:', resultId)
          console.log('🧹 Cleaning up temporary data...')
          
          // Очищуємо тимчасові дані
          surveyUtils.clearSurveyTime('magical-quest')
          surveyUtils.clearProgress('magical-quest')
          
          console.log('🎉 Save process completed successfully!')
        }).catch((error) => {
          console.error('❌ Error saving magical quest result:', error)
          console.error('🔥 Error details:', error.message)
        })
      } else {
        if (alreadySaved) {
          console.log('ℹ️ Results already saved, skipping save process')
        }
        if (!storedResponses) {
          console.log('⚠️ No responses found, cannot save results')
        }
      }
    } else {
      console.log('❌ No matches found, redirecting to magical-quest')
      router.push('/magical-quest')
    }
  }, [router, i18n.language, saveTestResult])

  const handleTryMagic = () => {
    // Ensure matches and responses are in localStorage for the next page
    // (They should already be, but this is defensive)
    const responses = localStorage.getItem('surveyResponses');
    if (responses) {
      localStorage.setItem('surveyResponses', responses);
    }
    localStorage.setItem('surveyMatches', JSON.stringify(matches));
    router.push('/magical-quest/try-magic');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-teal-900 to-purple-900">
      <div className="max-w-lg w-full bg-gradient-to-br from-green-800/80 via-teal-800/80 to-purple-800/80 rounded-2xl p-8 shadow-2xl animate-fade-in">
        <h1 className="text-2xl font-bold text-white mb-4">Фінальні результати</h1>
        
        {/* Повідомлення про збереження */}
        {isSaving && (
          <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <p className="text-blue-200 text-sm">Збереження результатів...</p>
          </div>
        )}
        
        {localStorage.getItem('magicalQuestSaved') && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
            <p className="text-green-200 text-sm">✅ Результати збережено!</p>
          </div>
        )}
        {matches.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-green-200 mb-2">Професії, які рекомендує ШІ:</h2>
            <ul className="space-y-4">
              {matches.map((match, idx) => (
                <li key={idx} className="bg-white/10 rounded-lg p-4">
                  <div className="text-lg font-bold text-yellow-300 mb-1">{match.title} <span className="text-white/70">({match.matchPercentage}%)</span></div>
                  <div className="text-green-100 text-sm mb-1">Причини: {Array.isArray(match.fitReasons) && match.fitReasons.join(', ')}</div>
                  <div className="text-green-100 text-sm mb-1">Сильні сторони: {Array.isArray(match.strongSkills) && match.strongSkills.join(', ')}</div>
                  <div className="text-green-100 text-sm mb-1">Навички для розвитку: {Array.isArray(match.skillsToImprove) && match.skillsToImprove.join(', ')}</div>
                  {match.salaryRange && (
                    <div className="text-green-100 text-sm mb-1">Зарплата: Junior {match.salaryRange?.junior}, Mid {match.salaryRange?.mid}, Senior {match.salaryRange?.senior}</div>
                  )}
                  {match.education && (
                    <div className="text-green-100 text-sm mb-1">Освіта: Офлайн: {Array.isArray(match.education?.offline) && match.education.offline.join(', ')}, Онлайн: {Array.isArray(match.education?.online) && match.education.online.join(', ')}</div>
                  )}
                  <div className="text-green-100 text-sm">Наступні кроки: {Array.isArray(match.nextSteps) && match.nextSteps.join(', ')}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          onClick={handleTryMagic}
          className="w-full p-3 rounded-xl bg-yellow-500 text-white font-bold hover:bg-yellow-600 transition-all duration-300 text-lg"
        >
          {i18n.language === 'uk' ? 'Спробувати магію' : 'Try Magic'}
        </button>
      </div>
      <DebugLogger />
    </main>
  )
} 