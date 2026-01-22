'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../login/login.module.css'; // Reusing login styles

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
            } else {
                setError(data.error || 'Errore durante la richiesta');
            }
        } catch (err) {
            setError('Si è verificato un errore');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Password Dimenticata</h1>
                <p className={styles.subtitle}>Inserisci la tua email per reimpostare la password</p>

                {error && <div className={styles.error}>{error}</div>}
                {message && <div className={styles.success} style={{ color: 'green', marginBottom: '1rem', textAlign: 'center' }}>{message}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="iltuo@ristorante.com"
                        />
                    </div>

                    <button type="submit" className={styles.button} disabled={isLoading}>
                        {isLoading ? 'Invio in corso...' : 'Invia Link di Reset'}
                    </button>
                </form>

                <p className={styles.footer}>
                    <Link href="/login" className={styles.secondaryButton}>Torna al Login</Link>
                </p>
            </div>
        </div>
    );
}
