import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ClerkProviderWrapper } from '@/components/clerk-provider';
import { ThemeProvider } from '@/lib/theme-context';
import PwaInstallPrompt from '@/components/pwa-install-prompt';
import PushManager from '@/components/push-manager';
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
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
  ],
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
      <html lang="en" className={`${GeistSans.className} ${GeistMono.className}`} suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  var t = localStorage.getItem('sokopay-theme');
                  if (t === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.classList.remove('light');
                    document.documentElement.classList.add('dark');
                  }
                })();
              `,
            }}
          />
        </head>
        <body className="min-h-screen bg-background text-text-primary antialiased">
          <ThemeProvider>
            {children}
            <PwaInstallPrompt />
            <PushManager />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProviderWrapper>
  );
}
