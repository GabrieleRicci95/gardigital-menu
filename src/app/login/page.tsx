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
