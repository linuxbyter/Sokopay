'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, ShoppingBag, Store } from 'lucide-react';

export default function RoleSelectionPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Top bar */}
      <div className="px-4 pt-5 flex items-center justify-between max-w-lg mx-auto w-full">
        <button
          onClick={() => router.push('/')}
          className="p-2 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-500 hover:text-neutral-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-lg font-bold text-brand-700">SökoPay</span>
        <div className="w-11" />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-neutral-900 mb-2">Welcome!</h1>
            <p className="text-neutral-500 text-sm">How would you like to use SökoPay?</p>
          </div>

          <div className="space-y-4">
            {/* Customer */}
            <button
              onClick={() => router.push('/auth/login/customer')}
              className="w-full bg-white border-2 border-neutral-100 hover:border-brand-400 rounded-2xl p-5 text-left transition-all hover:shadow-md group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-brand-100 transition-colors">
                  <ShoppingBag className="w-7 h-7 text-brand-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-neutral-900 text-base mb-0.5">I'm a Customer</div>
                  <div className="text-sm text-neutral-500">Find vendors, browse products, chat & order</div>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-300 group-hover:text-brand-500 transition-colors flex-shrink-0" />
              </div>
            </button>

            {/* Vendor */}
            <button
              onClick={() => router.push('/auth/login/vendor')}
              className="w-full bg-white border-2 border-neutral-100 hover:border-copper-300 rounded-2xl p-5 text-left transition-all hover:shadow-md group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-copper-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-copper-100 transition-colors">
                  <Store className="w-7 h-7 text-copper-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-neutral-900 text-base mb-0.5">I'm a Vendor</div>
                  <div className="text-sm text-neutral-500">Create your shop, receive orders, grow your business</div>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-300 group-hover:text-copper-400 transition-colors flex-shrink-0" />
              </div>
            </button>
          </div>

          <p className="text-center text-xs text-neutral-400 mt-6">
            Your first login sets your role permanently.
          </p>
        </div>
      </div>
    </div>
  );
}
