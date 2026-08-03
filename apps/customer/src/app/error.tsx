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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        <h1 className="text-5xl font-bold text-copper-400 mb-2">Oops!</h1>
        <h2 className="text-lg font-semibold text-text-primary mb-1">Something went wrong</h2>
        <p className="text-text-secondary text-sm mb-2">
          Samahani! An unexpected error occurred.
        </p>
        {error.digest && (
          <p className="text-xs text-text-tertiary mb-4">Error ID: {error.digest}</p>
        )}

        <FruitGame onExit={reset} />

        <div className="flex gap-3 mt-6 justify-center">
          <button
            onClick={reset}
            className="text-sm text-primary hover:text-primary-hover font-medium"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-text-secondary hover:text-text-primary font-medium"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
