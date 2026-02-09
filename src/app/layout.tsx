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
  title: "Gardigital Menu | Il Menu Digitale Premium per Ristoranti",
  description: "Crea Menu Personalizzati e QR Code per il tuo locale. Include Agenda Digitale con sistema di prenotazioni dirette. La soluzione completa per la gestione ristoranti.",
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
    "agenda elettronica prenotazioni"
  ],
  authors: [{ name: "Gardigital" }],
  openGraph: {
    title: "Gardigital Menu | Il Menu Digitale QR Premium & Gestionale Ristoranti",
    description: "L'unica piattaforma professionale che unisce Menu Digitale QR, Agenda Elettronica e Sito Web. Gestisci piatti, allergeni e prenotazioni in un sistema elegante e veloce.",
    url: "https://www.gardigital.it",
    siteName: "Gardigital Menu",
    images: [
      {
        url: "/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Gardigital Menu - Premium Digital Experience"
      },
    ],
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gardigital Menu | Il Menu Digitale Premium",
    description: "Crea il tuo menu digitale premium in pochi minuti. Elegante, veloce e completo di agenda prenotazioni.",
    images: ["/og-banner.png"],
  },
  icons: {
    icon: "/logo_v2.png",
    shortcut: "/logo_v2.png",
    apple: "/logo_v2.png",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Gardigital Menu",
    "serviceType": "Soluzioni Digitali Per Ristoranti",
    "description": "Crea Menu Personalizzati e QR Code per il tuo locale. Include Agenda Digitale con sistema di prenotazioni dirette. La soluzione completa per la gestione ristoranti.",
    "provider": {
      "@type": "Organization",
      "name": "Gardigital"
    },
    "featureList": "Menu Personalizzati, QR Code, Agenda Digitale, Prenotazioni Dirette su Agenda",
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
      <head>
        {/* Google Tag (gtag.js) */}
        {(process.env.NEXT_PUBLIC_GA_ID || "AW-17928402861") && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || "AW-17928402861"}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                ${process.env.NEXT_PUBLIC_GA_ID ? `gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');` : ''}
                gtag('config', 'AW-17928402861');
              `}
            </Script>
          </>
        )}
      </head>
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
