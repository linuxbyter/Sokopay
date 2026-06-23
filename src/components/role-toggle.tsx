'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Store, ShoppingBag } from 'lucide-react';

export default function RoleToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const [isVendor, setIsVendor] = useState(pathname.startsWith('/vendor'));

  const handleToggle = () => {
    const newIsVendor = !isVendor;
    setIsVendor(newIsVendor);
    
    if (newIsVendor) {
      // Check if vendor has a profile, if not go to creation
      router.push('/vendor/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
      title={isVendor ? 'Switch to Customer view' : 'Switch to Vendor view'}
    >
      <div className="flex items-center gap-1.5">
        <Store className={`w-4 h-4 transition-colors ${isVendor ? 'text-brand-600' : 'text-neutral-400'}`} />
        <span className={`text-xs font-medium transition-colors ${isVendor ? 'text-brand-600' : 'text-neutral-400'}`}>
          Vendor
        </span>
      </div>
      
      <div className={`relative w-10 h-5 rounded-full transition-colors ${isVendor ? 'bg-brand-600' : 'bg-copper-400'}`}>
        <div
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
            isVendor ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </div>
      
      <div className="flex items-center gap-1.5">
        <span className={`text-xs font-medium transition-colors ${!isVendor ? 'text-copper-600' : 'text-neutral-400'}`}>
          Customer
        </span>
        <ShoppingBag className={`w-4 h-4 transition-colors ${!isVendor ? 'text-copper-600' : 'text-neutral-400'}`} />
      </div>
    </button>
  );
}
