-- Supabase の SQL Editor に丸ごと貼って Run
create table public.sightings (
  id         bigint generated always as identity primary key,
  stage      text not null check (stage in ('adult','larva','damage')),  -- 成虫 / 幼虫 / 食害
  lat        double precision not null check (lat between 32.7 and 33.8), -- 大分県のおおよその範囲
  lng        double precision not null check (lng between 130.8 and 132.2),
  memo       text check (char_length(memo) <= 200),
  created_at timestamptz not null default now()
);
alter table public.sightings enable row level security;
create policy "anyone can read"   on public.sightings for select to anon using (true);
create policy "anyone can insert" on public.sightings for insert to anon with check (true);
