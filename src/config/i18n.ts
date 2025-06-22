import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      roles: {
        student: 'Student',
        parent: 'Parent',
        teacher: 'Teacher',
        magicalQuest: 'Magical Quest'
      },
      magicalQuest: {
        intro: {
          title: 'I am Emberwing, your magical guide',
          subtitle: 'Let\'s find your path to success together!',
          start: 'Start',
          progress: 'Ready to begin? Click the button below!'
        },
        survey: {
          step: 'Step {{current}} of {{total}}',
          complete: 'Complete'
        }
      }
    }
  },
  uk: {
    translation: {
      roles: {
        student: 'Учень',
        parent: 'Батько/Мати',
        teacher: 'Вчитель',
        magicalQuest: 'Магічний квест'
      },
      magicalQuest: {
        intro: {
          title: 'Я Ембервінґ, твій магічний гід',
          subtitle: 'Давай разом знайдемо твій шлях до успіху!',
          start: 'Почати',
          progress: 'Готовий почати? Натисни кнопку нижче!'
        },
        survey: {
          step: 'Крок {{current}} з {{total}}',
          complete: 'Завершити'
        }
      }
    }
  },
  hi: {
    translation: {
      roles: {
        student: 'छात्र',
        parent: 'माता-पिता',
        teacher: 'शिक्षक',
        magicalQuest: 'जादुई खोज'
      },
      magicalQuest: {
        intro: {
          title: 'मैं एम्बरविंग हूं, आपका जादुई गाइड',
          subtitle: 'चलिए सफलता का रास्ता एक साथ खोजते हैं!',
          start: 'शुरू करें',
          progress: 'शुरू करने के लिए तैयार? नीचे दिए गए बटन पर क्लिक करें!'
        },
        survey: {
          step: 'चरण {{current}} / {{total}}',
          complete: 'पूर्ण करें'
        }
      }
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'uk', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n 