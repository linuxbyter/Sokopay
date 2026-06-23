'use client';

import { useRouter } from 'next/navigation';
import { ShoppingBag, Store, ArrowRight } from 'lucide-react';

export default function RoleSelectionPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-brand-700 mb-2">SökoPay</h1>
        <p className="text-neutral-600 text-lg">How would you like to use SökoPay?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl w-full">
        <button
          onClick={() => router.push('/auth/login/customer')}
          className="bg-white rounded-2xl shadow-lg p-8 text-left hover:shadow-xl transition-shadow border border-neutral-100 hover:border-brand-200"
        >
          <div className="w-14 h-14 bg-brand-100 rounded-xl flex items-center justify-center mb-6">
            <ShoppingBag className="w-7 h-7 text-brand-600" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">I&apos;m a Customer</h3>
          <p className="text-neutral-500 text-sm mb-6">Find vendors, compare prices, and shop local</p>
          <div className="flex items-center text-brand-600 font-medium text-sm">
            Continue as Customer
            <ArrowRight className="ml-2 w-4 h-4" />
          </div>
        </button>

        <button
          onClick={() => router.push('/auth/login/vendor')}
          className="bg-white rounded-2xl shadow-lg p-8 text-left hover:shadow-xl transition-shadow border border-neutral-100 hover:border-copper-200"
        >
          <div className="w-14 h-14 bg-copper-100 rounded-xl flex items-center justify-center mb-6">
            <Store className="w-7 h-7 text-copper-600" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">I&apos;m a Vendor</h3>
          <p className="text-neutral-500 text-sm mb-6">Create your shop and reach more customers</p>
          <div className="flex items-center text-copper-600 font-medium text-sm">
            Continue as Vendor
            <ArrowRight className="ml-2 w-4 h-4" />
          </div>
        </button>
      </div>

      <button
        onClick={() => router.push('/')}
        className="mt-8 text-neutral-500 hover:text-neutral-700 text-sm"
      >
        Back to home
      </button>
    </div>
  );
}