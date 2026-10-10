-- Jalankan di Supabase: 
--SQL Editor -> New query -> RUN

create table if not exists loans (
  id uuid primary key default gen_random_uuid(),
  member_name text not null,
  book_title text not null,
  loan_date date not null default current_date,
  due_date date not null,
  return_date date,
  status text not null default 'Dipinjam'
    check (status in ('Dipinjam', 'Dikembalikan', 'Terlambat')),
  created_at timestamptz not null default now()
);

--  Contoh data untuk mengetest filter status bisa
insert into loans (member_name, book_title, loan_date, due_date, return_date, status) values
  ('Budi',  'Pemrograman Web', '2026-09-20', '2026-09-27', null,'Terlambat'),
  ('Biddy',   'Basis Data Lanjut',              '2026-10-01', '2026-10-08', '2026-10-07', 'Dikembalikan'),
  ('Barby',  'Algoritma dan Struktur Data',    '2026-10-08', '2026-10-15', null,'Dipinjam');
