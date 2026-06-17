"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button'; // We'll create this later
import { PhoneIcon } from 'lucide-react';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setIsLoading(true);
    try {
      await login(phone);
      router.push(`/auth/verify?phone=${encodeURIComponent(phone)}`);
    } catch (error) {
      alert('Failed to send OTP. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 p-6">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-neutral-900 text-center">
          Welcome to SökoPay
        </h1>
        <p className="text-neutral-600 text-center">
          Enter your phone number to get started
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border-2 border-neutral-200 rounded-xl p-3">
            <PhoneIcon className="h-5 w-5 text-neutral-400" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="flex-1 pl-3 focus:outline-none"
              autoComplete="tel"
              inputMode="tel"
              maxLength={10}
            />
          </div>
          
          <Button
            type="submit"
            loading={isLoading}
            fullWidth
          >
            Send OTP
          </Button>
          
          <p className="text-xs text-neutral-500 text-center">
            We'll send a one-time code to verify your number
          </p>
        </form>
      </div>
    </div>
  );
}