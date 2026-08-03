-- SökoPay Database Schema
-- Neon Postgres, one schema, raw SQL

-- Vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  business_name TEXT NOT NULL,
  category TEXT NOT NULL,
  category_secondary TEXT,
  description TEXT,
  address TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  hours JSONB,
  services JSONB,
  whatsapp TEXT,
  phone TEXT,
  photos TEXT[] DEFAULT '{}',
  is_open BOOLEAN DEFAULT FALSE,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chats table
CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id),
  customer_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES chats(id),
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES chats(id),
  vendor_id UUID NOT NULL REFERENCES vendors(id),
  customer_id UUID NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  transaction_rating INTEGER CHECK (transaction_rating BETWEEN 1 AND 5),
  comment TEXT,
  vendor_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_vendors_user_id ON vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_category ON vendors(category);
CREATE INDEX IF NOT EXISTS idx_vendors_location ON vendors(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_chats_vendor_id ON chats(vendor_id);
CREATE INDEX IF NOT EXISTS idx_chats_customer_id ON chats(customer_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_feedback_vendor_id ON feedback(vendor_id);
CREATE INDEX IF NOT EXISTS idx_feedback_customer_id ON feedback(customer_id);
