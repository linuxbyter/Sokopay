'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, Store, MessageCircle, ShoppingBag, HelpCircle, Mail, Info, LogOut, ChevronDown } from 'lucide-react';
import RoleToggle from './role-toggle';
import NotificationBell from './notification-bell';

interface NavbarProps {
  title?: string;
}

export default function Navbar({ title = 'SökoPay' }: NavbarProps) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isVendor = pathname.startsWith('/vendor');

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setMenuOpen(false);
    await signOut({ redirectUrl: '/' });
  };

  const menuItems = [
    ...(isVendor ? [{
      icon: Store,
      label: 'My Shop',
      onClick: () => { setMenuOpen(false); router.push('/vendor/dashboard'); },
    }] : []),
    {
      icon: ShoppingBag,
      label: 'Browse as Customer',
      onClick: () => { setMenuOpen(false); router.push('/dashboard'); },
    },
    {
      icon: MessageCircle,
      label: 'Messages',
      onClick: () => { setMenuOpen(false); router.push(isVendor ? '/vendor/messages' : '/messages'); },
    },
    { type: 'divider' as const },
    {
      icon: HelpCircle,
      label: 'Support',
      onClick: () => { setMenuOpen(false); router.push('/support'); },
    },
    {
      icon: Mail,
      label: 'Contact',
      onClick: () => { setMenuOpen(false); router.push('/contact'); },
    },
    {
      icon: Info,
      label: 'About',
      onClick: () => { setMenuOpen(false); router.push('/about'); },
    },
    { type: 'divider' as const },
    {
      icon: LogOut,
      label: 'Sign Out',
      onClick: handleSignOut,
      danger: true,
    },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="text-2xl font-bold text-brand-700 hover:text-brand-800 transition-colors"
            >
              {title}
            </button>
            <RoleToggle />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-600 hidden sm:block">
              {user?.firstName ? `Hi, ${user.firstName}` : 'Dashboard'}
            </span>

            <NotificationBell />

            {/* Profile dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-brand-700">
                    {user?.firstName?.charAt(0) || user?.emailAddresses?.[0]?.emailAddress?.charAt(0) || '?'}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-100 py-2 z-50">
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-neutral-100">
                    <p className="font-medium text-neutral-900 text-sm">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">
                      {user?.emailAddresses?.[0]?.emailAddress}
                    </p>
                  </div>

                  {/* Menu items */}
                  {menuItems.map((item, index) => {
                    if ('type' in item && item.type === 'divider') {
                      return <div key={`divider-${index}`} className="border-t border-neutral-100 my-1" />;
                    }
                    const menuItem = item as { icon: any; label: string; onClick: () => void; danger?: boolean };
                    const Icon = menuItem.icon;
                    return (
                      <button
                        key={menuItem.label}
                        onClick={menuItem.onClick}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          menuItem.danger
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {menuItem.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
