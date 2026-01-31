import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import styles from './vantaggi.module.css';

const TraditionalIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
);

const DigitalIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
);

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
                    <h1 className={styles.title}>Il Futuro del tuo Ristorante è Digitale.</h1>
                    <p className={styles.subtitle}>
                        Elimina gli sprechi, accogli i turisti e aumenta le prenotazioni. Scopri perché Gardigital Menu è la scelta dei ristoratori d'eccellenza.
                    </p>
                </section>

                <div className={styles.section}>
                    <div className={styles.mainPricingCard}>
                        {/* Comparison Header */}
                        <div className={styles.comparisonHeader}>
                            <div className={`${styles.headerCol} ${styles.headerTraditional}`}>
                                <TraditionalIcon /> Gestione Tradizionale
                            </div>
                            <div className={`${styles.headerCol} ${styles.headerDigital}`}>
                                <DigitalIcon /> Esperienza Gardigital
                            </div>
                        </div>

                        {/* Rows */}
                        <div className={styles.comparisonBody}>
                            {/* Row 1: Updates */}
                            <div className={styles.comparisonRow}>
                                <div className={`${styles.cell} ${styles.cellTraditional}`}>
                                    <div className={`${styles.featureIcon} ${styles.iconRed}`}>📄</div>
                                    <div className={styles.featureLabel}>Menu Cartaceo</div>
                                    <p className={styles.featureDesc}>Costi di ristampa per ogni cambio prezzo. Errori corretti a penna che danno un'immagine trascurata.</p>
                                </div>
                                <div className={`${styles.cell} ${styles.cellDigital}`}>
                                    <div className={`${styles.featureIcon} ${styles.iconGreen}`}>⚡</div>
                                    <div className={styles.featureLabel}>Aggiornamenti Live</div>
                                    <p className={styles.featureDesc}>Cambia prezzi e piatti in un secondo. Sincronizzazione istantanea su tutti i QR Code del ristorante.</p>
                                </div>
                            </div>

                            {/* Row 2: Languages */}
                            <div className={styles.comparisonRow}>
                                <div className={`${styles.cell} ${styles.cellTraditional}`}>
                                    <div className={`${styles.featureIcon} ${styles.iconRed}`}>🌐</div>
                                    <div className={styles.featureLabel}>Barriere Linguistiche</div>
                                    <p className={styles.featureDesc}>Difficoltà di comunicazione con i turisti. Ordini rallentati e rischio di allergie non segnalate correttamente.</p>
                                </div>
                                <div className={`${styles.cell} ${styles.cellDigital}`}>
                                    <div className={`${styles.featureIcon} ${styles.iconGreen}`}>🌍</div>
                                    <div className={styles.featureLabel}>DeepL AI Integration</div>
                                    <p className={styles.featureDesc}>Traduzione istantanea in 4 lingue. I tuoi clienti stranieri ordinano con totale sicurezza e autonomia.</p>
                                </div>
                            </div>

                            {/* Row 3: Reservations */}
                            <div className={styles.comparisonRow}>
                                <div className={`${styles.cell} ${styles.cellTraditional}`}>
                                    <div className={`${styles.featureIcon} ${styles.iconRed}`}>📞</div>
                                    <div className={styles.featureLabel}>Telefono Sempre Occupato</div>
                                    <p className={styles.featureDesc}>Clienti persi perché non rispondi durante il servizio. Errori umani nel segnare le date.</p>
                                </div>
                                <div className={`${styles.cell} ${styles.cellDigital}`}>
                                    <div className={`${styles.featureIcon} ${styles.iconGreen}`}>📅</div>
                                    <div className={styles.featureLabel}>Agenda & WhatsApp</div>
                                    <p className={styles.featureDesc}>Ricevi prenotazioni 24/7. Organizzate automaticamente in un'agenda chiara e professionale.</p>
                                </div>
                            </div>

                            {/* Row 4: Visuals */}
                            <div className={styles.comparisonRow}>
                                <div className={`${styles.cell} ${styles.cellTraditional}`}>
                                    <div className={`${styles.featureIcon} ${styles.iconRed}`}>🖼️</div>
                                    <div className={styles.featureLabel}>Nessun Impatto Visivo</div>
                                    <p className={styles.featureDesc}>Il cliente non vede cosa sta comprando. Si fida solo del nome del piatto, limitando l'ordine.</p>
                                </div>
                                <div className={`${styles.cell} ${styles.cellDigital}`}>
                                    <div className={`${styles.featureIcon} ${styles.iconGreen}`}>📸</div>
                                    <div className={styles.featureLabel}>Gallery ad alta Definizone</div>
                                    <p className={styles.featureDesc}>Foto mozzafiato che aumentano lo scontrino medio del 15-20%. Il cibo si guarda prima con gli occhi.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <section className={styles.howItWorks}>
                    <h2 className={styles.howTitle}>Come funziona in 3 passi</h2>
                    <div className={styles.stepsGrid}>
                        <div className={styles.stepCard}>
                            <div className={styles.stepNumber}>01</div>
                            <h3 className={styles.stepTitle}>Creazione Menu</h3>
                            <p className={styles.featureDesc}>Carichi i tuoi piatti e le tue foto nella dashboard intuitiva. Ci vogliono pochi minuti.</p>
                        </div>
                        <div className={styles.stepCard}>
                            <div className={styles.stepNumber}>02</div>
                            <h3 className={styles.stepTitle}>AI Translation</h3>
                            <p className={styles.featureDesc}>L'intelligenza artificiale traduce automaticamente tutto il tuo contenuto per i turisti.</p>
                        </div>
                        <div className={styles.stepCard}>
                            <div className={styles.stepNumber}>03</div>
                            <h3 className={styles.stepTitle}>QR Code alle Tavole</h3>
                            <p className={styles.featureDesc}>I tuoi clienti inquadrano e iniziano l'esperienza. Niente app, solo velocità.</p>
                        </div>
                    </div>
                </section>

                <section className={styles.ctaSection}>
                    <h2 className={styles.ctaTitle}>Porta il tuo locale al livello successivo.</h2>
                    <Link href="/contact?plan=Informazioni" className={styles.primaryBtn}>
                        Richiedi Informazioni Gratis
                    </Link>
                </section>
            </main>

            <Footer />
        </div>
    );
}
