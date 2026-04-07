'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult } from '@/types/card'

function parseTags(tagsStr: string): string[] {
  return tagsStr.split(',').map(t => t.trim()).filter(Boolean)
}

export async function createCard(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const front = formData.get('front') as string
  const back = formData.get('back') as string
  const category = (formData.get('category') as string) ?? ''
  const tags = parseTags((formData.get('tags') as string) ?? '')

  await supabase.from('cards').insert({
    user_id: user.id,
    front,
    back,
    category,
    tags,
    box_number: 1,
    graduated: false,
  })

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function updateCard(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const front = formData.get('front') as string
  const back = formData.get('back') as string
  const category = (formData.get('category') as string) ?? ''
  const tags = parseTags((formData.get('tags') as string) ?? '')

  await supabase
    .from('cards')
    .update({ front, back, category, tags, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function submitReview(
  cardId: string,
  wasCorrect: boolean,
  currentBox: number,
  isLastCard: boolean = false
): Promise<ActionResult> {
  return submitReviewBatch([{ cardId, wasCorrect }], currentBox)
}

export async function submitReviewBatch(
  answers: { cardId: string; wasCorrect: boolean }[],
  currentBox: number,
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '인증이 필요합니다.' }

  const now = new Date().toISOString()

  const cardUpdates = answers.map(({ cardId, wasCorrect }) => {
    const graduated = wasCorrect && currentBox === 5
    const boxAfter = wasCorrect
      ? (currentBox === 5 ? 5 : currentBox + 1)
      : 1
    return { cardId, boxAfter, graduated, wasCorrect }
  })

  // 카드 업데이트: 정답/오답 그룹별로 배치
  const correctIds = cardUpdates.filter(u => u.wasCorrect).map(u => u.cardId)
  const wrongIds = cardUpdates.filter(u => !u.wasCorrect).map(u => u.cardId)

  const correctBoxAfter = currentBox === 5 ? 5 : currentBox + 1
  const correctGraduated = currentBox === 5

  const promises: PromiseLike<unknown>[] = []

  if (correctIds.length > 0) {
    promises.push(
      supabase
        .from('cards')
        .update({ box_number: correctBoxAfter, graduated: correctGraduated, updated_at: now })
        .in('id', correctIds)
        .eq('user_id', user.id)
        .then()
    )
  }

  if (wrongIds.length > 0) {
    promises.push(
      supabase
        .from('cards')
        .update({ box_number: 1, graduated: false, updated_at: now })
        .in('id', wrongIds)
        .eq('user_id', user.id)
        .then()
    )
  }

  // 리뷰 이벤트 일괄 삽입
  const events = cardUpdates.map(({ cardId, boxAfter, wasCorrect }) => ({
    user_id: user.id,
    card_id: cardId,
    box_before: currentBox,
    box_after: boxAfter,
    was_correct: wasCorrect,
  }))

  promises.push(
    supabase.from('review_events').insert(events).then()
  )

  const results = await Promise.all(promises)
  const error = results.find((r: any) => r.error)
  if (error) return { success: false, error: (error as any).error.message }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function resetCard(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '인증이 필요합니다.' }

  const { error } = await supabase
    .from('cards')
    .update({ box_number: 1, graduated: false, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteCard(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '인증이 필요합니다.' }

  const { error } = await supabase
    .from('cards')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard')
  return { success: true }
}
