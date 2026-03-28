-- cards 테이블: 핵심 플래시카드
create table public.cards (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  front        text not null,
  back         text not null,
  category     text not null default '',
  tags         text[] not null default '{}',
  box_number   smallint not null default 1 check (box_number between 1 and 5),
  graduated    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
-- 박스 용량 방식(20장 기준)이므로 next_review_at 불필요

-- review_events 테이블: 복습 이력
create table public.review_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  card_id     uuid not null references public.cards(id) on delete cascade,
  box_before  smallint not null,
  box_after   smallint not null,
  was_correct boolean not null,
  reviewed_at timestamptz not null default now()
);

-- 인덱스
create index cards_user_box on public.cards (user_id, box_number)
  where graduated = false;
create index cards_user_category on public.cards (user_id, category);
create index review_events_card on public.review_events (card_id, reviewed_at desc);
