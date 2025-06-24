# AI Logs System Documentation

## Опис системи

Система логування AI запитів дозволяє відстежувати та аналізувати всі звернення до OpenAI API в рамках проекту CGG MVP.

## Що логується

### Input (Вхідні дані)
- `responses`: Відповіді користувача з анкети
- `language`: Мова інтерфейсу користувача
- `prompt`: Повний текст промпту, відправлений до AI

### Output (Вихідні дані)
- `rawResponse`: Сирий текст відповіді від OpenAI
- `parsedResponse`: Розпарсена JSON відповідь
- `success`: Статус успішності запиту (true/false)
- `error`: Текст помилки (якщо є)

### Metadata (Метадані)
- `questionnaireId`: Ідентифікатор анкети ('magical-quest', 'student-survey', тощо)
- `userId`: ID користувача (якщо є)
- `userAgent`: User-Agent браузера
- `model`: Модель AI що використовувалась
- `tokensUsed`: Кількість використаних токенів
- `responseTime`: Час відповіді в мілісекундах

### Timestamps (Часові мітки)
- `requestStarted`: Час початку запиту
- `requestCompleted`: Час завершення запиту
- `createdAt`: Час створення запису в базі

## Структура бази даних

Логи зберігаються в Firebase Firestore в колекції `ai_logs`.

### Приклад документу:
```json
{
  "input": {
    "responses": [...],
    "language": "uk",
    "prompt": "..."
  },
  "output": {
    "rawResponse": "...",
    "parsedResponse": {...},
    "success": true,
    "error": null
  },
  "metadata": {
    "questionnaireId": "magical-quest",
    "userId": "user123",
    "userAgent": "Mozilla/5.0...",
    "model": "gpt-4-turbo-preview",
    "tokensUsed": 1234,
    "responseTime": 2500
  },
  "timestamps": {
    "requestStarted": "2025-06-24T10:00:00.000Z",
    "requestCompleted": "2025-06-24T10:00:02.500Z", 
    "createdAt": "2025-06-24T10:00:03.000Z"
  }
}
```

## Використання

### Автоматичне логування

Логування відбувається автоматично при виклику функції `analyzeSurveyResponses()` в `src/lib/openai.ts`.

### Ручне логування

```typescript
import aiLogsService from '@/services/ai-logs.service'

// Створити шаблон логу
const logTemplate = aiLogsService.createLogTemplate(
  responses,
  language, 
  prompt,
  questionnaireId,
  userId
)

// Після отримання відповіді від AI
const completedLog = aiLogsService.completeLog(
  logTemplate,
  rawResponse,
  parsedResponse,
  success,
  error,
  tokensUsed
)

// Зберегти лог
await aiLogsService.logAIRequest(completedLog)
```

## Адміністрування

### Веб-інтерфейс

Доступний за адресою `/admin/ai-logs` з наступними можливостями:

- Перегляд всіх логів з пагінацією (50 останніх записів)
- Фільтрація за:
  - Типом анкети (questionnaireId)
  - Статусом (успішні/помилки)
- Статистика:
  - Загальна кількість логів
  - Кількість успішних запитів
  - Кількість помилок
  - Середній час відповіді
- Детальний перегляд кожного логу

### Фільтри

#### За типом анкети:
- `magical-quest`: Основна анкета магічного квесту
- `magical-quest-try-magic`: Спроба магії після результатів
- `student-survey`: Анкета для студентів
- `student-try-magic`: Спроба магії для студентів

#### За статусом:
- `all`: Всі записи
- `success`: Тільки успішні запити
- `error`: Тільки помилки

## Налагодження

### Логи в консолі

Система виводить детальні логи в консоль браузера:
- `🤖 Starting AI request...` - початок запиту
- `✅ AI request completed successfully` - успішне завершення
- `❌ Error analyzing survey responses` - помилка запиту
- `📝 Saving AI log entry` - збереження логу
- `✅ AI log entry saved with ID` - успішне збереження

### Помилки

Якщо запис логу не вдався, система:
1. Виводить помилку в консоль
2. Не блокує основний потік виконання
3. Дозволяє продовжити роботу з AI навіть якщо логування не працює

## Налаштування безпеки

### Firestore Rules

Рекомендовані правила безпеки для колекції `ai_logs`:

```javascript
// Тільки адміністратори можуть читати та записувати логи
match /ai_logs/{document} {
  allow read, write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}

// Додаткове правило для запису логів від аутентифікованих користувачів
match /ai_logs/{document} {
  allow create: if request.auth != null;
}
```

## Аналітика та моніторинг

### Ключові метрики для моніторингу:

1. **Час відповіді AI** - середній час обробки запитів
2. **Успішність запитів** - відсоток успішних vs помилкових запитів
3. **Використання токенів** - витрати на API OpenAI
4. **Популярні анкети** - які типи опитувань використовуються найчастіше
5. **Помилки** - аналіз типових помилок для покращення системи

### Рекомендації з оптимізації:

- Моніторити середній час відповіді (повинен бути < 5 секунд)
- Відслідковувати кількість використаних токенів для контролю витрат
- Аналізувати помилки для покращення промптів та обробки помилок
- Регулярно очищати старі логи (> 6 місяців) для економії місця в базі

## Підтримка та розширення

### Додавання нових типів анкет:

1. Оновити виклик `analyzeSurveyResponses()` з новим `questionnaireId`
2. Додати новий тип до фільтрів в `AILogsAdmin.tsx`
3. Оновити документацію

### Додавання нових полів логування:

1. Розширити інтерфейс `AILogEntry` в `ai-logs.service.ts`
2. Оновити методи `createLogTemplate()` та `completeLog()`
3. Оновити UI адміністрування для показу нових полів
