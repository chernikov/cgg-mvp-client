import OpenAI from 'openai'
import type { SurveyResponse } from '@/types/survey'
import aiLogsService from '@/services/ai-logs.service'

if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
  throw new Error('Missing NEXT_PUBLIC_OPENAI_API_KEY environment variable')
}

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

export async function analyzeSurveyResponses(
  responses: SurveyResponse[], 
  language: string = 'uk',
  questionnaireId: string = 'magical-quest',
  userId?: string
) {
  let languageInstruction = '';
  if (language === 'uk') {
    languageInstruction = 'Відповідай українською мовою.';
  } else if (language === 'en') {
    languageInstruction = 'Respond in English.';
  } else if (language === 'hi') {
    languageInstruction = 'उत्तर हिंदी में दें।';
  } else {
    languageInstruction = 'Respond in English.';
  }
  const prompt = `
    ${languageInstruction}
    Based on the following survey responses, analyze and suggest up to 3 most suitable professions.
    For each profession, provide:
    1. Match percentage (0-100%)
    2. 3 reasons why it fits
    3. 3 strong skills the person has
    4. 3 skills to improve
    5. Salary range (junior, mid, senior levels)
    6. 2 offline educational institutions from the person's country
    7. 2 global online learning platforms
    8. 3 suggested next steps

    Survey Responses:
    ${JSON.stringify(responses, null, 2)}

    Format the response as a JSON object with the following structure:
    {
      "matches": [
        {
          "title": "string",
          "matchPercentage": number,
          "fitReasons": string[],
          "strongSkills": string[],
          "skillsToImprove": string[],
          "salaryRange": {
            "junior": number,
            "mid": number,
            "senior": number
          },
          "education": {
            "offline": string[],
            "online": string[]
          },
          "nextSteps": string[]
        }
      ]
    }
  `

  // Створюємо заготовку логу перед запитом
  const logTemplate = aiLogsService.createLogTemplate(
    responses,
    language,
    prompt,
    questionnaireId,
    userId
  )

  try {
    console.log('🤖 Starting AI request...')
    
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4-turbo-preview',
      response_format: { type: 'json_object' }
    })

    const response = completion.choices[0].message.content || '{}'
    const parsedResponse = JSON.parse(response)
    
    console.log('✅ AI request completed successfully')

    // Логуємо успішний запит
    console.log('📝 Preparing log entry for successful AI request...')
    const completedLog = aiLogsService.completeLog(
      logTemplate,
      response,
      parsedResponse,
      true,
      undefined,
      completion.usage?.total_tokens
    )
    
    console.log('💾 Completed log data:', completedLog)
    
    // Синхронно зберігаємо лог для тестування
    try {
      console.log('🔄 Attempting to save AI log...')
      const logId = await aiLogsService.logAIRequest(completedLog)
      console.log('✅ AI log saved successfully with ID:', logId)
    } catch (logError) {
      console.error('❌ Failed to save AI log:', logError)
      console.error('🔥 Log error details:', logError)
    }
    
    return parsedResponse
  } catch (error) {
    console.error('❌ Error analyzing survey responses:', error)
    
    // Логуємо помилку
    console.log('📝 Preparing log entry for AI request error...')
    const completedLog = aiLogsService.completeLog(
      logTemplate,
      '',
      null,
      false,
      error instanceof Error ? error.message : 'Unknown error'
    )
    
    console.log('💾 Error log data:', completedLog)
    
    // Синхронно зберігаємо лог з помилкою для тестування
    try {
      console.log('🔄 Attempting to save AI error log...')
      const logId = await aiLogsService.logAIRequest(completedLog)
      console.log('✅ AI error log saved successfully with ID:', logId)
    } catch (logError) {
      console.error('❌ Failed to save AI error log:', logError)
      console.error('🔥 Error log save details:', logError)
    }
    
    throw error
  }
} 