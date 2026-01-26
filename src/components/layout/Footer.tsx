'use client';

import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    const resetCookies = () => {
        localStorage.removeItem('cookieConsent');
        window.location.reload();
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.linksContainer}>
                <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
                <Link href="/terms" className={styles.link}>Termini e Condizioni</Link>
                <Link href="/cookies" className={styles.link}>Cookie Policy</Link>
                <button
                    onClick={resetCookies}
                    className={styles.link}
                    style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}
                >
                    Gestisci Cookie
                </button>
            </div>
            <p>&copy; {new Date().getFullYear()} Gardigital Menu. Tutti i diritti riservati.</p>
        </footer>
    );
}
