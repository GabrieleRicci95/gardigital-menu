import type { Metadata, Viewport } from "next";
import "@fontsource/inter";
import "@fontsource/playfair-display";
import "./globals.css";

import CookieBanner from "@/components/common/CookieBanner";

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Gardigital Menu - Crea il Menu Digitale Premium per il tuo Ristorante",
  description: "Soluzione completa per menu digitali con QR Code. Aggiorna i tuoi piatti in tempo reale, gestione allergeni, traduzioni automatiche e design elegante.",
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Gardigital Menu",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "15.00",
      "priceCurrency": "EUR"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "120"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "url": "https://www.gardigital.it",
    "logo": "https://www.gardigital.it/logo_v2.png",
    "name": "Gardigital Menu",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "gardigital234@gmail.com",
      "contactType": "customer service"
    }
  };

  return (
    <html lang="it" suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
