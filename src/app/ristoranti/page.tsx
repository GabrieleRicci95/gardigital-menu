'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import {
    UtensilsCrossed,
    Globe,
    Settings,
    Zap,
    ChevronRight,
    ArrowRight,
    Smartphone,
    Languages,
    Star,
    Sparkles
} from "lucide-react";
import styles from "./ristoranti.module.css";

export default function RistorantiLanding() {
    return (
        <div className={styles.container}>
            {/* Header / Nav */}
            <nav className={styles.nav}>
                <div className={styles.navContent}>
                    <div className={styles.logo}>
                        <Link href="/">
                            <img src="/logo.png" alt="SoloMenu" className={styles.logoImg} />
                        </Link>
                    </div>
                    <Link
                        href="/register"
                        className={styles.navBtn}
                    >
                        Provalo 7 Giorni Gratis
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className={styles.badge}>
                            <UtensilsCrossed size={14} /> Creato per Ristoranti d&apos;Eccellenza
                        </div>
                        <h1 className={styles.heroTitle}>
                            Il Menu Digitale che <br />
                            <span className={styles.highlight}>esalta i tuoi piatti.</span>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Smetti di stampare e inizia a stupire. Un&apos;interfaccia premium che riflette la qualità del tuo servizio, con traduzioni AI istantanee per i tuoi ospiti internazionali.
                        </p>
                        <div className={styles.heroActions}>
                            <Link href="/register" className={styles.mainBtn}>
                                Inizia ora (7 Giorni Gratis) <ChevronRight size={20} />
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={styles.heroVisual}
                    >
                        <div className={styles.mockupContainer}>
                            <img src="/assets/menu-hero.png" alt="Premium Menu Experience" className={styles.mockupImg} />
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className={styles.floatingCard}
                            >
                                <Sparkles size={16} className={styles.sparkleIcon} />
                                <span>Menu Multi-lingua AI</span>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Showcase Section */}
            <section className={styles.showcase}>
                <div className={styles.showcaseContent}>
                    <div className={styles.showcaseText}>
                        <h2 className={styles.sectionTitle}>Non solo un menu, <br />un sistema di marketing.</h2>
                        <ul className={styles.checkList}>
                            <li><Zap size={18} /> Aumenta lo scontrino medio</li>
                            <li><Zap size={18} /> Valorizza l'estetica dei tuoi piatti</li>
                            <li><Zap size={18} /> Elimina i costi di ristampa per errori</li>
                            <li><Zap size={18} /> Semplifica l'esperienza dei tuoi ospiti</li>
                        </ul>
                    </div>
                    <div className={styles.showcaseVisual}>
                        <img src="/assets/menu-beach.png" alt="Business efficiency" className={styles.showcaseImg} />
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className={styles.cta}>
                <div className={styles.ctaBox}>
                    <h2 className={styles.ctaTitle}>Il futuro del tuo ristorante inizia oggi.</h2>
                    <p className={styles.ctaSubtitle}>Unisciti a centinaia di ristoratori che hanno già digitalizzato il successo.</p>
                    <Link href="/register" className={styles.finalBtn}>Attiva Ora (7 Giorni Gratis)</Link>
                </div>
            </section>

            {/* Features Section - Moved to End */}
            <section className={styles.features}>
                <div className={styles.featuresGrid}>
                    <div className={styles.featureCard}>
                        <Languages className={styles.featureIcon} size={32} />
                        <h3 className={styles.featureTitle}>Oltre le Barriere</h3>
                        <p className={styles.featureText}>Traduzioni istantanee in tempo reale. I turisti ordineranno con fiducia nella loro lingua.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <Settings className={styles.featureIcon} size={32} />
                        <h3 className={styles.featureTitle}>Controllo Totale</h3>
                        <p className={styles.featureText}>Cambia prezzi, disponibilità o piatti speciali dallo smartphone in pochi secondi.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <Star className={styles.featureIcon} size={32} />
                        <h3 className={styles.featureTitle}>Esperienza Gourmet</h3>
                        <p className={styles.featureText}>Design raffinato, foto in alta risoluzione e caricamento istantaneo per il massimo del comfort.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
