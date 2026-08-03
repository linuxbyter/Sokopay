'use client';

import { SignIn } from '@clerk/nextjs';

export default function CustomerLoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-text-primary mb-2">Customer Sign In</h1>
          <p className="text-sm text-text-secondary">Find vendors, chat, and transact</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-6">
          <SignIn
            routing="path"
            path="/auth/login/customer"
            afterSignInUrl="/auth/setup"
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-transparent border-0 shadow-none p-0',
                headerTitle: 'text-text-primary',
                headerSubtitle: 'text-text-secondary',
                socialButtonsBlockButton: 'border-border bg-surface hover:bg-surface-hover text-text-primary',
                socialButtonsBlockButtonText: 'text-text-primary',
                dividerLine: 'bg-border',
                dividerText: 'text-text-tertiary',
                formFieldLabel: 'text-text-secondary',
                formFieldInput: 'bg-background border-border text-text-primary',
                formButtonPrimary: 'bg-primary hover:bg-primary-hover text-primary-foreground',
                footerActionLink: 'text-primary hover:text-primary-hover',
                identityPreviewEditButton: 'text-primary',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
