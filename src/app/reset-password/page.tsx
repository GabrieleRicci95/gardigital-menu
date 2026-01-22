'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../login/login.module.css';

function ResetPasswordForm() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('Le password non coincidono');
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                setTimeout(() => router.push('/login'), 2000);
            } else {
                setError(data.error || 'Errore durante il reset');
            }
        } catch (err) {
            setError('Si è verificato un errore');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.error}>Token mancante o non valido.</div>
                    <p className={styles.footer}>
                        <Link href="/login" className={styles.secondaryButton}>Torna al Login</Link>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Nuova Password</h1>
                <p className={styles.subtitle}>Inserisci la tua nuova password</p>

                {error && <div className={styles.error}>{error}</div>}
                {message && <div className={styles.success} style={{ color: 'green', marginBottom: '1rem', textAlign: 'center' }}>{message}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Nuova Password</label>
                        <input
                            type="password"
                            id="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="confirmPassword">Conferma Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className={styles.button} disabled={isLoading}>
                        {isLoading ? 'Aggiornamento...' : 'Aggiorna Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Caricamento...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
