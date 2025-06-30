import OpenAI from 'openai'
import type { SurveyResponse } from '@/types/survey'

if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
  throw new Error('Missing NEXT_PUBLIC_OPENAI_API_KEY environment variable')
}

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

export async function analyzeSurveyResponses(responses: SurveyResponse[], language: string = 'uk') {
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
    Based on the following survey responses, analyze and suggest exactly 3 most suitable professions.
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

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4-turbo-preview',
      response_format: { type: 'json_object' }
    })

    const response = completion.choices[0].message.content
    return JSON.parse(response || '{}')
  } catch (error) {
    console.error('Error analyzing survey responses:', error)
    throw error
  }
} 