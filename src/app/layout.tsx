import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MAGICALDERO - Expense & Income Tracker",
  description: "Professional business finance management with automatic calculations",
  viewport: {
    width: "device-width",
    initialScale: 1,
    minimumScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#dc2626" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
