'use client';

import { SignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function CustomerLoginPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-6">
      <button
        onClick={() => router.push('/auth/role')}
        className="absolute top-6 left-6 flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </button>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-brand-700 mb-2">SökoPay</h1>
        <p className="text-neutral-600">Sign in as a customer</p>
      </div>
      <SignIn routing="hash" afterSignInUrl="/dashboard" />
    </div>
  );
}
