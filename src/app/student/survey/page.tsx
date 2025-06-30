'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { magicalQuestQuestions } from '@/config/questions'
import { analyzeSurveyResponses } from '@/lib/openai'
import type { SurveyResponse } from '@/types/survey'
import { useTranslation } from 'react-i18next'
import { db, auth } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

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

// Autofill answers for testing
const TEST_ANSWERS: Record<string, string | string[]> = {
  email: "test.student@gmail.com",
  nickname: "Олександр",
  age: "15",
  gender: "Boy",
  country_of_birth: "Ukraine",
  current_mood: "Good, because it's sunny today and I got a good grade.",
  hobby: "I play guitar, I love football.",
  habits: "I wake up at 7 AM, I read before bed.",
  top_abilities: "Teamwork, creativity, problem solving",
  abilities_to_develop: "Public speaking, time management, English language",
  chosen_profession: "Programmer",
  favorite_character: "Harry Potter, because he is brave and always helps his friends.",
  antihero: "Voldemort, because he is evil and selfish.",
  admired_relative: "Mom, because she always supports me.",
  not_like_relative: "Uncle, because he often gets angry.",
  bonus_characteristics: "I love helping others, I'm interested in science.",
  learning_new_things_ease: "8",
  preferred_learning_methods: ["Visual", "Kinesthetic"],
  quick_school_task_situation: "I did my homework in 30 minutes because I concentrated and turned off my phone.",
  effort_for_results: "9",
  overcoming_difficulties_methods: ["Family", "Music"],
  difficult_situation_example: "I prepared for a test in one night and got a good grade.",
  making_new_friends_ease: "7",
  conflict_behavior: "I try to speak calmly or walk away.",
  center_of_attention_situation: "I performed at a school concert, it was exciting but interesting.",
  responsibility_level: "8",
  life_goals: ["Success", "Happiness", "Adventure"],
  important_for_achieving_goals: "Support from friends and family, belief in myself.",
  active_lifestyle_level: "7",
  physical_fitness_methods: ["Sports", "Sleep"],
  feeling_after_activity: "I feel energy and good mood.",
  creativity_level: "9",
  creativity_situations: ["Alone", "At school"],
  nonstandard_solution_example: "I solved a math problem in a different way.",
  emotional_control_level: "6",
  negative_emotions_handling_methods: ["Talk to someone", "Listen to music"],
  emotional_control_example: "Before performing on stage, I calmed down, took deep breaths.",
  question_clarity_level: "10",
  difficult_questions: "Questions about conflicts.",
  interesting_questions: "Questions about hobbies and creativity.",
  survey_improvement_suggestions: "Add more questions about modern professions."
}

export default function StudentSurvey() {
  const router = useRouter()
  const { t, i18n } = useTranslation('student')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<SurveyResponse[]>([])
  const [textInput, setTextInput] = useState('')
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [loadingAI, setLoadingAI] = useState(false)

  const currentQuestion: Question = allQuestions[currentQuestionIndex]
  const totalQuestions = allQuestions.length
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100

  // Get translated question text, placeholder, and options
  const questionText = t(`survey.questions.${currentQuestion.id}.text`)
  const questionPlaceholder = t(`survey.questions.${currentQuestion.id}.placeholder`)
  const questionOptions = (currentQuestion.type === 'select' || currentQuestion.type === 'multiselect')
    ? t(`survey.questions.${currentQuestion.id}.options`, { returnObjects: true })
    : []

  // Get translated loading messages
  const loadingMessages = t('survey.loadingMessages', { returnObjects: true }) as { title: string, desc: string }[];

  // Set magicMsg only once per loading session
  const [magicMsg] = useState(() =>
    loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
  );

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
        // Save current language
        localStorage.setItem('surveyLanguage', i18n.language)
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

  // Autofill handler (per question)
  const handleAutofill = () => {
    const answer = TEST_ANSWERS[currentQuestion.id];
    if (!answer) return;
    if (currentQuestion.type === 'multiselect') {
      // Ensure answer is an array of strings
      const answerArray = Array.isArray(answer) ? answer : [answer];
      setSelectedOptions(answerArray);
      setTimeout(() => handleAnswer(answerArray), 200);
    } else if (currentQuestion.type === 'select') {
      setTimeout(() => handleAnswer(answer), 200);
    } else {
      setTextInput(Array.isArray(answer) ? answer.join(', ') : answer);
      setTimeout(() => handleAnswer(answer), 200);
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
            <span>{t('survey.step', { current: currentQuestionIndex + 1, total: totalQuestions })}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full bg-gradient-to-r from-purple-400 via-teal-400 to-green-400 rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 via-teal-400 to-purple-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Question */}
          <h2 className="text-xl font-bold text-green-100 mb-4 text-center">{questionText}</h2>

          {/* Autofill for testing (per question) */}
          <div className="flex mb-4">
            <button
              type="button"
              onClick={handleAutofill}
              className="px-4 py-2 rounded-lg bg-green-500 text-white font-bold text-base shadow hover:bg-green-600 transition-all"
              style={{ marginRight: 'auto' }}
            >
              {t('survey.ui.autofill')}
            </button>
          </div>

          <div className="space-y-4">
            {currentQuestion.type === 'text' || currentQuestion.type === 'email' || currentQuestion.type === 'number' ? (
              <form onSubmit={handleTextSubmit} className="space-y-4">
                <input
                  type={currentQuestion.type}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={questionPlaceholder}
                  min={currentQuestion.type === 'number' && 'min' in currentQuestion ? currentQuestion.min : undefined}
                  max={currentQuestion.type === 'number' && 'max' in currentQuestion ? currentQuestion.max : undefined}
                  className="w-full p-4 rounded-xl bg-white text-green-900 placeholder-green-400 border-2 border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-lg"
                />
                <div className="flex gap-4 mt-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={currentQuestionIndex === 0}
                    className="flex-1 px-6 py-3 rounded-xl bg-green-900 text-green-200 font-bold hover:bg-green-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('survey.ui.back')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 p-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-all duration-300 text-lg"
                  >
                    {t('survey.ui.next')}
                  </button>
                </div>
              </form>
            ) : currentQuestion.type === 'select' || currentQuestion.type === 'multiselect' ? (
              <>
                <div className="space-y-2">
                  {Array.isArray(questionOptions) && questionOptions.map((option) => (
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
                      {t('survey.ui.back')}
                    </button>
                    <button
                      onClick={handleMultiSelectSubmit}
                      disabled={selectedOptions.length === 0}
                      className="flex-1 p-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    >
                      {t('survey.ui.next')}
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
                />
                <div className="flex gap-4 mt-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={currentQuestionIndex === 0}
                    className="flex-1 px-6 py-3 rounded-xl bg-green-900 text-green-200 font-bold hover:bg-green-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('survey.ui.back')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 p-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-all duration-300 text-lg"
                  >
                    {t('survey.ui.next')}
                  </button>
                </div>
              </form>
            ) : null}
          </div>

          {/* Motivational message */}
          <div className="mt-8 text-center text-green-100 text-lg font-semibold">
            {t('survey.ui.motivation')}
          </div>
        </div>
      </div>
    </main>
  )
} 