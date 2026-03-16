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
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "SoloMenu | I Migliori Menu Digitali QR per Ristoranti Premium",
  description: "Eleva il tuo locale con SoloMenu. Menu digitali QR d'autore, agenda prenotazioni integrata e traduzioni AI istantanee. La soluzione d'eccellenza per la ristorazione moderna.",
  keywords: [
    "SoloMenu",
    "menu digitali premium",
    "menu digitale qr",
    "migliori menu digitali 2026",
    "menu ristorante lusso",
    "software menu digitale elegante",
    "qr code ristorazione boutique",
    "ordinazioni al tavolo eleganti",
    "prenotazioni digitali ristoranti",
    "traduzione menu AI"
  ],
  authors: [{ name: "SoloMenu" }],
  openGraph: {
    title: "SoloMenu | Menu Digitali QR Premium & Eccellenza Hospitality",
    description: "Sinergia tra design d'autore e tecnologia invisibile. Gestisci il tuo menu e le prenotazioni con l'eleganza di SoloMenu.",
    url: "https://www.solomenu.it",
    siteName: "SoloMenu",
    images: [
      {
        url: "/og-banner.png",
        width: 1200,
        height: 630,
        alt: "SoloMenu - L'eccellenza nei Menu Digitali"
      },
    ],
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SoloMenu | Menu Digitali d'Autore",
    description: "Crea un'esperienza sensoriale per i tuoi ospiti con i menu digitali SoloMenu. Eleganti, veloci, unici.",
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
  verification: {
    google: "_p6_Cq8R3ocSi1iD1gPlpUIUoYyRG9bj4H2teOBwsB0",
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
    "name": "SoloMenu",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "description": "SoloMenu trasforma l'ospitalità con menu digitali QR eleganti e un'agenda elettronica integrata per prenotazioni dirette.",
    "provider": {
      "@type": "Organization",
      "name": "SoloMenu"
    },
    "featureList": "Menu Digitali d'Autore, QR Code Premium, Agenda Elettronica, Prenotazioni Dirette",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "150"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "url": "https://www.solomenu.it",
    "logo": "https://www.solomenu.it/logo_v2.png",
    "name": "SoloMenu",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "info@solomenu.it",
      "telephone": "+39 351 348 7580",
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
