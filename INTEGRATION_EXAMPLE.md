```tsx
// Приклад інтеграції у будь-який тест (наприклад, teacher survey)

import { useEffect, useState } from 'react'
import { useSaveTestResult } from '@/hooks/useQuestions'
import UserTypeSelection from '@/components/UserTypeSelection'
import TestCompletion from '@/components/TestCompletion'
import surveyUtils from '@/utils/survey.utils'
import type { SurveyResponse } from '@/types/survey'

export default function TeacherSurveyPage() {
  const [userTypeSelected, setUserTypeSelected] = useState(false)
  const [surveyCompleted, setSurveyCompleted] = useState(false)
  const [responses, setResponses] = useState<SurveyResponse[]>([])
  const [userType, setUserType] = useState<'student' | 'teacher' | 'parent'>('teacher')

  // Обробник вибору типу користувача
  const handleUserTypeSelected = (selectedType: 'student' | 'teacher' | 'parent') => {
    setUserType(selectedType)
    setUserTypeSelected(true)
  }

  // Обробник завершення тесту
  const handleSurveyCompleted = (surveyResponses: SurveyResponse[]) => {
    setResponses(surveyResponses)
    setSurveyCompleted(true)
  }

  // Обробник збереження результату
  const handleResultSaved = (resultId: string) => {
    console.log('✅ Test result saved with ID:', resultId)
    // Можна перенаправити користувача або показати повідомлення
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {!userTypeSelected ? (
        // Крок 1: Вибір типу користувача
        <UserTypeSelection
          onUserTypeSelected={handleUserTypeSelected}
          questionnaireId="teacher-survey"
          questionnaireName="Анкета для вчителів"
        />
      ) : !surveyCompleted ? (
        // Крок 2: Проходження тесту
        <div className="max-w-4xl mx-auto">
          {/* Тут ваш існуючий компонент тесту */}
          <YourExistingSurveyComponent
            userType={userType}
            onComplete={handleSurveyCompleted}
          />
        </div>
      ) : (
        // Крок 3: Збереження результатів
        <TestCompletion
          userType={userType}
          questionnaireId="teacher-survey"
          questionnaireName="Анкета для вчителів"
          responses={responses}
          onResultSaved={handleResultSaved}
          onError={(error) => console.error('Error saving result:', error)}
        />
      )}
    </div>
  )
}

// Приклад простого компонента тесту
function YourExistingSurveyComponent({ 
  userType, 
  onComplete 
}: { 
  userType: string
  onComplete: (responses: SurveyResponse[]) => void 
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<SurveyResponse[]>([])

  const questions = [
    { id: 'q1', text: 'Скільки років ви працюєте вчителем?', type: 'text' },
    { id: 'q2', text: 'Який предмет викладаєте?', type: 'text' },
    // Додайте більше питань...
  ]

  const handleAnswer = (questionId: string, answer: string) => {
    const newResponse: SurveyResponse = {
      questionId,
      answerId: answer
    }
    
    const updatedResponses = [...responses, newResponse]
    setResponses(updatedResponses)

    // Зберігаємо прогрес
    surveyUtils.saveProgress(
      'teacher-survey',
      currentQuestion + 1,
      questions.length,
      updatedResponses
    )

    if (currentQuestion + 1 >= questions.length) {
      // Тест завершено
      onComplete(updatedResponses)
    } else {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            Питання {currentQuestion + 1} з {questions.length}
          </span>
          <span className="text-sm text-gray-500">
            Тип: {userType}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {questions[currentQuestion]?.text}
        </h2>
        <input
          type="text"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Введіть вашу відповідь..."
          onKeyPress={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              handleAnswer(questions[currentQuestion].id, e.currentTarget.value.trim())
              e.currentTarget.value = ''
            }
          }}
        />
      </div>
    </div>
  )
}
```

## Ключові переваги нової системи:

1. **📊 Централізоване збереження** - всі результати тестів зберігаються в одному місці
2. **⏱️ Автоматичне відстеження часу** - система автоматично рахує час проходження
3. **👥 Типізація користувачів** - розділення за ролями (учень, вчитель, батьки)
4. **📈 Детальна аналітика** - готові компоненти для відображення статистики
5. **🔒 Приватність** - анонімне зберігання даних з унікальними ID
6. **💾 Прогрес** - можливість зберігати прогрес проходження
7. **🎯 Метадані** - збереження додаткової інформації про контекст тесту

## Структура збережених даних:

```json
{
  "id": "result_1234567890_abc123def",
  "userId": "user_1234567890_xyz789",
  "userType": "student",
  "questionnaireId": "magical-quest",
  "questionnaireName": "Магічний квест професій",
  "responses": [
    {
      "questionId": "email", 
      "answerId": "test@example.com"
    }
  ],
  "matches": [
    {
      "title": "Frontend Developer",
      "matchPercentage": 85,
      "description": "...",
      "fitReasons": ["..."],
      "strongSkills": ["..."]
    }
  ],
  "metadata": {
    "userAge": 16,
    "userGrade": "10-А",
    "schoolName": "Гімназія №1",
    "completionTime": 420,
    "additionalData": {
      "language": "uk",
      "timestamp": "2024-12-24T10:30:00.000Z",
      "userAgent": "Mozilla/5.0..."
    }
  },
  "createdAt": "2024-12-24T10:30:00.000Z",
  "completedAt": "2024-12-24T10:37:00.000Z"
}
```
