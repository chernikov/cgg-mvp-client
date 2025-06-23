import { useState, useEffect } from 'react'
import questionsService from '../services/questions.service'
import type { StoredQuestionnaire } from '../services/questions.service'

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
