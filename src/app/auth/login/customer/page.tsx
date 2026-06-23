'use client';

import { SignIn } from '@clerk/nextjs';

export default function CustomerLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-brand-700 mb-2">SökoPay</h1>
        <p className="text-neutral-600">Sign in as a customer</p>
      </div>
      <SignIn routing="hash" afterSignInUrl="/dashboard" />
    </div>
  );
}