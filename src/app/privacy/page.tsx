import Link from 'next/link';
import styles from '../page.module.css';

export default function PrivacyPage() {
    return (
        <div className={styles.container}>
            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <Link href="/" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
                        ← Torna alla Home
                    </Link>
                </div>

                <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Privacy Policy</h1>

                <div style={{ lineHeight: '1.6', color: 'var(--color-text-main)' }}>
                    <p style={{ marginBottom: '2rem', fontStyle: 'italic' }}>Ultimo aggiornamento: {new Date().toLocaleDateString()}</p>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>1. Introduzione</h2>
                        <p>
                            Gardigital Menu ("noi", "nostro") si impegna a proteggere la tua privacy.
                            Questa Privacy Policy spiega come raccogliamo, utilizziamo e proteggiamo i tuoi dati personali.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>2. Dati Raccolti</h2>
                        <p>Raccogliamo i seguenti dati necessari per l'erogazione del servizio:</p>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li>Indirizzo email (per account e recupero password)</li>
                            <li>Dati relativi al ristorante (menu, immagini, descrizioni)</li>
                            <li>Dati di utilizzo del servizio</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>3. Finalità del Trattamento</h2>
                        <p>Utilizziamo i tuoi dati per:</p>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li>Fornire e mantenere il servizio</li>
                            <li>Gestire il tuo account e abbonamento</li>
                            <li>Inviare comunicazioni di servizio</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>4. Terze Parti</h2>
                        <p>Potremmo condividere i dati con fornitori di servizi terzi strettamente necessari, come:</p>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li>Processori di pagamento (Stripe)</li>
                            <li>Servizi di hosting e infrastruttura</li>
                            <li>Servizi di invio email</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>5. Contatti</h2>
                        <p>
                            Per domande sulla privacy, contattaci all'indirizzo email di supporto.
                        </p>
                    </section>
                </div>
            </main>

            <footer className={styles.footer}>
                <p>&copy; {new Date().getFullYear()} Gardigital Menu. Tutti i diritti riservati.</p>
            </footer>
        </div>
    );
}
