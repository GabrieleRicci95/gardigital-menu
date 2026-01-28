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

    const [restaurantName, setRestaurantName] = useState('');

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const res = await fetch('/api/restaurant');
                if (res.ok) {
                    const data = await res.json();
                    if (data.restaurant) {
                        setRestaurantName(data.restaurant.name);
                        if (!data.restaurant.subscription) {
                            router.push('/onboarding');
                        }
                    }
                }
            } catch (error) {
                console.error("Restaurant data fetch failed", error);
            }
        };
        fetchRestaurantData();
    }, [router]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMobileMenuOpen]);

    const navItems = [
        { label: 'Panoramica', href: '/dashboard', icon: 'Items' },
        { label: 'Il mio Ristorante', href: '/dashboard/restaurant', icon: 'Store' },
        { label: 'Menu', href: '/dashboard/menu', icon: 'Menu' },
        { label: 'Menu Fissi', href: '/dashboard/fixed-menus', icon: 'Star' },
        { label: 'Carta dei Vini', href: '/dashboard/wine-list', icon: 'Wine' },
        { label: 'Carta Champagne', href: '/dashboard/champagne-list', icon: 'Glass' }, // Added icon
        { label: 'Aspetto & Design', href: '/dashboard/design', icon: 'Palette' },
        { label: 'QR Code', href: '/dashboard/qrcode', icon: 'QR' },
    ];

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/';
    };

    // Swipe to close logic
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        if (isLeftSwipe) {
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <div className={styles.layout}>
            <aside
                className={`${styles.sidebar} ${isMobileMenuOpen ? styles.open : ''}`}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div className={styles.logo}>
                    <img src="/logo_dashboard.png" alt="Logo" className={styles.logoImage} />
                </div>
                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
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
                        Bentornato {restaurantName || 'Ristoratore'}
                    </div>
                </header>
                <div className={styles.content}>
                    {children}
                </div>
            </main>
        </div>
    );
}
