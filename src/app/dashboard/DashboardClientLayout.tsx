'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './dashboard.module.css';

export default function DashboardClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter(); // Import useRouter
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [restaurantName, setRestaurantName] = useState('');
    const [restaurantSlug, setRestaurantSlug] = useState('');
    const [ownerEmail, setOwnerEmail] = useState('');
    const [subscriptionPlan, setSubscriptionPlan] = useState<string>('BASE');
    const [isWineActive, setIsWineActive] = useState(false);
    const [isChampagneActive, setIsChampagneActive] = useState(false);
    const [isDrinkActive, setIsDrinkActive] = useState(false);
    const [restaurantLogo, setRestaurantLogo] = useState<string | null>(null);
    const [customModules, setCustomModules] = useState<{ name: string, slug: string }[]>([]);

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const res = await fetch('/api/restaurant');
                if (res.ok) {
                    const data = await res.json();
                    if (data.restaurant) {
                        setRestaurantName(data.restaurant.name);
                        setRestaurantSlug(data.restaurant.slug);
                        setOwnerEmail(data.restaurant.owner?.email || '');
                        setIsWineActive(!!data.restaurant.wineList?.isActive);
                        setIsChampagneActive(!!data.restaurant.champagneList?.isActive);
                        setIsDrinkActive(!!data.restaurant.drinkList?.isActive);
                        setRestaurantLogo(data.restaurant.logoUrl || null);
                        setCustomModules(data.restaurant.customLists || []);
                        if (data.restaurant.subscription) {
                            setSubscriptionPlan(data.restaurant.subscription.plan);
                        } else {
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
        { label: 'Agenda', href: '/dashboard/reservations', icon: 'Calendar', requiresFull: true },
        { label: 'Il mio Ristorante', href: '/dashboard/restaurant', icon: 'Store' },
        { label: 'Menu', href: '/dashboard/menu', icon: 'Menu' },
        { label: 'Menu Fissi', href: '/dashboard/fixed-menus', icon: 'Star' },
        { label: 'Vini/Bollicine', href: '/dashboard/wine-list', icon: 'Wine' },
        { label: 'Champagne', href: '/dashboard/champagne-list', icon: 'Glass' },
        { label: 'Drink', href: '/dashboard/drink-list', icon: 'Cocktail' },
        // Add Gin Selection here if it's in custom modules
        ...customModules
            .filter(m => m.name.toLowerCase().includes('gin'))
            .map(m => ({
                label: m.name,
                href: `/dashboard/custom-list/${m.slug}`,
                icon: 'Layers'
            })),
        { label: 'Aspetto & Design', href: '/dashboard/design', icon: 'Palette' },
        { label: 'QR Code', href: '/dashboard/qrcode', icon: 'QR' },
        // Add other custom modules that are not Gin Selection
        ...customModules
            .filter(m => !m.name.toLowerCase().includes('gin'))
            .map(m => ({
                label: m.name,
                href: `/dashboard/custom-list/${m.slug}`,
                icon: 'Layers'
            }))
    ]
        .filter((item: any) => {
            if (item.requiresFull && subscriptionPlan !== 'FULL') return false;

            const isDemo = restaurantSlug?.toLowerCase() === 'demo' ||
                ownerEmail?.toLowerCase() === 'demo@gardigital.it' ||
                restaurantName?.toLowerCase().includes('demo');

            // Hide special lists if not active for normal users
            if (item.label === 'Vini/Bollicine' && (!isWineActive || isDemo)) return false;
            if (item.label === 'Champagne' && (!isChampagneActive || isDemo)) return false;
            if (item.label === 'Drink' && (!isDrinkActive || isDemo)) return false;

            return true;
        });

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
                    {restaurantSlug?.toLowerCase() === 'demo' || ownerEmail?.toLowerCase() === 'demo@gardigital.it' || restaurantName?.toLowerCase().includes('demo') ? (
                        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>Benvenuto</span>
                    ) : (
                        <img src="/logo_dashboard.png" alt="Logo" className={styles.logoImage} />
                    )}
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

            {/* Backdrop Overlay for Mobile */}
            <div
                className={`${styles.overlay} ${isMobileMenuOpen ? styles.open : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            <main className={styles.main}>
                <header className={styles.header}>
                    <button className={styles.mobileToggle} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        Menu
                    </button>
                    <div className={styles.userMenu}>
                        {restaurantLogo ? (
                            <img
                                src={restaurantLogo}
                                alt="Logo Ristorante"
                                style={{ height: '140px', width: 'auto', objectFit: 'contain', position: 'relative', zIndex: 10 }}
                            />
                        ) : (
                            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', marginRight: '20px' }}>
                                {restaurantSlug?.toLowerCase() === 'demo' || ownerEmail?.toLowerCase() === 'demo@gardigital.it' || !restaurantName ? 'Benvenuto' : restaurantName}
                            </span>
                        )}
                    </div>
                </header>
                <div className={styles.content}>
                    {children}
                </div>
            </main>
        </div>
    );
}
