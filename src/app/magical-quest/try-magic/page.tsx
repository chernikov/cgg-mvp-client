"use client";

import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { analyzeSurveyResponses } from '@/lib/openai';
import { collection, addDoc, doc, arrayUnion, updateDoc } from 'firebase/firestore';
import { auth } from '@/lib/firebase';
import { db } from '@/lib/firebase';

// Define a minimal type for localStorage matches
type LocalMatch = { skillsToImprove?: string[] };

export default function TryMagic() {
  const { i18n } = useTranslation();
  const [profession, setProfession] = useState("");
  const [allSkills, setAllSkills] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get all skillsToImprove from all matches in localStorage
    const matches = JSON.parse(localStorage.getItem("surveyMatches") || "[]") as LocalMatch[];
    const skills = Array.from(new Set(matches.flatMap((m) => m.skillsToImprove || [])));
    setAllSkills(skills as string[]);
  }, []);

  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else if (selectedSkills.length < 3) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleCustomSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomSkill(e.target.value);
  };

  const handleProfessionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfession(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!profession) {
      setError(i18n.language === 'uk' ? 'Введіть професію' : 'Enter a profession');
      return;
    }
    if (selectedSkills.length + (customSkill ? 1 : 0) === 0) {
      setError(i18n.language === 'uk' ? 'Оберіть або введіть хоча б одну навичку для розвитку' : 'Select or enter at least one skill to improve');
      return;
    }
    setLoading(true);
    try {
      const responses = JSON.parse(localStorage.getItem("surveyResponses") || "[]");
      // Compose extra context for ChatGPT
      const extra = {
        chosenProfession: profession,
        skillsToImprove: [...selectedSkills, ...(customSkill ? [customSkill] : [])],
      };
      const aiResult = await analyzeSurveyResponses([...responses, extra], i18n.language, 'magical-quest-try-magic');

      // Save to Firestore
      try {
        const userId = auth.currentUser?.uid || 'anonymous';
        const docId = localStorage.getItem('magicalQuestDocId');
        if (docId) {
          // Append to tryMagicHistory array
          await updateDoc(doc(db, 'magical_quest_surveys', docId), {
            tryMagicHistory: arrayUnion({
              profession,
              selectedSkills,
              customSkill,
              result: aiResult.matches,
              timestamp: new Date().toISOString(),
              language: i18n.language
            }),
            lastTryMagic: {
              profession,
              selectedSkills,
              customSkill,
              result: aiResult.matches,
              timestamp: new Date().toISOString(),
              language: i18n.language
            },
            responses,
            userId
          });
          console.log('[TryMagic] Updated Firestore document with ID:', docId);
        } else {
          const docRef = await addDoc(collection(db, 'try_magic'), {
            userId,
            profession,
            selectedSkills,
            customSkill,
            result: aiResult.matches,
            timestamp: new Date().toISOString(),
            language: i18n.language,
            createdByTryMagic: true
          });
          console.log('[TryMagic] Saved result to Firestore with ID:', docRef.id);
        }
      } catch (fireErr) {
        console.error('[TryMagic] Error saving to Firestore:', fireErr);
      }
    } catch {
      setError(i18n.language === 'uk' ? 'Помилка при зверненні до ШІ. Спробуйте ще раз.' : 'Error contacting AI. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-teal-900 to-purple-900">
        <div className="max-w-lg w-full bg-gradient-to-br from-green-800/80 via-teal-800/80 to-purple-800/80 rounded-2xl p-8 shadow-2xl animate-fade-in flex flex-col items-center">
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
          <div className="text-white">Магія працює...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-teal-900 to-purple-900">
      <form
        onSubmit={handleSubmit}
        className="max-w-lg w-full bg-gradient-to-br from-green-800/80 via-teal-800/80 to-purple-800/80 rounded-2xl p-8 shadow-2xl animate-fade-in"
      >
        <h1 className="text-2xl font-bold text-white mb-4">{i18n.language === 'uk' ? 'Спробувати магію' : 'Try Magic'}</h1>
        <div className="mb-4">
          <label className="block text-white mb-2">Професія</label>
          <input
            type="text"
            value={profession}
            onChange={handleProfessionChange}
            className="w-full p-2 rounded-lg bg-black/30 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Введіть бажану професію"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2">Навички, які потребують розвитку (оберіть до 3)</label>
          <div className="flex flex-wrap gap-2">
            {allSkills.map((skill) => (
              <button
                type="button"
                key={skill}
                className={`px-3 py-1 rounded-full border text-sm transition-all duration-200 ${selectedSkills.includes(skill) ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-black/30 text-white border-white/20 hover:bg-yellow-500/30'}`}
                onClick={() => handleSkillToggle(skill)}
                disabled={
                  !selectedSkills.includes(skill) && selectedSkills.length >= 3
                }
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
        {selectedSkills.length < 3 && (
          <div className="mb-4">
            <label className="block text-white mb-2">Додаткова навичка (опціонально)</label>
            <input
              type="text"
              value={customSkill}
              onChange={handleCustomSkillChange}
              className="w-full p-2 rounded-lg bg-black/30 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Введіть додаткову навичку"
              maxLength={40}
            />
          </div>
        )}
        {error && <div className="text-red-400 mb-2">{error}</div>}
        <button
          type="submit"
          className="w-full p-3 rounded-xl bg-yellow-500 text-white font-bold hover:bg-yellow-600 transition-all duration-300 text-lg mt-2"
        >
          {i18n.language === 'uk' ? 'Спробувати магію' : 'Try Magic'}
        </button>
      </form>
    </main>
  );
} 