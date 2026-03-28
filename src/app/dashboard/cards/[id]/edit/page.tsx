import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { updateCard } from '@/lib/actions/cards'
import TagInput from '@/components/TagInput'

export default async function EditCardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: card } = await supabase
    .from('cards')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!card) redirect('/dashboard')

  const updateCardWithId = updateCard.bind(null, id)

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
            ← 뒤로
          </Link>
          <h1 className="text-lg font-semibold text-zinc-900">카드 수정</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <form action={updateCardWithId} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              앞면 <span className="text-red-500">*</span>
            </label>
            <textarea
              name="front"
              required
              rows={3}
              defaultValue={card.front}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              뒷면 <span className="text-red-500">*</span>
            </label>
            <textarea
              name="back"
              required
              rows={3}
              defaultValue={card.back}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">카테고리</label>
            <input
              type="text"
              name="category"
              defaultValue={card.category ?? ''}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">태그</label>
            <TagInput defaultValue={(card.tags ?? []).join(', ')} />
            <p className="mt-1 text-xs text-zinc-400">쉼표로 구분해서 입력하세요</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-md hover:bg-zinc-800 transition-colors"
            >
              저장
            </button>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-white text-zinc-700 text-sm font-medium rounded-md border border-zinc-200 hover:bg-zinc-50 transition-colors"
            >
              취소
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
