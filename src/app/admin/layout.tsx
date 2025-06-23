import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">      <nav className="bg-white shadow p-4 flex gap-6 mb-8">
        <Link href="/admin/tests" className="font-semibold text-blue-600 hover:underline">Тести</Link>
        <Link href="/admin/questions" className="font-semibold text-blue-600 hover:underline">Менеджер питань</Link>
        <Link href="/admin/users" className="font-semibold text-blue-600 hover:underline">Користувачі</Link>
      </nav>
      <main className="max-w-4xl mx-auto">{children}</main>
    </div>
  );
}
