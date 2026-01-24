import Link from 'next/link';
import styles from '../page.module.css';

export default function TermsPage() {
    return (
        <div className={styles.container}>
            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <Link href="/" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
                        ← Torna alla Home
                    </Link>
                </div>

                <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Termini e Condizioni</h1>

                <div style={{ lineHeight: '1.6', color: 'var(--color-text-main)' }}>
                    <p style={{ marginBottom: '2rem', fontStyle: 'italic' }}>Ultimo aggiornamento: {new Date().toLocaleDateString()}</p>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>1. Accettazione dei Termini</h2>
                        <p>
                            Utilizzando Gardigital Menu, accetti di essere vincolato da questi Termini e Condizioni.
                            Se non accetti questi termini, ti preghiamo di non utilizzare il servizio.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>2. Descrizione del Servizio</h2>
                        <p>
                            Gardigital Menu fornisce una piattaforma per la creazione e gestione di menu digitali per ristoranti.
                            Ci riserviamo il diritto di modificare o interrompere il servizio in qualsiasi momento.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>3. Account Utente</h2>
                        <p>
                            Sei responsabile della sicurezza del tuo account e della password.
                            Non siamo responsabili per eventuali perdite derivanti dall'uso non autorizzato del tuo account.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>4. Abbonamenti e Pagamenti</h2>
                        <p>
                            Alcune funzionalità richiedono un abbonamento a pagamento.
                            Tutti i pagamenti sono gestiti in modo sicuro tramite processori di pagamento terzi.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>5. Proprietà Intellettuale</h2>
                        <p>
                            Mantieni la proprietà dei contenuti (foto, testi) che carichi.
                            Concedi a noi una licenza per ospitare e visualizzare tali contenuti al solo scopo di fornire il servizio.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>6. Legge Applicabile</h2>
                        <p>
                            Questi termini sono regolati dalle leggi vigenti in Italia.
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
