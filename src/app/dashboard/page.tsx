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
  const boxFilter = box ?? null

  // 박스별 카드 수 통계
  const [b1, b2, b3, b4, b5, graduated] = await Promise.all([
    supabase.from('cards').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('box_number', 1).eq('graduated', false),
    supabase.from('cards').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('box_number', 2).eq('graduated', false),
    supabase.from('cards').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('box_number', 3).eq('graduated', false),
    supabase.from('cards').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('box_number', 4).eq('graduated', false),
    supabase.from('cards').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('box_number', 5).eq('graduated', false),
    supabase.from('cards').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('graduated', true),
  ])

  const boxCounts = [
    { label: 'Box 1', count: b1.count ?? 0 },
    { label: 'Box 2', count: b2.count ?? 0 },
    { label: 'Box 3', count: b3.count ?? 0 },
    { label: 'Box 4', count: b4.count ?? 0 },
    { label: 'Box 5', count: b5.count ?? 0 },
    { label: '졸업', count: graduated.count ?? 0 },
  ]

  let query = supabase
    .from('cards')
    .select('*')
    .order('created_at', { ascending: false })

  if (boxFilter === 'graduated') {
    query = query.eq('graduated', true)
  } else if (boxFilter && ['1','2','3','4','5'].includes(boxFilter)) {
    query = query.eq('box_number', parseInt(boxFilter)).eq('graduated', false)
  } else {
    // 전체: 졸업 카드 제외
    query = query.eq('graduated', false)
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
        {/* 박스별 통계 */}
        <div className="grid grid-cols-6 gap-2 mb-6">
          {boxCounts.map(({ label, count }) => (
            <div key={label} className="bg-white border border-zinc-200 rounded-lg px-3 py-3 text-center">
              <p className="text-xl font-bold text-zinc-900">{count}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 mb-6">
          <Suspense>
            <BoxFilter />
          </Suspense>
          <div className="flex gap-2 shrink-0">
            <Link
              href="/dashboard/review"
              className="px-4 py-2 bg-white border border-zinc-200 text-zinc-700 text-sm font-medium rounded-md hover:bg-zinc-50 transition-colors"
            >
              복습 시작
            </Link>
            <Link
              href="/dashboard/cards/new"
              className="px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-md hover:bg-zinc-800 transition-colors"
            >
              + 새 카드
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-zinc-200 px-6">
          <CardList cards={cards ?? []} />
        </div>
      </main>
    </div>
  )
}
