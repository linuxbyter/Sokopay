'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FruitGame from '@/components/fruit-game';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        <h1 className="text-5xl font-bold text-brand-600 mb-2">404</h1>
        <h2 className="text-lg font-semibold text-neutral-900 mb-1">Page not found</h2>
        <p className="text-neutral-500 text-sm mb-6">
          Samahani! This page doesn&apos;t exist. While you wait, try catching some fruits 🍎
        </p>

        <FruitGame onExit={() => router.push('/dashboard')} />

        <button
          onClick={() => router.push('/dashboard')}
          className="mt-6 text-sm text-brand-600 hover:text-brand-700 font-medium"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
