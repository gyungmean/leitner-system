'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitReview } from '@/lib/actions/cards'
import type { Card } from '@/types/card'

interface ReviewCardProps {
  card: Card
  currentIndex: number
  totalCount: number
  boxNumber: number
}

export default function ReviewCard({ card, currentIndex, totalCount, boxNumber }: ReviewCardProps) {
  const router = useRouter()
  const [isFlipped, setIsFlipped] = useState(false)
  const [isPending, setIsPending] = useState(false)

  async function handleAnswer(wasCorrect: boolean) {
    setIsPending(true)
    await submitReview(card.id, wasCorrect, boxNumber)
    router.push(`/dashboard/review?box=${boxNumber}&idx=${currentIndex + 1}`)
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm text-zinc-500">
        {currentIndex + 1} / {totalCount}
      </p>

      <div className="w-full max-w-lg bg-white border border-zinc-200 rounded-xl p-10 min-h-48 flex items-center justify-center">
        <p className="text-xl text-zinc-900 text-center whitespace-pre-wrap">
          {isFlipped ? card.back : card.front}
        </p>
      </div>

      {!isFlipped ? (
        <button
          onClick={() => setIsFlipped(true)}
          className="px-6 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-md hover:bg-zinc-800 transition-colors"
        >
          뒤집기
        </button>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={() => handleAnswer(false)}
            disabled={isPending}
            className="px-6 py-2.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-500 transition-colors disabled:opacity-50"
          >
            오답
          </button>
          <button
            onClick={() => handleAnswer(true)}
            disabled={isPending}
            className="px-6 py-2.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-500 transition-colors disabled:opacity-50"
          >
            정답
          </button>
        </div>
      )}
    </div>
  )
}
