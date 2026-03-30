import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ReviewCard from '@/components/ReviewCard'

const BOX_CAPACITY = 20

export default async function ReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ box?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { box } = await searchParams

  // 박스 결정: box 파라미터 없으면 RPC로 복습 대상 박스 계산 (redirect 없이)
  let boxNumber: number
  if (box) {
    boxNumber = parseInt(box)
  } else {
    const { data: counts } = await supabase.rpc('get_box_counts', { p_user_id: user.id })
    const countMap = new Map<number, number>((counts as { box_number: number; count: number }[] ?? []).map((r) => [r.box_number, Number(r.count)]))
    boxNumber = [5, 4, 3, 2].find((n) => (countMap.get(n) ?? 0) >= BOX_CAPACITY) ?? 1
  }

  // 해당 박스 카드 목록 조회
  const { data: cards } = await supabase
    .from('cards')
    .select('*')
    .eq('user_id', user.id)
    .eq('box_number', boxNumber)
    .eq('graduated', false)
    .order('created_at', { ascending: true })

  const cardList = cards ?? []

  // 복습할 카드가 없는 경우 (박스가 비어있음)
  if (cardList.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-600 mb-4">복습할 카드가 없습니다.</p>
          <Link
            href="/dashboard"
            className="text-sm text-zinc-900 underline underline-offset-2"
          >
            대시보드로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-zinc-900">
            Box {boxNumber} 복습
          </h1>
          <Link
            href="/dashboard"
            className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            그만하기
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <ReviewCard
          cards={cardList}
          boxNumber={boxNumber}
        />
      </main>
    </div>
  )
}
