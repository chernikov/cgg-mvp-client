// Утиліти для відстеження часу проходження тестів

export const surveyUtils = {
  /**
   * Записує час початку проходження тесту
   */
  startSurvey: (questionnaireId: string) => {
    const startTime = Date.now()
    localStorage.setItem(`surveyStartTime_${questionnaireId}`, startTime.toString())
    localStorage.setItem('surveyStartTime', startTime.toString()) // Для зворотної сумісності
    console.log(`🕒 Survey started: ${questionnaireId} at ${new Date(startTime).toISOString()}`)
  },

  /**
   * Обчислює час проходження тесту в секундах
   */
  calculateCompletionTime: (questionnaireId: string): number => {
    const startTimeStr = localStorage.getItem(`surveyStartTime_${questionnaireId}`) || 
                        localStorage.getItem('surveyStartTime')
    
    if (!startTimeStr) {
      console.warn('⚠️ No start time found for survey completion calculation')
      return 0
    }

    const startTime = parseInt(startTimeStr)
    const completionTime = Math.round((Date.now() - startTime) / 1000) // В секундах
    
    console.log(`⏱️ Survey completion time: ${completionTime} seconds (${Math.round(completionTime / 60)} minutes)`)
    return completionTime
  },

  /**
   * Очищає дані про час проходження тесту
   */
  clearSurveyTime: (questionnaireId: string) => {
    localStorage.removeItem(`surveyStartTime_${questionnaireId}`)
    localStorage.removeItem('surveyStartTime') // Для зворотної сумісності
  },

  /**
   * Генерує унікальний ID сесії для відстеження
   */
  generateSessionId: (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },
  /**
   * Зберігає прогрес проходження тесту
   */
  saveProgress: (questionnaireId: string, currentStep: number, totalSteps: number, responses: Record<string, unknown>[]) => {
    const progressData = {
      currentStep,
      totalSteps,
      responses,
      lastUpdated: new Date().toISOString()
    }
    localStorage.setItem(`surveyProgress_${questionnaireId}`, JSON.stringify(progressData))
  },

  /**
   * Завантажує прогрес проходження тесту
   */
  loadProgress: (questionnaireId: string) => {
    const progressStr = localStorage.getItem(`surveyProgress_${questionnaireId}`)
    return progressStr ? JSON.parse(progressStr) : null
  },

  /**
   * Очищає прогрес проходження тесту
   */
  clearProgress: (questionnaireId: string) => {
    localStorage.removeItem(`surveyProgress_${questionnaireId}`)
  },
  /**
   * Зберігає метадані користувача для тесту
   */
  saveUserMetadata: (metadata: {
    userAge?: number
    userGrade?: string
    schoolName?: string
    userType?: 'student' | 'teacher' | 'parent'
    additionalData?: Record<string, string | number | boolean>
  }) => {
    console.log('📊 SurveyUtils: Saving user metadata to localStorage')
    console.log('🔍 Metadata to save:', metadata)
    
    localStorage.setItem('userMetadata', JSON.stringify(metadata))
    
    console.log('✅ SurveyUtils: User metadata saved successfully')
  },

  /**
   * Завантажує метадані користувача
   */
  loadUserMetadata: () => {
    console.log('📂 SurveyUtils: Loading user metadata from localStorage')
    
    const metadataStr = localStorage.getItem('userMetadata')
    const metadata = metadataStr ? JSON.parse(metadataStr) : {}
    
    console.log('📋 SurveyUtils: Loaded metadata:', metadata)
    return metadata
  }
}

export default surveyUtils
