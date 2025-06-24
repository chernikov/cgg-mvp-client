import { db } from '@/lib/firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import type { SurveyResponse } from '@/types/survey'

export interface AILogEntry {
  id?: string
  input: {
    responses: SurveyResponse[]
    language: string
    prompt: string
  }
  output: {
    rawResponse: string
    parsedResponse: unknown
    success: boolean
    error?: string
  }
  metadata: {
    questionnaireId: string
    userId?: string
    userAgent: string
    model: string
    tokensUsed?: number
    responseTime: number // в мілісекундах
  }
  timestamps: {
    requestStarted: Date
    requestCompleted: Date
    createdAt: Date
  }
}

class AILogsService {
  private readonly collectionName = 'ai_logs'  /**
   * Логує запит до AI сервісу
   */
  async logAIRequest(logEntry: {
    input: { responses: SurveyResponse[]; language: string; prompt: string }
    output: { rawResponse: string; parsedResponse: unknown; success: boolean; error?: string }
    metadata: { questionnaireId: string; userId?: string; userAgent: string; model: string; tokensUsed?: number; responseTime: number }
    timestamps: { requestStarted: Date; requestCompleted: Date }
  }): Promise<string> {
    try {
      console.log('🔍 AI Logs Service: Starting log save process')
      console.log('📊 Log entry data:', logEntry)
      
      const logData = {
        ...logEntry,
        timestamps: {
          ...logEntry.timestamps,
          createdAt: new Date()
        }
      }

      console.log('📝 AI Logs Service: Final log data prepared:', logData)
      console.log('🔥 Firebase collection target:', this.collectionName)

      const docRef = await addDoc(collection(db, this.collectionName), {
        ...logData,
        timestamps: {
          requestStarted: Timestamp.fromDate(logData.timestamps.requestStarted),
          requestCompleted: Timestamp.fromDate(logData.timestamps.requestCompleted),
          createdAt: Timestamp.fromDate(logData.timestamps.createdAt)
        }
      })

      console.log('✅ AI log entry saved with ID:', docRef.id)
      return docRef.id
    } catch (error) {
      console.error('❌ Error saving AI log entry:', error)
      console.error('🔥 Error details:', error)
      console.error('🗂️ Collection name:', this.collectionName)
      console.error('📋 Firebase db object:', db)
      throw error
    }
  }  /**
   * Створює заготовку для логу (викликається перед запитом до AI)
   */
  createLogTemplate(
    responses: SurveyResponse[],
    language: string,
    prompt: string,
    questionnaireId: string,
    userId?: string
  ): {
    input: { responses: SurveyResponse[]; language: string; prompt: string }
    metadata: { questionnaireId: string; userId?: string; userAgent: string; model: string; responseTime: number }
    timestamps: { requestStarted: Date }
  } {
    console.log('🔍 AI Logs Service: Creating log template')
    console.log('📊 Template data:')
    console.log('   - questionnaireId:', questionnaireId)
    console.log('   - userId:', userId)
    console.log('   - language:', language)
    console.log('   - responses count:', responses.length)
    console.log('   - prompt length:', prompt.length)
    
    const template = {
      input: {
        responses,
        language,
        prompt
      },
      metadata: {
        questionnaireId,
        userId,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        model: 'gpt-4-turbo-preview',
        responseTime: 0
      },
      timestamps: {
        requestStarted: new Date()
      }
    }
    
    console.log('✅ AI Logs Service: Log template created:', template)
    return template
  }/**
   * Завершує лог після отримання відповіді від AI
   */
  completeLog(
    logTemplate: {
      input: { responses: SurveyResponse[]; language: string; prompt: string }
      metadata: { questionnaireId: string; userId?: string; userAgent: string; model: string; responseTime: number }
      timestamps: { requestStarted: Date }
    },
    rawResponse: string,
    parsedResponse: unknown,
    success: boolean,
    error?: string,
    tokensUsed?: number
  ): {
    input: { responses: SurveyResponse[]; language: string; prompt: string }
    output: { rawResponse: string; parsedResponse: unknown; success: boolean; error?: string }
    metadata: { questionnaireId: string; userId?: string; userAgent: string; model: string; tokensUsed?: number; responseTime: number }
    timestamps: { requestStarted: Date; requestCompleted: Date }
  } {
    const requestCompleted = new Date()
    const responseTime = requestCompleted.getTime() - logTemplate.timestamps.requestStarted.getTime()

    return {
      ...logTemplate,
      output: {
        rawResponse,
        parsedResponse,
        success,
        error
      },
      metadata: {
        ...logTemplate.metadata,
        tokensUsed,
        responseTime
      },
      timestamps: {
        ...logTemplate.timestamps,
        requestCompleted
      }
    }
  }
}

const aiLogsService = new AILogsService()
export default aiLogsService
