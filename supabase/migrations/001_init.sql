create table if not exists public.artifacts (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  type text not null check (type in ('tables', 'flows', 'catalog', 'acl')),
  requirements text not null,
  result jsonb not null,
  created_at timestamptz not null default now()
);

create index artifacts_session_id_idx on public.artifacts(session_id);
create index artifacts_created_at_idx on public.artifacts(created_at desc);

alter table public.artifacts enable row level security;

-- Allow all inserts/reads (API uses service role key from backend)
create policy "Service role full access" on public.artifacts
  using (true)
  with check (true);
