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
} from "firebase/firestore";
import type { SurveyQuestion } from "../types/survey";

export interface QuestionField {
  id: string;
  question: string;
  type: "text" | "email" | "number" | "select" | "textarea" | "multiselect";
  placeholder?: string;
  options?: string[];
  min?: number;
  max?: number;
}

// Типи для різних видів питань
interface TeacherQuestion {
  id: string;
  type: string;
  question: { uk: string; en: string } | string;
  placeholder?: { uk: string; en: string } | string;
  options?: { uk: string[]; en: string[] } | string[];
  min?: number;
  max?: number;
  conditional?: {
    dependsOn: string;
    value: { uk: string; en: string } | string;
  };
}

interface ParentQuestion {
  id: string;
  type: string;
  question: { uk: string; en: string } | string;
  placeholder?: { uk: string; en: string } | string;
  options?: { uk: string[]; en: string[] } | string[];
  min?: number;
  max?: number;
  conditional?: {
    dependsOn: string;
    value: { uk: string; en: string } | string;
  };
}

export interface Questionnaire {
  id: string;
  name: string;
  description: string;
  questions: QuestionField[];
  version: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoredQuestionnaire
  extends Omit<Questionnaire, "createdAt" | "updatedAt"> {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

class QuestionsService {
  private readonly COLLECTION_NAME = "questionnaires";

  async saveQuestionnaire(
    questionnaire: Omit<Questionnaire, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    try {
      const docData = {
        ...questionnaire,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(
        collection(db, this.COLLECTION_NAME),
        docData
      );
      console.log("✅ Questionnaire saved with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("❌ Error saving questionnaire:", error);
      throw error;
    }
  }

  async saveQuestionnaireWithId(
    id: string,
    questionnaire: Omit<Questionnaire, "id" | "createdAt" | "updatedAt">
  ): Promise<void> {
    try {
      const docData = {
        ...questionnaire,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, this.COLLECTION_NAME, id), docData);
      console.log("✅ Questionnaire saved with custom ID:", id);
    } catch (error) {
      console.error("❌ Error saving questionnaire with ID:", error);
      throw error;
    }
  }
  async getQuestionnaire(id: string): Promise<StoredQuestionnaire | null> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where("__name__", "==", id)
      );
      const docSnap = await getDocs(q);

      if (docSnap.empty) {
        console.log("❌ No questionnaire found with ID:", id);
        return null;
      }

      const docData = docSnap.docs[0].data();
      return {
        id: docSnap.docs[0].id,
        ...docData,
      } as StoredQuestionnaire;
    } catch (error) {
      console.error("❌ Error getting questionnaire:", error);
      throw error;
    }
  }

  async getAllQuestionnaires(): Promise<StoredQuestionnaire[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const questionnaires: StoredQuestionnaire[] = [];

      querySnapshot.forEach((doc) => {
        questionnaires.push({
          id: doc.id,
          ...doc.data(),
        } as StoredQuestionnaire);
      });

      console.log(`📊 Loaded ${questionnaires.length} questionnaires`);
      return questionnaires;
    } catch (error) {
      console.error("❌ Error loading questionnaires:", error);
      throw error;
    }
  }

  async getActiveQuestionnaires(): Promise<StoredQuestionnaire[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where("isActive", "==", true),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const questionnaires: StoredQuestionnaire[] = [];

      querySnapshot.forEach((doc) => {
        questionnaires.push({
          id: doc.id,
          ...doc.data(),
        } as StoredQuestionnaire);
      });

      console.log(`📊 Loaded ${questionnaires.length} active questionnaires`);
      return questionnaires;
    } catch (error) {
      console.error("❌ Error loading active questionnaires:", error);
      throw error;
    }
  }

  async updateQuestionnaire(
    id: string,
    updates: Partial<Omit<Questionnaire, "id" | "createdAt">>
  ): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, id);
      await setDoc(
        docRef,
        {
          ...updates,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      console.log("✅ Questionnaire updated:", id);
    } catch (error) {
      console.error("❌ Error updating questionnaire:", error);
      throw error;
    }
  }
  // Метод для міграції існуючих питань з коду
  async migrateQuestionsFromCode(): Promise<void> {
    try {
      // Імпортуємо всі питання з файлу
      const { 
        questions, 
        magicalQuestQuestions, 
        teacherSurveyQuestions, 
        parentSurveyQuestions 
      } = await import("../config/questions");

      console.log("🔄 Починаємо міграцію питань...");      // 1. Міграція основних питань (SurveyQuestion[])
      if (questions && questions.length > 0) {
        const basicQuestions: QuestionField[] = questions.map((q: SurveyQuestion, index: number) => ({
          id: q.id || `q${index + 1}`,
          question: q.text,
          type: "select" as const,
          options: q.options?.map((opt: { id: string; text: string }) => opt.text) || []
        }));

        const questionnaire = {
          name: "Основна анкета вибору професії",
          description: "Базові питання для визначення професійних схильностей",
          questions: basicQuestions,
          version: 1,
          isActive: true,
        };

        await this.saveQuestionnaireWithId("basic-career-survey", questionnaire);
        console.log("✅ Мігровано основні питання");
      }

      // 2. Міграція магічних квестів
      if (magicalQuestQuestions) {
        for (const [questKey, questions] of Object.entries(magicalQuestQuestions)) {
          const questionnaire = {
            name: `Магічний квест - ${questKey}`,
            description: `Детальні питання для глибокого аналізу особистості (${questKey})`,
            questions: questions as QuestionField[],
            version: 1,
            isActive: true,
          };

          await this.saveQuestionnaireWithId(`magical-quest-${questKey}`, questionnaire);
          console.log(`✅ Мігровано магічний квест: ${questKey}`);
        }
      }      // 3. Міграція анкети для вчителів
      if (teacherSurveyQuestions && teacherSurveyQuestions.length > 0) {
        const teacherQuestions: QuestionField[] = teacherSurveyQuestions.map((q: TeacherQuestion) => {
          const baseQuestion: QuestionField = {
            id: q.id,
            question: typeof q.question === 'object' ? q.question.uk : q.question,
            type: q.type === 'radio' ? 'select' : 
                  q.type === 'checkbox' ? 'multiselect' : 
                  q.type as 'text' | 'email' | 'number' | 'select' | 'textarea' | 'multiselect',
          };

          if (q.placeholder) {
            baseQuestion.placeholder = typeof q.placeholder === 'object' ? q.placeholder.uk : q.placeholder;
          }          if (q.options) {
            baseQuestion.options = Array.isArray(q.options) ? q.options : q.options.uk;
          }

          if (q.min !== undefined) baseQuestion.min = q.min;
          if (q.max !== undefined) baseQuestion.max = q.max;

          return baseQuestion;
        });

        const questionnaire = {
          name: "Анкета для вчителів",
          description: "Дослідження потреб вчителів у профорієнтації учнів",
          questions: teacherQuestions,
          version: 1,
          isActive: true,
        };

        await this.saveQuestionnaireWithId("teacher-survey", questionnaire);
        console.log("✅ Мігровано анкету для вчителів");
      }

      // 4. Міграція анкети для батьків
      if (parentSurveyQuestions && parentSurveyQuestions.length > 0) {
        const parentQuestions: QuestionField[] = parentSurveyQuestions.map((q: ParentQuestion) => {
          const baseQuestion: QuestionField = {
            id: q.id,
            question: typeof q.question === 'object' ? q.question.uk : q.question,
            type: q.type === 'radio' ? 'select' : 
                  q.type === 'checkbox' ? 'multiselect' : 
                  q.type as 'text' | 'email' | 'number' | 'select' | 'textarea' | 'multiselect',
          };

          if (q.placeholder) {
            baseQuestion.placeholder = typeof q.placeholder === 'object' ? q.placeholder.uk : q.placeholder;
          }

          if (q.options) {
            baseQuestion.options = Array.isArray(q.options) ? q.options : q.options.uk;
          }

          if (q.min !== undefined) baseQuestion.min = q.min;
          if (q.max !== undefined) baseQuestion.max = q.max;

          return baseQuestion;
        });

        const questionnaire = {
          name: "Анкета для батьків",
          description: "Дослідження потреб батьків у профорієнтації дітей",
          questions: parentQuestions,
          version: 1,
          isActive: true,
        };

        await this.saveQuestionnaireWithId("parent-survey", questionnaire);
        console.log("✅ Мігровано анкету для батьків");
      }

      console.log("🎉 Міграція завершена успішно! Всі питання додано до Firebase.");
    } catch (error) {
      console.error("❌ Error during migration:", error);
      throw error;
    }
  }
}

export const questionsService = new QuestionsService();
export default questionsService;
