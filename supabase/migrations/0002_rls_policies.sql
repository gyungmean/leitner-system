-- Row Level Security: 각 유저는 자신의 데이터만 접근 가능
alter table public.cards enable row level security;
alter table public.review_events enable row level security;

create policy "cards_owner" on public.cards
  using (user_id = auth.uid());

create policy "review_events_owner" on public.review_events
  using (user_id = auth.uid());
