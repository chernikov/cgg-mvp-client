import { useState, useEffect, useCallback } from 'react'
import questionsService from '../services/questions.service'
import testResultsService from '../services/test-results.service'
import type { StoredQuestionnaire } from '../services/questions.service'
import type { StoredTestResult, TestResultSummary } from '../services/test-results.service'
import type { SurveyResponse, ProfessionMatch } from '../types/survey'

export function useQuestionnaires() {
  const [questionnaires, setQuestionnaires] = useState<StoredQuestionnaire[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadQuestionnaires = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await questionsService.getAllQuestionnaires()
      setQuestionnaires(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error loading questionnaires:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadActiveQuestionnaires = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await questionsService.getActiveQuestionnaires()
      setQuestionnaires(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error loading active questionnaires:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadActiveQuestionnaires()
  }, [])

  return {
    questionnaires,
    isLoading,
    error,
    loadQuestionnaires,
    loadActiveQuestionnaires,
    refetch: loadActiveQuestionnaires
  }
}

export function useQuestionnaire(id: string) {
  const [questionnaire, setQuestionnaire] = useState<StoredQuestionnaire | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadQuestionnaire = async () => {
    if (!id) return

    setIsLoading(true)
    setError(null)
    try {
      const data = await questionsService.getQuestionnaire(id)
      setQuestionnaire(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error loading questionnaire:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      if (!id) return

      setIsLoading(true)
      setError(null)
      try {
        const data = await questionsService.getQuestionnaire(id)
        setQuestionnaire(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError(errorMessage)
        console.error('Error loading questionnaire:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [id])

  return {
    questionnaire,
    questions: questionnaire?.questions || [],
    isLoading,
    error,
    refetch: loadQuestionnaire
  }
}

// Хелпери для отримання питань конкретного типу
export function useMagicalQuestQuestions(questNumber: number) {
  const questId = `magical-quest-quest${questNumber}`
  return useQuestionnaire(questId)
}

export function useTeacherSurveyQuestions() {
  return useQuestionnaire('teacher-survey')
}

export function useParentSurveyQuestions() {
  return useQuestionnaire('parent-survey')
}

export function useBasicQuestions() {
  return useQuestionnaire('basic')
}

// Хелпер для перевірки чи є нові питання в порівнянні з кодом
export function useQuestionsComparison() {
  const [hasNewQuestions, setHasNewQuestions] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  const checkForUpdates = async () => {
    setIsChecking(true)
    try {
      // Завантажуємо питання з Firebase
      const firebaseQuestionnaires = await questionsService.getAllQuestionnaires()
      
      // В майбутньому тут може бути логіка для порівняння з новими питаннями
      // Поки що просто перевіримо, чи є хоча б базові анкети
      const requiredQuestionnaires = ['basic', 'magical-quest-quest1', 'magical-quest-quest2', 'magical-quest-quest3', 'teacher-survey', 'parent-survey']
      const existingIds = firebaseQuestionnaires.map((q: StoredQuestionnaire) => q.id)
      const missingQuestionnaires = requiredQuestionnaires.filter(id => !existingIds.includes(id))

      setHasNewQuestions(missingQuestionnaires.length > 0)
    } catch (error) {
      console.error('Error checking for question updates:', error)
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkForUpdates()
  }, [])

  return {
    hasNewQuestions,
    isChecking,
    checkForUpdates
  }
}

// Хуки для роботи з результатами тестів
export function useTestResults() {
  const [results, setResults] = useState<StoredTestResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadResults = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await testResultsService.getAllTestResults()
      setResults(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error loading test results:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadResults()
  }, [])

  return {
    results,
    isLoading,
    error,
    refetch: loadResults
  }
}

export function useTestResult(id: string) {
  const [result, setResult] = useState<StoredTestResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadResult = useCallback(async () => {
    if (!id) return

    setIsLoading(true)
    setError(null)
    try {
      const data = await testResultsService.getTestResult(id)
      setResult(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error loading test result:', err)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadResult()
  }, [loadResult])

  return {
    result,
    isLoading,
    error,
    refetch: loadResult
  }
}

export function useTestResultsSummary() {
  const [summary, setSummary] = useState<TestResultSummary | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadSummary = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await testResultsService.getTestResultsSummary()
      setSummary(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error loading test results summary:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSummary()
  }, [loadSummary])

  return {
    summary,
    isLoading,
    error,
    refetch: loadSummary
  }
}

// Хук для збереження результатів тесту
export function useSaveTestResult() {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const saveTestResult = async (resultData: {
    userId: string
    userType: 'student' | 'teacher' | 'parent'
    questionnaireId: string
    questionnaireName: string
    responses: SurveyResponse[]
    matches?: ProfessionMatch[]
    metadata: {
      userAge?: number
      userGrade?: string
      schoolName?: string
      completionTime?: number
      additionalData?: Record<string, string | number | boolean>
    }
  }) => {
    console.log('🚀 useSaveTestResult: Starting save process')
    console.log('📝 Result data to save:', resultData)
    
    // Додаткове логування для AI
    console.log('🔍 AI Logging Debug Info:')
    console.log('   - QuestionnaireId for AI logging:', resultData.questionnaireId)
    console.log('   - Responses count:', resultData.responses?.length || 0)
    console.log('   - Has matches:', !!resultData.matches)
    console.log('   - User ID:', resultData.userId)
    
    setIsSaving(true)
    setError(null)
    
    try {
      console.log('💾 useSaveTestResult: Calling testResultsService.saveTestResult')
      const resultId = await testResultsService.saveTestResult(resultData)
      
      console.log('✅ useSaveTestResult: Test result saved successfully!')
      console.log('🆔 Result ID:', resultId)
      console.log('📊 Saved data summary:')
      console.log('   - User ID:', resultData.userId)
      console.log('   - User Type:', resultData.userType)
      console.log('   - Questionnaire:', resultData.questionnaireName)
      console.log('   - Responses count:', resultData.responses.length)
      console.log('   - Matches count:', resultData.matches?.length || 0)
      console.log('   - Completion time:', resultData.metadata.completionTime, 'seconds')
      
      return resultId
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      console.error('❌ useSaveTestResult: Error saving test result')
      console.error('🔥 Error details:', err)
      console.error('📋 Error message:', errorMessage)
      
      setError(errorMessage)
      throw err
    } finally {
      setIsSaving(false)
      console.log('🏁 useSaveTestResult: Save process completed')
    }
  }

  return {
    saveTestResult,
    isSaving,
    error
  }
}

// Хук для отримання результатів користувача
export function useUserTestResults(userId: string) {
  const [results, setResults] = useState<StoredTestResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadUserResults = useCallback(async () => {
    if (!userId) return

    setIsLoading(true)
    setError(null)
    try {
      const data = await testResultsService.getUserTestResults(userId)
      setResults(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error loading user test results:', err)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    loadUserResults()
  }, [loadUserResults])

  return {
    results,
    isLoading,
    error,
    refetch: loadUserResults
  }
}

// Хук для отримання результатів конкретної анкети
export function useQuestionnaireResults(questionnaireId: string) {
  const [results, setResults] = useState<StoredTestResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadQuestionnaireResults = useCallback(async () => {
    if (!questionnaireId) return

    setIsLoading(true)
    setError(null)
    try {
      const data = await testResultsService.getQuestionnaireResults(questionnaireId)
      setResults(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error loading questionnaire results:', err)
    } finally {
      setIsLoading(false)
    }
  }, [questionnaireId])

  useEffect(() => {
    loadQuestionnaireResults()
  }, [loadQuestionnaireResults])

  return {
    results,
    isLoading,
    error,
    refetch: loadQuestionnaireResults
  }
}

// Хук для збереження проміжних результатів після кожної відповіді
export function useSaveProgressiveResults() {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const saveProgress = useCallback(async (
    userId: string,
    userType: 'student' | 'teacher' | 'parent',
    questionnaireId: string,
    questionnaireName: string,
    currentResponses: SurveyResponse[],
    currentStep: number,
    totalSteps: number,
    metadata?: Record<string, string | number | boolean | Date>
  ) => {
    if (isSaving) {
      console.log('⏳ Already saving, skipping duplicate save request')
      return null
    }

    setIsSaving(true)
    setError(null)

    try {
      console.log(`💾 Saving progress for step ${currentStep}/${totalSteps}`)
      console.log(`📊 Responses to save: ${currentResponses.length}`)

      // Створюємо проміжний результат з позначкою incomplete
      const progressResult = {
        userId,
        userType,
        questionnaireId,
        questionnaireName: `${questionnaireName} (В процесі)`,
        responses: currentResponses,
        matches: [], // Поки що без професійних матчів
        metadata: {
          ...metadata,
          completionTime: 0, // Ще не завершено
          isComplete: false,
          currentStep,
          totalSteps,
          progressPercentage: Math.round((currentStep / totalSteps) * 100),
          lastUpdated: new Date().toISOString(),
          additionalData: {
            language: 'uk',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            isProgressSave: true
          }
        }
      }

      const resultId = await testResultsService.saveTestResult(progressResult)
      
      setLastSaved(new Date())
      console.log(`✅ Progress saved successfully! ID: ${resultId}`)
      console.log(`📈 Progress: ${progressResult.metadata.progressPercentage}%`)

      return resultId
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error saving progress'
      setError(errorMessage)
      console.error('❌ Error saving progress:', err)
      throw err
    } finally {
      setIsSaving(false)
    }
  }, [isSaving])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    saveProgress,
    isSaving,
    error,
    lastSaved,
    clearError
  }
}

// Хук для автоматичного збереження прогресу
export function useAutoSaveProgress(
  userId: string,
  userType: 'student' | 'teacher' | 'parent',
  questionnaireId: string,
  questionnaireName: string,
  currentStep: number,
  totalSteps: number
) {
  const { saveProgress, isSaving, error } = useSaveProgressiveResults()
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)

  const triggerAutoSave = useCallback(async (responses: SurveyResponse[], metadata?: Record<string, string | number | boolean | Date>) => {
    if (!autoSaveEnabled || responses.length === 0) return

    try {
      await saveProgress(
        userId,
        userType,
        questionnaireId,
        questionnaireName,
        responses,
        currentStep,
        totalSteps,
        metadata
      )
    } catch (err) {
      console.warn('⚠️ Auto-save failed:', err)
    }
  }, [saveProgress, autoSaveEnabled, userId, userType, questionnaireId, questionnaireName, currentStep, totalSteps])

  return {
    triggerAutoSave,
    isSaving,
    error,
    autoSaveEnabled,
    setAutoSaveEnabled
  }
}
