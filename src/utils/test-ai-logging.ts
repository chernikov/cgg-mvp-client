import aiLogsService from '@/services/ai-logs.service'
import type { SurveyResponse } from '@/types/survey'

/**
 * Тестова функція для перевірки системи логування AI
 */
export async function testAILogging() {
  console.log('🧪 Starting AI Logging System Test...')

  try {    // Тестові дані
    const testResponses: SurveyResponse[] = [
      {
        questionId: 'test-1',
        answerId: 'test-answer-1'
      },
      {
        questionId: 'test-2', 
        answerId: 'test-answer-2'
      }
    ]

    const testPrompt = 'Test prompt for AI logging system'
    const testLanguage = 'uk'
    const testQuestionnaireId = 'test-questionnaire'
    const testUserId = 'test-user-123'

    // Створюємо заготовку логу
    console.log('📝 Creating log template...')
    const logTemplate = aiLogsService.createLogTemplate(
      testResponses,
      testLanguage,
      testPrompt,
      testQuestionnaireId,
      testUserId
    )

    console.log('✅ Log template created:', logTemplate)

    // Симулюємо успішну відповідь AI
    console.log('🤖 Simulating successful AI response...')
    const testRawResponse = '{"matches": [{"title": "Test Profession", "matchPercentage": 85}]}'
    const testParsedResponse = JSON.parse(testRawResponse)
    const testTokensUsed = 150

    // Завершуємо лог
    const completedLog = aiLogsService.completeLog(
      logTemplate,
      testRawResponse,
      testParsedResponse,
      true, // success
      undefined, // no error
      testTokensUsed
    )

    console.log('✅ Log completed:', completedLog)

    // Зберігаємо лог
    console.log('💾 Saving log to Firebase...')
    const logId = await aiLogsService.logAIRequest(completedLog)
    console.log('✅ Log saved successfully with ID:', logId)

    // Тестуємо логування помилки
    console.log('❌ Testing error logging...')
    const errorLog = aiLogsService.completeLog(
      logTemplate,
      '',
      null,
      false, // failed
      'Test error message'
    )

    const errorLogId = await aiLogsService.logAIRequest(errorLog)
    console.log('✅ Error log saved successfully with ID:', errorLogId)

    console.log('🎉 AI Logging System Test completed successfully!')
    return {
      success: true,
      successLogId: logId,
      errorLogId: errorLogId
    }

  } catch (error) {
    console.error('❌ AI Logging System Test failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Функція для очистки тестових логів
 */
export async function cleanupTestLogs() {
  console.log('🧹 This function would clean up test logs in a real implementation')
  console.log('   For now, you can manually delete test logs from Firebase console')
  console.log('   Search for logs with questionnaireId: "test-questionnaire"')
}
