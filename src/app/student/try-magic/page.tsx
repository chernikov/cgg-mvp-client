'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { analyzeSurveyResponses } from '@/lib/openai'
import { useTranslation } from 'react-i18next'
import { db, auth } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

type Match = { skillsToImprove?: string[] }

export default function TryMagic() {
  const router = useRouter()
  const { t, i18n } = useTranslation('student')
  const [profession, setProfession] = useState('')
  const [allSkills, setAllSkills] = useState<string[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [customSkill, setCustomSkill] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Get all skillsToImprove from all matches in localStorage
    const matches = JSON.parse(localStorage.getItem('surveyMatches') || '[]')
    const skills = Array.from(new Set((matches as Match[]).flatMap((m: Match) => m.skillsToImprove || [])))
    setAllSkills(skills as string[])
  }, [])

  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill))
    } else if (selectedSkills.length < 3) {
      setSelectedSkills([...selectedSkills, skill])
    }
  }

  const handleCustomSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomSkill(e.target.value)
  }

  const handleProfessionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfession(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!profession) {
      setError(t('tryMagic.errorProfession'))
      return
    }
    if (selectedSkills.length + (customSkill ? 1 : 0) === 0) {
      setError(t('tryMagic.errorSkills'))
      return
    }
    setLoading(true)
    try {
      const responses = JSON.parse(localStorage.getItem('surveyResponses') || '[]')
      // Compose extra context for ChatGPT
      const extra = {
        chosenProfession: profession,
        skillsToImprove: [...selectedSkills, ...(customSkill ? [customSkill] : [])],
      }
      const aiResult = await analyzeSurveyResponses([...responses, extra], i18n.language)
      localStorage.setItem('tryMagicResult', JSON.stringify(aiResult))
      // Save to Firestore
      if (db) {
        await addDoc(collection(db, 'student_try_magic'), {
          userId: auth?.currentUser?.uid || 'anonymous',
          profession,
          selectedSkills,
          customSkill,
          result: aiResult.matches,
          timestamp: new Date().toISOString(),
          language: i18n.language
        })
      }
      setLoading(false)
      router.push('/student/try-magic/results')
    } catch {
      setError(t('tryMagic.errorAI'))
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-teal-900 to-purple-900">
        <div className="max-w-lg w-full bg-gradient-to-br from-green-800/80 via-teal-800/80 to-purple-800/80 rounded-2xl p-8 shadow-2xl animate-fade-in flex flex-col items-center">
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
          <div className="text-white">{t('tryMagic.loading')}</div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-green-900 via-teal-900 to-purple-900">
      <div className="max-w-2xl mx-auto">
        <div className="animate-fade-in bg-gradient-to-br from-green-800/80 via-teal-800/80 to-purple-800/80 rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">{t('tryMagic.title')}</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="profession" className="block text-white mb-2">
                {t('tryMagic.enterProfession')}
              </label>
              <input
                type="text"
                id="profession"
                value={profession}
                onChange={handleProfessionChange}
                className="w-full p-4 rounded-xl bg-white text-green-900 placeholder-green-400 border-2 border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-lg"
                placeholder={t('tryMagic.professionPlaceholder')}
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2">
                {t('tryMagic.selectSkills')}
              </label>
              <div className="space-y-2">
                {allSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleSkillToggle(skill)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 border-2 text-lg ${
                      selectedSkills.includes(skill)
                        ? 'bg-green-400 text-green-900 border-green-500 font-bold'
                        : 'bg-white text-green-900 border-green-200 hover:bg-green-100'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="customSkill" className="block text-white mb-2">
                {t('tryMagic.orEnterCustomSkill')}
              </label>
              <input
                type="text"
                id="customSkill"
                value={customSkill}
                onChange={handleCustomSkillChange}
                className="w-full p-4 rounded-xl bg-white text-green-900 placeholder-green-400 border-2 border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-lg"
                placeholder={t('tryMagic.customSkillPlaceholder')}
              />
            </div>

            {error && (
              <div className="text-red-400 text-center">{error}</div>
            )}

            <button
              type="submit"
              className="w-full p-4 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold hover:shadow-lg transition-all duration-300 text-lg"
            >
              {t('tryMagic.submit')}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
} 