-- Scans table
create table if not exists scans (
  id uuid primary key,
  host text not null,
  result jsonb not null,
  created_at timestamptz default now()
);
create index if not exists scans_host_created_idx on scans(host, created_at desc);

-- Notifications ("Coming Soon" signups)
create table if not exists notifications (
  id uuid primary key,
  email text not null,
  domain text not null,
  created_at timestamptz default now()
);
create index if not exists notifications_email_idx on notifications(email);
