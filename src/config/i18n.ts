import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import homeEn from '../app/locales/en/home.json'
import homeUk from '../app/locales/uk/home.json'
import homeHi from '../app/locales/hi/home.json'
import parentEn from '../app/locales/en/parent.json'
import parentUk from '../app/locales/uk/parent.json'
import parentHi from '../app/locales/hi/parent.json'
import teacherEn from '../app/locales/en/teacher.json'
import teacherUk from '../app/locales/uk/teacher.json'
import teacherHi from '../app/locales/hi/teacher.json'
import studentEn from '../app/locales/en/student.json'
import studentUk from '../app/locales/uk/student.json'
import studentHi from '../app/locales/hi/student.json'
import magicalQuestEn from '../app/magical-quest/locales/en/magical-quest.json'
import magicalQuestUk from '../app/magical-quest/locales/uk/magical-quest.json'
import magicalQuestHi from '../app/magical-quest/locales/hi/magical-quest.json'
import magicalQuestV2En from '../app/magical-quest-v2/locales/en/magical-quest-v2.json'
import magicalQuestV2Uk from '../app/magical-quest-v2/locales/uk/magical-quest-v2.json'
import magicalQuestV2Hi from '../app/magical-quest-v2/locales/hi/magical-quest-v2.json'
// Add other flows as needed

const resources = {
  en: {
    home: homeEn,
    parent: parentEn,
    teacher: teacherEn,
    student: studentEn,
    'magical-quest': magicalQuestEn,
    'magical-quest-v2': magicalQuestV2En
    // ...add other namespaces
  },
  uk: {
    home: homeUk,
    parent: parentUk,
    teacher: teacherUk,
    student: studentUk,
    'magical-quest': magicalQuestUk,
    'magical-quest-v2': magicalQuestV2Uk
    // ...add other namespaces
  },
  hi: {
    home: homeHi,
    parent: parentHi,
    teacher: teacherHi,
    student: studentHi,
    'magical-quest': magicalQuestHi,
    'magical-quest-v2': magicalQuestV2Hi
    // ...add other namespaces
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    ns: ['home', 'parent', 'teacher', 'student', 'magical-quest', 'magical-quest-v2'],
    defaultNS: 'home',
    interpolation: {
      escapeValue: false
    },
    debug: true
  })

export default i18n 