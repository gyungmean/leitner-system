'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitReviewBatch } from '@/lib/actions/cards'
import type { Card } from '@/types/card'

interface ReviewCardProps {
  cards: Card[]
  boxNumber: number
}

export default function ReviewCard({ cards, boxNumber }: ReviewCardProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [answers, setAnswers] = useState<{ cardId: string; wasCorrect: boolean }[]>([])

  const totalCount = cards.length
  const progress = Math.round((currentIndex / totalCount) * 100)
  const card = cards[currentIndex]

  async function handleAnswer(wasCorrect: boolean) {
    const isLastCard = currentIndex + 1 >= totalCount
    const nextCorrect = wasCorrect ? correctCount + 1 : correctCount
    const nextWrong = wasCorrect ? wrongCount : wrongCount + 1
    const nextAnswers = [...answers, { cardId: card.id, wasCorrect }]

    if (isLastCard) {
      setIsPending(true)
      await submitReviewBatch(nextAnswers, boxNumber)
      router.push(`/dashboard/review/complete?box=${boxNumber}&correct=${nextCorrect}&wrong=${nextWrong}`)
    } else {
      setAnswers(nextAnswers)
      setCorrectCount(nextCorrect)
      setWrongCount(nextWrong)
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full max-w-lg">
        <div className="flex justify-between text-xs text-zinc-400 mb-1.5">
          <span>{currentIndex + 1} / {totalCount}</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-zinc-900 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

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
