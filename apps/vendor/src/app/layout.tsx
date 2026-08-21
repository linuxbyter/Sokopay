import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@sokopay/ui/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SökoPay Vendor",
  description: "Manage your shop, answer messages, confirm sales",
  appleWebApp: {
    capable: true,
    title: "SökoPay",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#F8F6F0",
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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
