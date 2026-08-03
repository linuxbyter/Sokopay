'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

function SetupContent() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const intendedRole = searchParams.get('role');

  useEffect(() => {
    if (!isLoaded || !user) return;

    const setupRole = async () => {
      try {
        const roleRes = await fetch(`/api/role?userId=${user.id}`);
        const roleData = await roleRes.json();

        if (roleData.role) {
          router.push(roleData.role === 'vendor' ? '/vendor/dashboard' : '/dashboard');
          return;
        }

        if (intendedRole && ['customer', 'vendor'].includes(intendedRole)) {
          await fetch('/api/role', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, role: intendedRole }),
          });
          router.push(intendedRole === 'vendor' ? '/vendor/dashboard' : '/dashboard');
        } else {
          const vendorRes = await fetch(`/api/vendors?userId=${user.id}`);
          const vendorData = await vendorRes.json();
          const hasVendors = (vendorData.vendors || []).length > 0;

          const fallbackRole = hasVendors ? 'vendor' : 'customer';
          await fetch('/api/role', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, role: fallbackRole }),
          });
          router.push(fallbackRole === 'vendor' ? '/vendor/dashboard' : '/dashboard');
        }
      } catch (error) {
        console.error('Setup error:', error);
        router.push('/dashboard');
      }
    };

    setupRole();
  }, [isLoaded, user, intendedRole, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
        <p className="text-text-secondary">Setting up your account...</p>
      </div>
    </div>
  );
}

export default function AuthSetupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    }>
      <SetupContent />
    </Suspense>
  );
}
