# SökoPay Development Plan
## Digital Operating Layer for Kenya's Informal Economy
### Vision: Premium, trustworthy platform connecting customers with local vendors/services through self-serve profiles, in-app chat, and location-based discovery.

## Core Principles
1. **Mobile-first, real-world usability** - Designed for intermittent connectivity, low-end devices
2. **Trust through transparency** - Verifiable freshness signals, not opaque scores
3. **Vendor empowerment** - Self-curated profiles, zero fees for basic listing
4. **Ecosystem over directory** - In-app chat enables transactions within platform
5. **Kenya-native experience** - Local terminology, Swahili/Sheng support where relevant
6. **Premium aesthetic** - White + muted basil green theme, no raw text/UI

## MVP Feature Set (All Included)
### Vendor Side
- **Profile Creation Flow**
  - Business name (required)
  - Category selector (primary + secondary from defined list)
  - Location: Address search + manual pin adjustment (OSM/Leaflet)
  - Hours: Open/closed toggle + time picker (Mon-Sun)
  - Media: 3 photo uploads (client-side compression)
  - Services: Free-text list with pricing hints
  - Contact: WhatsApp number (primary, auto-formatted) + optional phone
- **Profile View**
  - Responsive grid: Photo | Name | Category | Distance | "Open now" badge
  - Full profile: Gallery slider | Service list | Hours | Contact info
  - Trust signals: Last updated, photo age, area tenure, response rate
  - Interactive map: Vendor pin + user location (if shared) with distance
- **In-App Chat**
  - Persistent chat entry from profile
  - Real-time messaging (Supabase Realtime)
  - Message bubbles: Vendor (basil tint), Customer (white)
  - Timestamps, sender avatars (initials), typing awareness, read receipts
  - Transaction confirmation: "Mark as Paid"/"Mark as Served" buttons
- **Feedback System**
  - Dual prompt after "Mark as Served":
    - Customer: Star rating + optional feedback
    - Vendor: Transaction rating + optional notes
  - Private storage (V1), later aggregated for public display

### Customer Side
- **Discovery Experience**
  - Search bar: "What do you need? (e.g., sukuma wiki, haircut, water)"
    - Matches vendor name, category, services text
  - Location detector: Browser geolocation → "Near you" badge
  - Category chips: Tap to filter (11 defined categories)
  - Vendor grid: Photo | Name | Category | Distance | Open status
  - Empty state: Helpful prompt to be first vendor in area
- **Map Integration**
  - Full-screen map view: "See all nearby vendors"
    - OSM tiles via Leaflet.js (~15KB)
    - Clustered markers for vendor density
    - Basil green custom markers
    - Tap marker → vendor profile
  - Mini-map on vendor profile showing relative location
- **Search & Filters**
  - Filter by: Category, Open Now, Has Photos, Rating ≥4 (placeholder)
  - Sort by: Distance, Rating (placeholder), Update recency
  - Swahili/Sheng term support in search (e.g., "mboga" → vegetable sellers)

### Technical Architecture
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS with custom color palette
  - Primary: Muted Basil Green (`#8A9A5B`)
  - Secondary: Warm White (`#F8F6F0`)
  - Text: Charcoal Gray (`#2D3748`)
  - Accents: Adaptive based on context
- **Database & Auth**: Supabase (free tier)
  - Auth: Phone number OTP (Twilio free trial)
  - Storage: Vendor photos (compressed client-side)
  - Realtime: Chat messaging
  - Tables: vendors, chats, messages, feedback
- **Mapping**: 
  - Geocoding: Nominatim (OSM) - free, no key for low volume
  - Display: Leaflet.js + OSM tiles
  - Nearby search: Haversine formula on vendor lat/lng
- **Performance**:
  - Image optimization: Client-side compression before upload
  - Lazy loading: Vendor photos, map tiles
  - Offline: Service worker for basic caching
  - Bundle target: <150KB JS on first load
- **Icons**: Lucide React (already configured)

## UI/UX Specifications (Non-Negotiable)
- **Theme Execution**:
  - All primary buttons: Muted basil green background, white text
  - Active states: Slightly darker basil green
  - Backgrounds: Warm white with subtle texture (not flat)
  - Text: Charcoal gray for primary, muted for secondary
  - Contrast: WCAG AA minimum (verified via audit)
- **Anti-Raw Text Rules**:
  - Never display raw JSON/object dumps
  - Error messages: User-friendly, actionable (in English/Swahili mix)
  - Loading states: Skeleton screens, spinners, or progress indicators
  - Empty states: Illustrated, helpful, brand-voiced
  - Text content: Always styled with intentional typography (weight, size, spacing)
- **Map Requirements**:
  - Never static image only - always interactive Leaflet map
  - Custom marker icons (basil green variant of default)
  - Smooth pan/zoom, touch-friendly controls
  - Distance calculations displayed prominently
  - Cluster markers when vendors overlap at current zoom
- **Mobile-First Details**:
  - Thumb-friendly tap targets (min 48x48px)
  - Vertical scrolling only where appropriate
  - Keyboard-aware layouts (no hidden inputs)
  - FastTap suppression where needed
  - Portrait orientation lock consideration for specific flows

## Development Chunks (Logical Work Units)
*Ordered for incremental value delivery. Work in parallel where possible.*

### Chunk 1: Foundation & Auth (COMPLETE)
- Project setup verification (Next.js, TS, Tailwind)
- Custom color palette in `tailwind.config.ts`
- Supabase project initialization
- Auth flow: Switched to Clerk authentication (phone OTP via Clerk)
- Auth context/provider replaced with Clerk's built-in auth
- Protected routes middleware (Next.js middleware.ts) updated for Clerk
- Real Supabase project + `.env.local` with credentials (for database only)
- Fixed `handleResend` bug in verify page (replaced with Clerk's SignIn component)
- Converted auth routes to catch-all for Clerk compatibility
- Added `routing="hash"` to Clerk SignIn components
- Created separate public landing page ('/') and customer dashboard ('/dashboard')
- Middleware redirects authenticated users to '/dashboard' after login
- **Output**: Secure login/signup with Clerk, working auth state, separated public landing and authenticated dashboard

### Chunk 2: Vendor Profile System (NOT STARTED)
- Profile creation multi-step form (all 7 steps)
- Client-side image compression & preview
- Location picker: Address search + manual OSM pin adjustment
- Hours selector component (open/closed + time picker)
- Services textarea with character counter/hint
- Contact input with auto-formatting (+254)
- Profile view page displaying all entered data
- **Output**: Vendors can create and view complete profiles

### Chunk 3: Customer Discovery & Maps (IN PROGRESS)
- Home page layout with search bar, location detector
- Category chips component (tap to filter)
- Vendor card component (photo, name, category, distance, open badge)
- Vendor grid rendering with search/filter logic
- Mini-map on vendor profile (Leaflet, vendor pin + user location)
- Full-screen map page: "See all nearby vendors"
  - Clustered markers
  - Tap-to-profile navigation
  - Legend/filter controls
- **Output**: Customers can discover vendors by location/category, see on map

### Chunk 4: In-App Chat Engine
- Chat collection schema in Supabase
- Realtime subscription setup
- Chat UI: Message bubbles, avatars, timestamps
- Message sending/receiving with optimistic update
- Typing awareness indicator
- Read receipts (last seen timestamps)
- Chat entry point from vendor profile
- Transaction confirmation buttons ("Mark as Paid"/"Mark as Served")
- **Output**: Real-time, contextual chat between vendor/customer

### Chunk 5: Feedback & Trust Layer
- Feedback storage schema (private for V1)
- Post-service dual prompt triggered by "Mark as Served"
- Star rating component (1-5)
- Optional text feedback fields
- Trust signal calculations:
  - Profile freshness (last updated)
  - Photo freshness (last upload)
  - Area tenure (profile creation date)
  - Response rate (avg chat reply time)
- Trust signal display on vendor profile
- **Output**: Feedback collection + observable trust indicators

### Chunk 6: Polish, Performance & Launch
- Theme application: All colors, spacing, typography
- Performance audit:
  - Image optimization verification
  - Lazy loading implementation
  - Bundle analysis (<150KB JS target)
  - Service worker setup for offline caching
- Edge case handling:
  - Empty/loading/error states
  - Connection retry logic
  - Swahili/Sheng error messages where appropriate
  - Power loss resilience (optimistic UI)
- Launch preparation:
  - Vendor onboarding guide (visual)
  - Share-to-WhatsApp functionality
  - Metadata for social sharing
- **Output**: Production-ready, polished MVP

## Validation Checkpoints (Build-Measure-Learn)
*Run after each chunk to ensure direction*

1. **After Chunk 1**: 
    - Can users sign up/sign in with phone OTP via Clerk?
    - Is auth state persisting correctly (checked via middleware and client)?
    - Are protected routes properly secured (redirecting unauthenticated users to login)?
    - Is the public landing page ('/') accessible without authentication?
    - Is the customer dashboard ('/dashboard') accessible only after authentication?

2. **After Chunk 2**:
   - Do vendor profiles capture all required data accurately?
   - Are images uploading/compressing correctly?
   - Is location saving as lat/lng + address?

3. **After Chunk 3**:
   - Can customers find vendors by location/search?
   - Does map show correct vendor positions?
   - Is distance calculation accurate?
   - Does filtering work as expected?

4. **After Chunk 4**:
   - Is chat delivering messages in <2s?
   - Do transaction buttons trigger correctly?
   - Is typing awareness working?
   - Are messages persisting on refresh?

5. **After Chunk 5**:
   - Is feedback being stored after service completion?
   - Are trust signals calculating/displaying correctly?
   - Is UI not overwhelmed by signal display?

## Critical Constraints & Guardrails
- **Zero payment processing** in V1 (manual confirmation only)
- **No vendor fees** for basic listing (build supply through value)
- **Admin moderation deferred** to V2 (start with vendor self-service + customer reporting)
- **Review display deferred** to V2 (start with private feedback → public aggregation)
- **Search relevance**: Prioritize exact/fuzzy match over complex ranking for V1
- **Image limits**: Strict 3 photo max for vendor profiles (performance)
- **Chat limits**: Text-only for V1 (no media to prevent abuse/spam)
- **Location accuracy**: Allow landmark-based addresses but store precise lat/lng
- **Offline first**: Critical functions work with cached data when disconnected

## Kenya-Specific Execution Notes
- **Terminology**: Use provided category names exactly (Mama BaBa Mboga, Maasai Shop, etc.)
- **Language**: 
  - Primary interface: English
  - Error/help text: Mix English/Swahili where natural (e.g., "Samahani, jaribao tena")
  - Search: Normalize Swahili terms (e.g., "mboga" matches vegetable sellers)
- **Connectivity**: 
  - Assume 2G/3G common - prioritize text over images
  - Show text placeholders while assets load
  - Cache last successful state aggressively
- **Power**: Optimistic UI updates (send chat immediately, sync in background)
- **Trust**: Focus on observable, hard-to-fake signals (update recency, photo freshness)
- **Discovery**: Leverage existing WhatsApp groups for vendor sharing at launch

## Definition of Done for MVP
A vendor and customer can:
1. Complete profile/signup in <2 minutes
2. Discover nearby vendors by location/category/search
3. View vendor profile with photos, services, hours, location on map
4. Engage in real-time chat to confirm availability/pricing
5. Complete transaction outside app (M-Pesa/cash)
6. Confirm transaction in app ("Mark as Paid"/"Served")
7. Receive and submit dual feedback prompts
8. See trust signals based on verifiable profile activity

This plan delivers a premium, functional marketplace core in compressed timeline through ruthless prioritization, technical leverage of free tiers, and focus on the human connection problem rather than building a generic directory.

---
*Ready to execute. Next step: Begin with Chunk 1 (Foundation & Auth).*