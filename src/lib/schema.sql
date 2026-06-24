-- SökoPay Database Schema (Standard PostgreSQL)
-- For Neon Postgres

-- Vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
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
  is_open BOOLEAN DEFAULT false,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chats table (with transaction status tracking)
CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  customer_id TEXT NOT NULL,
  customer_name TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  customer_paid BOOLEAN DEFAULT false,
  vendor_confirmed_payment BOOLEAN DEFAULT false,
  goods_dispatched BOOLEAN DEFAULT false,
  vendor_marked_served BOOLEAN DEFAULT false,
  customer_marked_served BOOLEAN DEFAULT false,
  is_finalized BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE NOT NULL,
  sender_id TEXT NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'system', 'action')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES chats(id) ON DELETE SET NULL,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  customer_id TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  transaction_rating INTEGER CHECK (transaction_rating BETWEEN 1 AND 5),
  comment TEXT,
  vendor_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(chat_id, customer_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('message', 'feedback', 'transaction', 'system')),
  title TEXT NOT NULL,
  body TEXT,
  reference_id UUID,
  reference_type TEXT,
  is_read BOOLEAN DEFAULT false,
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
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);

-- User roles table (one-time role selection)
CREATE TABLE IF NOT EXISTS user_roles (
  user_id TEXT PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('customer', 'vendor')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Push notification subscriptions (for PWA background notifications)
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
