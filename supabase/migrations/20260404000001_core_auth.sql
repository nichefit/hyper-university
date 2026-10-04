-- Hyper University (Infly) — core auth, profiles, roles, wallets, settings

create extension if not exists "pgcrypto";

create type public.user_path as enum ('direct_selling', 'learn_and_earn');
create type public.app_role as enum ('student', 'client', 'ads_manager', 'admin');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  username text unique,
  avatar_url text,
  bio text,
  college text,
  city text,
  skills text[] default '{}',
  interests text[] default '{}',
  path public.user_path,
  referral_code text not null unique,
  referred_by uuid references public.profiles (id),
  onboarding_completed boolean not null default false,
  role text not null default 'user',
  website text,
  twitter text,
  linkedin text,
  instagram text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_username_idx on public.profiles (username);
create index profiles_referral_code_idx on public.profiles (referral_code);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create table public.platform_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

create table public.wallets (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  cash_balance_paise bigint not null default 0 check (cash_balance_paise >= 0),
  points_balance bigint not null default 0 check (points_balance >= 0),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.generate_referral_code()
returns text language plpgsql as $$
declare
  code text;
begin
  code := 'INFLY' || upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 8));
  return code;
end;
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  ref_code text;
  referrer_id uuid;
  meta jsonb;
begin
  ref_code := public.generate_referral_code();
  meta := coalesce(new.raw_user_meta_data, '{}'::jsonb);

  if meta ? 'referral_code_input' and (meta->>'referral_code_input') is not null then
    select id into referrer_id from public.profiles
    where referral_code = upper(meta->>'referral_code_input')
    limit 1;
  end if;

  insert into public.profiles (id, full_name, referral_code, referred_by, role)
  values (
    new.id,
    coalesce(meta->>'full_name', meta->>'name'),
    ref_code,
    referrer_id,
    'user'
  );

  insert into public.user_roles (user_id, role) values (new.id, 'student');
  insert into public.wallets (user_id) values (new.id);

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.platform_settings enable row level security;
alter table public.wallets enable row level security;

create or replace function public.is_admin(uid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.user_roles
    where user_id = uid and role = 'admin'
  );
$$;

create policy "Profiles are viewable by everyone"
on public.profiles for select using (true);

create policy "Users update own profile"
on public.profiles for update using (auth.uid() = id);

create policy "Users read own roles"
on public.user_roles for select using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "Admins manage roles"
on public.user_roles for all using (public.is_admin(auth.uid()));

create policy "Users read own wallet"
on public.wallets for select using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "Settings readable by authenticated"
on public.platform_settings for select to authenticated using (true);

create policy "Admins manage settings"
on public.platform_settings for all using (public.is_admin(auth.uid()));

insert into public.platform_settings (key, value) values
  ('course_commission_percent', '20'),
  ('referral_reward_percent', '10'),
  ('points_per_rupee', '100'),
  ('min_withdrawal_paise', '50000')
on conflict (key) do nothing;
