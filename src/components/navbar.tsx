'use client';

import { useUser } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import RoleToggle from './role-toggle';
import SignOutButton from './sign-out-button';

interface NavbarProps {
  title?: string;
}

export default function Navbar({ title = 'SökoPay' }: NavbarProps) {
  const { user } = useUser();
  const router = useRouter();

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
            <UserButton afterSignOutUrl="/" />
            <SignOutButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
