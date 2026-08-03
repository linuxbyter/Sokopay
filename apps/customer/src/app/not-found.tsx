'use client';

import { useRouter } from 'next/navigation';
import FruitGame from '@/components/fruit-game';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        <h1 className="text-5xl font-bold text-primary mb-2">404</h1>
        <h2 className="text-lg font-semibold text-text-primary mb-1">Page not found</h2>
        <p className="text-text-secondary text-sm mb-6">
          Samahani! This page doesn&apos;t exist. While you wait, try the fruit catching game below.
        </p>

        <FruitGame onExit={() => router.push('/dashboard')} />

        <button
          onClick={() => router.push('/dashboard')}
          className="mt-6 text-sm text-primary hover:text-primary-hover font-medium"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
