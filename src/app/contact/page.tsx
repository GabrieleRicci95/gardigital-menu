'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './contact.module.css';

function ContactForm() {
    const searchParams = useSearchParams();
    const plan = searchParams.get('plan') || 'Generico';

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className={styles.successMessage}>
                <h2>Grazie per averci contattato! 📩</h2>
                <p>Abbiamo ricevuto la tua richiesta per il piano <strong>{plan}</strong>.</p>
                <p>Ti risponderemo il prima possibile.</p>
                <a href="/" className={styles.premiumBtn} style={{ marginTop: '20px', display: 'inline-block', textDecoration: 'none' }}>Torna alla Home</a>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <input type="hidden" name="plan" value={plan} />

            <div className={styles.formGroup}>
                <label>Nome e Cognome</label>
                <input type="text" name="name" required placeholder="Mario Rossi" />
            </div>

            <div className={styles.formGroup}>
                <label>Email</label>
                <input type="email" name="email" required placeholder="mario@email.com" />
            </div>

            <div className={styles.formGroup}>
                <label>Telefono (Opzionale)</label>
                <input type="tel" name="phone" placeholder="+39 333..." />
            </div>

            <div className={styles.formGroup}>
                <label>Messaggio / Richiesta</label>
                <textarea name="message" rows={4} defaultValue={`Sono interessato al Piano ${plan}. Vorrei maggiori informazioni.`}></textarea>
            </div>

            <button type="submit" disabled={status === 'loading'} className={styles.premiumBtn}>
                {status === 'loading' ? 'Invio in corso...' : 'Invia Richiesta'}
            </button>

            {status === 'error' && <p className={styles.error}>Errore nell'invio. Riprova più tardi.</p>}
        </form>
    );
}

export default function ContactPage() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className="h2" style={{
                    textAlign: 'center',
                    marginBottom: '1rem',
                    fontFamily: 'var(--font-family-serif)',
                    fontSize: '2.5rem',
                    color: '#0d1b2a'
                }}>
                    Contattaci
                </h1>
                <p style={{
                    textAlign: 'center',
                    color: '#666',
                    marginBottom: '2.5rem',
                    lineHeight: '1.6'
                }}>
                    Compila il modulo per richiedere informazioni o attivare il piano.
                    <br />Ti risponderemo in giornata.
                </p>
                <Suspense fallback={<div>Caricamento...</div>}>
                    <ContactForm />
                </Suspense>
            </div>
        </div>
    );
}
