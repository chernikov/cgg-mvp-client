import Link from 'next/link'
import Image from 'next/image'

const roles = [
  {
    title: 'Магічний квест (новинка!)',
    description: 'Вирушай у магічну, ігрову подорож для учнів!',
    href: '/magical-quest',
    icon: '🧙‍♂️',
    highlight: true,
  },
  {
    title: 'Учень',
    description: 'Знайди своє покликання та відкрий майбутнє.',
    href: '/student',
    icon: '🎓',
  },
  {
    title: 'Батько/Мати',
    description: 'Підтримай шлях своєї дитини.',
    href: '/parent',
    icon: '👨‍👩‍👧‍👦',
  },
  {
    title: 'Вчитель',
    description: 'Надихай та веди нове покоління.',
    href: '/teacher',
    icon: '📜',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-br from-green-900 via-teal-900 to-purple-900 relative">
      {/* Language Switcher slot (if needed) */}
      <div className="absolute top-4 right-4 z-10" id="lang-switcher-slot" />

      <div className="flex flex-col items-center justify-center flex-1 w-full py-12">
        <div className="max-w-3xl w-full bg-gradient-to-br from-green-800/80 via-teal-800/80 to-purple-800/80 rounded-2xl p-10 shadow-2xl backdrop-blur-md animate-fade-in">
          <div className="flex flex-col items-center mb-8">
            <div className="mb-4">
              <Image src="/logo.svg" alt="Guild Logo" width={80} height={80} className="rounded-full shadow-lg" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-yellow-200 text-center drop-shadow mb-2">
              Career Guidance Guild
            </h1>
            <p className="text-white/90 text-center max-w-xl mb-2">
              Почніть свою подорож. Приєднуйтесь до Гільдії, щоб відкрити свій шлях, розкрити потенціал і стати частиною спільноти дослідників.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {roles.map((role) => (
              <Link key={role.title} href={role.href} className="group">
                <div
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl shadow-lg transition-all duration-300 bg-black/40 backdrop-blur-md border border-white/10 hover:scale-105 relative ${
                    role.highlight
                      ? 'ring-2 ring-yellow-400/80 ring-offset-2 ring-offset-black shadow-yellow-500/30'
                      : 'hover:ring-2 hover:ring-teal-400/40'
                  }`}
                >
                  <div className="text-4xl mb-2">{role.icon}</div>
                  <h2 className={`text-lg font-bold text-white text-center mb-1 ${role.highlight ? 'text-yellow-200 drop-shadow' : ''}`}>{role.title}</h2>
                  <p className="text-white/80 text-center text-sm">{role.description}</p>
                </div>
              </Link>
            ))}
          </div>
          <p className="text-white/60 text-center text-xs">Оберіть свою роль, щоб розпочати пригоду</p>
        </div>
      </div>

      <footer className="w-full flex flex-col items-center justify-center py-4 text-white/40 text-xs gap-1">
        <div>
          © 2025 Career Guidance Guild
        </div>
        <div className="flex gap-2 items-center">
          <a href="https://www.linkedin.com/company/career-guidance-guild/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="underline">LinkedIn</a>
          <span>·</span>
          <a href="mailto:info@careergg.com" className="underline">info@careergg.com</a>
        </div>
      </footer>
    </main>
  )
}

