'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Store, MessageCircle, ShoppingBag, HelpCircle, Mail, Info, LogOut, ChevronDown } from 'lucide-react';
import NotificationBell from './notification-bell';

interface NavbarProps {
  title?: string;
  glass?: boolean;
}

export default function Navbar({ title = 'SökoPay', glass = false }: NavbarProps) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isVendor = pathname.startsWith('/vendor');

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    setMenuOpen(false);
    await signOut({ redirectUrl: '/' });
  };

  const navigate = (path: string) => {
    setMenuOpen(false);
    router.push(path);
  };

  // Role-specific menu items
  const customerMenuItems = [
    {
      icon: MessageCircle,
      label: 'Messages',
      onClick: () => navigate('/messages'),
    },
    { type: 'divider' as const },
    {
      icon: HelpCircle,
      label: 'Support',
      onClick: () => navigate('/support'),
    },
    {
      icon: Mail,
      label: 'Contact',
      onClick: () => navigate('/contact'),
    },
    {
      icon: Info,
      label: 'About',
      onClick: () => navigate('/about'),
    },
    { type: 'divider' as const },
    {
      icon: LogOut,
      label: 'Sign Out',
      onClick: handleSignOut,
      danger: true,
    },
  ];

  const vendorMenuItems = [
    {
      icon: Store,
      label: 'My Shop',
      onClick: () => navigate('/vendor/dashboard'),
    },
    {
      icon: MessageCircle,
      label: 'Messages',
      onClick: () => navigate('/vendor/messages'),
    },
    { type: 'divider' as const },
    {
      icon: ShoppingBag,
      label: 'Browse as Customer',
      onClick: () => navigate('/dashboard'),
    },
    { type: 'divider' as const },
    {
      icon: HelpCircle,
      label: 'Support',
      onClick: () => navigate('/support'),
    },
    {
      icon: Mail,
      label: 'Contact',
      onClick: () => navigate('/contact'),
    },
    {
      icon: Info,
      label: 'About',
      onClick: () => navigate('/about'),
    },
    { type: 'divider' as const },
    {
      icon: LogOut,
      label: 'Sign Out',
      onClick: handleSignOut,
      danger: true,
    },
  ];

  const menuItems = isVendor ? vendorMenuItems : customerMenuItems;

  const navBase = glass
    ? 'bg-brand-700/75 backdrop-blur-md border-b border-white/10'
    : 'bg-white border-b border-neutral-100 shadow-sm';

  const brandColor = glass ? 'text-white hover:text-brand-100' : 'text-brand-700 hover:text-brand-800';
  const avatarBg = glass ? 'bg-white/20' : 'bg-brand-100';
  const avatarText = glass ? 'text-white' : 'text-brand-700';
  const menuHover = glass ? 'hover:bg-white/10' : 'hover:bg-neutral-100';

  return (
    <nav className={`sticky top-0 z-40 ${navBase}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Left: Brand */}
          <div className="flex items-center min-w-0">
            <button
              onClick={() => navigate(user ? (isVendor ? '/vendor/dashboard' : '/dashboard') : '/')}
              className={`text-xl font-bold transition-colors flex-shrink-0 ${brandColor}`}
            >
              {title}
            </button>
          </div>

          {/* Right: Notification bell + Profile dropdown */}
          <div className="flex items-center gap-1">
            <NotificationBell />

            {/* Profile dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`flex items-center gap-1.5 p-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] justify-center ${menuHover}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${avatarBg}`}>
                  <span className={`text-sm font-semibold ${avatarText}`}>
                    {user?.firstName?.charAt(0) || user?.emailAddresses?.[0]?.emailAddress?.charAt(0) || '?'}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform hidden sm:block ${glass ? 'text-white/70' : 'text-neutral-500'} ${menuOpen ? 'rotate-180' : ''}`} />
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
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-brand-100 text-brand-700">
                      {isVendor ? 'Vendor' : 'Customer'}
                    </span>
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
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors min-h-[48px] ${
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
