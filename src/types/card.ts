export type Card = {
  id: string
  user_id: string
  front: string
  back: string
  category: string
  tags: string[]
  box_number: 1 | 2 | 3 | 4 | 5
  graduated: boolean
  created_at: string
  updated_at: string
}

export type ActionResult =
  | { success: true }
  | { success: false; error: string }
