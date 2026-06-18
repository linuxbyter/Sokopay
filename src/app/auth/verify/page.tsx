"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { verifyOtp, login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const phone = searchParams.get('phone') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      await verifyOtp(phone, otp);
      router.push('/');
    } catch (error: any) {
      setError('Invalid OTP. Please try again.');
      console.error('OTP verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await login(phone);
      alert('New OTP sent!');
    } catch (error) {
      alert('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 p-6">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-neutral-900 text-center">
          Verify Your Number
        </h1>
        <p className="text-neutral-600 text-center">
          Enter the 6-digit code we sent to
          <span className="font-medium">{phone}</span>
        </p>
        
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border-2 border-neutral-200 rounded-xl p-3">
            <span className="h-5 w-5 text-neutral-400">#</span>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="______"
              className="flex-1 pl-3 text-center font-mono letter-spacing-wide focus:outline-none"
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength={6}
              autoFocus
            />
          </div>
          
          <Button
            type="submit"
            loading={isLoading}
            fullWidth
          >
            Verify & Continue
          </Button>
          
          <button
            type="button"
            onClick={handleResend}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-500"
          >
            {isLoading ? 'Sending...' : 'Resend OTP'}
          </button>
        </form>
      </div>
    </div>
  );
}