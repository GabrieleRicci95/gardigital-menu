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
                    Scegli come preferisci contattarci. Siamo a tua disposizione per qualsiasi dubbio o richiesta.
                </p>

                <div className={styles.directContacts}>
                    <a href="https://wa.me/393513487580" target="_blank" rel="noopener noreferrer" className={`${styles.contactCard} ${styles.whatsappCard}`}>
                        <div className={styles.contactIcon}>
                            <svg viewBox="0 0 24 24" fill="#25D366" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                        </div>
                        <span className={styles.contactLabel}>WhatsApp</span>
                        <span className={styles.contactValue}>351 348 7580</span>
                    </a>
                    <a href="mailto:gardigital16@gmail.com" className={`${styles.contactCard} ${styles.emailCard}`}>
                        <div className={styles.contactIcon}>
                            <svg viewBox="0 0 24 24" fill="#ffd700" xmlns="http://www.w3.org/2000/svg"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                        </div>
                        <span className={styles.contactLabel}>Email</span>
                        <span className={styles.contactValue}>gardigital16@gmail.com</span>
                    </a>
                </div>

                <div className={styles.divider}></div>

                <Suspense fallback={<div>Caricamento...</div>}>
                    <ContactForm />
                </Suspense>
            </div>
        </div>
    );
}
