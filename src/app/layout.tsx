import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MAGICALDERO - Expense & Income Tracker",
  description: "Professional business finance management with automatic calculations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
