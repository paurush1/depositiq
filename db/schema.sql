create table banks (
  id text primary key,
  name text not null,
  slug text not null unique,
  lead_endpoint text,
  created_at timestamptz not null default now()
);

create table products (
  id text primary key,
  bank_id text not null references banks(id),
  category text not null,
  name text not null,
  summary text not null,
  eligibility text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table rates (
  id bigserial primary key,
  product_id text not null references products(id) on delete cascade,
  rate_type text not null,
  label text not null,
  value_numeric numeric(8, 4),
  conditions text,
  effective_date date,
  created_at timestamptz not null default now()
);

create table fees (
  id bigserial primary key,
  product_id text not null references products(id) on delete cascade,
  fee_type text not null,
  label text not null,
  amount numeric(10, 2),
  waiver_conditions text,
  created_at timestamptz not null default now()
);

create table features (
  id bigserial primary key,
  product_id text not null references products(id) on delete cascade,
  feature_key text not null,
  feature_value text not null,
  created_at timestamptz not null default now()
);

create table source_snapshots (
  id bigserial primary key,
  product_id text references products(id) on delete set null,
  source_name text not null,
  source_url text not null,
  payload jsonb not null,
  fetched_at timestamptz not null,
  parser_version text,
  diff_status text not null default 'new'
);

create table consents (
  id bigserial primary key,
  full_name text not null,
  email text not null,
  phone text not null,
  consent_text_version text not null,
  consent_scope text not null,
  accepted_at timestamptz not null default now()
);

create table lead_events (
  id bigserial primary key,
  product_id text not null references products(id),
  bank_id text not null references banks(id),
  consent_id bigint not null references consents(id),
  payload_summary jsonb not null,
  delivery_status text not null default 'pending',
  delivered_at timestamptz,
  created_at timestamptz not null default now()
);

create table comparison_products (
  id text primary key,
  institution_id text not null,
  institution_name text not null,
  category text not null,
  category_name text not null,
  name text not null,
  summary text not null,
  rate_label text not null,
  monthly_fee_label text not null,
  monthly_fee_value numeric(10, 2),
  has_intro_offer boolean not null default false,
  has_offset boolean not null default false,
  has_rewards boolean not null default false,
  eligibility text not null,
  features jsonb not null default '[]'::jsonb,
  reasons jsonb not null default '[]'::jsonb,
  last_updated text not null,
  source_kind text not null,
  application_url text,
  source_snapshots jsonb not null default '[]'::jsonb,
  score integer not null default 70,
  synced_at timestamptz not null default now()
);

create index comparison_products_category_idx on comparison_products(category);
create index comparison_products_synced_at_idx on comparison_products(synced_at desc);

create table ingestion_sync_runs (
  id bigserial primary key,
  source_label text not null,
  institution_count integer not null default 0,
  product_count integer not null default 0,
  failure_count integer not null default 0,
  warnings jsonb not null default '[]'::jsonb,
  errors jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
