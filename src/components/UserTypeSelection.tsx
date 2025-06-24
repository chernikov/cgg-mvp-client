import React, { useState } from 'react'
import surveyUtils from '../utils/survey.utils'

interface UserTypeSelectionProps {
  onUserTypeSelected: (userType: 'student' | 'teacher' | 'parent') => void
  questionnaireId: string
  questionnaireName: string
}

export default function UserTypeSelection({
  onUserTypeSelected,
  questionnaireId,
  questionnaireName
}: UserTypeSelectionProps) {
  const [selectedType, setSelectedType] = useState<'student' | 'teacher' | 'parent' | null>(null)
  const [additionalInfo, setAdditionalInfo] = useState({
    age: '',
    grade: '',
    schoolName: ''
  })
  const handleProceed = () => {
    if (!selectedType) return

    console.log('🚀 UserTypeSelection: Starting user type selection process')
    console.log('📝 Selected user type:', selectedType)
    console.log('📋 Additional info:', additionalInfo)
    console.log('🎯 Questionnaire ID:', questionnaireId)
    console.log('📄 Questionnaire name:', questionnaireName)

    // Зберігаємо метадані користувача
    const metadata = {
      userType: selectedType,
      userAge: additionalInfo.age ? parseInt(additionalInfo.age) : undefined,
      userGrade: additionalInfo.grade || undefined,
      schoolName: additionalInfo.schoolName || undefined,
      additionalData: {
        selectionTimestamp: new Date().toISOString(),
        questionnaireId,
        questionnaireName
      }
    }
    
    console.log('💾 Saving user metadata:', metadata)
    surveyUtils.saveUserMetadata(metadata)

    // Запускаємо відстеження часу
    console.log('⏰ Starting survey timer for:', questionnaireId)
    surveyUtils.startSurvey(questionnaireId)

    console.log('✅ UserTypeSelection: Process completed, calling onUserTypeSelected')
    onUserTypeSelected(selectedType)
  }

  const userTypes = [
    {
      type: 'student' as const,
      title: 'Учень/Студент',
      description: 'Я хочу дізнатися про майбутні професії',
      icon: '🎓',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      type: 'teacher' as const,
      title: 'Вчитель/Викладач',
      description: 'Я допомагаю учням обирати професії',
      icon: '👨‍🏫',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      type: 'parent' as const,
      title: 'Батько/Мати',
      description: 'Я хочу допомогти своїй дитині',
      icon: '👨‍👩‍👧‍👦',
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ]

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
        Хто ви?
      </h2>
      <p className="text-gray-600 mb-8 text-center">
        Оберіть свою роль, щоб ми могли налаштувати тест під вас
      </p>

      <div className="grid gap-4 mb-6">
        {userTypes.map((type) => (
          <button
            key={type.type}
            onClick={() => setSelectedType(type.type)}
            className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
              selectedType === type.type
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-4">
              <span className="text-4xl">{type.icon}</span>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {type.title}
                </h3>
                <p className="text-gray-600">{type.description}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 ${
                selectedType === type.type
                  ? 'bg-blue-500 border-blue-500'
                  : 'border-gray-300'
              }`}>
                {selectedType === type.type && (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedType && (
        <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800">
            Додаткова інформація (необов&apos;язково)
          </h4>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Вік
              </label>
              <input
                type="number"
                value={additionalInfo.age}
                onChange={(e) => setAdditionalInfo(prev => ({ ...prev, age: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ваш вік"
                min="10"
                max="100"
              />
            </div>

            {selectedType === 'student' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Клас/Курс
                </label>
                <input
                  type="text"
                  value={additionalInfo.grade}
                  onChange={(e) => setAdditionalInfo(prev => ({ ...prev, grade: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Наприклад: 11-А, 2 курс"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Навчальний заклад
            </label>
            <input
              type="text"
              value={additionalInfo.schoolName}
              onChange={(e) => setAdditionalInfo(prev => ({ ...prev, schoolName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Назва школи, університету, коледжу"
            />
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={handleProceed}
          disabled={!selectedType}
          className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
            selectedType
              ? 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Розпочати тест
        </button>
      </div>

      <div className="mt-6 text-xs text-gray-500 text-center">
        <p>Ваші дані використовуються анонімно для покращення рекомендацій</p>
      </div>
    </div>
  )
}
