'use client';

import Link from "next/link";
import Footer from "@/components/layout/Footer";
import styles from "./page.module.css";

export default function ChiSiamo() {
    return (
        <div className={styles.container}>
            <header className={styles.header} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem 2rem',
                position: 'absolute',
                top: 0,
                width: '100%',
                zIndex: 100,
                background: 'transparent'
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {/* Logo removed as per user request */}
                </div>
                <nav style={{ display: 'flex', gap: '2rem' }}>
                    <Link href="/" style={{ color: 'white', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Home</Link>
                    <Link href="/login" style={{ color: 'white', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Area Clienti</Link>
                </nav>
            </header>

            {/* HERO */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        Il Futuro della Ristorazione<br />
                        <span className={styles.highlight}>è Adesso.</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Gardigital non è solo software. È l'ecosistema premium che trasforma il modo in cui i ristoratori lavorano, servono e crescono.
                    </p>
                </div>
            </section>

            {/* OUR STORY */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>La Nostra Storia</h2>

                <div className={styles.storyBlock}>
                    <div className={styles.storyText}>
                        <h3 className={styles.storyTitle}>Dall'Insofferenza all'Innovazione</h3>
                        <p className={styles.storyDesc}>
                            Tutto è nato da una cena. Un <strong>menu di carta plastificato</strong>, rovinato dal tempo, oppure un PDF lento e illeggibile su smartphone.
                            Ci siamo chiesti: <em>"Perché un ristorante carino deve avere un'esperienza così povera?"</em>.
                            Quella sera stessa abbiamo iniziato a disegnare <strong>Gardigital Menu</strong>. Non volevamo fare "un altro menu digitale".
                            Volevamo creare l'equivalente digitale di un servizio in guanti bianchi.
                        </p>
                    </div>
                    <div className={styles.storyImageContainer}>
                        <img src="/assets/chisiamo/story1.jpg" alt="Restaurant Experience" className={styles.storyImage} />
                    </div>
                </div>

                <div className={styles.storyBlock}>
                    <div className={styles.storyText}>
                        <h3 className={styles.storyTitle}>Oltre il Menu: L'Ecosistema</h3>
                        <p className={styles.storyDesc}>
                            Ben presto, i nostri ristoratori ci hanno chiesto di più. <em>"Il menu è bellissimo, ma ora aiutatemi a gestire il resto."</em>
                            Abbiamo ascoltato. Ed è nato il progetto <strong>Gardigital Master</strong>.
                            Attualmente è ancora in <strong>fase di produzione</strong> e perfezionamento. Non lo abbiamo ancora rilasciato perché teniamo troppo ai nostri clienti per offrire qualcosa che sia meno che perfetto.
                            Stiamo lavorando dietro le quinte per creare fluidità assoluta tra ordini, cassa e prenotazioni. Arriverà quando sarà impeccabile.
                        </p>
                    </div>
                    <div className={styles.storyImageContainer}>
                        <img src="/assets/chisiamo/story2.jpg" alt="Chef Tech" className={styles.storyImage} />
                    </div>
                </div>
            </section>

            {/* VALUES - DARK SECTION */}
            <section className={`${styles.section} ${styles.sectionAlt}`}>
                <div className={styles.sectionContent}>
                    <h2 className={styles.sectionTitle}>I Pilastri di Gardigital</h2>
                    <div className={styles.valuesGrid}>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>
                                {/* Diamond Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
                                    <path fillRule="evenodd" d="M12 2.25c.67 0 1.296.34 1.68.91l8.5 12.75a1.5 1.5 0 0 1 .09 1.594l-8.5 14.25a2.025 2.025 0 0 1-3.54 0l-8.5-14.25A1.5 1.5 0 0 1 1.82 15.91l8.5-12.75A2.025 2.025 0 0 1 12 2.25Zm0 2.25L4.5 16.5h15L12 4.5Z" clipRule="evenodd" style={{ display: 'none' }} />
                                    {/* Using a simpler Diamond shape */}
                                    <path d="M12.75 3.056a2.25 2.25 0 0 0-1.5 0L3.182 6.545a2.25 2.25 0 0 0-1.285 1.52l-1.096 4.93a2.25 2.25 0 0 0 .97 2.378l9.096 6.368a2.25 2.25 0 0 0 2.466 0l9.096-6.368a2.25 2.25 0 0 0 .97-2.378l-1.096-4.93a2.25 2.25 0 0 0-1.285-1.52L12.75 3.056ZM12 4.57 5.25 7.5h13.5L12 4.57ZM4.212 9 3.53 12.068l8.47 5.928V9H4.212Zm9.576 0v8.996l8.47-5.928L21.538 9h-7.75Z" />
                                </svg>
                            </div>
                            <h3 className={styles.valueTitle}>Design First</h3>
                            <p className={styles.valueDesc}>
                                In un mondo visivo, l'occhio vuole la sua parte. I nostri prodotti non servono solo a lavorare, ma ad affascinare i tuoi clienti.
                            </p>
                        </div>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>
                                {/* Lightning Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
                                    <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className={styles.valueTitle}>Velocità Estrema</h3>
                            <p className={styles.valueDesc}>
                                Il servizio di sala non aspetta. Abbiamo studiato ogni millisecondo per garantire fluidità assoluta, anche nei momenti di massima affluenza.
                            </p>
                        </div>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>
                                {/* Shield Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
                                    <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.352-.272-2.636-.777-3.801a.75.75 0 0 0-.722-.515H20.25a11.209 11.209 0 0 1-7.734-3.254Zm-4.906 7.616a.75.75 0 1 1 1.06-1.06l1.822 1.82 4.242-4.24a.75.75 0 1 1 1.061 1.06l-4.773 4.773a.75.75 0 0 1-1.06 0l-2.352-2.353Z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className={styles.valueTitle}>Affidabilità Totale</h3>
                            <p className={styles.valueDesc}>
                                Costruiamo su infrastrutture cloud di livello enterprise. Il tuo business non può fermarsi, e noi nemmeno.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS */}
            <section className={styles.section}>
                <div className={styles.statsRow}>
                    <div className={styles.statItem}>
                        <div className={styles.statNumber}>100%</div>
                        <div className={styles.statLabel}>Made in Italy</div>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.statNumber}>24/7</div>
                        <div className={styles.statLabel}>Monitoring</div>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.statNumber}>Premium</div>
                        <div className={styles.statLabel}>Quality Standards</div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.ctaSection}>
                <h2 className={styles.ctaTitle}>Pronto a fare il salto di qualità?</h2>
                <Link href="/contact?plan=Informazioni" className={styles.primaryBtn}>
                    Parla con noi
                </Link>
            </section>

            <Footer />
        </div>
    );
}
