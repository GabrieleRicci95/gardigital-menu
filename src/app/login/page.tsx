'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import styles from './login.module.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push(data.redirect || '/dashboard');
            } else {
                setError(data.error || 'Login fallito');
            }
        } catch (err) {
            setError('Si è verificato un errore');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.contentWrapper}>
                <div className={styles.card}>
                    <div style={{ textAlign: 'left' }}>
                        <Link href="/" className={styles.backLink}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                            Torna alla Home
                        </Link>
                    </div>
                    <h1 className={styles.title}>Gardigital Menu</h1>
                    <p className={styles.subtitle}>Accedi alla tua dashboard</p>

                    {error && <div className={styles.error}>{error}</div>}

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

                        <div className={styles.inputGroup}>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>

                        <button type="submit" className={styles.button}>Accedi</button>

                    </form>



                    <div className={styles.forgotPassword}>
                        <Link href="/forgot-password" className={styles.forgotPasswordLink}>
                            Password dimenticata?
                        </Link>
                    </div>

                    <p className={styles.footer}>
                        Non hai un account? <Link href="/register" className={styles.secondaryButton}>Registrati</Link>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
