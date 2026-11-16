-- Epoch Cycling form submissions (waitlist, Riders Club application, contact, footer signup).
-- Written only by the server route /api/forms with the service-role key. No public access.
-- No health information is ever collected by these forms (spec 6.7.2).
create extension if not exists pgcrypto;

create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  site text not null default 'epochcycling',
  form text not null check (form in ('waitlist', 'riders_club_application', 'contact', 'footer_signup', 'race_claim')),
  submitted_at timestamptz not null,
  route_to text not null,
  data jsonb not null,
  consent jsonb,
  attestations jsonb,
  utm jsonb,
  status text not null default 'new' check (status in ('new', 'reviewed', 'archived'))
);

create index if not exists form_submissions_form_created_idx on public.form_submissions (form, created_at desc);
create index if not exists form_submissions_email_idx on public.form_submissions ((data->>'email'));

alter table public.form_submissions enable row level security;
-- Intentionally no policies: anon and authenticated roles get nothing. The service role bypasses RLS.
revoke all on public.form_submissions from anon, authenticated;
