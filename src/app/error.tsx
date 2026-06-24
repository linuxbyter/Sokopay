'use client';

import { useRouter } from 'next/navigation';
import FruitGame from '@/components/fruit-game';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        <h1 className="text-5xl font-bold text-copper-500 mb-2">Oops!</h1>
        <h2 className="text-lg font-semibold text-neutral-900 mb-1">Something went wrong</h2>
        <p className="text-neutral-500 text-sm mb-2">
          Samahani! An unexpected error occurred.
        </p>
        {error.digest && (
          <p className="text-xs text-neutral-400 mb-4">Error ID: {error.digest}</p>
        )}

        <FruitGame onExit={reset} />

        <div className="flex gap-3 mt-6 justify-center">
          <button
            onClick={reset}
            className="text-sm text-brand-600 hover:text-brand-700 font-medium"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-neutral-500 hover:text-neutral-700 font-medium"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
