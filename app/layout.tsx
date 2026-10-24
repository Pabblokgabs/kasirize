import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { ServiceWorkerRegister } from "./sw-register";

export const viewport: Viewport = {
  themeColor: "#064e3b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Kasirize — Shortening the distance to meaningful income",
  description:
    "Shortening the distance between young people and meaningful income by translating skills into credible profiles, practical experience, work opportunities and career mobility.",
  applicationName: "Kasirize",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kasirize",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* Self-hosted via Google Fonts CDN — browser fetches at runtime, not build time */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Toaster position="top-center" reverseOrder={false} />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
