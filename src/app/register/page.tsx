'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../login/login.module.css'; // Reuse login styles

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password || !name) {
            setError('Tutti i campi sono obbligatori');
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push(data.redirect || '/onboarding');
            } else {
                setError(data.error || 'Registrazione fallita');
            }
        } catch (err) {
            setError('Si è verificato un errore');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
                    <Link href="/" style={{ textDecoration: 'none', color: '#666', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                        ← Home
                    </Link>
                </div>
                <h1 className={styles.title}>Unisciti a Noi</h1>
                <p className={styles.subtitle}>Crea il tuo menu digitale oggi</p>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="name">Nome e Cognome</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Mario Rossi"
                            required
                        />
                    </div>
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

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            minLength={6}
                        />
                    </div>

                    <button type="submit" className={styles.button}>Registrati</button>
                </form>

                <p className={styles.footer}>
                    Hai già un account? <Link href="/login">Accedi</Link>
                </p>
            </div>
        </div>
    );
}
