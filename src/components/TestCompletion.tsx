import React, { useState } from 'react'
import { useSaveTestResult } from '../hooks/useQuestions'
import testResultsService from '../services/test-results.service'
import type { SurveyResponse, ProfessionMatch } from '../types/survey'

interface TestCompletionProps {
  userId?: string
  userType: 'student' | 'teacher' | 'parent'
  questionnaireId: string
  questionnaireName: string
  responses: SurveyResponse[]
  matches?: ProfessionMatch[]
  onResultSaved?: (resultId: string) => void
  onError?: (error: string) => void
}

export default function TestCompletion({
  userId,
  userType,
  questionnaireId,
  questionnaireName,
  responses,
  matches,
  onResultSaved,
  onError
}: TestCompletionProps) {
  const { saveTestResult, isSaving, error } = useSaveTestResult()
  const [completionTime, setCompletionTime] = useState<number>(0)
  const [additionalInfo, setAdditionalInfo] = useState({
    userAge: '',
    userGrade: '',
    schoolName: ''
  })

  // Генеруємо унікальний ID користувача, якщо не передано
  const finalUserId = userId || testResultsService.generateUserId()

  const handleSaveResult = async () => {
    try {
      const resultData = {
        userId: finalUserId,
        userType,
        questionnaireId,
        questionnaireName,
        responses,
        matches,
        metadata: {
          userAge: additionalInfo.userAge ? parseInt(additionalInfo.userAge) : undefined,
          userGrade: additionalInfo.userGrade || undefined,
          schoolName: additionalInfo.schoolName || undefined,
          completionTime: completionTime || undefined,
          additionalData: {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            language: navigator.language
          }
        }
      }

      const resultId = await saveTestResult(resultData)
      console.log('✅ Test result saved with ID:', resultId)
      
      if (onResultSaved) {
        onResultSaved(resultId)
      }
    } catch (err) {
      console.error('❌ Error saving test result:', err)
      if (onError) {
        onError(err instanceof Error ? err.message : 'Unknown error')
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Завершення тесту: {questionnaireName}
      </h2>

      <div className="space-y-4 mb-6">
        <div>          <label className="block text-sm font-medium text-gray-700 mb-2">
            Вік (необов&apos;язково)
          </label>
          <input
            type="number"
            value={additionalInfo.userAge}
            onChange={(e) => setAdditionalInfo(prev => ({ ...prev, userAge: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Введіть ваш вік"
          />
        </div>

        {userType === 'student' && (
          <div>            <label className="block text-sm font-medium text-gray-700 mb-2">
              Клас (необов&apos;язково)
            </label>
            <input
              type="text"
              value={additionalInfo.userGrade}
              onChange={(e) => setAdditionalInfo(prev => ({ ...prev, userGrade: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Наприклад: 10-А"
            />
          </div>
        )}

        <div>          <label className="block text-sm font-medium text-gray-700 mb-2">
            Назва навчального закладу (необов&apos;язково)
          </label>
          <input
            type="text"
            value={additionalInfo.schoolName}
            onChange={(e) => setAdditionalInfo(prev => ({ ...prev, schoolName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Введіть назву школи/університету"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Час проходження (хвилини)
          </label>
          <input
            type="number"
            value={completionTime}
            onChange={(e) => setCompletionTime(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Скільки часу зайняло проходження тесту"
          />
        </div>
      </div>

      {/* Показуємо результати, якщо є */}
      {matches && matches.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            Ваші результати:
          </h3>
          <div className="space-y-2">
            {matches.slice(0, 3).map((match, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-blue-700">{match.title}</span>
                <span className="text-blue-600 font-medium">
                  {match.matchPercentage}% відповідності
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Показуємо статистику відповідей */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Статистика проходження:
        </h3>
        <div className="text-sm text-gray-600">
          <p>Загальна кількість відповідей: {responses.length}</p>
          <p>Тип користувача: {userType === 'student' ? 'Учень' : userType === 'teacher' ? 'Вчитель' : 'Батько'}</p>
          <p>ID анкети: {questionnaireId}</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="text-sm">Помилка збереження: {error}</p>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleSaveResult}
          disabled={isSaving}
          className={`flex-1 px-6 py-3 rounded-md font-medium transition-colors ${
            isSaving
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSaving ? 'Збереження...' : 'Зберегти результати'}
        </button>

        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium transition-colors"
        >
          Пройти ще раз
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>Ваші дані зберігаються анонімно та використовуються лише для статистики.</p>
        <p>ID користувача: {finalUserId}</p>
      </div>
    </div>
  )
}
