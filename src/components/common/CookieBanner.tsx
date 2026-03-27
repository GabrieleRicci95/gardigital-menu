'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './CookieBanner.module.css';

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Native App check
        const params = new URLSearchParams(window.location.search);
        const ua = navigator.userAgent || '';
        const isWebView = /Android/i.test(ua) && /Version\/[0-9.]+/i.test(ua);
        const isStandalone = (window.matchMedia('(display-mode: standalone)').matches) || (navigator as any).standalone;
        const isCapacitorNative = (window as any).Capacitor?.isNativePlatform?.() === true;
        const hasSession = sessionStorage.getItem('isAppMode') === 'true';

        if (params.get('platform') === 'app' || hasSession || isWebView || isStandalone || isCapacitorNative) {
            sessionStorage.setItem('isAppMode', 'true');
            return; // Don't show cookie banner in native apps
        }

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
        <>
            <div className={styles.overlay} />
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
        </>
    );
}
