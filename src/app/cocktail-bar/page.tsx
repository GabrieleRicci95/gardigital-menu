'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import {
    GlassWater,
    Smartphone,
    Zap,
    ChevronRight,
    ArrowRight,
    Music,
    Moon,
    Sparkles,
    Flame
} from "lucide-react";
import styles from "./cocktail-bar.module.css";

export default function CocktailBarLanding() {
    return (
        <div className={styles.container}>
            {/* Nav */}
            <nav className={styles.nav}>
                <div className={styles.navContent}>
                    <Link href="/" className={styles.logo}>
                        <img src="/logo-black.png" alt="Gardigital Logo" className={styles.logoImg} />
                    </Link>
                    <Link href="/register" className={styles.navBtn}>Prova Ora</Link>
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
                            <Moon size={14} /> Per Bar & Cocktail Bar Esclusivi
                        </div>
                        <h1 className={styles.heroTitle}>
                            Stile in movimento, <br />
                            <span className={styles.highlight}>cocktail leggendari.</span>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Non far aspettare i tuoi clienti. Un menu rapido, visivamente sbalorditivo e facile da aggiornare. Perfetto per liste drink dinamiche e promozioni notturne.
                        </p>
                        <Link href="/register" className={styles.mainBtn}>
                            Attiva il tuo Menu <ChevronRight size={20} />
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={styles.heroVisual}
                    >
                        <div className={styles.mockupContainer}>
                            <img src="/assets/menu-cocktail.png" alt="Cocktail Bar Menu" className={styles.mockupImg} />
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className={styles.floatingTag}
                            >
                                <Flame size={16} /> Best Seller: Negroni Gold
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section className={styles.features}>
                <div className={styles.featuresGrid}>
                    <div className={styles.featureCard}>
                        <Zap className={styles.featureIcon} size={32} />
                        <h3 className={styles.featureTitle}>Velocità Killer</h3>
                        <p className={styles.featureText}>Scansiona e ordina in meno di 10 secondi. Ottimizza il lavoro del tuo staff durante le ore di punta.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <Music className={styles.featureIcon} size={32} />
                        <h3 className={styles.featureTitle}>Mood Notturno</h3>
                        <p className={styles.featureText}>Design studiato per essere leggibile anche in ambienti con luci soffuse, senza sacrificare lo stile.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <Smartphone className={styles.featureIcon} size={32} />
                        <h3 className={styles.featureTitle}>Listini Dinamici</h3>
                        <p className={styles.featureText}>Aggiorna i drink della serata o cambia i prezzi del fuori menu con un tap dal telefono.</p>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className={styles.cta}>
                <div className={styles.ctaBox}>
                    <h2 className={styles.ctaTitle}>Porta il tuo bar al livello successivo.</h2>
                    <p className={styles.ctaSubtitle}>Inizia la tua prova gratuita e vedi la differenza dalla prima serata.</p>
                    <Link href="/register" className={styles.finalBtn}>Sali a Bordo Gratis</Link>
                </div>
            </section>
        </div>
    );
}
