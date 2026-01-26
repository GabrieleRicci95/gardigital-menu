import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.linksContainer}>
                <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
                <Link href="/terms" className={styles.link}>Termini e Condizioni</Link>
                <Link href="/cookies" className={styles.link}>Cookie Policy</Link>
            </div>
            <p>&copy; {new Date().getFullYear()} Gardigital Menu. Tutti i diritti riservati.</p>
        </footer>
    );
}
