'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './CookieBanner.module.css';

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already accepted cookies
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className={styles.banner}>
            <div className={styles.content}>
                <p>
                    Utilizziamo i cookie per migliorare la tua esperienza. Continuando a navigare accetti la nostra{' '}
                    <Link href="/cookies" className={styles.link}>Cookie Policy</Link>.
                </p>
                <div className={styles.actions}>
                    <button onClick={handleAccept} className={styles.button}>
                        Accetto
                    </button>
                </div>
            </div>
        </div>
    );
}
