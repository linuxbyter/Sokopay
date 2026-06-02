import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SokoPay — Market Commerce Platform",
  description:
    "Discover vendors, order fresh food and goods, and support local markets in Kenya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 antialiased">{children}</body>
    </html>
  );
}
