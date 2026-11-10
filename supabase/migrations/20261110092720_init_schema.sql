-- ค่าใน enum เป็นรหัสภาษาอังกฤษ ป้ายที่แสดงผลอยู่ใน messages/{th,en}.json
create type public.property_type as enum ('land', 'house', 'orchard', 'commercial', 'resort', 'farm');
create type public.property_state as enum ('pending', 'approved', 'rejected', 'sold', 'archived');
create type public.listing_status as enum ('available', 'viewing', 'offers');
create type public.crm_status as enum ('new', 'contacted', 'viewing', 'negotiating', 'won', 'cancelled');
create type public.crm_entity as enum ('lead', 'buyer_request', 'property');

create function public.set_updated_at() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ข้อมูลอ้างอิง ---------------------------------------------------------------

create table public.districts (
  slug text primary key check (slug ~ '^[a-z0-9-]+$'),
  name_th text not null unique,
  name_en text not null unique,
  center_lat numeric(9, 6) not null check (center_lat between -90 and 90),
  center_lon numeric(9, 6) not null check (center_lon between -180 and 180)
);

create table public.subdistricts (
  district_slug text not null references public.districts (slug) on update cascade,
  slug text not null check (slug ~ '^[a-z0-9-]+$'),
  name_th text not null,
  name_en text not null,
  primary key (district_slug, slug),
  unique (district_slug, name_th)
);

create table public.poi (
  id bigint generated always as identity primary key,
  name_th text not null,
  name_en text not null,
  kind text not null,
  lat numeric(9, 6) not null check (lat between -90 and 90),
  lon numeric(9, 6) not null check (lon between -180 and 180)
);

-- ใช้ตรวจสิทธิ์แอดมินใน RLS
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ทรัพย์ ----------------------------------------------------------------------

-- ตารางสาธารณะ: ห้ามมีคอลัมน์ที่เป็นข้อมูลลับ (พิกัดจริง เลขโฉนด ข้อมูลเจ้าของ) ให้ไปอยู่ที่ property_private
-- ฟิลด์ข้อความ _en ปล่อยว่างได้ หน้าเว็บ fallback เป็น _th
create table public.properties (
  id uuid primary key default gen_random_uuid(),
  code text unique check (code ~ '^LL-[0-9]{4,}$'),
  slug text unique check (slug ~ '^[a-z0-9-]+$'),
  title_th text not null,
  title_en text,
  type public.property_type not null,
  district text not null references public.districts (slug) on update cascade,
  subdistrict text,
  zone_th text not null,
  zone_en text,
  zone_lat numeric(9, 6) check (zone_lat between -90 and 90),
  zone_lon numeric(9, 6) check (zone_lon between -180 and 180),
  zone_radius_m integer not null default 800 check (zone_radius_m > 0),
  price bigint not null check (price >= 0),
  rai integer not null default 0 check (rai >= 0),
  ngan integer not null default 0 check (ngan between 0 and 3),
  wah numeric(5, 2) not null default 0 check (wah >= 0 and wah < 100),
  total_wah numeric generated always as (rai * 400 + ngan * 100 + wah) stored,
  frontage_th text,
  frontage_en text,
  road_th text,
  road_en text,
  utilities_th text,
  utilities_en text,
  deed_type text,
  listing_status public.listing_status not null default 'available',
  highlights_th text[] not null default '{}',
  highlights_en text[] not null default '{}',
  tags text[] not null default '{}',
  state public.property_state not null default 'pending',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (district, subdistrict) references public.subdistricts (district_slug, slug) on update cascade,
  -- หน้าสาธารณะต้องมี code/slug/พิกัดโซนเสมอ
  constraint approved_is_publishable check (
    state <> 'approved'
    or (code is not null and slug is not null and zone_lat is not null and zone_lon is not null and published_at is not null)
  )
);

create index properties_state_idx on public.properties (state);
create index properties_district_idx on public.properties (district);
create index properties_total_wah_idx on public.properties (total_wah);

create trigger properties_set_updated_at before update on public.properties
for each row execute function public.set_updated_at();

create table public.property_private (
  property_id uuid primary key references public.properties (id) on delete cascade,
  exact_lat numeric(9, 6) check (exact_lat between -90 and 90),
  exact_lon numeric(9, 6) check (exact_lon between -180 and 180),
  deed_number text,
  owner_name text,
  owner_contact text,
  encumbrance text,
  admin_note text,
  consent_at timestamptz,
  consent_version text,
  ip_hash text,
  created_at timestamptz not null default now(),
  constraint consent_pair check ((consent_at is null) = (consent_version is null))
);

create table public.property_photos (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties (id) on delete cascade,
  storage_path text not null unique,
  sort_order integer not null default 0,
  is_cover boolean not null default false,
  alt_th text,
  alt_en text,
  created_at timestamptz not null default now()
);

create index property_photos_property_idx on public.property_photos (property_id, sort_order);
create unique index property_photos_one_cover on public.property_photos (property_id) where is_cover;

-- CRM -------------------------------------------------------------------------

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties (id) on delete set null,
  name text not null,
  contact text not null,
  message text,
  crm_status public.crm_status not null default 'new',
  consent_at timestamptz not null,
  consent_version text not null,
  ip_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index leads_status_idx on public.leads (crm_status, created_at desc);
create index leads_property_idx on public.leads (property_id);

create trigger leads_set_updated_at before update on public.leads
for each row execute function public.set_updated_at();

create table public.buyer_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null,
  target_property_id uuid references public.properties (id) on delete set null,
  district text references public.districts (slug) on update cascade,
  preferred_zone text,
  budget_min bigint check (budget_min >= 0),
  budget_max bigint check (budget_max >= 0),
  min_rai numeric(8, 2) check (min_rai >= 0),
  purpose text,
  road_need text,
  utility_need text,
  detail text,
  crm_status public.crm_status not null default 'new',
  consent_at timestamptz not null,
  consent_version text not null,
  ip_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint budget_range check (budget_min is null or budget_max is null or budget_min <= budget_max)
);

create index buyer_requests_status_idx on public.buyer_requests (crm_status, created_at desc);

create trigger buyer_requests_set_updated_at before update on public.buyer_requests
for each row execute function public.set_updated_at();

-- entity_id ชี้ได้หลายตาราง จึงไม่มี foreign key
create table public.crm_events (
  id bigint generated always as identity primary key,
  entity_type public.crm_entity not null,
  entity_id uuid not null,
  from_status text,
  to_status text not null,
  actor_id uuid references auth.users (id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

create index crm_events_entity_idx on public.crm_events (entity_type, entity_id, created_at);

-- ห้ามลบ actor ทิ้งแบบ cascade เพื่อให้ร่องรอยการเปิดดู PII อยู่ครบ
create table public.audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  meta jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index audit_log_entity_idx on public.audit_log (entity_type, entity_id, created_at desc);

-- ปิดไว้ก่อนทุกตาราง (deny by default) · policy อยู่ใน migration ของ RLS
alter table public.districts enable row level security;
alter table public.subdistricts enable row level security;
alter table public.poi enable row level security;
alter table public.admins enable row level security;
alter table public.properties enable row level security;
alter table public.property_private enable row level security;
alter table public.property_photos enable row level security;
alter table public.leads enable row level security;
alter table public.buyer_requests enable row level security;
alter table public.crm_events enable row level security;
alter table public.audit_log enable row level security;
