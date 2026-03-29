import Link from 'next/link'

export default async function ReviewCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ box?: string; correct?: string; wrong?: string }>
}) {
  const { box, correct, wrong } = await searchParams
  const boxNumber = box ? parseInt(box) : null
  const correctCount = parseInt(correct ?? '0')
  const wrongCount = parseInt(wrong ?? '0')
  const total = correctCount + wrongCount
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-2xl font-semibold text-zinc-900 mb-2">
          {boxNumber ? `Box ${boxNumber} 복습 완료!` : '복습 완료!'}
        </p>
        <p className="text-zinc-500 mb-6">모든 카드를 복습했습니다.</p>

        {total > 0 && (
          <div className="flex gap-6 justify-center mb-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{correctCount}</p>
              <p className="text-xs text-zinc-500 mt-0.5">정답</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">{wrongCount}</p>
              <p className="text-xs text-zinc-500 mt-0.5">오답</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-zinc-900">{accuracy}%</p>
              <p className="text-xs text-zinc-500 mt-0.5">정답률</p>
            </div>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard/review"
            className="px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-md hover:bg-zinc-800 transition-colors"
          >
            한 번 더
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-white border border-zinc-200 text-zinc-700 text-sm font-medium rounded-md hover:bg-zinc-50 transition-colors"
          >
            대시보드로
          </Link>
        </div>
      </div>
    </div>
  )
}
