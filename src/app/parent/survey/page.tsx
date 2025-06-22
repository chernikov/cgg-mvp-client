"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { parentSurveyQuestions } from '@/config/questions';
import { useTranslation } from 'react-i18next';
import { db, auth } from '@/config/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function ParentSurvey() {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'uk' ? 'uk' : 'en';
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [error, setError] = useState("");
  const current = parentSurveyQuestions[step];
  const total = parentSurveyQuestions.length;

  if (!current) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (current.type === "checkbox") {
      const value = e.target.value;
      const checked = (e.target as HTMLInputElement).checked;
      setAnswers((prev) => {
        const prevValue = prev[current.id];
        const prevArr = Array.isArray(prevValue) ? prevValue : [];
        if (checked) {
          return { ...prev, [current.id]: [...prevArr, value] };
        } else {
          return { ...prev, [current.id]: prevArr.filter((v) => v !== value) };
        }
      });
    } else {
      setAnswers({ ...answers, [current.id]: e.target.value });
    }
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (current.type === "checkbox") {
      const val = answers[current.id];
      if (
        !val ||
        (Array.isArray(val) && val.length === 0) ||
        (typeof val === 'string' && val.length === 0)
      ) {
        setError(lang === 'uk' ? 'Це поле обовʼязкове' : 'This field is required');
        return;
      }
    } else if (!answers[current.id]) {
      setError(lang === 'uk' ? 'Це поле обовʼязкове' : 'This field is required');
      return;
    }
    setError("");
    if (current.id === 'want_results' && (answers[current.id] === 'Ні' || answers[current.id] === 'No')) {
      if (db) {
        await addDoc(collection(db, 'parent_surveys'), {
          userId: auth?.currentUser?.uid || 'anonymous',
          answers,
          timestamp: new Date().toISOString(),
          language: lang
        });
      }
      router.push("/parent/results");
      return;
    }
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      if (db) {
        await addDoc(collection(db, 'parent_surveys'), {
          userId: auth?.currentUser?.uid || 'anonymous',
          answers,
          timestamp: new Date().toISOString(),
          language: lang
        });
      }
      router.push("/parent/results");
    }
  };

  const handleBack = () => {
    if (step === 0) {
      router.push("/parent");
    } else {
      setStep(step - 1);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-teal-900 to-purple-900">
      <div className="max-w-lg w-full bg-gradient-to-br from-green-800/80 via-teal-800/80 to-purple-800/80 rounded-2xl p-8 shadow-2xl animate-fade-in">
        <h2 className="text-xl font-bold text-yellow-200 mb-4 text-center">{lang === 'uk' ? 'Опитування для батьків' : 'Parent Survey'}</h2>
        <div className="w-full mb-4">
          <div className="flex justify-between mb-1 text-sm text-yellow-200 items-center">
            <span>{lang === 'uk' ? 'Крок' : 'Step'} {step + 1} {lang === 'uk' ? 'з' : 'of'} {total}</span>
            <span className="glow">{Math.round(((step + 1) / total) * 100)}%</span>
          </div>
          <div className="h-2 w-full bg-gray-700 rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-300 via-indigo-500 to-green-400 rounded-full transition-all duration-300 shadow-lg"
              style={{ width: `${((step + 1) / total) * 100}%` }}
            />
          </div>
        </div>
        <form className="w-full flex flex-col gap-4" onSubmit={handleNext}>
          <label className="font-semibold text-yellow-200 mb-2">{current.question[lang]}</label>
          {current.type === "radio" ? (
            <div className="flex gap-4 flex-wrap">
              {(current.options?.[lang] ?? []).map((opt: string) => (
                <label key={opt} className="flex items-center gap-2 text-gray-200 font-medium">
                  <input
                    type="radio"
                    name={current.id}
                    value={opt}
                    checked={typeof answers[current.id] === 'string' && answers[current.id] === opt}
                    onChange={handleChange}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ) : current.type === "checkbox" ? (
            <div className="flex gap-4 flex-wrap">
              {(current.options?.[lang] ?? []).map((opt: string) => (
                <label key={opt} className="flex items-center gap-2 text-gray-200 font-medium">
                  <input
                    type="checkbox"
                    name={current.id}
                    value={opt}
                    checked={Array.isArray(answers[current.id]) && (answers[current.id] as string[]).includes(opt)}
                    onChange={handleChange}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ) : current.type === "textarea" ? (
            <textarea
              value={
                typeof answers[current.id] === 'string'
                  ? (answers[current.id] as string)
                  : typeof answers[current.id] === 'number'
                    ? String(answers[current.id])
                    : ''
              }
              onChange={handleChange}
              className="border-2 border-gray-400 bg-white rounded px-4 py-2 w-full text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
              rows={3}
              placeholder={current.placeholder?.[lang]}
            />
          ) : (
            <input
              type={current.type}
              value={
                typeof answers[current.id] === 'string'
                  ? (answers[current.id] as string)
                  : typeof answers[current.id] === 'number'
                    ? (answers[current.id] as number)
                    : undefined
              }
              onChange={handleChange}
              className="border-2 border-gray-400 bg-white rounded px-4 py-2 w-full text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
              placeholder={current.placeholder?.[lang]}
              min={current.min}
              max={current.max}
            />
          )}
          {error && <div className="text-red-400 text-sm text-center">{error}</div>}
          <div className="flex gap-4 mt-4">
            <button type="button" onClick={handleBack} className="flex-1 px-6 py-3 rounded-xl bg-green-900 text-green-200 font-bold hover:bg-green-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {lang === 'uk' ? 'Назад' : 'Back'}
            </button>
            <button type="submit" className="flex-1 p-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-all duration-300 text-lg">
              {step < total - 1 ? (lang === 'uk' ? 'Далі' : 'Next') : (lang === 'uk' ? 'Завершити' : 'Finish')}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
} 