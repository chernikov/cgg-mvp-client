"use client";
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from 'react-i18next';

interface Role {
  title: string;
  href: string;
  description: string;
}

export default function Home() {
  const { t } = useTranslation('home');
  const roles = t('roles', { returnObjects: true }) as Role[];
  return (
    <main className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-br from-green-900 via-teal-900 to-purple-900 relative">
      {/* DEPLOYMENT TEST BANNER - CloudRun Validation */}
      <div className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white text-center py-3 px-4 shadow-lg z-50">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-lg font-bold">🚀 DEPLOYMENT TEST - Phase 1.1</span>
          <span className="hidden sm:inline">|</span>
          <span className="text-sm opacity-90">CloudRun Validation - {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Language Switcher slot (if needed) */}
      <div className="absolute top-4 right-4 z-10" id="lang-switcher-slot" />

      <div className="flex flex-col items-center justify-center flex-1 w-full py-12">
        <div className="max-w-3xl w-full bg-gradient-to-br from-green-800/80 via-teal-800/80 to-purple-800/80 rounded-2xl p-10 shadow-2xl backdrop-blur-md animate-fade-in">
          <div className="flex flex-col items-center mb-8">
            <div className="mb-4">
              <Image src="/logo.svg" alt="Guild Logo" width={80} height={80} className="rounded-full shadow-lg" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-yellow-200 text-center drop-shadow mb-2">
              {t('title')}
            </h1>
            <p className="text-white/90 text-center max-w-xl mb-2">
              {t('subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {roles.map((role: Role, idx: number) => (
              <Link key={role.title} href={role.href} className="group">
                <div
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl shadow-lg transition-all duration-300 bg-black/40 backdrop-blur-md border border-white/10 hover:scale-105 relative ${
                    idx < 2
                      ? 'ring-2 ring-yellow-400/80 ring-offset-2 ring-offset-black shadow-yellow-500/30'
                      : 'hover:ring-2 hover:ring-teal-400/40'
                  }`}
                >
                  <div className="text-4xl mb-2">{['🧙‍♂️','🔮','🎓','👨‍👩‍👧‍👦','📜'][idx]}</div>
                  <h2 className={`text-lg font-bold text-white text-center mb-1 ${idx < 2 ? 'text-yellow-200 drop-shadow' : ''}`}>{role.title}</h2>
                  <p className="text-white/80 text-center text-sm">{role.description}</p>
                </div>
              </Link>
            ))}
          </div>
          <p className="text-white/60 text-center text-xs">{t('chooseRole')}</p>
        </div>
      </div>

      <footer className="w-full flex flex-col items-center justify-center py-4 text-white/40 text-xs gap-1">
        <div>
          {t('copyright')}
        </div>
        <div className="flex gap-2 items-center">
          <a href="https://www.linkedin.com/company/career-guidance-guild/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="underline">{t('linkedin')}</a>
          <span>·</span>
          <a href="mailto:info@careergg.com" className="underline">{t('email')}</a>
        </div>
      </footer>
    </main>
  )
}

