'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const arr = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) arr[i] = rawData.charCodeAt(i);
  return arr.buffer;
}

export default function PushManager() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    if (!VAPID_PUBLIC_KEY) return;

    const setup = async () => {
      try {
        // Register SW
        const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        await navigator.serviceWorker.ready;

        // Don't prompt if already denied
        if (Notification.permission === 'denied') return;

        // Request permission if not yet decided
        if (Notification.permission !== 'granted') {
          const result = await Notification.requestPermission();
          if (result !== 'granted') return;
        }

        // Check if already subscribed
        const existing = await registration.pushManager.getSubscription();
        if (existing) {
          // Re-sync to server in case it expired
          await syncSubscription(existing);
          return;
        }

        // Subscribe
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });

        await syncSubscription(subscription);
      } catch (err) {
        // Silent — don't break the app if push setup fails
        console.warn('Push setup failed:', err);
      }
    };

    setup();
  }, [isLoaded, user?.id]);

  return null;
}

async function syncSubscription(subscription: PushSubscription) {
  const json = subscription.toJSON();
  await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      endpoint: json.endpoint,
      keys: { p256dh: json.keys?.p256dh, auth: json.keys?.auth },
    }),
  }).catch(() => {});
}
