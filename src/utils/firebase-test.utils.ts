// Утиліта для перевірки з'єднання з Firebase
import { db } from '../config/firebase'
import { collection, getDocs, limit, query } from 'firebase/firestore'

export const firebaseTestUtils = {
  /**
   * Перевіряє з'єднання з Firebase
   */
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Testing Firebase connection...')
      
      // Спробуємо прочитати з колекції questionnaires
      const testQuery = query(
        collection(db, 'questionnaires'),
        limit(1)
      )
      
      const snapshot = await getDocs(testQuery)
      console.log('✅ Firebase connection successful!')
      console.log('📊 Test query returned', snapshot.size, 'documents')
      
      return true
    } catch (error) {
      console.error('❌ Firebase connection failed!')
      console.error('🔥 Error details:', error)
      return false
    }
  },

  /**
   * Перевіряє чи існує колекція test_results
   */
  async checkTestResultsCollection(): Promise<boolean> {
    try {
      console.log('🔍 Checking test_results collection...')
      
      const testQuery = query(
        collection(db, 'test_results'),
        limit(1)
      )
      
      const snapshot = await getDocs(testQuery)
      console.log('✅ test_results collection accessible!')
      console.log('📊 Collection contains', snapshot.size, 'documents')
      
      return true
    } catch (error) {
      console.error('❌ Cannot access test_results collection!')
      console.error('🔥 Error details:', error)
      return false
    }
  },

  /**
   * Виводить інформацію про Firebase конфігурацію
   */
  logFirebaseConfig() {
    console.log('🔧 Firebase Configuration Check:')
    console.log('🔹 App initialized:', !!db)
    console.log('🔹 Database object:', db)
    
    // Перевіряємо чи є потрібні змінні середовища
    if (typeof window !== 'undefined') {
      console.log('🌐 Running in browser environment')
    } else {
      console.log('🖥️ Running in server environment')
    }
  }
}

export default firebaseTestUtils
