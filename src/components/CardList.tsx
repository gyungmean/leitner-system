'use client'

import Link from 'next/link'
import { deleteCard } from '@/lib/actions/cards'
import type { Card } from '@/types/card'

export default function CardList({ cards }: { cards: Card[] }) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-zinc-400 text-sm">카드가 없습니다. 새 카드를 추가해보세요.</p>
      </div>
    )
  }

  async function handleDelete(id: string) {
    if (!confirm('이 카드를 삭제하시겠습니까?')) return
    await deleteCard(id)
  }

  return (
    <div className="divide-y divide-zinc-100">
      {cards.map(card => (
        <div key={card.id} className="py-4 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-900 text-white">
                Box {card.box_number}
              </span>
              {card.graduated && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                  졸업
                </span>
              )}
              {card.category && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                  {card.category}
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-zinc-900 truncate">{card.front}</p>
            <p className="text-sm text-zinc-500 truncate mt-0.5">{card.back}</p>
            {card.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {card.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-zinc-100 text-zinc-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/dashboard/cards/${card.id}/edit`}
              className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              수정
            </Link>
            <button
              onClick={() => handleDelete(card.id)}
              className="text-sm text-red-400 hover:text-red-600 transition-colors"
            >
              삭제
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
