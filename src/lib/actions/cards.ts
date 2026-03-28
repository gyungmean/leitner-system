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
