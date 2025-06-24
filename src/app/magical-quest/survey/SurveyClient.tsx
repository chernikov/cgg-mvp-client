'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { analyzeSurveyResponses } from '@/lib/openai'
import type { SurveyResponse } from '@/types/survey'
import { useTranslation } from 'react-i18next'
import { Suspense } from 'react'
import { useMagicalQuestQuestions, useSaveProgressiveResults } from '@/hooks/useQuestions'
import surveyUtils from '@/utils/survey.utils'

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

const steps: Step[] = [
  {
    title: 'Крок 1: Особиста інформація',
    description: 'Розкажи нам про себе',
    questions: []
  },
  {
    title: 'Крок 2: Навчання та розвиток',
    description: 'Дізнаємося про твій підхід до навчання',
    questions: []
  },
  {
    title: 'Крок 3: Фізичний та емоційний стан',
    description: 'Останні питання про твій стан',
    questions: []
  }
]

// Temporary autofill answers for testing
const TEST_ANSWERS: Record<string, string | string[]> = {
  email: "test.student@gmail.com",
  nickname: "Олександр",
  age: "15",
  gender: "Хлопець",
  country_of_birth: "Україна",
  current_mood: "Гарний, бо сьогодні сонячно і я отримав гарну оцінку.",
  hobby: "Граю на гітарі, люблю футбол.",
  habits: "Прокидаюсь о 7 ранку, читаю перед сном.",
  top_abilities: "Командна робота, креативність, вирішення задач",
  abilities_to_develop: "Публічні виступи, тайм-менеджмент, англійська мова",
  chosen_profession: "Програміст",
  favorite_character: "Гаррі Поттер, бо він сміливий і завжди допомагає друзям.",
  antihero: "Волдеморт, бо він злий і егоїстичний.",
  admired_relative: "Мама, бо вона завжди підтримує мене.",
  not_like_relative: "Дядько, бо він часто сердиться.",
  bonus_characteristics: "Люблю допомагати іншим, цікавлюсь наукою.",
  learning_new_things_ease: "8",
  preferred_learning_methods: ["Візуальний", "Кінестетичний"],
  quick_school_task_situation: "Я зробив домашнє завдання за 30 хвилин, бо сконцентрувався і вимкнув телефон.",
  effort_for_results: "9",
  overcoming_difficulties_methods: ["Родина", "Музика"],
  difficult_situation_example: "Я підготувався до контрольної за одну ніч і отримав гарну оцінку.",
  making_new_friends_ease: "7",
  conflict_behavior: "Стараюсь говорити спокійно або відійти.",
  center_of_attention_situation: "Виступав на шкільному концерті, було хвилююче, але цікаво.",
  responsibility_level: "8",
  life_goals: ["Успіх", "Щастя", "Пригоди"],
  important_for_achieving_goals: "Підтримка друзів і родини, віра в себе.",
  active_lifestyle_level: "7",
  physical_fitness_methods: ["Спорт", "Сон"],
  feeling_after_activity: "Відчуваю енергію і гарний настрій.",
  creativity_level: "9",
  creativity_situations: ["Наодинці", "У школі"],
  nonstandard_solution_example: "Вирішив задачу з математики іншим способом.",
  emotional_control_level: "6",
  negative_emotions_handling_methods: ["Поговорити з кимось", "Послухати музику"],
  emotional_control_example: "Перед виступом на сцені заспокоївся, глибоко дихав.",
  question_clarity_level: "10",
  difficult_questions: "Питання про конфлікти.",
  interesting_questions: "Питання про хобі та креативність.",
  survey_improvement_suggestions: "Додати більше питань про сучасні професії."
};

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
  },
  {
    title: "Зірки складають твій кар'єрний гороскоп...",
    desc: "Твої можливості вже на горизонті!"
  },
  {
    title: "Магічний компас шукає твій ідеальний напрямок...",
    desc: "Трохи терпіння — і ти дізнаєшся свій шлях!"
  },
  {
    title: "Чарівна мапа малює твоє майбутнє...",
    desc: "Професії вже формуються у магічному світі!"
  },
  {
    title: "Магічний квест триває...",
    desc: "Твої відповіді перетворюються на унікальні рекомендації!"
  },
  {
    title: "Чарівна енергія збирає дані...",
    desc: "Незабаром ти побачиш свої найкращі професійні можливості!"
  }
];

function SurveyClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<SurveyResponse[]>([])
  const [textInput, setTextInput] = useState('')
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [loadingAI, setLoadingAI] = useState(false)
  const [magicMsg, setMagicMsg] = useState<null | { title: string; desc: string }>(null)
  const [stepsData, setStepsData] = useState<Step[]>(steps)

  const { i18n } = useTranslation()

  // Ініціалізуємо хук для збереження проміжних результатів
  const { saveProgress, isSaving: isSavingProgress, lastSaved } = useSaveProgressiveResults()
  
  // Генеруємо унікальний userId для цієї сесії
  const [userId] = useState(() => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)

  // Завантажуємо питання з Firebase
  const quest1 = useMagicalQuestQuestions(1)
  const quest2 = useMagicalQuestQuestions(2)
  const quest3 = useMagicalQuestQuestions(3)

  // Оновлюємо steps коли завантажуються питання
  useEffect(() => {
    if (!quest1.isLoading && !quest2.isLoading && !quest3.isLoading) {
      if (quest1.questions.length > 0 && quest2.questions.length > 0 && quest3.questions.length > 0) {
        const updatedSteps: Step[] = [
          {
            title: 'Крок 1: Особиста інформація',
            description: 'Розкажи нам про себе',
            questions: quest1.questions as Question[]
          },
          {
            title: 'Крок 2: Навчання та розвиток',
            description: 'Дізнаємося про твій підхід до навчання',
            questions: quest2.questions.slice(0, -1) as Question[]
          },
          {
            title: 'Крок 3: Фізичний та емоційний стан',
            description: 'Останні питання про твій стан',
            questions: [
              ...quest2.questions.slice(-1),
              ...quest3.questions
            ] as Question[]
          }
        ]
        setStepsData(updatedSteps)
      }
    }
  }, [quest1.isLoading, quest2.isLoading, quest3.isLoading, quest1.questions, quest2.questions, quest3.questions])

  const currentStep = stepsData[currentStepIndex]
  const currentQuestion = currentStep?.questions[currentQuestionIndex] as Question
  const stepQuestionsCount = currentStep?.questions.length || 0
  const stepProgress = ((currentQuestionIndex + 1) / stepQuestionsCount) * 100

  // On mount, check for step param and start survey tracking
  useEffect(() => {
    const stepParam = searchParams.get('step')
    if (stepParam !== null) {
      const stepNum = Number(stepParam)
      if (!isNaN(stepNum) && stepNum >= 0 && stepNum < steps.length) {
        setCurrentStepIndex(stepNum)
        setCurrentQuestionIndex(0)
      }
    }
    
    // Запускаємо відстеження часу проходження тесту
    surveyUtils.startSurvey('magical-quest')
    
    // Зберігаємо базові метадані користувача
    surveyUtils.saveUserMetadata({
      userType: 'student',
      additionalData: {
        language: i18n.language,
        startedAt: new Date().toISOString(),
        userAgent: navigator.userAgent
      }
    })
    // eslint-disable-next-line
  }, [])

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

    // 💾 Зберігаємо прогрес після кожної відповіді
    try {
      console.log(`💾 Saving progress after answer: ${currentQuestion.id}`)
      await saveProgress(
        userId,
        'student', // Припускаємо, що це учень
        'magical-quest',
        'Магічний квест професій',
        updatedResponses,
        currentStepIndex + 1,
        stepsData.length,
        {
          currentQuestionIndex: currentQuestionIndex + 1,
          totalQuestionsInStep: currentStep.questions.length,
          stepName: currentStep.title
        }
      )
      console.log(`✅ Progress saved successfully! Last saved: ${lastSaved}`)
    } catch (error) {
      console.warn('⚠️ Failed to save progress:', error)
      // Не блокуємо продовження опитування при помилці збереження
    }
    
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
      router.push(`/magical-quest/survey/step-result?step=${currentStepIndex}`)
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
        router.push('/magical-quest/results')
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
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-teal-900 to-purple-900">
        <div className="max-w-lg w-full bg-gradient-to-br from-green-800/80 via-teal-800/80 to-purple-800/80 rounded-2xl p-8 shadow-2xl animate-fade-in flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-yellow-400 mb-6"></div>
          <h2 className="text-2xl font-bold text-yellow-200 mb-2 text-center">
            {magicMsg ? magicMsg.title : magicLoadingMessages[0].title}
          </h2>
          <p className="text-green-100 text-lg text-center">
            {magicMsg ? magicMsg.desc : magicLoadingMessages[0].desc}
          </p>
        </div>
      </main>
    )
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-teal-900 to-purple-900">
        <div className="max-w-lg w-full">
          <div className="bg-gradient-to-br from-green-800/80 via-teal-800/80 to-purple-800/80 rounded-2xl p-8 shadow-2xl animate-fade-in">
            {/* Autofill for testing */}
            <button
              type="button"
              onClick={handleAutofill}
              className="mb-4 px-4 py-2 rounded bg-green-300 text-green-900 font-bold hover:bg-green-400 transition-all duration-200"
            >
              Автозаповнити для тесту
            </button>

            {/* Saving indicator */}
            {isSavingProgress && (
              <div className="flex items-center justify-center text-blue-200 text-sm mb-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-200 mr-2"></div>
                Збереження прогресу...
              </div>
            )}
            
            {lastSaved && !isSavingProgress && (
              <div className="flex items-center justify-center text-green-200 text-xs mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Останнє збереження: {lastSaved.toLocaleTimeString()}
              </div>
            )}

            {/* Progress bar */}
            <div className="flex justify-between items-center text-white/80 text-sm mb-1">
              <span>Крок {currentQuestionIndex + 1} з {stepQuestionsCount}</span>
              <span>{Math.round(stepProgress)}%</span>
            </div>
            <div className="h-2 w-full bg-gradient-to-r from-purple-400 via-teal-400 to-green-400 rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 via-teal-400 to-purple-400 transition-all duration-500"
                style={{ width: `${stepProgress}%` }}
              />
            </div>

            {/* Question */}
            {currentQuestion ? (
              <>
                <h2 className="text-xl font-bold text-green-100 mb-4 text-center">{currentQuestion.question}</h2>

                <div className="space-y-4">
                  {currentQuestion.type === 'text' || currentQuestion.type === 'email' || currentQuestion.type === 'number' ? (
                    <form onSubmit={handleTextSubmit} className="space-y-4">
                      <input
                        type={currentQuestion.type}
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder={currentQuestion.placeholder}
                        min={currentQuestion.type === 'number' ? currentQuestion.min : undefined}
                        max={currentQuestion.type === 'number' ? currentQuestion.max : undefined}
                        className="w-full p-4 rounded-xl bg-white text-green-900 placeholder-green-400 border-2 border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-lg"
                        required
                      />
                      <div className="flex gap-4 mt-2">
                        <button
                          type="button"
                          onClick={handleBack}
                          disabled={currentStepIndex === 0 && currentQuestionIndex === 0}
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
                            disabled={currentStepIndex === 0 && currentQuestionIndex === 0}
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
                          disabled={currentStepIndex === 0 && currentQuestionIndex === 0}
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
              </>
            ) : (
              <div className="text-center text-green-100">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-100 mx-auto mb-4"></div>
                <p>Завантаження питання...</p>
              </div>
            )}

            {/* Motivational message */}
            <div className="mt-8 text-center text-green-100 text-lg font-semibold">
              Ти чудово справляєшся! Продовжуй, юний маге!
            </div>

            {/* Step indicator */}
            <div className="flex justify-center gap-4 mt-6">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentStepIndex(idx)
                    setCurrentQuestionIndex(0)
                    setTextInput('')
                    setSelectedOptions([])
                  }}
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 text-lg font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 ${
                    idx === currentStepIndex
                      ? 'bg-green-400 border-green-500 text-green-900 shadow-lg scale-110'
                      : 'bg-green-900 border-green-700 text-green-300 opacity-60 hover:opacity-90'
                  }`}
                  aria-current={idx === currentStepIndex ? 'step' : undefined}
                  type="button"
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </Suspense>
  )
}

export default SurveyClient