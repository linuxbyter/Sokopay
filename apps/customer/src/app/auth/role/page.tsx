'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, ShoppingBag, Store } from 'lucide-react';

export default function RoleSelectionPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-4 pt-5 flex items-center justify-between max-w-lg mx-auto w-full">
        <button
          onClick={() => router.push('/')}
          className="p-2 rounded-lg hover:bg-surface-hover transition-colors text-text-secondary hover:text-text-primary min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-lg font-bold text-primary">SökoPay</span>
        <div className="w-11" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold tracking-[-0.02em] text-text-primary mb-2">Welcome!</h1>
            <p className="text-text-secondary text-sm">How would you like to use SökoPay?</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => router.push('/auth/login/customer')}
              className="w-full bg-surface border border-border hover:border-primary/30 rounded-xl p-5 text-left transition-all hover:bg-surface-hover group card-interactive"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                  <ShoppingBag className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-text-primary text-base mb-0.5">I'm a Customer</div>
                  <div className="text-sm text-text-secondary">Find vendors, browse products, chat & order</div>
                </div>
                <ArrowRight className="w-5 h-5 text-text-tertiary group-hover:text-primary transition-colors flex-shrink-0" />
              </div>
            </button>

            <button
              onClick={() => router.push('/auth/login/vendor')}
              className="w-full bg-surface border border-border hover:border-copper-400/30 rounded-xl p-5 text-left transition-all hover:bg-surface-hover group card-interactive"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-copper-400/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-copper-400/15 transition-colors">
                  <Store className="w-7 h-7 text-copper-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-text-primary text-base mb-0.5">I'm a Vendor</div>
                  <div className="text-sm text-text-secondary">Create your shop, receive orders, grow your business</div>
                </div>
                <ArrowRight className="w-5 h-5 text-text-tertiary group-hover:text-copper-400 transition-colors flex-shrink-0" />
              </div>
            </button>
          </div>

          <p className="text-center text-xs text-text-tertiary mt-6">
            Your first login sets your role permanently.
          </p>
        </div>
      </div>
    </div>
  );
}
