"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function AdminNavigation() {
  const pathname = usePathname();
  
  const navItems = [
    { href: "/admin", label: "🏠 Головна", icon: "🏠" },
    { href: "/admin/tests", label: "📊 Тести", icon: "📊" },
    { href: "/admin/questions", label: "❓ Питання", icon: "❓" },
    { href: "/admin/users", label: "👥 Користувачі", icon: "👥" },
    { href: "/admin/test-results", label: "📈 Результати", icon: "📈" },
    { href: "/admin/ai-logs", label: "🤖 AI Логи", icon: "🤖" },
    { href: "/admin/settings", label: "⚙️ Налаштування", icon: "⚙️" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/admin" className="text-2xl font-bold text-gray-900 mr-8">
              🛠️ Адмін панель
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label.replace(/^.+ /, '')}
                </Link>
              );
            })}
          </div>
          
          <div className="flex items-center">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 mr-4"
            >
              ← Назад до сайту
            </Link>
          </div>
        </div>
        
        {/* Мобільне меню */}
        <div className="md:hidden pb-4">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-center ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <div>{item.icon}</div>
                  <div className="text-xs mt-1">{item.label.replace(/^.+ /, '')}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
      
      {/* Футер */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div>
              © 2025 CGG MVP - Система професійної орієнтації
            </div>
            <div className="flex space-x-4">
              <span>Версія: 1.0.0</span>
              <span>Останнє оновлення: {new Date().toLocaleDateString('uk-UA')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
