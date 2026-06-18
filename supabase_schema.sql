-- Vendors table
create table vendors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  business_name text not null,
  category text not null,
  category_secondary text,
  description text,
  address text,
  latitude numeric,
  longitude numeric,
  hours jsonb,
  services jsonb,
  whatsapp text,
  phone text,
  photos text[] default '{}',
  is_open boolean default false,
  last_updated timestamptz default now(),
  created_at timestamptz default now()
);

-- Chats table
create table chats (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references vendors not null,
  customer_id uuid references auth.users not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Messages table
create table messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references chats not null,
  sender_id uuid references auth.users not null,
  content text not null,
  created_at timestamptz default now(),
  read_at timestamptz
);

-- Feedback table
create table feedback (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references chats,
  vendor_id uuid references vendors not null,
  customer_id uuid references auth.users not null,
  rating integer check (rating between 1 and 5),
  transaction_rating integer check (transaction_rating between 1 and 5),
  comment text,
  vendor_notes text,
  created_at timestamptz default now()
);

-- Enable Row Level Security on all tables
alter table vendors enable row level security;
alter table chats enable row level security;
alter table messages enable row level security;
alter table feedback enable row level security;

-- Enable Realtime on messages table
alter table messages replica identity full;