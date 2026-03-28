'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const tabs = [
  { label: '전체', value: null },
  { label: 'Box 1', value: '1' },
  { label: 'Box 2', value: '2' },
  { label: 'Box 3', value: '3' },
  { label: 'Box 4', value: '4' },
  { label: 'Box 5', value: '5' },
]

export default function BoxFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentBox = searchParams.get('box')

  return (
    <div className="flex gap-1 flex-wrap">
      {tabs.map(tab => {
        const isActive = tab.value === currentBox
        return (
          <button
            key={tab.label}
            onClick={() =>
              router.push(tab.value ? `/dashboard?box=${tab.value}` : '/dashboard')
            }
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              isActive
                ? 'bg-zinc-900 text-white'
                : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
