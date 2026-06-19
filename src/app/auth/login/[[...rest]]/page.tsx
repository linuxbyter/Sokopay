'use client';

import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-6">
      <SignIn routing="hash" />
    </div>
  );
}