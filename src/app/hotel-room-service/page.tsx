'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import {
    Hotel,
    Smartphone,
    ConciergeBell,
    Zap,
    ChevronRight,
    ArrowRight,
    Coffee,
    Bed,
    Sparkles,
    ShieldCheck
} from "lucide-react";
import styles from "./hotel.module.css";

export default function HotelLanding() {
    return (
        <div className={styles.container}>
            {/* Nav */}
            <nav className={styles.nav}>
                <div className={styles.navContent}>
                    <Link href="/" className={styles.logo}>
                        <img src="/logo-black.png" alt="Gardigital Logo" className={styles.logoImg} />
                    </Link>
                    <Link href="/register" className={styles.navBtn}>Attiva Ora</Link>
                </div>
            </nav>

            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className={styles.badge}>
                            <Hotel size={14} /> Per Hotel & Resort di Lusso
                        </div>
                        <h1 className={styles.heroTitle}>
                            Il Room Service <br />
                            <span className={styles.highlight}>diventa smart.</span>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Eleva l&apos;esperienza dei tuoi ospiti con un menu digitale integrato. Ordini istantanei dalla camera, menu bar e ristorante in un&apos;unica interfaccia premium.
                        </p>
                        <Link href="/register" className={styles.mainBtn}>
                            Migliora il tuo Servizio <ChevronRight size={20} />
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={styles.heroVisual}
                    >
                        <div className={styles.mockupContainer}>
                            <img src="/assets/menu-hero.png" alt="Hotel Menu Experience" className={styles.mockupImg} />
                            <motion.div
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className={styles.floatingTag}
                            >
                                <ConciergeBell size={16} /> Richiesta Ricevuta dalla Camera 102
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section className={styles.features}>
                <div className={styles.featuresGrid}>
                    <div className={styles.featureCard}>
                        <Bed className={styles.featureIcon} size={32} />
                        <h3 className={styles.featureTitle}>Room Service 2.0</h3>
                        <p className={styles.featureText}>I tuoi ospiti possono ordinare la colazione o la cena direttamente dal letto, senza telefonate.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <ShieldCheck className={styles.featureIcon} size={32} />
                        <h3 className={styles.featureTitle}>Igiene & Sicurezza</h3>
                        <p className={styles.featureText}>Elimina i menu cartacei condivisi. Una soluzione contactless che garantisce i massimi standard di pulizia.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <Coffee className={styles.featureIcon} size={32} />
                        <h3 className={styles.featureTitle}>Multi-Service</h3>
                        <p className={styles.featureText}>Gestisci spa, bar della piscina e ristorante con QR code differenziati ma un unico pannello di controllo.</p>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className={styles.cta}>
                <div className={styles.ctaBox}>
                    <h2 className={styles.ctaTitle}>Dai prestigio alla tua struttura.</h2>
                    <p className={styles.ctaSubtitle}>Un piccolo cambiamento per un grande salto di qualità nel tuo servizio ospiti.</p>
                    <Link href="/register" className={styles.finalBtn}>Prova Gardigital Gratis</Link>
                </div>
            </section>
        </div>
    );
}
