import { db } from "../config/firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  query,
  orderBy,
  where,
  Timestamp,
  limit,
} from "firebase/firestore";
import type { SurveyResponse, ProfessionMatch } from "../types/survey";

export interface TestResult {
  id: string;
  userId: string; // Унікальний ідентифікатор користувача (може бути згенерований на клієнті)
  userType: 'student' | 'teacher' | 'parent'; // Тип користувача  questionnaireId: string; // ID анкети/тесту
  questionnaireName: string; // Назва анкети для зручності
  responses: SurveyResponse[]; // Відповіді користувача
  matches?: ProfessionMatch[]; // Результати аналізу (для magical-quest)
  metadata: {
    userAge?: number;
    userGrade?: string;
    schoolName?: string;
    completionTime?: number; // Час проходження в секундах
    isComplete?: boolean; // Чи завершено тест повністю
    currentStep?: number; // Поточний крок (для проміжних результатів)
    totalSteps?: number; // Загальна кількість кроків
    progressPercentage?: number; // Відсоток завершення
    lastUpdated?: string; // Час останнього оновлення
    additionalData?: Record<string, string | number | boolean>; // Додаткові метадані
  };
  createdAt: Date;
  completedAt: Date;
}

export interface StoredTestResult extends Omit<TestResult, "createdAt" | "completedAt"> {
  createdAt: Timestamp;
  completedAt: Timestamp;
}

export interface TestResultSummary {
  totalResults: number;
  resultsByType: {
    student: number;
    teacher: number;
    parent: number;
  };
  resultsByQuestionnaire: Record<string, number>;
  averageCompletionTime: number;
  recentResults: StoredTestResult[];
}

class TestResultsService {
  private readonly COLLECTION_NAME = "test_results";
  /**
   * Зберігає результат тесту в Firebase
   */
  async saveTestResult(
    result: Omit<TestResult, "id" | "createdAt" | "completedAt">
  ): Promise<string> {
    console.log('🔥 TestResultsService: Starting saveTestResult')
    console.log('📋 Input data:', result)
    
    try {
      const docData = {
        ...result,
        createdAt: new Date(),
        completedAt: new Date(),
      };

      console.log('📄 Document data to save:', docData)
      console.log('🎯 Collection name:', this.COLLECTION_NAME)

      const docRef = await addDoc(
        collection(db, this.COLLECTION_NAME),
        docData
      );
      
      console.log("✅ TestResultsService: Test result saved successfully!")
      console.log("🆔 Document ID:", docRef.id);
      console.log("📊 Saved to collection:", this.COLLECTION_NAME);
      
      return docRef.id;
    } catch (error) {
      console.error("❌ TestResultsService: Error saving test result");
      console.error("🔥 Error details:", error);
      console.error("📋 Collection:", this.COLLECTION_NAME);
      console.error("💾 Data that failed to save:", result);
      throw error;
    }
  }

  /**
   * Зберігає результат тесту з кастомним ID
   */
  async saveTestResultWithId(
    id: string,
    result: Omit<TestResult, "id" | "createdAt" | "completedAt">
  ): Promise<void> {
    try {
      const docData = {
        ...result,
        createdAt: new Date(),
        completedAt: new Date(),
      };

      await setDoc(doc(db, this.COLLECTION_NAME, id), docData);
      console.log("✅ Test result saved with custom ID:", id);
    } catch (error) {
      console.error("❌ Error saving test result with ID:", error);
      throw error;
    }
  }

  /**
   * Отримує результат тесту за ID
   */
  async getTestResult(id: string): Promise<StoredTestResult | null> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where("__name__", "==", id)
      );
      const docSnap = await getDocs(q);

      if (docSnap.empty) {
        console.log("❌ No test result found with ID:", id);
        return null;
      }      const docData = docSnap.docs[0].data();
      return {
        id: docSnap.docs[0].id,
        ...docData,
      } as StoredTestResult;
    } catch (error) {
      console.error("❌ Error getting test result:", error);
      throw error;
    }
  }

  /**
   * Отримує всі результати тестів для конкретного користувача
   */
  async getUserTestResults(userId: string): Promise<StoredTestResult[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where("userId", "==", userId),
        orderBy("completedAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const results: StoredTestResult[] = [];

      querySnapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        } as StoredTestResult);
      });

      console.log(`📊 Loaded ${results.length} test results for user ${userId}`);
      return results;
    } catch (error) {
      console.error("❌ Error loading user test results:", error);
      throw error;
    }
  }

  /**
   * Отримує результати тестів для конкретної анкети
   */
  async getQuestionnaireResults(questionnaireId: string): Promise<StoredTestResult[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where("questionnaireId", "==", questionnaireId),
        orderBy("completedAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const results: StoredTestResult[] = [];

      querySnapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        } as StoredTestResult);
      });

      console.log(`📊 Loaded ${results.length} results for questionnaire ${questionnaireId}`);
      return results;
    } catch (error) {
      console.error("❌ Error loading questionnaire results:", error);
      throw error;
    }
  }

  /**
   * Отримує результати тестів за типом користувача
   */
  async getResultsByUserType(userType: 'student' | 'teacher' | 'parent'): Promise<StoredTestResult[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where("userType", "==", userType),
        orderBy("completedAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const results: StoredTestResult[] = [];

      querySnapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        } as StoredTestResult);
      });

      console.log(`📊 Loaded ${results.length} results for ${userType}s`);
      return results;
    } catch (error) {
      console.error("❌ Error loading results by user type:", error);
      throw error;
    }
  }

  /**
   * Отримує всі результати тестів з пагінацією
   */
  async getAllTestResults(limitCount: number = 50): Promise<StoredTestResult[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        orderBy("completedAt", "desc"),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const results: StoredTestResult[] = [];

      querySnapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        } as StoredTestResult);
      });

      console.log(`📊 Loaded ${results.length} test results`);
      return results;
    } catch (error) {
      console.error("❌ Error loading all test results:", error);
      throw error;
    }
  }

  /**
   * Отримує статистику результатів тестів
   */
  async getTestResultsSummary(): Promise<TestResultSummary> {
    try {
      const allResults = await this.getAllTestResults(1000); // Отримуємо більше для статистики

      const summary: TestResultSummary = {
        totalResults: allResults.length,
        resultsByType: {
          student: 0,
          teacher: 0,
          parent: 0,
        },
        resultsByQuestionnaire: {},
        averageCompletionTime: 0,
        recentResults: allResults.slice(0, 10), // Останні 10 результатів
      };

      let totalCompletionTime = 0;
      let completionTimeCount = 0;

      allResults.forEach((result) => {
        // Підрахунок за типами користувачів
        summary.resultsByType[result.userType]++;        // Підрахунок за анкетами
        if (!summary.resultsByQuestionnaire[result.questionnaireName]) {
          summary.resultsByQuestionnaire[result.questionnaireName] = 0;
        }
        summary.resultsByQuestionnaire[result.questionnaireName]++;

        // Підрахунок середнього часу проходження
        if (result.metadata.completionTime) {
          totalCompletionTime += result.metadata.completionTime;
          completionTimeCount++;
        }
      });

      if (completionTimeCount > 0) {
        summary.averageCompletionTime = Math.round(totalCompletionTime / completionTimeCount);
      }

      console.log("📊 Generated test results summary:", summary);
      return summary;
    } catch (error) {
      console.error("❌ Error generating test results summary:", error);
      throw error;
    }
  }

  /**
   * Генерує унікальний ID користувача (для анонімних користувачів)
   */
  generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Генерує ID сесії для відстеження
   */
  generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

const testResultsService = new TestResultsService();
export default testResultsService;
