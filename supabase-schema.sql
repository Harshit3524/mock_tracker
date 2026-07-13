-- Run this in your Supabase SQL Editor to set up the database

-- Mock exam entries table
create table if not exists mock_entries (
  id uuid default gen_random_uuid() primary key,
  user_name text not null,
  exam_name text not null,
  exam_date date not null,
  score numeric not null,
  max_score numeric not null default 100,
  accuracy numeric not null,
  platform text not null default '',
  notes text default '',
  created_at timestamp with time zone default now()
);

-- PDF documents table
create table if not exists pdf_docs (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text default '',
  uploaded_by text not null,
  file_path text not null,
  created_at timestamp with time zone default now()
);

-- Preparation tracker progress table
create table if not exists tracker_progress (
  id uuid default gen_random_uuid() primary key,
  user_name text not null,
  exam text not null check (exam in ('SSC', 'RAS')),
  topic_id text not null,
  completed boolean not null default false,
  needs_revision boolean not null default false,
  remarks text not null default '',
  updated_at timestamp with time zone default now(),
  unique (user_name, exam, topic_id)
);

alter table tracker_progress add column if not exists user_name text;
alter table tracker_progress add column if not exists exam text;
alter table tracker_progress add column if not exists topic_id text;
alter table tracker_progress add column if not exists completed boolean not null default false;
alter table tracker_progress add column if not exists needs_revision boolean not null default false;
alter table tracker_progress add column if not exists remarks text not null default '';
alter table tracker_progress add column if not exists updated_at timestamp with time zone default now();

update tracker_progress set user_name = 'user1' where user_name is null;
update tracker_progress set exam = 'SSC' where exam is null;
update tracker_progress set topic_id = id::text where topic_id is null;

alter table tracker_progress alter column user_name set not null;
alter table tracker_progress alter column exam set not null;
alter table tracker_progress alter column topic_id set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'tracker_progress_exam_check'
  ) then
    alter table tracker_progress
      add constraint tracker_progress_exam_check check (exam in ('SSC', 'RAS'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'tracker_progress_user_name_exam_topic_id_key'
  ) then
    alter table tracker_progress
      add constraint tracker_progress_user_name_exam_topic_id_key unique (user_name, exam, topic_id);
  end if;
end $$;

-- Create storage bucket for PDFs (run this too)
insert into storage.buckets (id, name, public)
values ('pdfs', 'pdfs', false)
on conflict do nothing;

-- Allow all operations on storage (since no auth)
create policy "Allow all on pdfs bucket" on storage.objects
  for all using (bucket_id = 'pdfs');

-- Allow all operations on mock_entries
alter table mock_entries enable row level security;
create policy "Allow all on mock_entries" on mock_entries
  for all using (true) with check (true);

-- Allow all operations on pdf_docs
alter table pdf_docs enable row level security;
create policy "Allow all on pdf_docs" on pdf_docs
  for all using (true) with check (true);

-- Allow all operations on tracker_progress
alter table tracker_progress enable row level security;
drop policy if exists "Allow all on tracker_progress" on tracker_progress;
create policy "Allow all on tracker_progress" on tracker_progress
  for all using (true) with check (true);
