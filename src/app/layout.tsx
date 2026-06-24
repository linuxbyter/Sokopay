import type { Metadata, Viewport } from "next";
import { ClerkProviderWrapper } from '@/components/clerk-provider';
import PwaInstallPrompt from '@/components/pwa-install-prompt';
import "./globals.css";

export const metadata: Metadata = {
  title: "SökoPay",
  description: "Your hood's vendors, one tap away — marketplace for local Kenya",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: "SökoPay",
    statusBarStyle: "default",
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#457841',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProviderWrapper>
      <html lang="en">
        <body className="min-h-screen bg-neutral-50 antialiased">
          {children}
          <PwaInstallPrompt />
        </body>
      </html>
    </ClerkProviderWrapper>
  );
}
