-- Platform tables (courses, gigs, wallet ledger, referrals, ads, etc.)

create type public.course_status as enum (
  'draft', 'pending_review', 'published', 'unpublished', 'rejected'
);
create type public.ad_request_status as enum (
  'submitted', 'in_review', 'creative_in_progress', 'ready_for_approval', 'live', 'completed', 'rejected'
);
create type public.gig_status as enum (
  'draft', 'open', 'in_progress', 'submitted', 'completed', 'cancelled'
);
create type public.withdrawal_status as enum ('pending', 'approved', 'paid', 'rejected');
create type public.wallet_tx_type as enum (
  'credit', 'debit', 'purchase', 'sale', 'commission', 'referral', 'withdrawal', 'exchange', 'escrow_hold', 'escrow_release', 'refund'
);

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.user_skills (
  user_id uuid references public.profiles (id) on delete cascade,
  skill_id uuid references public.skills (id) on delete cascade,
  primary key (user_id, skill_id)
);

create table public.badges (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  track_id uuid,
  created_at timestamptz not null default now()
);

create table public.user_badges (
  user_id uuid references public.profiles (id) on delete cascade,
  badge_id uuid references public.badges (id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  slug text not null unique,
  description text,
  category text,
  language text default 'en',
  thumbnail_url text,
  intro_video_url text,
  price_paise bigint not null default 0 check (price_paise >= 0),
  status public.course_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index courses_creator_idx on public.courses (creator_id);
create index courses_status_idx on public.courses (status);

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules (id) on delete cascade,
  title text not null,
  content_type text not null default 'video',
  body text,
  video_url text,
  pdf_url text,
  position int not null default 0,
  duration_seconds int,
  created_at timestamptz not null default now()
);

create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  title text not null
);

create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes (id) on delete cascade,
  prompt text not null,
  options jsonb not null default '[]',
  correct_index int not null default 0
);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (course_id, user_id)
);

create table public.lesson_progress (
  user_id uuid references public.profiles (id) on delete cascade,
  lesson_id uuid references public.lessons (id) on delete cascade,
  completed boolean not null default false,
  last_position_seconds int not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_percent int not null check (discount_percent between 1 and 100),
  max_uses int,
  uses int not null default 0,
  expires_at timestamptz,
  active boolean not null default true
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id),
  course_id uuid not null references public.courses (id),
  amount_paise bigint not null,
  coupon_id uuid references public.coupons (id),
  status text not null default 'pending',
  razorpay_order_id text,
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  razorpay_payment_id text,
  amount_paise bigint not null,
  status text not null,
  created_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  body text,
  created_at timestamptz not null default now(),
  unique (course_id, user_id)
);

create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  issued_at timestamptz not null default now(),
  pdf_url text,
  unique (course_id, user_id)
);

create table public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  tx_type public.wallet_tx_type not null,
  amount_paise bigint not null,
  points_delta bigint not null default 0,
  reference_type text,
  reference_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index wallet_tx_user_idx on public.wallet_transactions (user_id, created_at desc);

create table public.points_rules (
  id uuid primary key default gen_random_uuid(),
  action text not null unique,
  points int not null,
  active boolean not null default true
);

create table public.points_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  points_delta int not null,
  action text not null,
  reference_type text,
  reference_id uuid,
  created_at timestamptz not null default now()
);

create table public.point_exchanges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id),
  points_spent int not null,
  cash_paise bigint not null,
  created_at timestamptz not null default now()
);

create table public.leaderboard_snapshots (
  id uuid primary key default gen_random_uuid(),
  period text not null,
  category text,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.profiles (id),
  referred_id uuid not null references public.profiles (id) unique,
  code text not null,
  created_at timestamptz not null default now()
);

create table public.referral_rewards (
  id uuid primary key default gen_random_uuid(),
  referral_id uuid not null references public.referrals (id),
  amount_paise bigint not null,
  reference_type text not null,
  reference_id uuid not null,
  created_at timestamptz not null default now()
);

create table public.withdrawals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id),
  amount_paise bigint not null check (amount_paise > 0),
  method text not null,
  destination text not null,
  status public.withdrawal_status not null default 'pending',
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.kyc_records (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  pan text,
  aadhaar_last4 text,
  verified boolean not null default false,
  verified_by uuid references public.profiles (id),
  updated_at timestamptz not null default now()
);

create table public.ad_requests (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id),
  creator_id uuid not null references public.profiles (id),
  target_audience text,
  budget_range text,
  platform text,
  notes text,
  reference_links text[],
  status public.ad_request_status not null default 'submitted',
  assigned_to uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ad_creatives (
  id uuid primary key default gen_random_uuid(),
  ad_request_id uuid not null references public.ad_requests (id) on delete cascade,
  asset_url text not null,
  caption text,
  created_at timestamptz not null default now()
);

create table public.ad_comments (
  id uuid primary key default gen_random_uuid(),
  ad_request_id uuid not null references public.ad_requests (id) on delete cascade,
  author_id uuid not null references public.profiles (id),
  body text not null,
  created_at timestamptz not null default now()
);

create table public.ad_performance (
  id uuid primary key default gen_random_uuid(),
  ad_request_id uuid not null references public.ad_requests (id) on delete cascade,
  impressions int not null default 0,
  clicks int not null default 0,
  sales int not null default 0,
  recorded_at timestamptz not null default now()
);

create table public.learning_tracks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  skill_id uuid references public.skills (id),
  created_at timestamptz not null default now()
);

create table public.track_lessons (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references public.learning_tracks (id) on delete cascade,
  title text not null,
  content text,
  position int not null default 0
);

create table public.track_progress (
  user_id uuid references public.profiles (id) on delete cascade,
  track_id uuid references public.learning_tracks (id) on delete cascade,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, track_id)
);

create table public.gigs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles (id),
  title text not null,
  description text not null,
  required_skills text[] default '{}',
  budget_paise bigint not null,
  deadline date,
  status public.gig_status not null default 'open',
  created_at timestamptz not null default now()
);

create table public.gig_applications (
  id uuid primary key default gen_random_uuid(),
  gig_id uuid not null references public.gigs (id) on delete cascade,
  applicant_id uuid not null references public.profiles (id),
  pitch text not null,
  status text not null default 'applied',
  created_at timestamptz not null default now(),
  unique (gig_id, applicant_id)
);

create table public.gig_contracts (
  id uuid primary key default gen_random_uuid(),
  gig_id uuid not null references public.gigs (id),
  worker_id uuid not null references public.profiles (id),
  amount_paise bigint not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table public.gig_submissions (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.gig_contracts (id) on delete cascade,
  deliverable_url text,
  notes text,
  status text not null default 'submitted',
  created_at timestamptz not null default now()
);

create table public.escrow_holds (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.gig_contracts (id),
  amount_paise bigint not null,
  razorpay_payment_id text,
  released boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  reward_points int not null default 0,
  reward_paise bigint not null default 0,
  created_by uuid references public.profiles (id),
  active boolean not null default true
);

create table public.task_completions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks (id),
  user_id uuid not null references public.profiles (id),
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  unique (task_id, user_id)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  body text,
  href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  context_type text not null,
  context_id uuid not null,
  created_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.profiles (id),
  body text not null,
  created_at timestamptz not null default now()
);

create table public.fraud_flags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id),
  reason text not null,
  metadata jsonb not null default '{}',
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id),
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- RLS enable
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.withdrawals enable row level security;
alter table public.notifications enable row level security;

create policy "Published courses are public"
on public.courses for select using (status = 'published' or creator_id = auth.uid() or public.is_admin(auth.uid()));

create policy "Creators manage own courses"
on public.courses for all using (creator_id = auth.uid() or public.is_admin(auth.uid()));

create policy "Users see own enrollments"
on public.enrollments for select using (user_id = auth.uid() or public.is_admin(auth.uid()));

create policy "Users see own wallet tx"
on public.wallet_transactions for select using (user_id = auth.uid() or public.is_admin(auth.uid()));

create policy "Users manage own withdrawals"
on public.withdrawals for select using (user_id = auth.uid() or public.is_admin(auth.uid()));

create policy "Users read notifications"
on public.notifications for select using (user_id = auth.uid());

insert into public.points_rules (action, points) values
  ('lesson_complete', 10),
  ('track_complete', 100),
  ('course_published', 50),
  ('sale', 25),
  ('gig_complete', 75),
  ('five_star_review', 20),
  ('referral_conversion', 50),
  ('daily_login', 5)
on conflict (action) do nothing;
