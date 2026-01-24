import type { Metadata } from "next";
import "@fontsource/inter";
import "@fontsource/playfair-display";
import "./globals.css";

import CookieBanner from "@/components/common/CookieBanner";

export const metadata: Metadata = {
  title: "Gardigital Menu - Gestione Ristoranti",
  description: "Piattaforma SaaS per menu digitali premium",
  icons: {
    icon: "/logo_v2.png",
    shortcut: "/logo_v2.png",
    apple: "/logo_v2.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
