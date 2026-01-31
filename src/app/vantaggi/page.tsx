import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import styles from './vantaggi.module.css';

export default function VantaggiPage() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.logo}>
                    <Link href="/">
                        <img src="/gardigital-logo-header.png" alt="Gardigital Menu" className={styles.logoImage} />
                    </Link>
                </div>
                <nav className={styles.nav}>
                    <Link href="/login" className={styles.navLink}>Accedi</Link>
                </nav>
            </header>

            <main>
                <section className={styles.hero}>
                    <h1 className={styles.title}>Perché scegliere Gardigital Menu?</h1>
                    <p className={styles.subtitle}>
                        Il confronto definitivo tra la gestione tradizionale e l'evoluzione digitale per il tuo ristorante.
                    </p>
                </section>

                <div className={styles.section}>
                    <div className={styles.comparisonSection}>
                        <div className={styles.comparisonGrid}>
                            {/* Traditional Column */}
                            <div className={`${styles.comparisonColumn} ${styles.traditional}`}>
                                <h2 className={styles.columnTitle}>
                                    <span>❌</span> Senza Gardigital
                                </h2>
                                <ul className={styles.featureList}>
                                    <li className={styles.featureItem}>
                                        <div className={styles.featureName}>
                                            <span className={`${styles.badge} ${styles.badgeBad}`}>Lento</span>
                                            Menu Cartaceo
                                        </div>
                                        <p className={styles.featureDesc}>Ogni piccola modifica ai prezzi o ai piatti richiede una nuova ristampa. Costoso e poco ecologico.</p>
                                    </li>
                                    <li className={styles.featureItem}>
                                        <div className={styles.featureName}>
                                            <span className={`${styles.badge} ${styles.badgeBad}`}>Nullo</span>
                                            Barriera Linguistica
                                        </div>
                                        <p className={styles.featureDesc}>I turisti stranieri fanno fatica a capire gli ingredienti. Rischio di incomprensioni e ordini sbagliati.</p>
                                    </li>
                                    <li className={styles.featureItem}>
                                        <div className={styles.featureName}>
                                            <span className={`${styles.badge} ${styles.badgeBad}`}>Statico</span>
                                            Nessuna Immagine
                                        </div>
                                        <p className={styles.featureDesc}>Il cliente deve "immaginare" il piatto. Le foto vendono più delle descrizioni, ma nel cartaceo non c'è spazio.</p>
                                    </li>
                                    <li className={styles.featureItem}>
                                        <div className={styles.featureName}>
                                            <span className={`${styles.badge} ${styles.badgeBad}`}>Inefficiente</span>
                                            Prenotazioni solo via Telefono
                                        </div>
                                        <p className={styles.featureDesc}>Interruzioni continue durante il servizio. Errori nella trascrizione e perdita di potenziali clienti fuori orario.</p>
                                    </li>
                                    <li className={styles.featureItem}>
                                        <div className={styles.featureName}>
                                            <span className={`${styles.badge} ${styles.badgeBad}`}>Invisibile</span>
                                            Zero Dati
                                        </div>
                                        <p className={styles.featureDesc}>Non sai quali piatti sono i più visti o quali categorie attirano di più. Navighi al buio senza statistiche.</p>
                                    </li>
                                </ul>
                            </div>

                            {/* Digital Column */}
                            <div className={`${styles.comparisonColumn} ${styles.digital}`}>
                                <h2 className={styles.columnTitle}>
                                    <span>✅</span> Con Gardigital Menu
                                </h2>
                                <ul className={styles.featureList}>
                                    <li className={styles.featureItem}>
                                        <div className={styles.featureName}>
                                            <span className={`${styles.badge} ${styles.badgeGood}`}>Istantaneo</span>
                                            Aggiornamenti in Tempo Reale
                                        </div>
                                        <p className={styles.featureDesc}>Cambia un prezzo o nascondi un piatto esaurito in un secondo dal tuo smartphone. Mai più scuse con i clienti.</p>
                                    </li>
                                    <li className={styles.featureItem}>
                                        <div className={styles.featureName}>
                                            <span className={`${styles.badge} ${styles.badgeGood}`}>Illimitato</span>
                                            Traduzione AI Multilingua
                                        </div>
                                        <p className={styles.featureDesc}>DeepL traduce il tuo menu in inglese, francese e tedesco. Il cliente si sente a casa e ordina con fiducia.</p>
                                    </li>
                                    <li className={styles.featureItem}>
                                        <div className={styles.featureName}>
                                            <span className={`${styles.badge} ${styles.badgeGood}`}>Vibrante</span>
                                            Menu Visivo Premium
                                        </div>
                                        <p className={styles.featureDesc}>Supporto per foto di alta qualità, descrizioni ricche e allergene filtrabili. Un'esperienza che stuzzica l'appetito.</p>
                                    </li>
                                    <li className={styles.featureItem}>
                                        <div className={styles.featureName}>
                                            <span className={`${styles.badge} ${styles.badgeGood}`}>Automatico</span>
                                            Prenotazioni WhatsApp & Web
                                        </div>
                                        <p className={styles.featureDesc}>Ricevi prenotazioni pulite su WhatsApp e gestiscile su un'agenda elettronica dedicata. Più tempo per i tuoi tavoli.</p>
                                    </li>
                                    <li className={styles.featureItem}>
                                        <div className={styles.featureName}>
                                            <span className={`${styles.badge} ${styles.badgeGood}`}>Analitico</span>
                                            Statistiche & Insights
                                        </div>
                                        <p className={styles.featureDesc}>Scopri i piatti più popolari e le lingue più usate. Prendi decisioni basate sui dati reali delle visite.</p>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className={styles.ctaSection}>
                            <Link href="/contact?plan=Informazioni" className={styles.primaryBtn}>
                                Voglio digitalizzare il mio locale 🚀
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
