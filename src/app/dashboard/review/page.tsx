import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ReviewCard from '@/components/ReviewCard'

const BOX_CAPACITY = 20

export default async function ReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ box?: string; idx?: string; correct?: string; wrong?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { box, idx, correct, wrong } = await searchParams

  // 박스 결정: box 파라미터 없으면 복습 대상 박스 계산
  if (!box) {
    const [b5, b4, b3, b2] = await Promise.all(
      [5, 4, 3, 2].map((n) =>
        supabase
          .from('cards')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('box_number', n)
          .eq('graduated', false)
      )
    )

    const counts: Record<number, number> = {
      5: b5.count ?? 0,
      4: b4.count ?? 0,
      3: b3.count ?? 0,
      2: b2.count ?? 0,
    }

    const targetBox =
      [5, 4, 3, 2].find((n) => counts[n] >= BOX_CAPACITY) ?? 1

    redirect(`/dashboard/review?box=${targetBox}&idx=0&correct=0&wrong=0`)
  }

  const boxNumber = parseInt(box)
  const currentIdx = parseInt(idx ?? '0')
  const correctCount = parseInt(correct ?? '0')
  const wrongCount = parseInt(wrong ?? '0')

  // 해당 박스 카드 목록 조회
  const { data: cards } = await supabase
    .from('cards')
    .select('*')
    .eq('user_id', user.id)
    .eq('box_number', boxNumber)
    .eq('graduated', false)
    .order('created_at', { ascending: true })

  const cardList = cards ?? []

  // 모든 카드 복습 완료
  if (currentIdx >= cardList.length) {
    redirect(`/dashboard/review/complete?box=${boxNumber}&correct=${correctCount}&wrong=${wrongCount}`)
  }

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

  const currentCard = cardList[currentIdx]

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
          card={currentCard}
          currentIndex={currentIdx}
          totalCount={cardList.length}
          boxNumber={boxNumber}
          correct={correctCount}
          wrong={wrongCount}
        />
      </main>
    </div>
  )
}
