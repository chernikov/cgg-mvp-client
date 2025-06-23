"use client";

import { useState, useEffect } from "react";
import questionsService, {
  StoredQuestionnaire,
} from "../../../services/questions.service";

export default function QuestionsManager() {
  const [questionnaires, setQuestionnaires] = useState<StoredQuestionnaire[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<string>("");
  const [selectedQuestionnaire, setSelectedQuestionnaire] =
    useState<StoredQuestionnaire | null>(null);

  useEffect(() => {
    loadQuestionnaires();
  }, []);

  const loadQuestionnaires = async () => {
    setIsLoading(true);
    try {
      const data = await questionsService.getAllQuestionnaires();
      setQuestionnaires(data);
    } catch (error) {
      console.error("Error loading questionnaires:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMigration = async () => {
    setMigrationStatus("🔄 Запускаємо міграцію питань...");
    try {
      await questionsService.migrateQuestionsFromCode();
      setMigrationStatus("✅ Міграція завершена успішно!");
      await loadQuestionnaires();
    } catch (error) {
      setMigrationStatus("❌ Помилка під час міграції");
      console.error("Migration error:", error);
    }
  };

  const toggleQuestionnaireStatus = async (
    id: string,
    currentStatus: boolean
  ) => {
    try {
      await questionsService.updateQuestionnaire(id, {
        isActive: !currentStatus,
      });
      await loadQuestionnaires();
    } catch (error) {
      console.error("Error updating questionnaire status:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">📝 Менеджер питань</h2>

      {/* Кнопки управління */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={loadQuestionnaires}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? "🔄 Завантажуємо..." : "🔄 Оновити"}
        </button>

        <button
          onClick={handleMigration}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          📤 Мігрувати з коду
        </button>
      </div>

      {/* Статус міграції */}
      {migrationStatus && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          {migrationStatus}
        </div>
      )}

      {/* Список анкет */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Збережені анкети ({questionnaires.length})
        </h3>

        {questionnaires.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-2">
              Поки що немає збережених анкет
            </div>
            <div className="text-sm text-gray-400">
              Натисніть &quot;Мігрувати з коду&quot; щоб створити анкети з
              існуючих питань
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {questionnaires.map((questionnaire) => (
              <div key={questionnaire.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-lg">
                      {questionnaire.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {questionnaire.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        questionnaire.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {questionnaire.isActive ? "Активна" : "Неактивна"}
                    </span>
                    <button
                      onClick={() =>
                        toggleQuestionnaireStatus(
                          questionnaire.id,
                          questionnaire.isActive
                        )
                      }
                      className={`px-3 py-1 rounded text-xs ${
                        questionnaire.isActive
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      {questionnaire.isActive ? "Деактивувати" : "Активувати"}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-gray-600">Питань:</span>
                    <span className="ml-1 font-medium">
                      {questionnaire.questions.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Версія:</span>
                    <span className="ml-1 font-medium">
                      v{questionnaire.version}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Створено:</span>
                    <span className="ml-1 font-medium">
                      {questionnaire.createdAt?.toDate?.()
                        ? questionnaire.createdAt
                            .toDate()
                            .toLocaleDateString("uk-UA")
                        : "Невідома дата"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Оновлено:</span>
                    <span className="ml-1 font-medium">
                      {questionnaire.updatedAt?.toDate?.()
                        ? questionnaire.updatedAt
                            .toDate()
                            .toLocaleDateString("uk-UA")
                        : "Невідома дата"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setSelectedQuestionnaire(
                        selectedQuestionnaire?.id === questionnaire.id
                          ? null
                          : questionnaire
                      )
                    }
                    className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                  >
                    {selectedQuestionnaire?.id === questionnaire.id
                      ? "🙈 Сховати"
                      : "👁️ Переглянути"}
                  </button>
                </div>

                {/* Детальний перегляд питань */}
                {selectedQuestionnaire?.id === questionnaire.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded">
                    <h5 className="font-medium mb-3">Питання:</h5>
                    <div className="space-y-3">
                      {questionnaire.questions.map((question, index) => (
                        <div
                          key={question.id}
                          className="p-3 bg-white rounded border"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium">
                              #{index + 1} ({question.type})
                            </span>
                            <span className="text-xs text-gray-500">
                              {question.id}
                            </span>
                          </div>
                          <p className="text-sm mb-2">{question.question}</p>

                          {question.placeholder && (
                            <p className="text-xs text-gray-500">
                              Placeholder: {question.placeholder}
                            </p>
                          )}

                          {question.options && (
                            <div className="text-xs text-gray-600 mt-1">
                              <span>Опції: </span>
                              <span>{question.options.join(", ")}</span>
                            </div>
                          )}

                          {(question.min !== undefined ||
                            question.max !== undefined) && (
                            <div className="text-xs text-gray-600 mt-1">
                              Діапазон: {question.min} - {question.max}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Інформаційна секція */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h4 className="font-semibold text-yellow-800 mb-2">Інформація:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>
            • <strong>Міграція з коду</strong> - перенесе всі питання з файлу
            questions.ts у Firebase
          </li>
          <li>
            • <strong>Активні анкети</strong> - будуть доступні для використання
            в додатку
          </li>
          <li>
            • <strong>Версії</strong> - дозволяють відстежувати зміни в питаннях
          </li>
          <li>
            • Після міграції питання можна редагувати через Firebase Console
          </li>
        </ul>
      </div>
    </div>
  );
}
