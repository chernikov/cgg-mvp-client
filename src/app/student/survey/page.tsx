'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { magicalQuestQuestions } from '@/config/questions'
import { analyzeSurveyResponses } from '@/lib/openai'
import type { SurveyResponse } from '@/types/survey'
import { useTranslation } from 'react-i18next'
import { db, auth } from '@/config/firebase'
import { collection, addDoc } from 'firebase/firestore'

// Magic loading messages for loader
const magicLoadingMessages = [
  {
    title: "Магія працює...",
    desc: "Твої найкращі кар'єрні можливості вже формуються. Зачекай, поки магічні дані збираються!"
  },
  {
    title: "Чарівний пилок аналізує твої відповіді...",
    desc: "Незабаром з'являться професії, які змінять твоє майбутнє!"
  },
  {
    title: "Чарівна куля обирає твій шлях...",
    desc: "Трохи терпіння — і ти побачиш свої магічні результати!"
  },
  {
    title: "Магічний портал відкривається...",
    desc: "Твої таланти вже шукають найкращі професії!"
  },
  {
    title: "Чарівник готує для тебе унікальні можливості...",
    desc: "Зачекай, поки магія завершить свою роботу!"
  }
];

// Combine all questions into a single array
const allQuestions = [
  ...magicalQuestQuestions.quest1,
  ...magicalQuestQuestions.quest2,
  ...magicalQuestQuestions.quest3
] as Question[];

type Question = {
  id: string
  question: string
  type: 'text' | 'email' | 'number' | 'select' | 'multiselect' | 'textarea'
  placeholder?: string
  options?: string[]
  min?: number
  max?: number
}

export default function StudentSurvey() {
  const router = useRouter()
  const { i18n } = useTranslation()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<SurveyResponse[]>([])
  const [textInput, setTextInput] = useState('')
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [loadingAI, setLoadingAI] = useState(false)
  const [magicMsg, setMagicMsg] = useState(magicLoadingMessages[0])

  const currentQuestion: Question = allQuestions[currentQuestionIndex]
  const totalQuestions = allQuestions.length
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100

  useEffect(() => {
    setMagicMsg(magicLoadingMessages[Math.floor(Math.random() * magicLoadingMessages.length)])
  }, [])

  const handleAnswer = async (answer: string | string[]) => {
    const newResponse: SurveyResponse = {
      questionId: currentQuestion.id,
      answerId: Array.isArray(answer) ? answer.join(',') : answer
    }
    
    const updatedResponses = [...responses, newResponse]
    setResponses(updatedResponses)
    
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setTextInput('')
      setSelectedOptions([])
    } else {
      setLoadingAI(true)
      try {
        // Save responses to localStorage
        localStorage.setItem('surveyResponses', JSON.stringify(updatedResponses))
        // Get AI analysis
        const result = await analyzeSurveyResponses(updatedResponses, i18n.language)
        // Save matches to localStorage
        localStorage.setItem('surveyMatches', JSON.stringify(result.matches))
        // Save to Firestore
        if (db) {
          await addDoc(collection(db, 'student_surveys'), {
            userId: auth?.currentUser?.uid || 'anonymous',
            responses: updatedResponses,
            matches: result.matches,
            timestamp: new Date().toISOString(),
            language: i18n.language
          })
        }
        // Hide loader and redirect
        setLoadingAI(false)
        router.push('/student/results')
      } catch (error) {
        console.error('Error processing survey:', error)
        setLoadingAI(false)
      }
    }
  }

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (textInput.trim()) {
      handleAnswer(textInput)
    }
  }

  const handleOptionSelect = (option: string) => {
    if (currentQuestion.type === 'multiselect') {
      const newOptions = selectedOptions.includes(option)
        ? selectedOptions.filter(o => o !== option)
        : [...selectedOptions, option]
      setSelectedOptions(newOptions)
    } else {
      handleAnswer(option)
    }
  }

  const handleMultiSelectSubmit = () => {
    if (selectedOptions.length > 0) {
      handleAnswer(selectedOptions)
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setTextInput('')
      setSelectedOptions([])
    }
  }

  if (loadingAI) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-teal-900 to-purple-900">
        <div className="max-w-lg w-full bg-gradient-to-br from-green-800/80 via-teal-800/80 to-purple-800/80 rounded-2xl p-8 shadow-2xl animate-fade-in flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-yellow-400 mb-6"></div>
          <h2 className="text-2xl font-bold text-yellow-200 mb-2 text-center">{magicMsg.title}</h2>
          <p className="text-green-100 text-lg text-center">{magicMsg.desc}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-teal-900 to-purple-900">
      <div className="max-w-lg w-full">
        <div className="bg-gradient-to-br from-green-800/80 via-teal-800/80 to-purple-800/80 rounded-2xl p-8 shadow-2xl animate-fade-in">
          {/* Progress bar */}
          <div className="flex justify-between items-center text-white/80 text-sm mb-1">
            <span>Питання {currentQuestionIndex + 1} з {totalQuestions}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full bg-gradient-to-r from-purple-400 via-teal-400 to-green-400 rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 via-teal-400 to-purple-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Question */}
          <h2 className="text-xl font-bold text-green-100 mb-4 text-center">{currentQuestion.question}</h2>

          <div className="space-y-4">
            {currentQuestion.type === 'text' || currentQuestion.type === 'email' || currentQuestion.type === 'number' ? (
              <form onSubmit={handleTextSubmit} className="space-y-4">
                <input
                  type={currentQuestion.type}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  min={currentQuestion.type === 'number' && 'min' in currentQuestion ? currentQuestion.min : undefined}
                  max={currentQuestion.type === 'number' && 'max' in currentQuestion ? currentQuestion.max : undefined}
                  className="w-full p-4 rounded-xl bg-white text-green-900 placeholder-green-400 border-2 border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-lg"
                  required
                />
                <div className="flex gap-4 mt-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={currentQuestionIndex === 0}
                    className="flex-1 px-6 py-3 rounded-xl bg-green-900 text-green-200 font-bold hover:bg-green-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Назад
                  </button>
                  <button
                    type="submit"
                    className="flex-1 p-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-all duration-300 text-lg"
                  >
                    Далі
                  </button>
                </div>
              </form>
            ) : currentQuestion.type === 'select' || currentQuestion.type === 'multiselect' ? (
              <>
                <div className="space-y-2">
                  {currentQuestion.options?.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleOptionSelect(option)}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-300 border-2 text-lg ${
                        selectedOptions.includes(option)
                          ? 'bg-green-400 text-green-900 border-green-500 font-bold'
                          : 'bg-white text-green-900 border-green-200 hover:bg-green-100'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {currentQuestion.type === 'multiselect' && (
                  <div className="flex gap-4 mt-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={currentQuestionIndex === 0}
                      className="flex-1 px-6 py-3 rounded-xl bg-green-900 text-green-200 font-bold hover:bg-green-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Назад
                    </button>
                    <button
                      onClick={handleMultiSelectSubmit}
                      disabled={selectedOptions.length === 0}
                      className="flex-1 p-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    >
                      Далі
                    </button>
                  </div>
                )}
              </>
            ) : currentQuestion.type === 'textarea' ? (
              <form onSubmit={handleTextSubmit} className="space-y-4">
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  className="w-full p-4 rounded-xl bg-white text-green-900 placeholder-green-400 border-2 border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 min-h-[120px] text-lg"
                  required
                />
                <div className="flex gap-4 mt-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={currentQuestionIndex === 0}
                    className="flex-1 px-6 py-3 rounded-xl bg-green-900 text-green-200 font-bold hover:bg-green-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Назад
                  </button>
                  <button
                    type="submit"
                    className="flex-1 p-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-all duration-300 text-lg"
                  >
                    Далі
                  </button>
                </div>
              </form>
            ) : null}
          </div>

          {/* Motivational message */}
          <div className="mt-8 text-center text-green-100 text-lg font-semibold">
            Ти чудово справляєшся! Продовжуй, юний маге!
          </div>
        </div>
      </div>
    </main>
  )
} 