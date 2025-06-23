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

export interface QuestionField {
  id: string;
  question: string;
  type: "text" | "email" | "number" | "select" | "textarea" | "multiselect";
  placeholder?: string;
  options?: string[];
  min?: number;
  max?: number;
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
      // Імпортуємо питання з файлу
      const { magicalQuestQuestions } = await import("../config/questions");

      // Конвертуємо кожен квест у окрему анкету
      for (const [questKey, questions] of Object.entries(
        magicalQuestQuestions
      )) {
        const questionnaire: Omit<
          Questionnaire,
          "id" | "createdAt" | "updatedAt"
        > = {
          name: `Magical Quest ${questKey}`,
          description: `Автоматично мігровані питання з ${questKey}`,
          questions: questions as QuestionField[],
          version: 1,
          isActive: true,
        };

        await this.saveQuestionnaireWithId(
          `magical-quest-${questKey}`,
          questionnaire
        );
      }

      console.log("✅ Migration completed successfully");
    } catch (error) {
      console.error("❌ Error during migration:", error);
      throw error;
    }
  }
}

export const questionsService = new QuestionsService();
export default questionsService;
