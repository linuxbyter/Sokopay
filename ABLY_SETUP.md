# Ably Setup Guide for SökoPay

## What SökoPay Is (for Ably signup)

**App description:**
SökoPay is a mobile-first marketplace connecting customers with local vendors in Kenya. Users receive real-time notifications when:
- A customer messages a vendor about a product or service
- A vendor replies to a customer
- Transaction status updates (payment confirmed, order dispatched, order served)
- Feedback is left after a completed transaction

Think of it like WhatsApp-style notifications — real-time alerts when someone messages you or an order status changes. No stock feeds or price updates, just direct person-to-person messaging and transaction updates.

**Category:** E-commerce / Marketplace
**Platform:** Web (Next.js, mobile-first)
**Expected users:** 1,000+ (Kenya MVP)

---

## Step-by-Step Ably Setup

### 1. Create Account
- Go to https://ably.com/signup
- Sign up with email (free tier: 6M messages/month, 100 connections)

### 2. Create App
- App name: `SökoPay`
- Region: `eu-west-1` (closest to Kenya)

### 3. Get Keys
- Go to Dashboard → App → API Keys
- Create a new key with these capabilities:
  - Publish (for sending notifications)
  - Subscribe (for receiving notifications)
  - Presence (optional, for online status)

### 4. Copy Keys to .env.local
```
ABLY_APP_ID=your_app_id
ABLY_API_KEY=your_api_key
NEXT_PUBLIC_ABLY_APP_ID=your_app_id
NEXT_PUBLIC_ABLY_API_KEY=your_api_key
```

### 5. Update Code
Replace Pusher references with Ably in:
- `src/lib/pusher.ts` → `src/lib/ably.ts`
- `src/lib/pusher-client.ts` → `src/lib/ably-client.ts`
- All API routes that call `triggerNotification()`
- `src/components/notification-bell.tsx`

---

## What Users See (Real-Time Flow)

### Customer Perspective:
1. Customer taps "Message Vendor" on a barber's profile
2. Chat opens, customer types "Do you have appointments today?"
3. **Vendor gets INSTANT notification** (bell icon pulses red)
4. Vendor opens messages, sees the new chat, replies
5. **Customer gets INSTANT notification** of the reply
6. After the haircut, customer taps "Mark as Paid"
7. **Vendor gets INSTANT notification** — "Payment marked by customer"
8. Vendor taps "Confirm Payment"
9. **Customer gets INSTANT notification** — "Payment confirmed by vendor"

### Vendor Perspective:
1. Vendor opens dashboard, sees notification bell with "3" badge
2. Taps bell — sees:
   - "New message" from Faith W. (2m ago)
   - "Payment marked by customer" from John K. (5m ago)
   - "Feedback received from customer" from Mary N. (1h ago)
3. Taps any notification → opens the relevant chat
4. Bell badge clears

### The notification panel looks like:
```
┌─────────────────────────────┐
│ Notifications      Mark all read │
├─────────────────────────────┤
│ 💬 New message                    │
│    Faith W.                      │
│    Do you have appointments...   │
│    2m ago                  ●     │
├─────────────────────────────┤
│ ⚡ Payment marked by customer     │
│    John K.                       │
│    Haircut service - KES 500     │
│    5m ago                        │
├─────────────────────────────┤
│ ⭐ Feedback received              │
│    Mary N.                       │
│    ★★★★★                         │
│    1h ago                        │
└─────────────────────────────┘
```

The "●" dot means unread. Tapping marks it as read.
