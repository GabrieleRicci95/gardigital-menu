'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    const [isAppMode, setIsAppMode] = useState(false);

    useEffect(() => {
        const checkAppMode = () => {
            if (typeof window === 'undefined') return;

            const params = new URLSearchParams(window.location.search);
            const ua = navigator.userAgent || '';

            const hasParam = params.get('platform') === 'app';
            const hasSession = sessionStorage.getItem('isAppMode') === 'true';
            const isWebView = /Android/i.test(ua) && /Version\/[0-9.]+/i.test(ua);
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;

            if (hasParam || hasSession || isWebView || isStandalone) {
                setIsAppMode(true);
            }
        };
        checkAppMode();
    }, []);

    if (isAppMode) return null;

    return (
        <footer className={styles.footer}>
            <div className={styles.linksContainer}>
                <Link href="/chi-siamo" className={styles.link}>Chi Siamo</Link>
                <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
                <Link href="/terms" className={styles.link}>Termini e Condizioni</Link>
                <Link href="/cookies" className={styles.link}>Cookie Policy</Link>
            </div>
            <p>&copy; {new Date().getFullYear()} Gardigital Menu. Tutti i diritti riservati.</p>
        </footer>
    );
}
