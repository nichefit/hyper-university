-- Profile role column + RLS per auth spec

alter table public.profiles
  add column if not exists role text not null default 'user';

create index if not exists profiles_role_idx on public.profiles (role);

create or replace function public.is_admin(uid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = uid and role = 'admin'
  );
$$;

drop policy if exists "Profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users update own profile" on public.profiles;

create policy "Users read own profile"
on public.profiles for select
using (auth.uid() = id or public.is_admin(auth.uid()));

create policy "Admins read all profiles"
on public.profiles for select
using (public.is_admin(auth.uid()));

create policy "Users update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- Public marketing profiles (username pages)
create policy "Public read profiles by username"
on public.profiles for select
using (username is not null);
