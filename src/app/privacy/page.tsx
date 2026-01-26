import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import styles from '../legal.module.css';

export default function PrivacyPage() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <img src="/gardigital-logo-legal.png" alt="Gardigital" className={styles.logo} />
                    <Link href="/" className={styles.backLink}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                        Torna alla Home
                    </Link>
                    <h1 className={styles.title}>Privacy Policy</h1>
                </div>

                <div className={styles.text}>
                    <p style={{ fontStyle: 'italic', marginBottom: '2rem' }}>Ultimo aggiornamento: {new Date().toLocaleDateString()}</p>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>1. Introduzione</h2>
                        <p className={styles.text}>
                            Gardigital Menu ("noi", "nostro") si impegna a proteggere la tua privacy.
                            Questa Privacy Policy spiega come raccogliamo, utilizziamo e proteggiamo i tuoi dati personali.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>2. Dati Raccolti</h2>
                        <p className={styles.text}>Raccogliamo i seguenti dati necessari per l'erogazione del servizio:</p>
                        <ul className={styles.list}>
                            <li>Indirizzo email (per account e recupero password)</li>
                            <li>Dati relativi al ristorante (menu, immagini, descrizioni)</li>
                            <li>Dati di utilizzo del servizio</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>3. Finalità del Trattamento</h2>
                        <p className={styles.text}>Utilizziamo i tuoi dati per:</p>
                        <ul className={styles.list}>
                            <li>Fornire e mantenere il servizio</li>
                            <li>Gestire il tuo account e abbonamento</li>
                            <li>Inviare comunicazioni di servizio</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>4. Terze Parti</h2>
                        <p className={styles.text}>Potremmo condividere i dati con fornitori di servizi terzi strettamente necessari, come:</p>
                        <ul className={styles.list}>
                            <li>Processori di pagamento (Stripe)</li>
                            <li>Servizi di hosting e infrastruttura</li>
                            <li>Servizi di invio email</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>5. Contatti</h2>
                        <p className={styles.text}>
                            Per domande sulla privacy, contattaci all'indirizzo email di supporto.
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
}
