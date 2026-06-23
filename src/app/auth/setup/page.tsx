'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

function SetupContent() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const intendedRole = searchParams.get('role'); // 'customer' or 'vendor'

  useEffect(() => {
    if (!isLoaded || !user) return;

    const setupRole = async () => {
      try {
        // Check if user already has a stored role
        const roleRes = await fetch(`/api/role?userId=${user.id}`);
        const roleData = await roleRes.json();

        if (roleData.role) {
          // Role already stored — redirect to correct dashboard
          router.push(roleData.role === 'vendor' ? '/vendor/dashboard' : '/dashboard');
          return;
        }

        // No role stored yet — store the one from the login flow
        if (intendedRole && ['customer', 'vendor'].includes(intendedRole)) {
          await fetch('/api/role', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, role: intendedRole }),
          });
          router.push(intendedRole === 'vendor' ? '/vendor/dashboard' : '/dashboard');
        } else {
          // No intended role — check if they have vendor shops to determine role
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
        // Fallback: go to customer dashboard
        router.push('/dashboard');
      }
    };

    setupRole();
  }, [isLoaded, user, intendedRole, router]);

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-4" />
        <p className="text-neutral-600">Setting up your account...</p>
      </div>
    </div>
  );
}

export default function AuthSetupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    }>
      <SetupContent />
    </Suspense>
  );
}
