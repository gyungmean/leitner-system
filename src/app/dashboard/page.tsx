import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

async function signOut() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-zinc-900">라이트너 시스템</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-500">{user.email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                로그아웃
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 text-center">
        <p className="text-zinc-400 text-sm">대시보드 — Phase 3에서 구현 예정</p>
      </main>
    </div>
  )
}
