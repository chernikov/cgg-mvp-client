"use client";

import { useEffect, useState, useCallback } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { AILogEntry } from "@/services/ai-logs.service";

interface AILogEntryWithId extends AILogEntry {
  id: string;
}

export default function AILogsAdmin() {
  const [logs, setLogs] = useState<AILogEntryWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    questionnaireId: "",
    dateFrom: "",
    dateTo: "",
    success: "all", // 'all', 'success', 'error'
  });

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let q = query(
        collection(db, "ai_logs"),
        orderBy("timestamps.createdAt", "desc"),
        limit(50)
      );

      // Додаємо фільтри якщо вони встановлені
      if (filter.questionnaireId) {
        q = query(
          q,
          where("metadata.questionnaireId", "==", filter.questionnaireId)
        );
      }

      if (filter.success !== "all") {
        q = query(
          q,
          where("output.success", "==", filter.success === "success")
        );
      }

      const snapshot = await getDocs(q);
      const logsData: AILogEntryWithId[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();

        // Конвертуємо Timestamp назад в Date
        const convertedData = {
          ...data,
          id: doc.id,
          timestamps: {
            requestStarted: data.timestamps.requestStarted.toDate(),
            requestCompleted: data.timestamps.requestCompleted.toDate(),
            createdAt: data.timestamps.createdAt.toDate(),
          },
        } as AILogEntryWithId;

        logsData.push(convertedData);
      });

      setLogs(logsData);
    } catch (err) {
      console.error("Error loading AI logs:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [filter.questionnaireId, filter.success]);

  useEffect(() => {
    const initialLoad = async () => {
      await loadLogs();
    };
    initialLoad();
  }, [loadLogs]); // Додаємо loadLogs як залежність

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("uk-UA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    const seconds = Math.round(ms / 100) / 10;
    return `${seconds}s`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Помилка:</strong> {error}
        </div>
        <button
          onClick={loadLogs}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Спробувати знову
        </button>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Адміністрування AI Логів</h1>
      {/* Фільтри */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Фільтри</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">ID Анкети</label>
            <select
              value={filter.questionnaireId}
              onChange={(e) =>
                setFilter({ ...filter, questionnaireId: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option value="">Всі</option>
              <option value="magical-quest">Магічний Квест</option>
              <option value="magical-quest-try-magic">Спроба Магії</option>
              <option value="student-survey">Анкета Студента</option>
              <option value="student-try-magic">Студентська Магія</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Статус</label>
            <select
              value={filter.success}
              onChange={(e) =>
                setFilter({ ...filter, success: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option value="all">Всі</option>
              <option value="success">Успішні</option>
              <option value="error">Помилки</option>
            </select>
          </div>{" "}
          <div className="md:col-span-2 flex items-end gap-2">
            <button
              onClick={loadLogs}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Застосувати Фільтри
            </button>
            <button
              onClick={async () => {
                try {
                  console.log("🧪 Testing AI logging system...");
                  // Імпортуємо тестову функцію динамічно
                  const { testAILogging } = await import(
                    "@/utils/test-ai-logging"
                  );
                  const result = await testAILogging();
                  if (result.success) {
                    alert(
                      "✅ Тест AI логування пройшов успішно! Перевірте консоль та оновіть сторінку."
                    );
                    setTimeout(() => loadLogs(), 1000);
                  } else {
                    alert("❌ Тест AI логування не вдався: " + result.error);
                  }
                } catch (error) {
                  console.error("Test error:", error);
                  alert(
                    "❌ Помилка тесту: " +
                      (error instanceof Error ? error.message : "Unknown")
                  );
                }
              }}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              🧪 Тест
            </button>
            <button
              onClick={async () => {
                try {
                  console.log("🔍 Running diagnostics...");
                  const { diagnoseAILogging, checkFirebaseRules } =
                    await import("@/utils/diagnose-ai-logging");
                  const result = await diagnoseAILogging();
                  checkFirebaseRules();

                  const summary = `
🔍 Діагностика AI Логування:
• Firebase: ${result.firebaseConnection ? "✅" : "❌"}
• Колекція: ${result.collectionAccess ? "✅" : "❌"}  
• Читання: ${result.readPermission ? "✅" : "❌"}
• Запис: ${result.writePermission ? "✅" : "❌"}
${result.errors.length > 0 ? "\n❌ Помилки:\n" + result.errors.join("\n") : ""}

Перевірте консоль для деталей.`;

                  alert(summary);
                } catch (error) {
                  console.error("Diagnostics error:", error);
                  alert(
                    "❌ Помилка діагностики: " +
                      (error instanceof Error ? error.message : "Unknown")
                  );
                }
              }}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              🔍 Діагностика
            </button>
          </div>
        </div>
      </div>
      {/* Статистика */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="font-semibold">Всього Логів</h3>
          <p className="text-2xl font-bold">{logs.length}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="font-semibold">Успішних</h3>
          <p className="text-2xl font-bold text-green-600">
            {logs.filter((log) => log.output.success).length}
          </p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
          <h3 className="font-semibold">Помилок</h3>
          <p className="text-2xl font-bold text-red-600">
            {logs.filter((log) => !log.output.success).length}
          </p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h3 className="font-semibold">Серед. Час Відповіді</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {logs.length > 0
              ? formatDuration(
                  logs.reduce(
                    (sum, log) => sum + log.metadata.responseTime,
                    0
                  ) / logs.length
                )
              : "0мс"}
          </p>
        </div>
      </div>{" "}
      {/* Таблиця логів */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Час
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Анкета
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Час Відповіді
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Токени
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дії
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(log.timestamps.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {log.metadata.questionnaireId}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log.output.success ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Успішно
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Помилка
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDuration(log.metadata.responseTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.metadata.tokensUsed || "Н/Д"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        // Відкриваємо детальний вигляд логу в модальному вікні або на новій сторінці
                        console.log("Деталі логу:", log);
                        alert("Дивіться консоль для деталей логу"); // Тимчасово
                      }}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Переглянути
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {logs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Логи, що відповідають поточним фільтрам, не знайдені.
          </div>
        )}
      </div>
    </div>
  );
}
