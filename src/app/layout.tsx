import type { Metadata, Viewport } from "next";
import "@fontsource/inter";
import "@fontsource/playfair-display";
import "./globals.css";

import Script from "next/script";
import CookieBanner from "@/components/common/CookieBanner";

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Gardigital Menu - Il Menu Digitale Premium per il tuo Ristorante",
  description: "Trasforma il tuo ristorante con Gardigital Menu. Crea menu digitali QR eleganti, gestisci piatti, allergeni e traduzioni in tempo reale. Un design premium per un'esperienza cliente impeccabile.",
  keywords: [
    "menu digitale",
    "qr code menu",
    "facile menu",
    "menu",
    "menu ristorante",
    "menu facile",
    "menu semplice",
    "software menu digitale ristoranti",
    "qr code ristorante",
    "menu digitale interattivo",
    "ordinazioni al tavolo qr code",
    "prenotazioni whatsapp ristorante",
    "gestione allergeni digitale",
    "traduzione automatica menu AI",
    "sito web professionale ristorante",
    "digitalizzazione horeca",
    "miglior menu digitale 2026",
    "agenda elettronica prenotazioni",
    "creare menu online gratis",
    "listino prezzi digitale"
  ],
  authors: [{ name: "Gardigital" }],
  openGraph: {
    title: "Gardigital Menu - Menu Digitale Premium",
    description: "La soluzione professionale per il tuo ristorante. Semplice, elegante e veloce.",
    url: "https://www.gardigital.it",
    siteName: "Gardigital Menu",
    images: [
      {
        url: "/logo_v2.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gardigital Menu",
    description: "Crea il tuo menu digitale in pochi minuti.",
    images: ["/logo_v2.png"],
  },
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
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
        <CookieBanner />
      </body>
    </html>
  );
}
