import Link from 'next/link'

export default async function ReviewCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ box?: string }>
}) {
  const { box } = await searchParams
  const boxNumber = box ? parseInt(box) : null

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-2xl font-semibold text-zinc-900 mb-2">
          {boxNumber ? `Box ${boxNumber} 복습 완료!` : '복습 완료!'}
        </p>
        <p className="text-zinc-500 mb-8">모든 카드를 복습했습니다.</p>
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
