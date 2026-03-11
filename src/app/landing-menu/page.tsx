'use client';

import Link from "next/link";
import Footer from "@/components/layout/Footer";
import styles from "./landing.module.css";

export default function MenuLanding() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.logo}>
                    <img src="/gardigital-logo-header.png" alt="Gardigital Menu" className={styles.logoImage} />
                </div>
                <nav className={styles.nav}>
                    <Link href="#features" className={styles.navLink}>Funzionalità</Link>
                    <Link href="#pricing" className={styles.navLink}>Prezzi</Link>
                    <Link href="/register" className={styles.primaryBtn}>Crea il tuo Menu</Link>
                </nav>
            </header>

            <main>
                {/* HERO SECTION */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <span className={styles.heroBadge}>Menu Digitale QR Premium</span>
                        <h1 className={styles.heroTitle}>
                            Eleva il tuo locale con l'<span className={styles.highlight}>eccellenza digitale</span>
                        </h1>
                        <p className={styles.heroText}>
                            Basta carta, benvenuti nel futuro della ristorazione. Gardigital trasforma il tuo listino in un'esperienza interattiva, multilingue e istantanea.
                        </p>
                        <div className={styles.ctaGroup}>
                            <Link href="/register" className={styles.primaryBtn}>Inizia Prova Gratuita</Link>
                            <Link href="/menu/demo" className={styles.secondaryBtn} target="_blank">Guarda la Demo</Link>
                        </div>
                    </div>
                </section>

                {/* HERO IMAGE SHOWCASE */}
                <section className={styles.imageShowcase}>
                    <div className={styles.mainImageContainer}>
                        <img src="/assets/menu-hero.png" alt="Premium Restaurant QR Menu" className={styles.mainImage} />
                    </div>
                </section>

                {/* FEATURES GRID */}
                <section id="features" className={styles.featuresGridSection}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Tutto quello che serve per <span className={styles.highlight}>stupire</span> i tuoi ospiti</h2>
                    </div>
                    <div className={styles.featuresGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
                            </div>
                            <h3 className={styles.featureTitle}>Design Tailor-Made</h3>
                            <p className={styles.featureText}>Ogni menu è curato per riflettere il prestigio del tuo locale. Più di un software, un asset di design.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9"></path></svg>
                            </div>
                            <h3 className={styles.featureTitle}>Traduzioni AI Real-Time</h3>
                            <p className={styles.featureText}>Accogli turisti da tutto il mondo. Il tuo menu si traduce istantaneamente in oltre 10 lingue.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4 4 4M12 10V6M12 22l4-4 4 4M12 18v-4"></path></svg>
                            </div>
                            <h3 className={styles.featureTitle}>Gestione Mobile</h3>
                            <p className={styles.featureText}>Terminato uno stock? Cambia i prezzi o nascondi un piatto direttamente dal tuo smartphone in 3 secondi.</p>
                        </div>
                    </div>
                </section>

                {/* SHOWCASE SECTION 1 */}
                <section className={styles.showcaseSection}>
                    <div className={styles.showcaseRow}>
                        <div className={styles.showcaseText}>
                            <h2 className={styles.sectionTitle}>Perfetto per i <span className={styles.highlight}>Cocktail Bar</span> più esclusivi</h2>
                            <p className={styles.heroText} style={{ textAlign: 'left', marginInline: '0' }}>
                                Atmosfera, stile e immediatezza. Rendi l'ordinazione un piacere visivo mentre mantieni il controllo totale sul listino delle liste speciali.
                            </p>
                            <Link href="/register" className={styles.primaryBtn}>Attiva Ora</Link>
                        </div>
                        <div className={styles.showcaseVisual}>
                            <div className={styles.visualContainer}>
                                <img src="/assets/menu-cocktail.png" alt="Cocktail Bar QR Menu" className={styles.visualImg} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* SHOWCASE SECTION 2 */}
                <section className={styles.showcaseSection}>
                    <div className={styles.showcaseRowReverse}>
                        <div className={styles.showcaseText}>
                            <h2 className={styles.sectionTitle}>Efficienza anche sotto l'<span className={styles.highlight}>ombrellone</span></h2>
                            <p className={styles.heroText} style={{ textAlign: 'left', marginInline: '0' }}>
                                Dagli stabilimenti balneari ai grandi hotel. Porta il servizio direttamente al cliente con QR code durevoli e interfacce ultra-veloci.
                            </p>
                            <Link href="/register" className={styles.primaryBtn}>Scopri di più</Link>
                        </div>
                        <div className={styles.showcaseVisual}>
                            <div className={styles.visualContainer}>
                                <img src="/assets/menu-beach.png" alt="Beach Club QR Menu" className={styles.visualImg} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* PRICING SECTION */}
                <section id="pricing" className={styles.pricingSection}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle} style={{ color: 'white' }}>Piani Tariffari <span className={styles.highlight}>Trasparenti</span></h2>
                        <p style={{ opacity: 0.7 }}>Nessuna commissione nascosta. Scegli il piano più adatto alla tua crescita.</p>
                    </div>
                    <div className={styles.pricingGrid}>
                        <div className={styles.pricingCard}>
                            <h3 className={styles.planName}>Small Business</h3>
                            <div className={styles.planPrice}>€15<span>/mese</span></div>
                            <ul className={styles.planFeatures}>
                                <li>Menu Digitale Completo</li>
                                <li>QR Code Personalizzati</li>
                                <li>Gestione da Mobile</li>
                                <li>Fino a 3 Categorie</li>
                                <li>Supporto Standard</li>
                            </ul>
                            <Link href="/register" className={styles.secondaryBtn} style={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)', width: '100%', display: 'block', textAlign: 'center' }}>Inizia Gratis</Link>
                        </div>
                        <div className={`${styles.pricingCard} ${styles.featured}`}>
                            <h3 className={styles.planName}>Full Pack Premium</h3>
                            <div className={styles.planPrice}>€29,99<span>/mese</span></div>
                            <ul className={styles.planFeatures}>
                                <li>Tutto di Small Business</li>
                                <li>Traduzioni AI Incluse</li>
                                <li>Modulo Agenda & Prenotazioni</li>
                                <li>Liste Speciali Illimitate</li>
                                <li>Supporto WhatsApp Prioritario</li>
                            </ul>
                            <Link href="/register" className={styles.primaryBtn} style={{ backgroundColor: '#e2b13c', color: '#0d1b2a', width: '100%', display: 'block', textAlign: 'center' }}>Sblocca Tutto</Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        "name": "Gardigital Menu QR",
                        "description": "Menu digitali interattivi, multilingua e gestibili in tempo reale per ristoranti, bar e hotel.",
                        "brand": {
                            "@type": "Brand",
                            "name": "Gardigital"
                        },
                        "offers": {
                            "@type": "AggregateOffer",
                            "lowPrice": "15",
                            "highPrice": "29.99",
                            "priceCurrency": "EUR"
                        }
                    })
                }}
            />
        </div>
    );
}
