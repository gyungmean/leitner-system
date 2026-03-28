import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BoxFilter from '@/components/BoxFilter'
import CardList from '@/components/CardList'
import { Suspense } from 'react'

async function signOut() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ box?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { box } = await searchParams
  const boxFilter = box ? parseInt(box) : null

  let query = supabase
    .from('cards')
    .select('*')
    .order('created_at', { ascending: false })

  if (boxFilter && boxFilter >= 1 && boxFilter <= 5) {
    query = query.eq('box_number', boxFilter)
  }

  const { data: cards } = await query

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

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <Suspense>
            <BoxFilter />
          </Suspense>
          <Link
            href="/dashboard/cards/new"
            className="px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-md hover:bg-zinc-800 transition-colors shrink-0"
          >
            + 새 카드
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-zinc-200 px-6">
          <CardList cards={cards ?? []} />
        </div>
      </main>
    </div>
  )
}
