'use client';

import Link from 'next/link';
import styles from './Footer.module.css';
import { useIsAndroid } from '@/lib/hooks/useIsAndroid';

export default function Footer() {
    const isAndroid = useIsAndroid();

    if (isAndroid) return null;

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
