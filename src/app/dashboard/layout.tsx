'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './dashboard.module.css';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter(); // Import useRouter
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const checkSubscription = async () => {
            try {
                const res = await fetch('/api/restaurant');
                if (res.ok) {
                    const data = await res.json();
                    if (!data.restaurant?.subscription) {
                        router.push('/onboarding');
                    }
                }
            } catch (error) {
                console.error("Subscription check failed", error);
            }
        };
        checkSubscription();
    }, [router]);

    const navItems = [
        { label: 'Panoramica', href: '/dashboard', icon: 'Items' },
        { label: 'Il mio Ristorante', href: '/dashboard/restaurant', icon: 'Store' },
        { label: 'Menu', href: '/dashboard/menu', icon: 'Menu' },
        { label: 'Aspetto & Design', href: '/dashboard/design', icon: 'Palette' },
        { label: 'QR Code', href: '/dashboard/qrcode', icon: 'QR' },
    ];

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/';
    };

    return (
        <div className={styles.layout}>
            <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.open : ''}`}>
                <div className={styles.logo}>
                    <img src="/logo_dashboard.png" alt="Logo" className={styles.logoImage} />
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
                    <button className={styles.mobileToggle} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        Menu
                    </button>
                    <div className={styles.userMenu}>
                        Bentornato, Ristoratore
                    </div>
                </header>
                <div className={styles.content}>
                    {children}
                </div>
            </main>
        </div>
    );
}
