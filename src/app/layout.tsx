import type { Metadata } from "next";
import "@fontsource/inter";
import "@fontsource/playfair-display";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gardigital Menu - Gestione Ristoranti",
  description: "Piattaforma SaaS per menu digitali premium",
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
      </body>
    </html>
  );
}
