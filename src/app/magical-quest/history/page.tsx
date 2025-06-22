'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { db, auth } from '@/config/firebase'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'

interface SurveyHistory {
  id: string
  timestamp: string
  matches: {
    title: string
    matchPercentage: number
  }[]
}

export default function History() {
  const router = useRouter()
  const [history, setHistory] = useState<SurveyHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userId = auth?.currentUser?.uid
        if (!userId) {
          router.push('/magical-quest')
          return
        }

        if (db) {
          const surveysRef = collection(db, 'surveys')
          const q = query(
            surveysRef,
            where('userId', '==', userId),
            orderBy('timestamp', 'desc')
          )
          const querySnapshot = await getDocs(q)
          const surveyHistory = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          setHistory(surveyHistory as SurveyHistory[])
        } else {
          setHistory([])
        }
      } catch (error) {
        console.error('Error fetching history:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="animate-fade-in bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-white mb-8">Історія опитувань</h1>

          {history.length === 0 ? (
            <p className="text-white/80 text-center">У вас ще немає збережених результатів</p>
          ) : (
            <div className="space-y-6">
              {history.map((survey, index) => (
                <div
                  key={survey.id}
                  className="animate-slide-in bg-white/5 rounded-xl p-6"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">
                      {new Date(survey.timestamp).toLocaleDateString('uk-UA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </h2>
                    <button
                      onClick={() => router.push(`/magical-quest/results/${survey.id}`)}
                      className="text-yellow-400 hover:text-yellow-300 transition-colors"
                    >
                      Переглянути деталі
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {survey.matches.map((match, i) => (
                      <div
                        key={i}
                        className="bg-white/5 rounded-lg p-4"
                      >
                        <h3 className="text-white font-semibold mb-1">{match.title}</h3>
                        <p className="text-yellow-400">{match.matchPercentage}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => router.push('/magical-quest')}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Новий тест
            </button>
          </div>
        </div>
      </div>
    </main>
  )
} 