import type { Metadata } from "next";
import { ClerkProviderWrapper } from '@/components/clerk-provider';
import "./globals.css";

export const metadata: Metadata = {
  title: "SökoPay",
  description: "Digital operating layer for local commerce in Kenya",
  icons: {
    icon: '/favicon.svg',
  },
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
        </body>
      </html>
    </ClerkProviderWrapper>
  );
}
