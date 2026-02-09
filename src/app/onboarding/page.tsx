'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './onboarding.module.css';

export default function OnboardingPage() {
    const router = useRouter();

    useEffect(() => {
        // Track Google Ads Conversion for Registration
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'conversion', {
                'send_to': 'AW-17928402861/Z5sFCKSDx_QBEO3v9uQC',
                'value': 1.0,
                'currency': 'EUR'
            });
        }

        // Check if already active
        const checkStatus = async () => {
            try {
                const t = Date.now();
                const res = await fetch(`/api/restaurant?t=${t}`);
                if (res.ok) {
                    const data = await res.json();
                    const sub = data.restaurant?.subscription;

                    if (sub && sub.status === 'ACTIVE') {
                        router.push('/dashboard');
                    }
                }
            } catch (error) {
                console.error("Check failed", error);
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, [router]);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <div className={styles.container}>
            <button onClick={handleLogout} className={styles.logoutButton}>
                Esci
            </button>
            <div className={styles.card}>
                <div className={styles.iconWrapper}>⏳</div>
                <h1 className={styles.title}>Attivazione in Corso</h1>
                <p className={styles.text}>
                    Grazie per esserti registrato!<br />
                    Il tuo account è attualmente <strong>in attesa di revisione</strong>.
                </p>

                <div className={styles.statusBox}>
                    Un amministratore attiverà il tuo profilo a breve.<br />
                    Non devi fare nulla, questa pagina si aggiornerà automaticamente appena sarai attivo.
                </div>

                <div className={styles.footerText}>
                    <p>Se hai fretta o desideri maggiori informazioni, contattaci.</p>
                    <a href="/contact" className={styles.contactLink}>
                        Contatta Supporto &rarr;
                    </a>
                </div>
            </div>
        </div>
    );
}
