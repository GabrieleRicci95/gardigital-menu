import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import styles from '../legal.module.css';

export default function TermsPage() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Link href="/" className={styles.backLink}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    Torna alla Home
                </Link>

                <h1 className={styles.title}>Termini e Condizioni</h1>

                <div className={styles.text}>
                    <p style={{ fontStyle: 'italic', marginBottom: '2rem' }}>Ultimo aggiornamento: {new Date().toLocaleDateString()}</p>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>1. Accettazione dei Termini</h2>
                        <p className={styles.text}>
                            Utilizzando Gardigital Menu, accetti di essere vincolato da questi Termini e Condizioni.
                            Se non accetti questi termini, ti preghiamo di non utilizzare il servizio.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>2. Descrizione del Servizio</h2>
                        <p className={styles.text}>
                            Gardigital Menu fornisce una piattaforma per la creazione e gestione di menu digitali per ristoranti.
                            Ci riserviamo il diritto di modificare o interrompere il servizio in qualsiasi momento.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>3. Account Utente</h2>
                        <p className={styles.text}>
                            Sei responsabile della sicurezza del tuo account e della password.
                            Non siamo responsabili per eventuali perdite derivanti dall'uso non autorizzato del tuo account.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>4. Abbonamenti e Pagamenti</h2>
                        <p className={styles.text}>
                            Alcune funzionalità richiedono un abbonamento a pagamento.
                            Tutti i pagamenti sono gestiti in modo sicuro tramite processori di pagamento terzi.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>5. Proprietà Intellettuale</h2>
                        <p className={styles.text}>
                            Mantieni la proprietà dei contenuti (foto, testi) che carichi.
                            Concedi a noi una licenza per ospitare e visualizzare tali contenuti al solo scopo di fornire il servizio.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>6. Legge Applicabile</h2>
                        <p className={styles.text}>
                            Questi termini sono regolati dalle leggi vigenti in Italia.
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
}
