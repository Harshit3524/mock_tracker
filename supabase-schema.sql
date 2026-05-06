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
