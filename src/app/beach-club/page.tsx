'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import {
    Sun,
    Smartphone,
    Waves,
    Zap,
    ChevronRight,
    ArrowRight,
    Umbrella,
    Navigation,
    Sparkles
} from "lucide-react";
import styles from "./beach-club.module.css";

export default function BeachClubLanding() {
    return (
        <div className={styles.container}>
            {/* Nav */}
            <nav className={styles.nav}>
                <div className={styles.navContent}>
                    <div className={styles.logo}>
                        <Link href="/">
                            <img src="/logo.png" alt="SoloMenu" className={styles.logoImg} />
                        </Link>
                    </div>
                    <Link href="/register" className={styles.navBtn}>Provalo 7 Giorni Gratis</Link>
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
                            <Waves size={14} /> Per Stabilimenti Balneari & Beach Clubs
                        </div>
                        <h1 className={styles.heroTitle}>
                            Servizio in spiaggia <br />
                            <span className={styles.highlight}>veloce come il vento.</span>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Porta le ordinazioni direttamente sotto l&apos;ombrellone. QR code resistenti e un&apos;interfaccia ultra-rapida per massimizzare le vendite anche nei giorni di massimo affollamento.
                        </p>
                        <Link href="/register" className={styles.mainBtn}>
                            Inizia ora (7 Giorni Gratis) <ChevronRight size={20} />
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={styles.heroVisual}
                    >
                        <div className={styles.mockupContainer}>
                            <img src="/assets/menu-beach.png" alt="Beach Club Menu" className={styles.mockupImg} />
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 5, repeat: Infinity }}
                                className={styles.floatingTag}
                            >
                                <Navigation size={16} /> Ordina dall&apos;Ombrellone 42
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Final */}
            <section className={styles.cta}>
                <div className={styles.ctaBox}>
                    <h2 className={styles.ctaTitle}>Rendi la tua estate indimenticabile.</h2>
                    <p className={styles.ctaSubtitle}>Aumenta le vendite del 30% grazie all&apos;efficienza del menu digitale.</p>
                    <Link href="/register" className={styles.finalBtn}>Inizia ora (7 Giorni Gratis)</Link>
                </div>
            </section>

            {/* Features - Moved to End */}
            <section className={styles.features}>
                <div className={styles.featuresGrid}>
                    <div className={styles.featureCard}>
                        <Umbrella className={styles.featureIcon} size={32} />
                        <h3 className={styles.featureTitle}>Consegna al Posto</h3>
                        <p className={styles.featureText}>Identifica istantaneamente la zona o il numero dell&apos;ombrellone per un servizio preciso e senza errori.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <Zap className={styles.featureIcon} size={32} />
                        <h3 className={styles.featureTitle}>Zero Code</h3>
                        <p className={styles.featureText}>Riduci le file al bar. I tuoi clienti ordinano e pagano online mentre si godono il sole.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <Sun className={styles.featureIcon} size={32} />
                        <h3 className={styles.featureTitle}>QR Ultra-Resistenti</h3>
                        <p className={styles.featureText}>Ti forniamo i materiali migliori per resistere a salsedine, sabbia e sole cocente.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
