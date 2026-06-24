# Sokopay — Complete Codebase Documentation

> **Purpose**: This document is a comprehensive handoff guide for continuing development on Sokopay. It covers every file, every decision, every pattern, and every known issue. Read this before touching any code.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Environment & Configuration](#3-environment--configuration)
4. [Database Schema & Management](#4-database-schema--management)
5. [Authentication System](#5-authentication-system)
6. [Middleware & Route Protection](#6-middleware--route-protection)
7. [API Routes](#7-api-routes)
8. [Pages & Routing](#8-pages--routing)
9. [Components](#9-components)
10. [Real-Time System (Ably)](#10-real-time-system-ably)
11. [Chat & Transaction System](#11-chat--transaction-system)
12. [Vendor Profile System](#12-vendor-profile-system)
13. [Customer Discovery & Maps](#13-customer-discovery--maps)
14. [Notification System](#14-notification-system)
15. [Error Handling & Game](#15-error-handling--game)
16. [Design System & Brand](#16-design-system--brand)
17. [Known Issues & Bugs](#17-known-issues--bugs)
18. [Development Workflow](#18-development-workflow)
19. [Deployment](#19-deployment)
20. [Future Development Roadmap](#20-future-development-roadmap)

---

## 1. Project Overview

### What Is Sokopay?

Sokopay is a **mobile-first web marketplace** connecting customers with nearby local vendors in Kenya. It is a premium, trustworthy marketplace for businesses that don't have websites: vegetable sellers, barbers, water vendors, gas refillers, butcheries, laundries, kiosks, and eateries.

**Brand**: Sokopay (always with o-umlaut — never "SokoPay")
**Market**: Kenya — Nairobi-first, designed for intermittent connectivity and low-end devices
**V1 Constraint**: No payment processing. Transactions happen offline (M-Pesa/cash). App only provides manual "Mark as Paid" / "Mark as Served" confirmation buttons.

### Core User Flows

1. **Customer Flow**: Land on homepage → Select role → Sign up/in → Browse vendors on dashboard → View vendor profile → Message vendor → Complete transaction → Leave feedback
2. **Vendor Flow**: Land on homepage → Select role → Sign up/in → Create shop profile → Receive messages from customers → Manage transactions → View analytics

### The 11 Vendor Categories

1. Mama/Baba Mboga (vegetable sellers)
2. Maasai Shop (general kiosks)
3. Barbers
4. Saloonists
5. Water Vendors
6. Gas Refillers
7. Butcheries
8. Laundry Mart
9. SuperMarkets & Wholesellers
10. Eateries
11. Quick Snacks

---

## 2. Tech Stack & Dependencies

### Core Framework

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 14.2.21 | React framework (App Router) |
| React | ^18.3.1 | UI library |
| TypeScript | ^5 | Type safety |
| Tailwind CSS | ^3.4 | Styling |

### Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| @clerk/nextjs | 6.10.3 | Authentication (email, social, phone) |
| ably | latest | Real-time messaging & notifications |
| pg | latest | Neon Postgres database driver |
| leaflet | latest | Interactive maps |
| react-leaflet | latest | React wrapper for Leaflet |
| lucide-react | latest | Icon library |
| class-variance-authority | latest | Component variant styling |
| tailwind-merge | latest | Tailwind class deduplication |
| clsx | latest | Conditional classnames |

### What We Migrated Away From

| Old | New | Why |
|-----|-----|-----|
| Supabase Auth | Clerk | More mature, cleaner UX, better role management |
| Supabase Database | Neon Postgres | Simpler pricing, direct SQL, no edge function complexity |
| Supabase Realtime | Ably | Better free tier (6M msgs/month), works on Vercel |
| Supabase Storage | Base64 in DB | V1 simplicity (not ideal for production) |

### Scripts (package.json)

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "db:setup": "tsx src/lib/setup-db.ts"
}
```

---

## 3. Environment & Configuration

### Environment Variables Required

Copy `.env.example` to `.env.local` and fill in:

```env
# Database (Neon Postgres)
DATABASE_URL=postgresql://neondb_owner:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Real-time (Ably)
ABLY_APP_ID=xxx
ABLY_API_KEY=xxx
NEXT_PUBLIC_ABLY_APP_ID=xxx
NEXT_PUBLIC_ABLY_API_KEY=xxx
```

### Current Credentials (as of last session)

```
Neon: postgresql://neondb_owner:npg_BezOIgb07xtn@ep-red-mode-ains0riv-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
Clerk PK: pk_test_aGFuZHktbG9ic3Rlci01My5jbGVyay5hY2NvdW50cy5kZXYk
Clerk SK: sk_test_qwPTK3tvo9t4Fzfw5SxT4xg4RiDDxRyxxAj9xmThzR
Ably App ID: 1Yt3xw
Ably API Key: 1Yt3xw.8vc9Tg:3kEe26_0cVn0n4--EGdwUkguxnm9XAgh30TD1aajOms
```

### Clerk Dashboard Configuration

- **Home URL**: `/dashboard`
- **Sign-in URL**: `/auth/login`
- **Sign-up URL**: `/auth/role`
- **Sign-out URL**: `/`

### GitHub Repository

- **URL**: `https://github.com/linuxbyter/Sokopay.git`
- **Branch**: `main`
- **Auto-deploy**: Vercel connected to main branch

### Tailwind Configuration

File: `tailwind.config.ts` (105 lines)

**Custom Colors**:
- `brand` (50-950): Muted basil green — primary brand color
  - Key shades: `brand-500` `#6ab864` (buttons), `brand-600` `#559650` (active/hover), `brand-700` `#457841` (headers)
- `copper` (50-900): Warm orange accent
  - Key shade: `copper-400` `#D4874D` (highlights, badges)
- `neutral` (50-950): Warm gray
  - `neutral-50` `#F8F7F4` (lightest), `neutral-950` `#262422` (darkest)
- `background.50`: `#F8F6F0` (warm white page backgrounds)
- `foreground.50`: `#2D3748` (charcoal text)

**Custom Utilities**:
- Font: Inter + system fallbacks
- Font size: `2xs` (0.65rem)
- Shadows: `card`, `card-hover`, `elevated`, `bottom-nav`
- Border radii: `2xl` (1rem), `3xl` (1.25rem)
- Animations: `fade-in`, `slide-up`, `slide-in-right`, `pulse`

---

## 4. Database Schema & Management

### Database: Neon Postgres

We use Neon Postgres (serverless Postgres) via the `pg` package. No ORM — all raw SQL.

### Connection Pool (`src/lib/db.ts`)

```typescript
// Lazy singleton pool — initializes on first query
const getPool = () => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
  }
  return pool;
};

// Query helper with logging
export async function query(text: string, params?: unknown[]) {
  const start = Date.now();
  const result = await getPool().query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text: text.substring(0, 50), duration, rows: result.rowCount });
  return result;
}
```

### Tables

#### vendors — Vendor shop profiles

```sql
vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,                    -- Clerk user ID (e.g., "user_xxx")
  business_name TEXT NOT NULL,
  category TEXT NOT NULL,                    -- One of 11 categories
  category_secondary TEXT,                   -- Optional second category
  description TEXT,
  address TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  hours JSONB,                              -- { mon: { open: "08:00", close: "18:00", closed: false }, ... }
  services JSONB,                           -- [{ name: "Haircut", price_hint: "300" }, ...]
  whatsapp TEXT,                            -- Primary contact, +254 format
  phone TEXT,                               -- Optional secondary
  photos TEXT[] DEFAULT '{}',               -- Up to 10 base64 strings (NOT URLs)
  is_open BOOLEAN DEFAULT FALSE,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

#### chats — Chat rooms between vendor and customer

```sql
chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id) NOT NULL,
  customer_id TEXT NOT NULL,                 -- Clerk user ID
  customer_name TEXT,                        -- Cached customer name for display
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'confirmed', 'dispatched', 'served', 'finalized')),
  customer_paid BOOLEAN DEFAULT FALSE,
  vendor_confirmed_payment BOOLEAN DEFAULT FALSE,
  goods_dispatched BOOLEAN DEFAULT FALSE,
  vendor_marked_served BOOLEAN DEFAULT FALSE,
  customer_marked_served BOOLEAN DEFAULT FALSE,
  is_finalized BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(vendor_id, customer_id, is_finalized)
)
```

#### messages — Individual chat messages

```sql
messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES chats(id) NOT NULL,
  sender_id TEXT NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'system')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ
)
```

#### feedback — Customer and vendor ratings

```sql
feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES chats(id),
  vendor_id UUID REFERENCES vendors(id) NOT NULL,
  customer_id TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  transaction_rating INTEGER CHECK (transaction_rating BETWEEN 1 AND 5),
  comment TEXT,
  vendor_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(chat_id, customer_id)
)
```

#### notifications — Push notification history

```sql
notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  body TEXT,
  reference_id TEXT,
  reference_type TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

#### user_roles — Persistent role storage

```sql
user_roles (
  user_id TEXT PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('customer', 'vendor')),
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

### Indexes

```sql
CREATE INDEX idx_vendors_user_id ON vendors(user_id);
CREATE INDEX idx_vendors_category ON vendors(category);
CREATE INDEX idx_chats_vendor_id ON chats(vendor_id);
CREATE INDEX idx_chats_customer_id ON chats(customer_id);
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_feedback_vendor_id ON feedback(vendor_id);
CREATE INDEX idx_feedback_customer_id ON feedback(customer_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
```

### SQL Management Files

| File | Purpose | When to Use |
|------|---------|-------------|
| src/lib/schema.sql | Full schema definition | First-time setup |
| src/lib/reset.sql | Wipe all data + recreate tables | Fresh start in dev |
| src/lib/cleanup.sql | Delete all rows (preserve structure) | Clear test data |

To reset the database: Run the contents of `reset.sql` in the Neon SQL editor.

---

## 5. Authentication System

### Architecture

```
User visits /auth/role
  -> Selects "Customer" or "Vendor"
  -> Redirected to /auth/login/customer or /auth/login/vendor
  -> Clerk <SignIn> component handles auth
  -> After sign-in, redirected to /auth/setup?role=customer|vendor
  -> /auth/setup checks if role exists in user_roles table
  -> If not, stores role via POST /api/role
  -> Redirects to /dashboard (customer) or /vendor/dashboard (vendor)
```

### Key Files

| File | Purpose |
|------|---------|
| src/app/auth/role/page.tsx | Role selection cards |
| src/app/auth/login/customer/page.tsx | Clerk SignIn for customers |
| src/app/auth/login/vendor/page.tsx | Clerk SignIn for vendors |
| src/app/auth/setup/page.tsx | Post-login role storage & routing |
| src/app/api/role/route.ts | GET/POST role from user_roles table |
| src/components/clerk-provider.tsx | ClerkProvider wrapper |
| src/components/sign-out-button.tsx | Sign out helper |

### Role Storage

Roles are stored ONCE in the user_roles table. The API uses upsert-safe logic:

```sql
INSERT INTO user_roles (user_id, role) VALUES ($1, $2)
ON CONFLICT (user_id) DO NOTHING
```

This means the first role selection is permanent. There is NO role toggle in the app.

### Auth State

Clerk handles all auth state via `useUser()` hook. The `user.id` (e.g., `user_xxx`) is used throughout as the primary user identifier.

---

## 6. Middleware & Route Protection

### File: middleware.ts (root level)

```typescript
export async function middleware(req: NextRequest) {
  // Dynamically import Clerk to avoid edge runtime issues
  const { auth } = await import('@clerk/nextjs/server')
  const { userId } = await auth()

  // Redirect authenticated users away from auth pages
  if (userId && pathname.startsWith('/auth/')) {
    return NextResponse.redirect('/dashboard')
  }

  // Public paths (no auth required)
  const publicPaths = ['/', '/auth/role', '/auth/login', '/auth/logout', '/about']

  // All other paths require authentication
  if (!userId) {
    return NextResponse.redirect('/auth/role')
  }

  return NextResponse.next()
}
```

### Route Protection Summary

| Route | Access | Notes |
|-------|--------|-------|
| / | Public | Landing page |
| /auth/role | Public | Role selection |
| /auth/login/* | Public | Clerk sign-in |
| /auth/setup | Public | Post-login setup |
| /about | Public | About page |
| /dashboard | Protected | Customer dashboard |
| /messages | Protected | Customer messages |
| /vendor/[id] | Protected | Vendor profile page |
| /vendor/dashboard | Protected | Vendor dashboard |
| /vendor/messages | Protected | Vendor messages |
| /vendor/profile/create | Protected | Profile creation/edit |
| /support | Protected | FAQ page |
| /contact | Protected | Contact page |

---

## 7. API Routes

### Base URL: /api/

All API routes are in src/app/api/. They use Next.js 14 App Router conventions (Route Handlers).

#### GET /api/vendors — List vendors
- **Query params**: category, search, userId
- **Response**: { vendors: [...with avg_rating and feedback_count] }
- **SQL**: Subquery joins feedback for real ratings

#### POST /api/vendors — Create vendor
- **Body**: { userId, businessName, category, description, address, latitude, longitude, hours, services, whatsapp, phone, photos }
- **Response**: { vendor: {...} }
- **Notes**: Photos stored as base64 strings

#### GET /api/vendors/[id] — Get single vendor
- **Response**: { vendor: {...} }

#### PUT /api/vendors/[id] — Update vendor
- **Auth**: Required (Clerk). Verifies ownership.
- **Body**: Any subset of allowed fields
- **Response**: { vendor: {...updated} }

#### DELETE /api/vendors/[id] — Delete vendor
- **Auth**: Required (Clerk). Verifies ownership.
- **Checks**: Cannot delete if has active (non-finalized) chats
- **Response**: { success: true }

#### GET /api/vendors/[id]/stats — Vendor statistics
- **Response**: { customersServed, totalFeedback, averageRating, totalMessages }

#### POST /api/chats — Create or resume chat
- **Body**: { vendorId, customerId, customerName, newChat? }
- **Logic**: If newChat=true (Buy Again), creates fresh chat. Otherwise finds existing non-finalized chat or creates new one.
- **Response**: { chat: {...} }

#### GET /api/chats — List user's chats
- **Query params**: userId, role (customer or vendor)
- **Response**: { chats: [...with last_message, last_message_at, last_message_sender] }
- **SQL**: Uses LEFT JOIN LATERAL to get last message per chat

#### GET /api/chats/[id]/messages — Get messages
- **Response**: { messages: [...] }
- **Order**: created_at ASC

#### POST /api/chats/[id]/messages — Send message
- **Body**: { senderId, content, messageType? }
- **Side effects**: Updates chat timestamp, publishes to Ably channel, sends notification to recipient
- **Response**: { message: {...} }

#### PUT /api/chats/[id]/status — Update transaction status
- **Body**: { action, userId }
- **Actions**: mark_paid, confirm_payment, dispatch, vendor_serve, customer_serve, finalize
- **Side effects**: Inserts system message, sends notification via Ably
- **Response**: { chat: {...updated} }

#### POST /api/feedback — Submit feedback
- **Body**: { chatId, vendorId, customerId, rating?, comment?, transactionRating?, vendorNotes? }
- **Logic**: Upserts on UNIQUE(chat_id, customer_id) constraint
- **Side effects**: Inserts system message, notifies other party
- **Response**: { feedback: {...} }

#### GET /api/feedback — Get feedback
- **Query params**: chatId or vendorId
- **Response**: { feedback: [...] }

#### GET /api/notifications — List notifications
- **Query params**: userId, readOnly?
- **Response**: { notifications: [...], unreadCount: number }
- **Limit**: 50 most recent

#### POST /api/notifications — Create notification
- **Body**: { userId, type, title, body?, referenceId?, referenceType? }
- **Side effects**: Triggers Ably push notification

#### PATCH /api/notifications/[id] — Mark as read
- **Response**: { success: true }

#### PATCH /api/notifications/read-all — Mark all as read
- **Query params**: userId
- **Response**: { success: true }

#### POST /api/upload — Upload images
- **Body**: { vendorId, images: string[] }
- **Notes**: Validates max 3 images (but client allows 10 — INCONSISTENCY!)
- **Storage**: Base64 strings in vendor.photos column

#### GET /api/role — Get user role
- **Query params**: userId
- **Response**: { role: 'customer' | 'vendor' | null }

#### POST /api/role — Store user role
- **Body**: { userId, role }
- **Logic**: Upsert-safe (ON CONFLICT DO NOTHING)
- **Response**: { success: true }

---

## 8. Pages & Routing

### Page Structure

```
src/app/
├── page.tsx                    # Landing page (public)
├── layout.tsx                  # Root layout with ClerkProvider
├── globals.css                 # Tailwind imports
├── error.tsx                   # Route-level error boundary (has FruitGame)
├── not-found.tsx               # 404 page (has FruitGame)
├── global-error.tsx            # Global error boundary (has FruitGame)
├── favicon.svg                 # SVG favicon
├── about/page.tsx              # About page
├── contact/page.tsx            # Contact page with form
├── support/page.tsx            # FAQ accordion
├── messages/page.tsx           # Customer chat list
├── auth/
│   ├── role/page.tsx           # Role selection
│   ├── login/
│   │   ├── customer/page.tsx   # Customer Clerk sign-in
│   │   └── vendor/page.tsx     # Vendor Clerk sign-in
│   ├── setup/page.tsx          # Post-login role routing
│   └── logout/route.ts         # POST logout (no-op, Clerk handles it)
├── dashboard/
│   └── page.tsx                # Customer dashboard (vendor discovery)
└── vendor/
    ├── [id]/page.tsx           # Public vendor profile page
    ├── dashboard/page.tsx      # Vendor dashboard (shop management)
    ├── messages/page.tsx       # Vendor chat list
    └── profile/
        └── create/page.tsx     # 7-step profile creation/edit wizard
```

### Landing Page (src/app/page.tsx — 220 lines)

- Sticky navbar with brand name + "Sign In" button
- Hero section with "Get Started" CTA → /auth/role
- "Browse Categories" scrolls down to category grid
- 11 category cards with icons (all navigate to /auth/role)
- "How It Works" 3-step guide
- Search bar (non-functional, navigates to /auth/role)
- Footer with links

### Customer Dashboard (src/app/dashboard/page.tsx — 371 lines)

- Search bar with filter toggle
- "Use My Location" button (browser geolocation, falls back to Nairobi: -1.286389, 36.817223)
- Category chips for filtering
- Sort by distance or rating
- List/Map view toggle
- Vendor cards: photo, name, category, distance, rating, open status
- Click vendor → navigates to /vendor/[id]
- MapView component (Leaflet, dynamic import, SSR-safe)

### Vendor Dashboard (src/app/vendor/dashboard/page.tsx — 369 lines)

- **No shops**: Welcome onboarding with Create Shop, Messages, Browse cards
- **Has shops**: Shop cards with photo, name, category, open/closed toggle, actions (View Stats, Toggle Open, Edit, Delete)
- Stats grid: Customers Served, Avg Rating, Reviews, Messages
- Quick actions: Messages, Browse as Customer
- Multi-shop support: shows all shops as cards

### Vendor Profile Page (src/app/vendor/[id]/page.tsx — 360 lines)

- Sticky header with back button + shop name
- Photo gallery with carousel (prev/next/dots navigation)
- Shop info: name, category, open/closed badge, star rating (from DB), address
- Description section
- Services & Products list with KES prices
- Operating Hours (Mon-Sun)
- Location MiniMap (non-interactive Leaflet)
- Contact links (WhatsApp deep-link wa.me/, phone tel: link)
- Sticky "Message Vendor" CTA at bottom
- Creates/resumes chat via POST /api/chats, then navigates to /messages

### Profile Creation Wizard (src/app/vendor/profile/create/page.tsx — 861 lines)

7-step form:
1. **Business Info**: Name, category (11 options), description
2. **Location**: Nominatim address search, pick from results (lat/lng stored)
3. **Hours**: Mon-Sun toggle with open/close time pickers
4. **Photos**: ImageUpload component (up to 10 photos, base64)
5. **Services**: Name + price hint, add/remove list
6. **Contact**: WhatsApp (+254 auto-prefix), optional phone
7. **Review**: Summary of all data before submission

Supports EDIT mode via `?edit={vendorId}` query param. Loads existing data, uses PUT instead of POST.

### Messages Page (src/app/messages/page.tsx — 175 lines)

- Customer-facing chat list
- Shows vendor avatar, name, category, last message preview, timestamp
- Deep-linking: accepts ?chatId= param from notifications to auto-open a chat
- Wrapped in Suspense boundary (required for useSearchParams)

### Vendor Messages Page (src/app/vendor/messages/page.tsx — 147 lines)

- Vendor-facing chat list
- Shows customer initials avatar, customer name, last message preview, timestamp
- Opens ChatDialog with isVendor=true

### About Page (src/app/about/page.tsx — 27 lines)

- Brand description
- "Back to Home" button (routes to /dashboard if signed in, / otherwise)

### Contact Page (src/app/contact/page.tsx — 118 lines)

- Email link (support@sokopay.com)
- WhatsApp link (wa.me/254700000000 — placeholder number)
- Contact form (name, email, message) with alert() on submit (no backend)

### Support Page (src/app/support/page.tsx — 173 lines)

- FAQ accordion with 4 sections, 12 items total
- Covers: Getting Started, Chat & Transactions, Vendor Profile, Account & Safety
- "Contact Support" CTA

---

## 9. Components

### ChatDialog (src/components/chat-dialog.tsx — 521 lines)

THE most complex component. Full chat interface with:

**Features**:
- Message list with bubbles (self = brand green, other = gray, system = centered gray pill)
- Transaction status bar (5-step progress: Paid → Confirmed → Dispatched → Served → Finalized)
- Quick action buttons that change based on transaction state AND user role
- Message input with send button
- Optimistic message sending (appears immediately, synced in background)
- Ably real-time subscription for incoming messages (deduplicates by ID)
- FeedbackModal integration
- "Buy Again" functionality (creates new chat for same vendor+customer)

**Props**: chat, onBack, onChatUpdate, isVendor

**Key State**: messages, newMessage, loading, sending, showFeedback, feedbackType, activeChat

**Transaction Actions**:
- Customer: "Mark as Paid" (when not yet paid), "Mark as Served" (when dispatched)
- Vendor: "Confirm Payment" (when customer paid), "Mark as Dispatched" (when confirmed), "Mark as Served" (when dispatched)
- Both (when finalized): "Buy Again", "Leave Feedback"

### Navbar (src/components/navbar.tsx — 201 lines)

Role-aware navigation bar:
- Brand name (routes to correct dashboard based on role)
- NotificationBell component
- User avatar with dropdown menu
- **Customer menu**: Messages, Support, Contact, About, Sign Out
- **Vendor menu**: My Shop, Messages, Browse as Customer, Support, Contact, About, Sign Out
- 44px min touch targets for accessibility
- Detects vendor/customer from pathname

### NotificationBell (src/components/notification-bell.tsx — 189 lines)

- Bell icon with red unread count badge (shows "9+" if >9)
- Dropdown panel with notification list
- Mark as read / Mark all as read buttons
- Real-time Ably subscription for live notifications
- Click chat notifications → deep-links to /messages?chatId=...
- Icons: MessageSquare (blue), Star (copper), Zap (green), Info (gray)
- Relative time display ("Just now", "5m ago", "2h ago", etc.)

### FeedbackModal (src/components/feedback-modal.tsx — 133 lines)

- 5 interactive stars with hover preview
- Labels: Poor, Fair, Good, Very Good, Excellent
- Optional comment textarea
- Skip and Submit buttons
- Different text for customer vs vendor feedback types

### ImageUpload (src/components/image-upload.tsx — 118 lines)

- Grid of preview thumbnails with red X remove buttons
- Dashed "Add Photo" button
- Validates file type (image/*) and size (5MB max)
- Max 10 images (configurable via maxImages prop)
- Properly revokes object URLs on removal to free memory

### MapView (src/components/map-view.tsx — 119 lines)

- Full-screen Leaflet map
- Custom DivIcon markers (green #6ab864 for open, gray for closed)
- User location shown as blue dot
- Click marker → calls onVendorClick handler
- fitBounds auto-zooms to show all vendors
- SSR-safe (dynamic import in dashboard)
- Cleans up map instance on unmount

### MiniMap (src/components/mini-map.tsx — 57 lines)

- Small non-interactive Leaflet map for vendor profile pages
- Green custom marker with vendor name popup
- All interaction disabled (drag, zoom, scroll)
- Uses brand green (#6ab864) for marker

### FruitGame (src/components/fruit-game.tsx — 257 lines)

- Canvas-based fruit-collecting game for error pages
- Arrow keys / touch/swipe to move basket
- 3 lives, score counter, high score (localStorage)
- Difficulty ramps as score increases
- Keyboard (arrows/WASD) and touch input support
- Start screen → Game → Game Over screen with Play Again

### LoadingSpinner (src/components/loading-spinner.tsx — 34 lines)

- Animated Loader2 icon with optional text
- Size variants: sm, md, lg
- FullScreen mode wraps in centered full-height container

### Button (src/components/ui/button.tsx — 83 lines)

- CVA-based component with 6 variants (default, destructive, outline, secondary, ghost, link)
- 4 sizes (default, sm, lg, icon)
- Loading spinner state
- fullWidth prop

### ClerkProviderWrapper (src/components/clerk-provider.tsx — 12 lines)

- Wraps children with ClerkProvider
- Uses NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

### RoleToggle (src/components/role-toggle.tsx — 53 lines)

- Toggle switch to switch between vendor and customer views
- NOT currently used in any page (leftover from earlier design)

### SignOutButton (src/components/sign-out-button.tsx — 25 lines)

- Button that calls Clerk signOut() and redirects to /

---

## 10. Real-Time System (Ably)

### Architecture

```
Server (API routes)                    Client (Browser)
      |                                      |
      |  POST /api/chats/[id]/messages       |
      |  -> Insert into DB                   |
      |  -> Publish to Ably channel          |
      |                                      |
      |  -------- Ably Cloud -------->       |
      |                                      |
      |                              subscribeToChatMessages()
      |                              -> Updates message list
      |                              -> Real-time UI update
```

### Server Side (src/lib/ably.ts — 60 lines)

```typescript
import Ably from 'ably';

let ably: Ably.Realtime | null = null;

export function getAbly() {
  if (!ably && process.env.ABLY_API_KEY) {
    ably = new Ably.Realtime({ key: process.env.ABLY_API_KEY });
  }
  return ably;
}

export async function triggerNotification(userId: string, notification: {...}) {
  const ably = getAbly();
  if (!ably) return;  // Graceful degradation
  await ably.channels.get(`user-${userId}`).publish('notification', notification);
}

export async function publishChatMessage(chatId: string, message: {...}) {
  const ably = getAbly();
  if (!ably) return;  // Graceful degradation
  await ably.channels.get(`chat-${chatId}`).publish('message', message);
}
```

### Client Side (src/lib/ably-client.ts — 39 lines)

```typescript
import Ably from 'ably';

let ablyClient: Ably.Realtime | null = null;

function getClient() {
  if (!ablyClient && process.env.NEXT_PUBLIC_ABLY_API_KEY) {
    ablyClient = new Ably.Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY });
  }
  return ablyClient;
}

export function subscribeToNotifications(userId: string, callback: (notification) => void) {
  const client = getClient();
  if (!client) return () => {};  // No-op if Ably unavailable
  const channel = client.channels.get(`user-${userId}`);
  channel.subscribe('notification', callback);
  return () => channel.unsubscribe('notification', callback);
}

export function subscribeToChatMessages(chatId: string, callback: (message) => void) {
  const client = getClient();
  if (!client) return () => {};  // No-op if Ably unavailable
  const channel = client.channels.get(`chat-${chatId}`);
  channel.subscribe('message', callback);
  return () => channel.unsubscribe('message', callback);
}
```

### Channel Naming

| Channel | Events | Purpose |
|---------|--------|---------|
| user-{userId} | notification | Push notifications to specific user |
| chat-{chatId} | message | Real-time messages in a chat room |

### How It Works

1. **Sending a message**: Client POSTs to /api/chats/[id]/messages → Server inserts into DB → Server calls publishChatMessage() → Ably delivers to all subscribers of chat-{chatId}
2. **Receiving a message**: ChatDialog calls subscribeToChatMessages() on mount → When event arrives, message is added to state (with deduplication by ID)
3. **Notifications**: API routes call triggerNotification() → Client's NotificationBell subscribes via subscribeToNotifications() → Badge updates in real-time

### Ably Free Tier

- 6M messages/month
- 200 connections/month (more than enough for MVP)
- No credit card required

---

## 11. Chat & Transaction System

### Transaction State Machine

```
pending -> paid -> confirmed -> dispatched -> served -> finalized
  |         |        |           |          |         |
  |     Customer   Vendor     Vendor     Both      Either
  |     marks as   confirms   marks as   mark as   party
  |     paid       payment    dispatched served    finalizes
```

### Actions and Who Can Perform Them

| Action | Actor | Sets | Notifies |
|--------|-------|------|----------|
| mark_paid | Customer | customer_paid=true, status='paid' | Vendor |
| confirm_payment | Vendor | vendor_confirmed_payment=true, status='confirmed' | Customer |
| dispatch | Vendor | goods_dispatched=true, status='dispatched' | Customer |
| vendor_serve | Vendor | vendor_marked_served=true, status='served' | Customer |
| customer_serve | Customer | customer_marked_served=true, status='served' | Vendor |
| finalize | Either | is_finalized=true, status='finalized' | Other party |

### Quick Actions in Chat

The ChatDialog shows different action buttons based on the current state and user role:

**Customer sees**:
- "Mark as Paid" (when not yet paid)
- "Mark as Served" (when dispatched and both served flags not set)
- "Buy Again" (when finalized)
- "Leave Feedback" (when finalized)

**Vendor sees**:
- "Confirm Payment" (when customer paid but vendor hasn't confirmed)
- "Mark as Dispatched" (when confirmed but not yet dispatched)
- "Mark as Served" (when dispatched and both served flags not set)
- "Buy Again" (when finalized)
- "Leave Feedback" (when finalized)

### "Buy Again" Flow

1. Either party clicks "Buy Again" in a finalized chat
2. Client calls POST /api/chats with { vendorId, customerId, customerName, newChat: true }
3. Server creates a fresh chat (old chat stays as history)
4. User is taken back to messages list where the new chat appears

### Message Types

- **text**: Regular user message (displayed as chat bubble)
- **system**: Auto-generated status update (displayed as centered gray pill)

System messages are created automatically when transaction status changes (e.g., "Marked as paid", "Payment confirmed", etc.).

### Optimistic UI

When sending a message:
1. Message appears in the chat immediately (before API response)
2. If API succeeds: replaced with server response (includes real ID, timestamp)
3. If API fails: removed from chat, error shown to user

This makes the chat feel instant even on slow connections.

---

## 12. Vendor Profile System

### Profile Creation

The 7-step wizard (src/app/vendor/profile/create/page.tsx) collects:

**Step 1 — Business Info**:
- Business name (required, text input)
- Category (required, dropdown of 11 categories)
- Description (optional, textarea)

**Step 2 — Location**:
- Address search using Nominatim (OSM geocoding, free, no API key)
- Pick from search results → stores address + latitude + longitude
- Rate-limited to ~1 request/second

**Step 3 — Operating Hours**:
- Mon-Sun toggle (open/closed switch for each day)
- Time pickers for open/close times
- Defaults: 08:00 - 18:00

**Step 4 — Photos**:
- Up to 10 photos
- Client-side validation (image/* type, 5MB max per file)
- Stored as base64 strings (NOT URLs)
- NOTE: API route still validates max 3 — inconsistency!

**Step 5 — Services**:
- Add services with name + price hint (in KES)
- Remove services
- Example: "Haircut" — "300"

**Step 6 — Contact**:
- WhatsApp number (auto-prefix +254 if not present)
- Optional phone number

**Step 7 — Review**:
- Summary of all entered data
- Submit creates vendor via POST /api/vendors or updates via PUT /api/vendors/{id}

### Edit Mode

Access /vendor/profile/create?edit={vendorId} to edit an existing profile. The wizard:
1. Fetches existing vendor data
2. Pre-fills all form fields
3. Uses PUT /api/vendors/{id} instead of POST /api/vendors on submit

### Photo Storage

Photos are stored as **base64 strings** directly in the photos TEXT[] column. This is a V1 simplification:
- Pros: No external storage needed, simple implementation
- Cons: Large DB size, no CDN, no image optimization, DB queries slower

### Profile Display

The public profile page (/vendor/[id]) shows:
- Photo gallery with carousel (prev/next/dots navigation)
- Business name, category, open/closed status badge
- Star rating (from feedback table, real average)
- Address with MiniMap
- Description
- Services list with KES prices
- Operating hours (Mon-Sun)
- Contact links (WhatsApp deep-link wa.me/, phone tel:)
- Sticky "Message Vendor" CTA at bottom

---

## 13. Customer Discovery & Maps

### Dashboard Discovery

The customer dashboard (/dashboard) provides:
- Search by name/description/category (ILIKE query)
- Filter by category (11 chips, toggle on/off)
- Sort by distance or rating
- List/Map view toggle
- Browser geolocation (falls back to Nairobi: -1.286389, 36.817223)

### Map Integration

**Leaflet + OpenStreetMap** — free, no API key needed.

- **MapView** component: Full-screen interactive map
- Custom markers: Green (#6ab864) for open vendors, Gray for closed
- User location: Blue dot
- Click marker → navigate to vendor profile page
- fitBounds auto-zooms to show all vendors
- SSR-safe via dynamic import (loaded only on client)

### Distance Calculation

Currently uses **Euclidean approximation** (not Haversine):
```typescript
const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111;
```

This multiplies the Euclidean distance of lat/lng differences by 111 (approximate km per degree of latitude). It's inaccurate for large distances but acceptable for Nairobi-scale discovery.

### Geocoding

Uses **Nominatim** (OpenStreetMap) for address search during profile creation:
- Free, no API key required
- Rate-limited to ~1 request/second
- Returns: display_name, lat, lon
- Called from client-side in the profile creation wizard

---

## 14. Notification System

### Types

| Type | Icon | Color | Trigger |
|------|------|-------|---------|
| message | MessageSquare | Blue | New chat message |
| feedback | Star | Copper | Feedback submitted |
| transaction | Zap | Green | Transaction status change |
| info | Info | Gray | General notification |

### Delivery Pipeline

1. API route creates notification in DB (INSERT INTO notifications)
2. API route calls triggerNotification() via Ably
3. Ably delivers to user-{userId} channel
4. Client's NotificationBell receives real-time update
5. Badge count updates immediately (no page reload needed)

### Deep Linking

Clicking a notification with reference_type: 'chat' navigates to /messages?chatId={id}, which auto-opens that specific chat in the messages page.

### Storage

Notifications are stored in the notifications table. Limited to 50 most recent per user. No pagination implemented yet.

---

## 15. Error Handling & Game

### Error Pages

All 3 error boundaries now include the Fruit Basket game:

| Page | When Shown | Game |
|------|-----------|------|
| not-found.tsx | 404 errors | FruitGame |
| error.tsx | Route-level errors | FruitGame |
| global-error.tsx | Critical app errors | FruitGame |

### FruitGame (src/components/fruit-game.tsx — 257 lines)

A mini game where users catch falling fruits in a basket.

**Gameplay**:
- Fruits (apple, orange, lemon, grapes, watermelon, strawberry, etc.) fall from the top
- Player moves a basket (left/right) using arrow keys, WASD, or touch/swipe
- Catching a fruit = +1 score
- Missing a fruit = -1 life (3 lives total)
- Game gets harder as score increases (faster fruits, more fruits at once)

**Screens**:
1. **Start**: Shows fruit emojis, "Start Game" button
2. **Playing**: Score bar, lives (hearts), game canvas, controls hint
3. **Game Over**: Final score, high score indicator, "Play Again" / "Exit" buttons

**Storage**: High score saved to localStorage

### Design Philosophy

Instead of scary red error icons, we show a fun game. The idea: "Something went wrong? Play a game while you wait." Each error page also has a subtle "Back to Dashboard" or "Try Again" link below the game.

---

## 16. Design System & Brand

### Color Palette

**Primary — Brand (Muted Basil Green)**:
- brand-50: #f0f4eb (lightest)
- brand-500: #6ab864 (main buttons)
- brand-600: #559650 (active/hover)
- brand-700: #457841 (headers)
- brand-950: #1e2e1a (darkest)

**Accent — Copper (Warm Orange)**:
- copper-50: #fdf6ef (lightest)
- copper-400: #D4874D (highlights, badges)
- copper-900: #67311e (darkest)

**Neutral — Warm Gray**:
- neutral-50: #F8F7F4 (lightest)
- neutral-100: #F1F0EC
- neutral-200: #E5E4E0
- neutral-300: #D4D2CE
- neutral-400: #A8A6A2
- neutral-500: #7C7A76
- neutral-600: #5A5854
- neutral-700: #403E3A
- neutral-800: #2D2B28
- neutral-900: #1A1918
- neutral-950: #262422 (darkest)

**Semantic**:
- background-50: #F8F6F0 (warm white — page backgrounds)
- foreground-50: #2D3748 (charcoal — primary text)

### Design Rules

- Never raw text/UI — everything must be styled with proper typography
- Never display raw JSON or object dumps — always format for humans
- Error messages: user-friendly, actionable. Mix English/Swahili where natural (e.g., "Samahani, jaribu tena")
- Loading states: Skeleton screens or spinners, never blank areas
- Mobile-first: Thumb-friendly tap targets (min 44-48px), vertical scrolling
- Maps: Always interactive Leaflet maps, never static images
- All primary buttons: Muted basil green (brand-600), white text
- WCAG AA minimum contrast compliance

### Custom Tailwind Additions

- fontFamily: Inter + system fallbacks
- fontSize: 2xs (0.65rem)
- boxShadow: card, card-hover, elevated, bottom-nav
- borderRadius: 2xl (1rem), 3xl (1.25rem)
- animation: fade-in, slide-up, slide-in-right, pulse keyframes

---

## 17. Known Issues & Bugs

### Critical

1. **Upload API photo limit mismatch**: POST /api/upload validates max 3 images, but client allows 10. This means uploading 4-10 photos will fail server-side. Fix: update /api/upload/route.ts to allow 10.

### Moderate

2. **Distance calculation is approximate**: Dashboard uses Euclidean * 111 instead of Haversine formula. Acceptable for Nairobi but inaccurate for distant vendors.

3. **Photos stored as base64 in DB**: No image optimization, no CDN, large DB size. Works for MVP but not production.

4. **Contact form is client-side only**: alert() on submit, no actual email sending.

5. **WhatsApp phone number placeholder**: Contact page uses wa.me/254700000000 (not a real number).

6. **No image optimization**: All images served as raw base64 or external URLs without Next.js Image component.

7. **No error handling for missing env vars**: If DATABASE_URL is not set, pg Pool throws on first query with non-descriptive error.

### Minor

8. **not-found.tsx line 3**: useState imported but never used.

9. **FruitGame localStorage key has leading space**: ' Sokopay_fruit_high_score' — potential inconsistency.

10. **RoleToggle component unused**: src/components/role-toggle.tsx exists but is not imported anywhere.

11. **Brand name typo on landing page**: The code renders "SokkoPay" (double 'k') in some places — should be "Sokopay" or "SokoPay".

12. **No pagination for notifications**: Limited to 50 most recent, no "load more".

13. **Auth setup page complexity**: The useEffect in auth/setup has intendedRole as dependency which could cause re-renders if searchParams change.

---

## 18. Development Workflow

### Getting Started

1. Clone repo: `git clone https://github.com/linuxbyter/Sokopay.git`
2. Install: `npm install`
3. Copy .env.example to .env.local and fill in credentials
4. Run reset.sql in Neon SQL editor (for fresh DB)
5. Start dev: `npm run dev`
6. Open http://localhost:3000

### Development Server

```bash
npm run dev    # Starts Next.js dev server on port 3000
```

### Database Reset

1. Go to Neon SQL editor
2. Paste contents of src/lib/reset.sql
3. Run the SQL
4. All data wiped, tables recreated

### Testing Flow

1. Open app → Landing page
2. Click "Get Started" → Role selection
3. Select "Customer" → Clerk sign-in (create account or use existing)
4. After sign-in → /auth/setup stores role → redirects to /dashboard
5. Browse vendors → Click a vendor → View profile
6. Click "Message Vendor" → Chat opens → Send message
7. Switch to vendor role (sign out, sign in as vendor)
8. Create shop → View dashboard → Respond to messages

### Git Workflow

- Main branch: `main`
- Auto-deploys to Vercel on push
- Commit messages: lowercase, descriptive, no conventional commits format

### Key Commands

```bash
npm run dev          # Dev server
npm run build        # Production build
npm run lint         # ESLint
npm run db:setup     # Test DB connection
npx tsc --noEmit     # Type check (no output = clean)
```

---

## 19. Deployment

### Platform: Vercel

- Connected to GitHub repo (linuxbyter/Sokopay)
- Auto-deploys on push to main
- Environment variables set in Vercel dashboard

### Environment Variables on Vercel

Same as .env.local — set in Vercel project settings under "Environment Variables":
- DATABASE_URL
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
- ABLY_APP_ID
- ABLY_API_KEY
- NEXT_PUBLIC_ABLY_APP_ID
- NEXT_PUBLIC_ABLY_API_KEY

### Build Configuration

- Framework: Next.js
- Build command: next build
- Output: .next
- Node.js version: 20.x (Vercel default)

### Post-Deploy Checklist

1. Check Vercel build logs for errors
2. Visit the deployed URL
3. Test sign-in flow (customer + vendor)
4. Test vendor profile creation
5. Test chat flow (two browser tabs, different users)
6. Test notifications appear in real-time
7. Test error pages (navigate to /nonexistent-page)

---

## 20. Future Development Roadmap

### Short Term (Next Sprint)

1. Fix upload API photo limit (3 → 10)
2. Add Haversine distance calculation
3. Add pagination for notifications
4. Fix brand name typo ("SokkoPay" → "Sokopay")
5. Fix unused useState import in not-found.tsx
6. Add vendor profile picture upload/edit
7. Notification deep-link to relevant chat on click (partially done)
8. Add last message preview + unread count to chat list

### Medium Term (V1 Polish)

1. Implement proper image storage (Supabase Storage or Cloudflare R2)
2. Add image optimization (Next.js Image component)
3. Add Swahili/Sheng language support
4. Implement contact form backend (email sending)
5. Add service worker for offline caching
6. Add share-to-WhatsApp functionality
7. Add social sharing metadata (Open Graph)
8. Bundle size optimization (< 150KB JS target)

### Long Term (V2 Features)

1. Payment processing (M-Pesa integration)
2. Public reviews and ratings
3. Admin moderation dashboard
4. Vendor analytics dashboard
5. Multi-language support (Swahili, Sheng)
6. Push notifications (FCM/APNs)
7. Vendor subscription plans
8. Delivery tracking

---

## File Structure Reference

```
sokopay/
├── middleware.ts                 # Route protection (Clerk auth)
├── tailwind.config.ts           # Brand colors, shadows, animations
├── tsconfig.json                # TypeScript config (path alias @/*)
├── next.config.mjs              # Next.js config (empty)
├── package.json                 # Dependencies and scripts
├── .env.example                 # Environment variable template
├── .gitignore                   # Ignores node_modules, .next, .env*.local
├── public/
│   └── favicon.svg              # SVG favicon (green gradient)
├── src/
│   ├── app/
│   │   ├── page.tsx             # Landing page
│   │   ├── layout.tsx           # Root layout + ClerkProvider
│   │   ├── globals.css          # Tailwind imports
│   │   ├── error.tsx            # Error boundary + FruitGame
│   │   ├── not-found.tsx        # 404 page + FruitGame
│   │   ├── global-error.tsx     # Global error + FruitGame
│   │   ├── about/page.tsx       # About page
│   │   ├── contact/page.tsx     # Contact page
│   │   ├── support/page.tsx     # FAQ page
│   │   ├── messages/page.tsx    # Customer chat list
│   │   ├── auth/
│   │   │   ├── role/page.tsx    # Role selection
│   │   │   ├── login/
│   │   │   │   ├── customer/page.tsx
│   │   │   │   └── vendor/page.tsx
│   │   │   ├── setup/page.tsx   # Post-login routing
│   │   │   └── logout/route.ts
│   │   ├── dashboard/page.tsx   # Customer dashboard
│   │   ├── api/
│   │   │   ├── role/route.ts
│   │   │   ├── upload/route.ts
│   │   │   ├── vendors/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       └── stats/route.ts
│   │   │   ├── chats/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── messages/route.ts
│   │   │   │       └── status/route.ts
│   │   │   ├── feedback/route.ts
│   │   │   └── notifications/
│   │   │       ├── route.ts
│   │   │       ├── [id]/route.ts
│   │   │       └── read-all/route.ts
│   │   └── vendor/
│   │       ├── [id]/page.tsx    # Public vendor profile
│   │       ├── dashboard/page.tsx
│   │       ├── messages/page.tsx
│   │       └── profile/create/page.tsx
│   ├── components/
│   │   ├── chat-dialog.tsx      # Chat interface (521 lines)
│   │   ├── navbar.tsx           # Role-aware navbar
│   │   ├── notification-bell.tsx
│   │   ├── feedback-modal.tsx
│   │   ├── image-upload.tsx
│   │   ├── map-view.tsx         # Leaflet map
│   │   ├── mini-map.tsx         # Static Leaflet map
│   │   ├── fruit-game.tsx       # Error page game
│   │   ├── loading-spinner.tsx
│   │   ├── clerk-provider.tsx
│   │   ├── sign-out-button.tsx
│   │   ├── role-toggle.tsx      # Unused
│   │   └── ui/
│   │       └── button.tsx       # CVA Button
│   └── lib/
│       ├── db.ts                # Neon Postgres pool
│       ├── ably.ts              # Server Ably
│       ├── ably-client.ts       # Client Ably
│       ├── setup-db.ts          # DB test script
│       ├── schema.sql           # Full schema
│       ├── reset.sql            # Full reset SQL
│       ├── cleanup.sql          # Data cleanup SQL
│       └── utils/index.ts       # cn(), formatCurrency(), etc.
```

---

## Summary Statistics

| Directory | File Count | Total Lines |
|-----------|-----------|-------------|
| src/app/ (pages) | 15 files | ~2,300 lines |
| src/app/api/ (routes) | 10 files | ~675 lines |
| src/components/ | 13 files | ~1,775 lines |
| src/lib/ | 8 files | ~570 lines |
| Root config files | 8 files | ~350 lines |
| **Total** | **54 files** | **~5,670 lines** |

---

*This document was generated as a codebase handoff for Claude or any AI assistant continuing development on Sokopay. Last updated: June 2026.*
