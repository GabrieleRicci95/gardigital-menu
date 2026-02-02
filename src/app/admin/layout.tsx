'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import styles from './admin-layout.module.css';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { label: 'Panoramica', href: '/admin' },
        { label: 'Ristoranti', href: '/admin/restaurants' },
        { label: 'Abbonamenti', href: '/admin/subscriptions' },
        { label: 'Utenti', href: '/admin/users' },
    ];

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/';
    };

    return (
        <div className={styles.layout}>
            <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.open : ''}`}>
                <div className={styles.logo} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <img src="/gardigital_logo.png" alt="Gardigital" style={{ height: '100px' }} />
                    <span style={{ fontSize: '0.6em', color: '#ff9800', verticalAlign: 'middle', border: '1px solid #ff9800', padding: '2px 4px', borderRadius: '4px' }}>ADMIN</span>
                </div>
                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <button onClick={handleLogout} className={`${styles.navItem} ${styles.logout}`}>
                        Esci
                    </button>
                </nav>
            </aside>

            <main className={styles.main}>
                <header className={styles.header}>
                    <button
                        className={styles.mobileToggle}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', marginRight: 'auto' }}
                    >
                        ☰
                    </button>
                    <div className={styles.userMenu}>
                        Pannello Amministratore
                    </div>
                </header>
                {isMobileMenuOpen && (
                    <div
                        className={styles.overlay}
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 45
                        }}
                    />
                )}
                <div className={styles.content}>
                    {children}
                </div>
            </main>
        </div>
    );
}
