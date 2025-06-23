# Firebase Testing Suite

Комплексний набір тестів для перевірки підключення, запису та безпеки Firebase Firestore.

## 🚀 Швидкий старт

1. Перейдіть на сторінку: http://localhost:3000/test-firebase
2. Переконайтеся, що всі змінні оточення налаштовані правильно
3. Запустіть тести для перевірки функціональності

## 📋 Доступні тести

### ⚙️ Тест конфігурації
- Перевіряє наявність всіх необхідних змінних оточення Firebase
- Валідує формат і правильність значень
- Показує маскіровані значення для безпеки

### 🔄 Основні операції
- **Перевірка підключення** - тестує базове з'єднання з Firestore
- **Додавання тестових даних** - створює документи в колекції `test`
- **Перевірка колекцій** - сканує всі доступні колекції
- **Тести запису** - комплексна перевірка addDoc, updateDoc, setDoc, deleteDoc
- **Тест читання** - вимірює продуктивність читання
- **Real-time listener** - тестує підписки на зміни в реальному часі

### 📊 Тест масового запису
- **Sequential Write** - послідовний запис документів
- **Batch Write** - групове записування (рекомендовано для великих даних)
- **Parallel Write** - паралельний запис з Promise.all
- Порівняння продуктивності різних методів

### 🔒 Тести безпеки
- Перевіряє правила безпеки Firestore
- Тестує доступ до різних колекцій без аутентифікації
- Показує які операції дозволені/заборонені

## 📈 Метрики продуктивності

Система вимірює час виконання операцій:
- Час читання (ms)
- Час запису (ms) 
- Час оновлення (ms)
- Час видалення (ms)

## 🛠️ Налаштування

### Змінні оточення (.env.local)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

### Правила безпеки Firestore

Для тестування рекомендується дозволити доступ до колекції `test`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Тестова колекція - дозволити всі операції
    match /test/{document} {
      allow read, write: if true;
    }
    
    // Інші колекції - обмежити доступ
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## ⚠️ Попередження

- **НЕ** використовуйте ці тести на продакшн даних
- **НЕ** коммітьте файл `.env.local` в git
- Переконайтеся, що правила безпеки правильно налаштовані для продакшн
- Тести створюють тестові дані - очищайте їх після використання

## 🔗 Корисні посилання

- [Firebase Console](https://console.firebase.google.com/)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

## 🐛 Усунення проблем

### Типові помилки:

1. **"Missing or insufficient permissions"**
   - Перевірте правила безпеки Firestore
   - Переконайтеся, що доступ до колекції `test` дозволено

2. **"Firebase: Error (auth/invalid-api-key)"**
   - Перевірте правильність API ключа в `.env.local`
   - Переконайтеся, що змінні мають префікс `NEXT_PUBLIC_`

3. **"Network request failed"**
   - Перевірте інтернет-з'єднання
   - Переконайтеся, що Firebase проект активний

4. **"Quota exceeded"**
   - Перевірте квоти в Firebase Console
   - Зменшіть кількість тестових записів

## 📝 Логи

Всі помилки логуються в консоль браузера. Відкрийте Developer Tools (F12) для детальної інформації про помилки.
