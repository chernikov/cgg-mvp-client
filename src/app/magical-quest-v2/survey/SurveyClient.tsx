'use client'

import { useState, useEffect, Suspense, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { magicalQuestQuestions } from '@/config/questions'
import { analyzeSurveyResponses } from '@/lib/openai'
import type { SurveyResponse } from '@/types/survey'
import { useTranslation } from 'react-i18next'

// Types

type Question = {
  id: string
  question: string
  type: 'text' | 'email' | 'number' | 'select' | 'multiselect' | 'textarea'
  placeholder?: string
  options?: string[]
  min?: number
  max?: number
}

type Step = {
  title: string
  description: string
  questions: Question[]
}

function SurveyClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<SurveyResponse[]>([])
  const [textInput, setTextInput] = useState('')
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [loadingAI, setLoadingAI] = useState(false)
  const { i18n, t } = useTranslation('magical-quest-v2')

  // Create steps dynamically using translations
  const steps: Step[] = [
    {
      title: t('survey.steps.step1.title'),
      description: t('survey.steps.step1.description'),
      questions: magicalQuestQuestions.quest1 as Question[]
    },
    {
      title: t('survey.steps.step2.title'),
      description: t('survey.steps.step2.description'),
      questions: magicalQuestQuestions.quest2.slice(0, -1) as Question[]
    },
    {
      title: t('survey.steps.step3.title'),
      description: t('survey.steps.step3.description'),
      questions: [
        ...magicalQuestQuestions.quest2.slice(-1),
        ...magicalQuestQuestions.quest3
      ] as Question[]
    }
  ]

  // Temporary autofill answers for testing
  const TEST_ANSWERS: Record<string, string | string[]> = {
    email: "test.student@gmail.com",
    nickname: t('survey.questions.nickname.placeholder'),
    age: "15",
    gender: t('survey.questions.gender.options.0'),
    country_of_birth: t('survey.questions.country_of_birth.placeholder'),
    current_mood: t('survey.questions.current_mood.placeholder'),
    hobby: t('survey.questions.hobby.placeholder'),
    habits: t('survey.questions.habits.placeholder'),
    top_abilities: t('survey.questions.top_abilities.placeholder'),
    abilities_to_develop: t('survey.questions.abilities_to_develop.placeholder'),
    chosen_profession: t('survey.questions.chosen_profession.placeholder'),
    favorite_character: t('survey.questions.favorite_character.placeholder'),
    antihero: t('survey.questions.antihero.placeholder'),
    admired_relative: t('survey.questions.admired_relative.placeholder'),
    not_like_relative: t('survey.questions.not_like_relative.placeholder'),
    bonus_characteristics: t('survey.questions.bonus_characteristics.placeholder'),
    learning_new_things_ease: "8",
    preferred_learning_methods: [t('survey.questions.preferred_learning_methods.options.0'), t('survey.questions.preferred_learning_methods.options.2')],
    quick_school_task_situation: t('survey.questions.quick_school_task_situation.placeholder'),
    effort_for_results: "9",
    overcoming_difficulties_methods: [t('survey.questions.overcoming_difficulties_methods.options.0'), t('survey.questions.overcoming_difficulties_methods.options.2')],
    difficult_situation_example: t('survey.questions.difficult_situation_example.placeholder'),
    making_new_friends_ease: "7",
    conflict_behavior: t('survey.questions.conflict_behavior.placeholder'),
    center_of_attention_situation: t('survey.questions.center_of_attention_situation.placeholder'),
    responsibility_level: "8",
    life_goals: [t('survey.questions.life_goals.options.0'), t('survey.questions.life_goals.options.1'), t('survey.questions.life_goals.options.2')],
    important_for_achieving_goals: t('survey.questions.important_for_achieving_goals.placeholder'),
    active_lifestyle_level: "7",
    physical_fitness_methods: [t('survey.questions.physical_fitness_methods.options.0'), t('survey.questions.physical_fitness_methods.options.1')],
    feeling_after_activity: t('survey.questions.feeling_after_activity.placeholder'),
    creativity_level: "9",
    creativity_situations: [t('survey.questions.creativity_situations.options.0'), t('survey.questions.creativity_situations.options.1')],
    nonstandard_solution_example: t('survey.questions.nonstandard_solution_example.placeholder'),
    emotional_control_level: "6",
    negative_emotions_handling_methods: [t('survey.questions.negative_emotions_handling_methods.options.0'), t('survey.questions.negative_emotions_handling_methods.options.1')],
    emotional_control_example: t('survey.questions.emotional_control_example.placeholder'),
    question_clarity_level: "10",
    difficult_questions: t('survey.questions.difficult_questions.placeholder'),
    interesting_questions: t('survey.questions.interesting_questions.placeholder'),
    survey_improvement_suggestions: t('survey.questions.survey_improvement_suggestions.placeholder')
  };

  // Magic loading messages for loader
  const magicLoadingMessages = useMemo(() => [
    { title: t('survey.loadingMessages.0.title'), desc: t('survey.loadingMessages.0.desc') },
    { title: t('survey.loadingMessages.1.title'), desc: t('survey.loadingMessages.1.desc') },
    { title: t('survey.loadingMessages.2.title'), desc: t('survey.loadingMessages.2.desc') },
    { title: t('survey.loadingMessages.3.title'), desc: t('survey.loadingMessages.3.desc') },
    { title: t('survey.loadingMessages.4.title'), desc: t('survey.loadingMessages.4.desc') },
    { title: t('survey.loadingMessages.5.title'), desc: t('survey.loadingMessages.5.desc') },
    { title: t('survey.loadingMessages.6.title'), desc: t('survey.loadingMessages.6.desc') },
    { title: t('survey.loadingMessages.7.title'), desc: t('survey.loadingMessages.7.desc') },
    { title: t('survey.loadingMessages.8.title'), desc: t('survey.loadingMessages.8.desc') },
    { title: t('survey.loadingMessages.9.title'), desc: t('survey.loadingMessages.9.desc') }
  ], [t]);

  // Set magicMsg only once per loading session
  const [magicMsg] = useState(() =>
    magicLoadingMessages[Math.floor(Math.random() * magicLoadingMessages.length)]
  );

  const currentStep = steps[currentStepIndex]
  const currentQuestion = currentStep.questions[currentQuestionIndex] as Question
  const stepQuestionsCount = currentStep.questions.length
  const stepProgress = ((currentQuestionIndex + 1) / stepQuestionsCount) * 100

  // Get translated question text, placeholder, and options
  const questionText = t(`survey.questions.${currentQuestion.id}.text`);
  const questionPlaceholder = t(`survey.questions.${currentQuestion.id}.placeholder`);
  const questionOptions = (currentQuestion.type === 'select' || currentQuestion.type === 'multiselect')
    ? t(`survey.questions.${currentQuestion.id}.options`, { returnObjects: true })
    : [];

  // On mount, check for step param
  useEffect(() => {
    const stepParam = searchParams.get('step')
    if (stepParam !== null) {
      const stepNum = Number(stepParam)
      if (!isNaN(stepNum) && stepNum >= 0 && stepNum < steps.length) {
        setCurrentStepIndex(stepNum)
        setCurrentQuestionIndex(0)
      }
    }
    // eslint-disable-next-line
  }, [])

  const handleAnswer = async (answer: string | string[]) => {
    const newResponse: SurveyResponse = {
      questionId: currentQuestion.id,
      answerId: Array.isArray(answer) ? answer.join(',') : answer
    }
    
    const updatedResponses = [...responses, newResponse]
    setResponses(updatedResponses)
    
    if (currentQuestionIndex < currentStep.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setTextInput('')
      setSelectedOptions([])
    } else if (currentStepIndex < steps.length - 1) {
      // Save responses to localStorage
      localStorage.setItem('surveyResponses', JSON.stringify(updatedResponses))
      // Show loader
      setLoadingAI(true)
      // Get only responses for this step
      const stepQuestionIds = currentStep.questions.map(q => q.id)
      const stepResponses = updatedResponses.filter(r => stepQuestionIds.includes(r.questionId))
      // Call AI for this step
      try {
        const result = await analyzeSurveyResponses(stepResponses, i18n.language)
        localStorage.setItem(`stepMatches_${currentStepIndex}`, JSON.stringify(result.matches))
      } catch (error) {
        console.error('Error analyzing step responses:', error)
      }
      // Hide loader and redirect
      setLoadingAI(false)
      router.push(`/magical-quest-v2/survey/step-result?step=${currentStepIndex}`)
    } else {
      setLoadingAI(true)
      try {
        // Save responses to localStorage
        localStorage.setItem('surveyResponses', JSON.stringify(updatedResponses))
        // Get AI analysis for all responses
        const result = await analyzeSurveyResponses(updatedResponses, i18n.language)
        // Save matches to localStorage
        localStorage.setItem('surveyMatches', JSON.stringify(result.matches))
        // Hide loader and redirect
        setLoadingAI(false)
        router.push('/magical-quest-v2/results')
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

  // Autofill handler
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
  };

  // Back button handler
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setTextInput('')
      setSelectedOptions([])
    } else if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
      setCurrentQuestionIndex(steps[currentStepIndex - 1].questions.length - 1)
      setTextInput('')
      setSelectedOptions([])
    }
  }

  if (loadingAI) {
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
          {/* Blue spinner */}
          <div className="flex items-center justify-center mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-400 border-t-blue-600"></div>
          </div>
          {/* Loader content */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            {magicMsg ? magicMsg.title : magicLoadingMessages[0].title}
          </h2>
          <p className="text-gray-600 text-lg text-center mb-6">
            {magicMsg ? magicMsg.desc : magicLoadingMessages[0].desc}
          </p>
        </div>
      </main>
    )
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="min-h-screen w-full flex items-center justify-center relative overflow-x-hidden">
        {/* Blue gradient background, always behind content */}
        <div className="fixed inset-0 w-full h-full bg-gradient-to-b from-white to-blue-200 -z-10" aria-hidden="true" />
        <div className="flex flex-col items-center w-full max-w-md">
          {/* Header with crown and CareerGG */}
          <div className="flex items-center gap-2 mb-8 mt-4">
            <span className="text-3xl">👑</span>
            <span className="text-2xl font-bold text-gray-700">CareerGG</span>
          </div>
          {/* Autofill for testing */}
          <button
            type="button"
            onClick={handleAutofill}
            className="mb-4 px-4 py-2 rounded bg-blue-200 text-blue-900 font-bold hover:bg-blue-300 transition-all duration-200"
          >
            {t('survey.ui.autofill')}
          </button>
          {/* Encouragement and progress */}
          <div className="w-full flex flex-col items-center mb-4">
            <div className="text-2xl font-bold text-gray-700 text-center mb-2">{t('survey.ui.success')}</div>
            <div className="flex items-center justify-between w-full text-gray-600 text-sm mb-1 px-2">
              <span>{t('survey.step', { current: currentQuestionIndex + 1, total: stepQuestionsCount })}</span>
              <span>{Math.round(stepProgress)}%</span>
            </div>
            <div className="w-full h-2 bg-blue-100 rounded-full mb-4 overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${stepProgress}%` }}
              />
            </div>
          </div>
          {/* Question card */}
          <div className="w-full bg-white rounded-2xl p-8 shadow-xl flex flex-col items-center mb-8">
            <h2 className="text-lg font-bold text-gray-700 mb-4 text-center">{questionText}</h2>
            <div className="w-full">
              {currentQuestion.type === 'text' || currentQuestion.type === 'email' || currentQuestion.type === 'number' ? (
                <form onSubmit={handleTextSubmit} className="space-y-4">
                  <input
                    type={currentQuestion.type}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder={questionPlaceholder}
                    min={currentQuestion.type === 'number' ? currentQuestion.min : undefined}
                    max={currentQuestion.type === 'number' ? currentQuestion.max : undefined}
                    className="w-full p-4 rounded-xl bg-white text-gray-700 placeholder-gray-400 border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
                    required
                  />
                  <div className="flex gap-4 mt-2">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={currentStepIndex === 0 && currentQuestionIndex === 0}
                      className="flex-1 px-6 py-3 rounded-xl bg-blue-300 text-white font-bold hover:bg-blue-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('survey.ui.back')}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 p-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all duration-300 text-lg"
                    >
                      {t('survey.ui.next')}
                    </button>
                  </div>
                </form>
              ) : currentQuestion.type === 'select' || currentQuestion.type === 'multiselect' ? (
                <>
                  <div className="space-y-2">
                    {(Array.isArray(questionOptions) ? questionOptions : []).map((option: string) => (
                      <button
                        key={option}
                        onClick={() => handleOptionSelect(option)}
                        className={`w-full text-left p-4 rounded-xl transition-all duration-300 border-2 text-lg ${
                          selectedOptions.includes(option)
                            ? 'bg-blue-400 text-blue-900 border-blue-500 font-bold'
                            : 'bg-white text-gray-700 border-blue-200 hover:bg-blue-100'
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
                        disabled={currentStepIndex === 0 && currentQuestionIndex === 0}
                        className="flex-1 px-6 py-3 rounded-xl bg-blue-300 text-white font-bold hover:bg-blue-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {t('survey.ui.back')}
                      </button>
                      <button
                        onClick={handleMultiSelectSubmit}
                        disabled={selectedOptions.length === 0}
                        className="flex-1 p-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
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
                    placeholder={questionPlaceholder}
                    className="w-full p-4 rounded-xl bg-white text-gray-700 placeholder-gray-400 border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[120px] text-lg"
                    required
                  />
                  <div className="flex gap-4 mt-2">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={currentStepIndex === 0 && currentQuestionIndex === 0}
                      className="flex-1 px-6 py-3 rounded-xl bg-blue-300 text-white font-bold hover:bg-blue-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('survey.ui.back')}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 p-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all duration-300 text-lg"
                    >
                      {t('survey.ui.next')}
                    </button>
                  </div>
                </form>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </Suspense>
  )
}

export default SurveyClient 