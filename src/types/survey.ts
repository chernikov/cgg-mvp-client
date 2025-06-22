export type SurveyResponse = {
  questionId: string
  answerId: string
}

export type ProfessionMatch = {
  title: string
  matchPercentage: number
  description: string
  fitReasons: string[]
  strongSkills: string[]
  skillsToImprove?: string[]
  salaryRange: {
    junior: number
    mid: number
    senior: number
  }
  education: {
    offline: string[]
    online: string[]
  }
  nextSteps: string[]
}

export type Question = {
  id: string
  question: string
  type: 'text' | 'email' | 'number' | 'select' | 'multiselect' | 'textarea'
  placeholder?: string
  options?: string[]
  min?: number
  max?: number
}

export interface SurveyQuestion {
  id: string
  text: string
  options: {
    id: string
    text: string
  }[]
}

export interface SurveyState {
  currentStep: number
  totalSteps: number
  responses: SurveyResponse[]
  matches: ProfessionMatch[]
} 