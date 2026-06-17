import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";

export const metadata: Metadata = {
  title: "SokoPay",
  description: "Digital operating layer for local commerce in Kenya",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}