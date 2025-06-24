import React, { useState, useMemo } from 'react'
import { useTestResultsSummary, useTestResults } from '../hooks/useQuestions'

export default function TestResultsAdmin() {
  const { summary, isLoading: summaryLoading, error: summaryError } = useTestResultsSummary()
  const { results, isLoading: resultsLoading, error: resultsError } = useTestResults()
  
  // State для фільтрів
  const [showIncompleteOnly, setShowIncompleteOnly] = useState(false)
  const [selectedUserType, setSelectedUserType] = useState<'all' | 'student' | 'teacher' | 'parent'>('all')

  // Фільтруємо результати
  const filteredResults = useMemo(() => {
    if (!results) return []
    
    return results.filter(result => {
      // Фільтр по завершеності
      if (showIncompleteOnly) {
        const isIncomplete = result.metadata?.isComplete === false || result.questionnaireName.includes('(В процесі)')
        if (!isIncomplete) return false
      }
      
      // Фільтр по типу користувача
      if (selectedUserType !== 'all' && result.userType !== selectedUserType) {
        return false
      }
      
      return true
    })
  }, [results, showIncompleteOnly, selectedUserType])

  if (summaryLoading || resultsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (summaryError || resultsError) {
    return (
      <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded">
        <h2 className="text-lg font-semibold mb-2">Помилка завантаження</h2>
        <p>{summaryError || resultsError}</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Статистика результатів тестів</h1>

      {/* Загальна статистика */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800">Всього результатів</h3>
            <p className="text-3xl font-bold text-blue-600">{summary.totalResults}</p>
          </div>

          <div className="bg-green-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800">Учні</h3>
            <p className="text-3xl font-bold text-green-600">{summary.resultsByType.student}</p>
          </div>

          <div className="bg-orange-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-orange-800">Вчителі</h3>
            <p className="text-3xl font-bold text-orange-600">{summary.resultsByType.teacher}</p>
          </div>

          <div className="bg-purple-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-800">Батьки</h3>
            <p className="text-3xl font-bold text-purple-600">{summary.resultsByType.parent}</p>
          </div>
        </div>
      )}

      {/* Статистика по анкетах */}
      {summary && Object.keys(summary.resultsByQuestionnaire).length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Результати по анкетах</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(summary.resultsByQuestionnaire).map(([questionnaireId, count]) => (
              <div key={questionnaireId} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium text-gray-700">{questionnaireId}</span>
                <span className="text-lg font-bold text-blue-600">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}      {/* Середній час проходження */}
      {summary && summary.averageCompletionTime > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Середній час проходження</h2>
          <p className="text-2xl font-bold text-indigo-600">
            {Math.round(summary.averageCompletionTime / 60)} хвилин
          </p>
        </div>
      )}

      {/* Фільтри результатів */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Фільтри результатів</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="show-incomplete"
              checked={showIncompleteOnly}
              onChange={(e) => setShowIncompleteOnly(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="show-incomplete" className="ml-2 block text-sm text-gray-900">
              Тільки незавершені тести
            </label>
          </div>
          
          <div className="flex items-center">
            <label htmlFor="user-type-filter" className="block text-sm font-medium text-gray-700 mr-2">
              Тип користувача:
            </label>
            <select
              id="user-type-filter"
              value={selectedUserType}
              onChange={(e) => setSelectedUserType(e.target.value as 'all' | 'student' | 'teacher' | 'parent')}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Всі</option>
              <option value="student">Учні</option>
              <option value="teacher">Вчителі</option>
              <option value="parent">Батьки</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            Знайдено результатів: <span className="font-semibold">{filteredResults.length}</span>
          </div>
        </div>
      </div>      {/* Відфільтровані результати */}
      {filteredResults.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Результати тестів
            {showIncompleteOnly && <span className="text-orange-600 ml-2">(Незавершені)</span>}
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата/Статус
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Тип користувача
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Анкета
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Прогрес
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Відповідей
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Час
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResults.slice(0, 20).map((result) => {
                  const isIncomplete = result.metadata?.isComplete === false || result.questionnaireName.includes('(В процесі)')
                  const progressPercentage = result.metadata?.progressPercentage || 0
                    return (
                    <tr key={result.id} className={`hover:bg-gray-50 ${isIncomplete ? 'bg-orange-50' : ''}`}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        <div>
                          <div className="text-gray-900">
                            {new Date(result.completedAt.toDate()).toLocaleDateString('uk-UA')}
                          </div>
                          <div className={`text-xs ${isIncomplete ? 'text-orange-600' : 'text-green-600'}`}>
                            {isIncomplete ? 'В процесі' : 'Завершено'}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          result.userType === 'student' ? 'bg-green-100 text-green-800' :
                          result.userType === 'teacher' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {result.userType === 'student' ? 'Учень' : 
                           result.userType === 'teacher' ? 'Вчитель' : 'Батько'}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {result.questionnaireName}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className={`h-2 rounded-full ${isIncomplete ? 'bg-orange-400' : 'bg-green-400'}`}
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">{Math.round(progressPercentage)}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {result.responses.length}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {result.metadata?.completionTime ? 
                          `${Math.round(result.metadata.completionTime / 60)} хв` : 
                          'N/A'
                        }
                      </td>
                    </tr>                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Детальний список всіх результатів */}
      {results && results.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Всі результати ({results.length})
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {results.map((result) => (
              <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{result.questionnaireName}</h3>
                    <p className="text-sm text-gray-500">
                      ID: {result.id}
                    </p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    result.userType === 'student' ? 'bg-green-100 text-green-800' :
                    result.userType === 'teacher' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {result.userType === 'student' ? 'Учень' : 
                     result.userType === 'teacher' ? 'Вчитель' : 'Батько'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Дата:</span>
                    <p className="font-medium">
                      {new Date(result.completedAt.toDate()).toLocaleDateString('uk-UA')}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Відповідей:</span>
                    <p className="font-medium">{result.responses.length}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Вік:</span>
                    <p className="font-medium">{result.metadata.userAge || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Час:</span>
                    <p className="font-medium">
                      {result.metadata.completionTime ? 
                        `${Math.round(result.metadata.completionTime / 60)} хв` : '-'}
                    </p>
                  </div>
                </div>

                {result.metadata.schoolName && (
                  <div className="mt-2">
                    <span className="text-gray-500 text-sm">Заклад:</span>
                    <p className="text-sm font-medium">{result.metadata.schoolName}</p>
                  </div>
                )}

                {result.matches && result.matches.length > 0 && (
                  <div className="mt-3">
                    <span className="text-gray-500 text-sm">Топ-3 професії:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {result.matches.slice(0, 3).map((match, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs bg-indigo-100 text-indigo-800"
                        >
                          {match.title} ({match.matchPercentage}%)
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
