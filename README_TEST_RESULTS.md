# Система збереження результатів тестів

Цей модуль надає функціональність для збереження та аналізу результатів проходження тестів у Firebase Firestore.

## Архітектура

### Основні компоненти:

1. **TestResultsService** (`src/services/test-results.service.ts`) - сервіс для роботи з Firebase
2. **useQuestions хуки** (`src/hooks/useQuestions.ts`) - React хуки для управління станом
3. **Survey Utils** (`src/utils/survey.utils.ts`) - утиліти для відстеження часу та прогресу
4. **Компоненти UI** - компоненти для відображення та збереження результатів

## Структура даних

### TestResult
```typescript
interface TestResult {
  id: string;
  userId: string; // Унікальний ідентифікатор користувача
  userType: 'student' | 'teacher' | 'parent';
  questionnaireId: string; // ID анкети
  questionnaireName: string;
  responses: SurveyResponse[]; // Відповіді користувача
  matches?: ProfessionMatch[]; // Результати аналізу
  metadata: {
    userAge?: number;
    userGrade?: string;
    schoolName?: string;
    completionTime?: number; // Час у секундах
    additionalData?: Record<string, string | number | boolean>;
  };
  createdAt: Date;
  completedAt: Date;
}
```

## Використання

### 1. Збереження результатів тесту

```tsx
import { useSaveTestResult } from '@/hooks/useQuestions'
import testResultsService from '@/services/test-results.service'

function TestComponent() {
  const { saveTestResult, isSaving, error } = useSaveTestResult()

  const handleSave = async () => {
    try {
      const resultId = await saveTestResult({
        userId: testResultsService.generateUserId(),
        userType: 'student',
        questionnaireId: 'magical-quest',
        questionnaireName: 'Магічний квест професій',
        responses: responses,
        matches: matches,
        metadata: {
          completionTime: 300, // 5 хвилин
          userAge: 16,
          schoolName: 'Школа №1'
        }
      })
      console.log('Результат збережено:', resultId)
    } catch (error) {
      console.error('Помилка збереження:', error)
    }
  }

  return (
    <button onClick={handleSave} disabled={isSaving}>
      {isSaving ? 'Збереження...' : 'Зберегти результат'}
    </button>
  )
}
```

### 2. Відстеження часу проходження

```tsx
import surveyUtils from '@/utils/survey.utils'

// На початку тесту
useEffect(() => {
  surveyUtils.startSurvey('magical-quest')
}, [])

// При завершенні тесту
const completionTime = surveyUtils.calculateCompletionTime('magical-quest')
```

### 3. Завантаження результатів

```tsx
import { useTestResults, useQuestionnaireResults } from '@/hooks/useQuestions'

// Всі результати
function AllResults() {
  const { results, isLoading, error } = useTestResults()
  
  if (isLoading) return <div>Завантаження...</div>
  if (error) return <div>Помилка: {error}</div>
  
  return (
    <div>
      {results.map(result => (
        <div key={result.id}>{result.questionnaireName}</div>
      ))}
    </div>
  )
}

// Результати конкретної анкети
function QuestionnaireResults() {
  const { results } = useQuestionnaireResults('magical-quest')
  return <div>Результатів: {results.length}</div>
}
```

### 4. Статистика результатів

```tsx
import { useTestResultsSummary } from '@/hooks/useQuestions'

function Statistics() {
  const { summary, isLoading } = useTestResultsSummary()
  
  if (isLoading) return <div>Завантаження...</div>
  
  return (
    <div>
      <p>Всього результатів: {summary?.totalResults}</p>
      <p>Учнів: {summary?.resultsByType.student}</p>
      <p>Вчителів: {summary?.resultsByType.teacher}</p>
      <p>Батьків: {summary?.resultsByType.parent}</p>
    </div>
  )
}
```

## Готові компоненти

### TestCompletion
Компонент для завершення тесту та збереження результатів:

```tsx
import TestCompletion from '@/components/TestCompletion'

<TestCompletion
  userType="student"
  questionnaireId="magical-quest"
  questionnaireName="Магічний квест професій"
  responses={responses}
  matches={matches}
  onResultSaved={(resultId) => console.log('Збережено:', resultId)}
/>
```

### TestResultsAdmin
Компонент для адміністрування результатів:

```tsx
import TestResultsAdmin from '@/components/TestResultsAdmin'

// На сторінці /admin/test-results
<TestResultsAdmin />
```

## Структура Firebase

### Колекція: `test_results`

Документи зберігаються з такими полями:
- `userId` - ID користувача
- `userType` - тип користувача
- `questionnaireId` - ID анкети
- `questionnaireName` - назва анкети
- `responses[]` - масив відповідей
- `matches[]` - результати аналізу (опціонально)
- `metadata{}` - додаткові дані
- `createdAt` - дата створення
- `completedAt` - дата завершення

### Індекси для оптимізації:
- `userId` (ascending)
- `questionnaireId` (ascending)
- `userType` (ascending)
- `completedAt` (descending)

## API сервісу

### TestResultsService методи:

- `saveTestResult(result)` - зберегти результат
- `saveTestResultWithId(id, result)` - зберегти з кастомним ID
- `getTestResult(id)` - отримати результат за ID
- `getUserTestResults(userId)` - результати користувача
- `getQuestionnaireResults(questionnaireId)` - результати анкети
- `getResultsByUserType(userType)` - результати за типом користувача
- `getAllTestResults(limit)` - всі результати з лімітом
- `getTestResultsSummary()` - статистика результатів
- `generateUserId()` - генерація ID користувача
- `generateSessionId()` - генерація ID сесії

### Survey Utils методи:

- `startSurvey(questionnaireId)` - почати відстеження
- `calculateCompletionTime(questionnaireId)` - обчислити час
- `clearSurveyTime(questionnaireId)` - очистити час
- `saveProgress(questionnaireId, step, total, responses)` - зберегти прогрес
- `loadProgress(questionnaireId)` - завантажити прогрес
- `saveUserMetadata(metadata)` - зберегти метадані
- `loadUserMetadata()` - завантажити метадані

## Приклади використання

### Повний цикл тесту

```tsx
// Початок тесту
useEffect(() => {
  surveyUtils.startSurvey('teacher-survey')
  surveyUtils.saveUserMetadata({
    userType: 'teacher',
    userAge: 35,
    schoolName: 'Гімназія №5'
  })
}, [])

// Збереження результату
const handleComplete = async () => {
  const completionTime = surveyUtils.calculateCompletionTime('teacher-survey')
  const metadata = surveyUtils.loadUserMetadata()
  
  await saveTestResult({
    userId: testResultsService.generateUserId(),
    userType: 'teacher',
    questionnaireId: 'teacher-survey',
    questionnaireName: 'Анкета для вчителів',
    responses: responses,
    metadata: {
      completionTime,
      ...metadata
    }
  })
  
  // Очистити тимчасові дані
  surveyUtils.clearSurveyTime('teacher-survey')
  surveyUtils.clearProgress('teacher-survey')
}
```

## Безпека та приватність

- Всі дані зберігаються анонімно
- `userId` генерується на клієнті
- Особисті дані не зберігаються без згоди
- Метадані містять тільки необхідну статистичну інформацію

## Моніторинг та логування

Система включає детальне логування:
- ✅ Успішні операції
- ❌ Помилки збереження
- 📊 Статистика завантаження
- 🕒 Відстеження часу
- ⏱️ Час завершення тестів

## Майбутні покращення

1. Експорт даних у CSV/Excel
2. Графічна аналітика результатів
3. Порівняння результатів по регіонах/школах
4. Автоматичні звіти
5. Інтеграція з системами аналітики
