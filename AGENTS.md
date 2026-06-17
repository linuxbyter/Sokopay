# AGENTS.md — SökoPay Project Context

## What Is SökoPay?

SökoPay is a **digital operating layer for Kenya's informal economy** — a mobile-first web app that connects customers with nearby local vendors and service providers. Think of it as a premium, trustworthy marketplace for the kinds of businesses that don't have websites: vegetable sellers, barbers, water vendors, gas refillers, butcheries, laundries, kiosks, and eateries.

**Brand**: SökoPay (always with ö — trademark concern, never "SokoPay")
**Market**: Kenya — Nairobi-first, designed for intermittent connectivity and low-end devices
**Stack**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase + Leaflet.js
**Budget**: Zero. Free tiers only. Supabase free tier, Vercel hosting, OSM/Nominatim geocoding.
**V1 Constraint**: No payment processing. Transactions happen offline (M-Pesa/cash). App only provides "Mark as Paid" / "Mark as Served" manual confirmation buttons.

---

## The 11 Vendor Categories (Use These Exact Names)

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

## Architecture & Tech Decisions

| Concern | Decision | Why |
|---------|----------|-----|
| Framework | Next.js 14 App Router + TypeScript | SSG/SSR, file-based routing, Vercel-native |
| Styling | Tailwind CSS with custom palette | Utility-first, no runtime CSS cost |
| Auth | Phone OTP via Supabase (+254 prefix) | Kenya-native — everyone has a phone, not email |
| Database | Supabase (Postgres) | Free tier, realtime, storage, auth in one |
| Maps | Leaflet.js + OSM tiles | Free, no API key, lightweight (~15KB) |
| Geocoding | Nominatim (OSM) | Free for low volume, no key needed |
| Chat | Supabase Realtime | WebSocket-based, free tier covers MVP |
| Images | Client-side compression → Supabase Storage | 3 photo max per vendor, compressed before upload |
| State | React Context (not Zustand) | Minimal global state needs for V1 |
| Icons | Lucide React | Already installed, tree-shakeable |

---

## Brand & Design System

### Color Palette (in `tailwind.config.ts`)

**Primary — Brand (Muted Basil Green):**
- `brand-50` `#f0f4eb` → `brand-950` `#1e2e1a`
- Key shades: `brand-500` `#6ab864` (buttons), `brand-600` `#559650` (active/hover), `brand-700` `#457841` (headers)

**Accent — Copper (Warm Orange):**
- `copper-50` `#fdf6ef` → `copper-900` `#67311e`
- Key shade: `copper-400` `#D4874D` (highlights, badges)

**Neutral — Warm Gray:**
- `neutral-50` `#F8F7F4` → `neutral-950` `#262422`

**Semantic:**
- `background` `#F8F6F0` (Warm White — page backgrounds)
- `foreground` `#2D3748` (Charcoal Gray — primary text)

### Design Rules (Non-Negotiable)
- **Never raw text/UI** — everything must be intentionally styled with proper typography (weight, size, spacing, color)
- **Never display raw JSON or object dumps** — always format data for human consumption
- **Error messages** — User-friendly, actionable. Mix English/Swahili where natural (e.g., "Samahani, jaribu tena")
- **Loading states** — Skeleton screens or spinners, never blank areas
- **Empty states** — Illustrated, helpful, brand-voiced (not just "No data")
- **Mobile-first** — Thumb-friendly tap targets (min 48x48px), vertical scrolling, keyboard-aware layouts
- **Maps** — Always interactive Leaflet maps, never static images only
- **All primary buttons** — Muted basil green background (`brand-600`), white text
- **WCAG AA** minimum contrast compliance

### Custom Tailwind Additions
- `fontFamily`: Inter + system fallbacks
- `fontSize`: `2xs` for micro-text
- `boxShadow`: `card`, `card-hover`, `elevated`, `bottom-nav`
- `borderRadius`: `2xl`, `3xl` overrides
- `animation`: `fade-in`, `slide-up`, `slide-in-right`, `pulse` keyframes

---

## Current Implementation Status

### What's Built (Chunk 1 — Foundation & Auth: ~70% Complete)

| File | What It Does | Status |
|------|-------------|--------|
| `src/app/page.tsx` | Landing page: header, hero/search bar, 11 category chips, placeholder vendor grid, footer | **Done** (was corrupted, now fixed) |
| `src/app/layout.tsx` | Root layout with AuthProvider wrapper, global CSS import | **Done** |
| `src/app/globals.css` | Tailwind base/components/utilities imports | **Done** |
| `src/app/about/page.tsx` | Simple about page with description and back link | **Done** (placeholder) |
| `src/app/auth/login/page.tsx` | Phone number input form → sends OTP via Supabase | **Done** |
| `src/app/auth/verify/page.tsx` | 6-digit OTP verification form with resend | **Done** (has `handleResend` bug — calls `useAuth()` inside event handler, violates React hooks rules) |
| `src/app/auth/logout/route.ts` | POST API route → calls `supabase.auth.signOut()` | **Done** |
| `src/lib/auth/auth-context.tsx` | AuthProvider: `user`, `loading`, `login()`, `verifyOtp()`, `logout()`, auto +254 prefix, auth state listener | **Done** |
| `src/lib/supabase.ts` | Supabase client initialized from env vars | **Done** |
| `src/lib/utils/index.ts` | Utilities: `cn()`, `formatCurrency()` (KES), `formatDate()` (relative), `formatOrderStatus()`, `getStatusColor()`, `getInitials()`, `generateId()`, `truncate()` | **Done** |
| `src/components/ui/button.tsx` | CVA Button: 6 variants, 3 sizes, `loading` spinner, `fullWidth` prop | **Done** |
| `tailwind.config.ts` | Full brand color palette (brand, copper, neutral, background, foreground), shadows, animations, fonts | **Done** |
| `.env.example` | Template for `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `TWILIO_*` | **Done** |
| `.gitignore` | Ignores `node_modules`, `.next`, `.env*.local`, `tsconfig.tsbuildinfo` | **Done** |

### What's NOT Built Yet

- **Protected routes middleware** — there's no Next.js middleware checking auth state
- **Supabase project** — no real project/credentials yet (`.env.local` does not exist)
- **Vendor profile creation** — the multi-step form (Chunk 2)
- **Vendor profile display** — the full vendor page (Chunk 2)
- **Customer discovery** — search/filter/sort with real data (Chunk 3)
- **Map integration** — Leaflet is not installed yet, no map views (Chunk 3)
- **In-app chat** — no chat UI or Supabase Realtime subscriptions (Chunk 4)
- **Feedback system** — no star ratings, trust signals, or dual prompts (Chunk 5)
- **Polish & performance** — no service worker, no bundle optimization, no Swahili i18n (Chunk 6)

### Known Bugs
1. **`src/app/auth/verify/page.tsx`** — `handleResend` calls `useAuth()` inside a click handler instead of at the top of the component. This violates React hooks rules and will crash at runtime. Fix: call `useAuth()` at component top level, use the returned `login` function inside `handleResend`.

---

## Development Plan (Chunks)

**Source of truth: [`.opencode/plans/PLAN.md`](./.opencode/plans/PLAN.md) — READ IT BEFORE MAKING ANY CHANGES.**

The plan has 6 development chunks. We are partway through Chunk 1.

### Chunk 1: Foundation & Auth (IN PROGRESS — ~70%)
- [x] Next.js + TypeScript + Tailwind setup verified
- [x] Custom color palette in tailwind.config.ts
- [x] Supabase client initialized (`src/lib/supabase.ts`)
- [x] Auth flow: Phone input → OTP verification → session handling
- [x] Auth context/provider for auth state (`src/lib/auth/auth-context.tsx`)
- [ ] Protected routes middleware (Next.js middleware.ts)
- [ ] Real Supabase project + `.env.local` with credentials
- [ ] Fix `handleResend` bug in verify page
- **Output**: Secure login/signup, working auth state

### Chunk 2: Vendor Profile System (NOT STARTED)
- Profile creation multi-step form (7 steps: name, category, location, hours, photos, services, contact)
- Client-side image compression & preview (3 photo max)
- Location picker: Nominatim address search + manual OSM pin adjustment
- Hours selector: open/closed toggle + time picker (Mon-Sun)
- Services: free-text list with character counter
- Contact: WhatsApp number auto-formatted (+254) + optional phone
- Profile view page: gallery slider, service list, hours, contact, mini-map
- **Output**: Vendors can create and view complete profiles

### Chunk 3: Customer Discovery & Maps (NOT STARTED)
- Install `leaflet` + `react-leaflet` + `@types/leaflet`
- Home page: search bar, browser geolocation, "Near you" badge
- Category chips → tap to filter vendor results
- Vendor card component: photo, name, category, distance, "Open now" badge
- Vendor grid with search/filter/sort (by distance, category, open status)
- Full-screen map page: Leaflet + OSM tiles, custom basil green markers, clustered markers
- Mini-map on vendor profile page
- Haversine distance calculation from user lat/lng to vendor lat/lng
- **Output**: Customers can discover vendors by location/category/search, see on map

### Chunk 4: In-App Chat Engine (NOT STARTED)
- Supabase tables: `chats`, `messages` with realtime subscriptions
- Chat UI: message bubbles (vendor = basil tint, customer = white), initials avatars, timestamps
- Optimistic message sending with background sync
- Typing awareness indicator
- Read receipts (last seen timestamps)
- Chat entry point from vendor profile page
- Transaction confirmation: "Mark as Paid" / "Mark as Served" buttons in chat
- **Output**: Real-time, contextual chat between vendor/customer

### Chunk 5: Feedback & Trust Layer (NOT STARTED)
- Supabase table: `feedback` (private storage in V1)
- Post-service dual prompt triggered by "Mark as Served"
- Star rating component (1-5) for customer side
- Transaction rating + optional notes for vendor side
- Trust signal calculations: profile freshness, photo freshness, area tenure, response rate
- Trust signal display on vendor profile cards and pages
- **Output**: Feedback collection + observable trust indicators

### Chunk 6: Polish, Performance & Launch (NOT STARTED)
- Theme audit: all pages use brand palette consistently
- Performance: image optimization, lazy loading, bundle analysis (<150KB JS target)
- Service worker for offline caching of critical data
- Edge cases: empty/loading/error states, connection retry, Swahili/Sheng error messages
- Power loss resilience with optimistic UI
- Vendor onboarding visual guide
- Share-to-WhatsApp functionality
- Social sharing metadata
- **Output**: Production-ready, polished MVP

---

## Database Schema (To Be Implemented in Supabase)

When Supabase project is created, these tables need to be set up:

```sql
-- Vendors table
vendors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  business_name text not null,
  category primary text not null,    -- one of 11 categories
  category_secondary text,            -- optional second category
  description text,
  address text,
  latitude numeric,
  longitude numeric,
  hours jsonb,                         -- { mon: { open: "08:00", close: "18:00", closed: false }, ... }
  services jsonb,                      -- [{ name: "Haircut", price_hint: 300 }, ...]
  whatsapp text,                       -- primary contact, +254 format
  phone text,                          -- optional secondary
  photos text[] default '{}',          -- up to 3 Supabase Storage URLs
  is_open boolean default false,
  last_updated timestamptz default now(),
  created_at timestamptz default now()
)

-- Chats table
chats (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references vendors not null,
  customer_id uuid references auth.users not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
)

-- Messages table
messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references chats not null,
  sender_id uuid references auth.users not null,
  content text not null,
  created_at timestamptz default now(),
  read_at timestamptz
)

-- Feedback table (private in V1)
feedback (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references chats,
  vendor_id uuid references vendors not null,
  customer_id uuid references auth.users not null,
  rating integer check (rating between 1 and 5),
  transaction_rating integer check (transaction_rating between 1 and 5),
  comment text,
  vendor_notes text,
  created_at timestamptz default now()
)

-- Enable Row Level Security on all tables
-- Enable Realtime on messages table
```

---

## Environment Variables Required

Copy `.env.example` to `.env.local` and fill in real values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
# Optional for server-side operations:
# TWILIO_ACCOUNT_SID=AC...
# TWILIO_AUTH_TOKEN=...
# TWILIO_VERIFY_SERVICE_SID=VA...
```

**Current status**: `.env.local` does NOT exist. App will crash on any Supabase call. User needs to create a Supabase project first.

---

## File Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page (hero, search, categories, vendor grid, footer)
│   ├── layout.tsx            # Root layout with AuthProvider
│   ├── globals.css           # Tailwind imports
│   ├── about/
│   │   └── page.tsx          # Placeholder about page
│   └── auth/
│       ├── login/page.tsx    # Phone number input → send OTP
│       ├── verify/page.tsx   # 6-digit OTP verification (BUG: handleResend)
│       └── logout/route.ts   # POST → sign out
├── components/
│   └── ui/
│       └── button.tsx        # CVA Button (6 variants, loading, fullWidth)
└── lib/
    ├── auth/
    │   └── auth-context.tsx  # AuthProvider (login, verifyOtp, logout, user state)
    ├── supabase.ts           # Supabase client init
    └── utils/
        └── index.ts          # cn(), formatCurrency(), formatDate(), etc.
```

---

## Critical Constraints (Read Before Coding)

1. **Zero payment processing** — V1 only has manual "Mark as Paid"/"Mark as Served" buttons. Never add Stripe, Paystack, or any payment gateway.
2. **No vendor fees** — Basic listing is free forever. Build supply through value.
3. **No admin moderation** — Deferred to V2. V1 relies on vendor self-service + customer reporting.
4. **No public reviews** — V1 stores feedback privately. Public aggregation comes in V2.
5. **3 photo max** — Strict limit for vendor profiles. Enforce client-side before upload.
6. **Text-only chat** — No media messages in V1 (prevents abuse/spam, saves bandwidth).
7. **Offline-first mindset** — Optimistic UI, cache last successful state, handle 2G/3G gracefully.
8. **Brand name** — Always "SökoPay" with ö. Never "SokoPay" or "SOKOPAY".
9. **Category names** — Use exact names from the plan (Mama/Baba Mboga, Maasai Shop, etc.). Never rename or abbreviate.
10. **Follow PLAN.md** — Don't improvise features or deviate from the plan. If unsure, check the plan first.

---

## Kenya-Specific Notes

- **Phone format**: +254 prefix, 9-digit local number (e.g., +254712345678)
- **Currency**: Kenyan Shilling (KES), format as "KES 1,500" or "KSh 1,500"
- **Language**: English primary UI, Swahili/Sheng in error messages and search normalization (e.g., "mboga" → vegetable sellers)
- **Connectivity**: Assume 2G/3G common — prioritize text over images, use text placeholders while assets load
- **Power**: Optimistic UI updates (send chat immediately, sync in background) for power-loss resilience
- **Trust**: Focus on observable, hard-to-fake signals (update recency, photo freshness, area tenure, response rate) — not opaque algorithmic scores
- **Discovery**: WhatsApp groups are the existing distribution channel for vendor sharing at launch

---

## Next Steps (Priority Order)

1. **Fix `handleResend` bug** in `src/app/auth/verify/page.tsx` — move `useAuth()` call to component top level
2. **Create Supabase project** — user needs to set up account, get URL + anon key, create `.env.local`
3. **Add Next.js middleware** for protected route checking
4. **Install Leaflet** — `npm install leaflet react-leaflet @types/leaflet` (needed for Chunk 2 location picker and Chunk 3 maps)
5. **Begin Chunk 2: Vendor Profile System** — multi-step form, image compression, location picker, hours selector, profile view
6. **Create Supabase database tables** — vendors, chats, messages, feedback (schema above)
7. **Chunk 3: Customer Discovery & Maps** — search, filter, vendor cards, full-screen map
8. **Chunk 4: In-App Chat** — Supabase Realtime, message UI, transaction buttons
9. **Chunk 5: Feedback & Trust** — ratings, trust signals
10. **Chunk 6: Polish & Launch** — performance, offline, Swahili i18n, production readiness

---

## Validation Checklist (After Each Chunk)

- **Chunk 1**: Can users sign up with phone OTP? Auth state persisting? No security holes?
- **Chunk 2**: Vendor profiles capture all data? Images upload/compress? Location saves as lat/lng?
- **Chunk 3**: Customers find vendors by location/search? Map shows correct positions? Distance accurate?
- **Chunk 4**: Chat delivers in <2s? Transaction buttons work? Typing awareness? Messages persist on refresh?
- **Chunk 5**: Feedback stored after service? Trust signals calculating/displaying correctly? UI not overwhelmed?
