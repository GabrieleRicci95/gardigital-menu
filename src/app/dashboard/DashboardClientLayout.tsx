'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
    Menu as MenuIcon, 
    LayoutDashboard, 
    CreditCard, 
    Calendar, 
    Store, 
    Utensils, 
    Wine, 
    GlassWater, 
    Martini, 
    Palette, 
    QrCode, 
    LogOut,
    Layers,
    ChevronDown,
    Plus,
    Trash2
} from 'lucide-react';
import styles from './dashboard.module.css';
import SubscriptionAlert from '@/components/common/SubscriptionAlert';
import { usePushNotifications } from '@/lib/hooks/usePushNotifications';
import ExpiredSubscriptionPaywall from '@/components/dashboard/ExpiredSubscriptionPaywall';

export default function DashboardClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [restaurantName, setRestaurantName] = useState('');
    const [restaurantId, setRestaurantId] = useState('');
    const [restaurantSlug, setRestaurantSlug] = useState('');
    const [ownerEmail, setOwnerEmail] = useState('');
    const [subscriptionPlan, setSubscriptionPlan] = useState<string>('BASE');
    const [isWineActive, setIsWineActive] = useState(false);
    const [isChampagneActive, setIsChampagneActive] = useState(false);
    const [isDrinkActive, setIsDrinkActive] = useState(false);
    const [hasReservations, setHasReservations] = useState(false);
    const [restaurantLogo, setRestaurantLogo] = useState<string | null>(null);
    const [customModules, setCustomModules] = useState<{ name: string, slug: string }[]>([]);
    const [pendingReservationsCount, setPendingReservationsCount] = useState(0);
    const [isSubscriptionActive, setIsSubscriptionActive] = useState(true);
    const [isModulesOpen, setIsModulesOpen] = useState(true);
    const [isCreatingModule, setIsCreatingModule] = useState(false);

    // Dynamic Push Notification Setup (only for mobile app)
    usePushNotifications(restaurantId);

    const fetchRestaurantData = async () => {
        try {
            const params = new URLSearchParams(window.location.search);
            const impersonateId = params.get('impersonate');
            const url = impersonateId ? `/api/restaurant?restaurantId=${impersonateId}` : '/api/restaurant';
            
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                if (data.restaurant) {
                    setRestaurantName(data.restaurant.name);
                    setRestaurantId(data.restaurant.id);
                    setRestaurantSlug(data.restaurant.slug);
                    setOwnerEmail(data.restaurant.owner?.email || '');
                    setIsWineActive(!!data.restaurant.wineList?.isActive);
                    setIsChampagneActive(!!data.restaurant.champagneList?.isActive);
                    setIsDrinkActive(!!data.restaurant.drinkList?.isActive);
                    setRestaurantLogo(data.restaurant.logoUrl || null);
                    setCustomModules(data.restaurant.customLists || []);
                    
                    if (data.restaurant.subscription) {
                        const plan = data.restaurant.subscription.plan;
                        setSubscriptionPlan(plan);
                        setHasReservations(!!data.restaurant.subscription.hasReservations);

                        const status = data.restaurant.subscription.status;
                        const endDate = data.restaurant.subscription.endDate;
                        
                        if (status === 'ACTIVE') {
                            if (endDate) {
                                const isExpired = plan === 'PILOT' ? false : new Date(endDate) < new Date();
                                setIsSubscriptionActive(!isExpired);
                            } else {
                                setIsSubscriptionActive(plan === 'PILOT');
                            }
                        } else {
                            // PENDING, EXPIRED, etc.
                            setIsSubscriptionActive(false);
                        }

                        if (data.restaurant.subscription.hasReservations) {
                            fetchPendingCount(data.restaurant.id);
                        }
                    } else {
                        router.push('/onboarding');
                    }
                }
            }
        } catch (error) {
            console.error("Restaurant data fetch failed", error);
        }
    };

    const fetchPendingCount = async (id: string) => {
        try {
            const params = new URLSearchParams(window.location.search);
            const impersonateId = params.get('impersonate');
            const url = `/api/reservations?restaurantId=${id}&countPending=true${impersonateId ? `&impersonate=${impersonateId}` : ''}`;
            
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setPendingReservationsCount(data.pendingCount || 0);
            }
        } catch (error) {
            console.error("Pending count fetch failed", error);
        }
    };

    useEffect(() => {
        fetchRestaurantData();
        const interval = setInterval(() => {
            if (restaurantId) fetchRestaurantData();
        }, 120000);
        return () => clearInterval(interval);
    }, [router, restaurantId]);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMobileMenuOpen]);

    const [isAppMode, setIsAppMode] = useState(false);

    useEffect(() => {
        const checkAppMode = () => {
            if (typeof window === 'undefined') return;
            const params = new URLSearchParams(window.location.search);
            const ua = navigator.userAgent || '';
            const hasParam = params.get('platform') === 'app';
            const hasSession = sessionStorage.getItem('isAppMode') === 'true';
            const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
            const isWebView = /Android/i.test(ua) && /Version\/[0-9.]+/i.test(ua);
            const isStandalone = (window.matchMedia('(display-mode: standalone)').matches) || (navigator as any).standalone;
            const isCapacitorNative = (window as any).Capacitor?.isNativePlatform?.() === true;

            if (hasParam || hasSession || isWebView || isStandalone || isCapacitorNative || isIOS) {
                setIsAppMode(true);
                sessionStorage.setItem('isAppMode', 'true');
            }
        };
        checkAppMode();
    }, []);

    const handleCreateModule = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const name = prompt("Inserisci il nome del nuovo modulo (es. Carta dei Gin):");
        if (!name || !name.trim()) return;

        setIsCreatingModule(true);
        try {
            const res = await fetch('/api/custom-lists', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
            if (res.ok) {
                const data = await res.json();
                await fetchRestaurantData();
                router.push(`/dashboard/custom-list/${data.customList.slug}`);
            } else {
                const errData = await res.json().catch(() => ({}));
                alert(`Errore nella creazione del modulo: ${errData.error || 'Riprova più tardi'}`);
            }
        } catch (error) {
            console.error("Modulo creation failed", error);
            alert("Errore di connessione. Riprova.");
        } finally {
            setIsCreatingModule(false);
        }
    };

    const handleToggleSpecialModule = async (type: 'wine' | 'champagne' | 'drink', currentStatus: boolean) => {
        try {
            const body = {
                [type === 'wine' ? 'isWineActive' : type === 'champagne' ? 'isChampagneActive' : 'isDrinkActive']: !currentStatus
            };
            const res = await fetch('/api/restaurant', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                await fetchRestaurantData();
            }
        } catch (error) {
            console.error("Special modulo toggle failed", error);
        }
    };

    const handleDeleteModule = async (e: React.MouseEvent, slug: string, name: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm(`Sei sicuro di voler rimuovere il modulo "${name}"? Questa azione è irreversibile.`)) return;

        try {
            const res = await fetch(`/api/custom-lists?slug=${slug}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                await fetchRestaurantData();
                if (pathname.includes(slug)) {
                    router.push('/dashboard');
                }
            }
        } catch (error) {
            console.error("Modulo deletion failed", error);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = isAppMode ? '/login' : '/';
    };

    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        if (touchStart - touchEnd > 50) setIsMobileMenuOpen(false);
    };

    const navItems = [
        { label: 'Panoramica', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { label: 'Abbonamenti', href: '/dashboard/subscription', icon: <CreditCard size={20} />, isSubscription: true },
        {
            label: 'Agenda',
            href: '/dashboard/reservations',
            icon: <Calendar size={20} />,
            isReservation: true,
            badge: pendingReservationsCount > 0 ? pendingReservationsCount : null
        },
        { label: 'Il mio Ristorante', href: '/dashboard/restaurant', icon: <Store size={20} /> },
        { label: 'Menu', href: '/dashboard/menu', icon: <Utensils size={20} /> },
        { label: 'QR Code', href: '/dashboard/qrcode', icon: <QrCode size={20} /> },
    ].filter(item => {
        if (item.isSubscription && isAppMode) return false;
        if (item.isReservation && !hasReservations) return false;
        return true;
    });

    return (
        <div className={styles.layout}>
            <aside
                className={`${styles.sidebar} ${isMobileMenuOpen ? styles.open : ''}`}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div className={styles.logo}>
                    <img src="/logo.png" alt="SoloMenu" className={styles.logoImage} />
                </div>

                <nav className={styles.nav}>
                    {/* Top Items (Panoramica, Abbonamenti, Agenda, Ristorante) */}
                    {navItems.filter(item => ['Panoramica', 'Abbonamenti', 'Agenda', 'Il mio Ristorante'].includes(item.label)).map((item: any) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <div className={styles.navItemContent}>
                                {item.icon}
                                <span>{item.label}</span>
                            </div>
                            {item.badge && <span className={styles.badge}>{item.badge}</span>}
                        </Link>
                    ))}

                    {/* Menu Item */}
                    {navItems.filter(item => item.label === 'Menu').map((item: any) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <div className={styles.navItemContent}>
                                {item.icon}
                                <span>{item.label}</span>
                            </div>
                        </Link>
                    ))}

                    {/* Moduli Dropdown - Positioned ALWAYS after Menu */}
                    <div className={`${styles.navDropdown} ${isModulesOpen ? styles.dropdownActive : ''}`}>
                        <div 
                            className={styles.dropdownHeader}
                            onClick={() => setIsModulesOpen(!isModulesOpen)}
                        >
                            <div className={styles.navItemContent}>
                                <Layers size={20} />
                                <span>Moduli</span>
                            </div>
                            <ChevronDown 
                                size={18} 
                                className={`${styles.chevron} ${isModulesOpen ? styles.chevronRotate : ''}`} 
                            />
                        </div>
                        
                        <div className={styles.dropdownContent}>
                            {/* Add New Module Item - Top */}
                            <button 
                                className={styles.addModuleDropdownBtn}
                                onClick={handleCreateModule}
                                disabled={isCreatingModule}
                                style={{ marginBottom: '12px' }}
                            >
                                <Plus size={16} />
                                <span>Aggiungi Modulo</span>
                            </button>

                            {/* Special Modules Toggles */}
                            <div style={{ marginBottom: '16px', padding: '0 8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', transition: 'all 0.3s' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: isWineActive ? '#d4af37' : 'rgba(255,255,255,0.4)' }}>
                                        <Wine size={14} />
                                        <span>Lista Vini</span>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        checked={isWineActive} 
                                        onChange={() => handleToggleSpecialModule('wine', isWineActive)}
                                        style={{ accentColor: '#d4af37', cursor: 'pointer', width: '16px', height: '16px' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', transition: 'all 0.3s' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: isChampagneActive ? '#d4af37' : 'rgba(255,255,255,0.4)' }}>
                                        <GlassWater size={14} />
                                        <span>Champagne</span>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        checked={isChampagneActive} 
                                        onChange={() => handleToggleSpecialModule('champagne', isChampagneActive)}
                                        style={{ accentColor: '#d4af37', cursor: 'pointer', width: '16px', height: '16px' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', transition: 'all 0.3s' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: isDrinkActive ? '#d4af37' : 'rgba(255,255,255,0.4)' }}>
                                        <Martini size={14} />
                                        <span>Lista Drink</span>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        checked={isDrinkActive} 
                                        onChange={() => handleToggleSpecialModule('drink', isDrinkActive)}
                                        style={{ accentColor: '#d4af37', cursor: 'pointer', width: '16px', height: '16px' }}
                                    />
                                </div>
                            </div>

                            <div style={{ height: '1px', background: 'rgba(212, 175, 55, 0.1)', margin: '4px 10px 12px 0' }} />

                            {isWineActive && (
                                <div className={styles.customModuleWrapper}>
                                    <Link 
                                        href="/dashboard/wine-list" 
                                        className={`${styles.dropdownItem} ${pathname === '/dashboard/wine-list' ? styles.activeDropdownItem : ''}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <Wine size={16} />
                                        <span>Vini/Bollicine</span>
                                    </Link>
                                </div>
                            )}
                            {isChampagneActive && (
                                <div className={styles.customModuleWrapper}>
                                    <Link 
                                        href="/dashboard/champagne-list" 
                                        className={`${styles.dropdownItem} ${pathname === '/dashboard/champagne-list' ? styles.activeDropdownItem : ''}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <GlassWater size={16} />
                                        <span>Champagne</span>
                                    </Link>
                                </div>
                            )}
                            {isDrinkActive && (
                                <div className={styles.customModuleWrapper}>
                                    <Link 
                                        href="/dashboard/drink-list" 
                                        className={`${styles.dropdownItem} ${pathname === '/dashboard/drink-list' ? styles.activeDropdownItem : ''}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <Martini size={16} />
                                        <span>Drink</span>
                                    </Link>
                                </div>
                            )}

                            {customModules.map(m => (
                                <div key={m.slug} className={styles.customModuleWrapper}>
                                    <Link 
                                        href={`/dashboard/custom-list/${m.slug}`} 
                                        className={`${styles.dropdownItem} ${pathname === `/dashboard/custom-list/${m.slug}` ? styles.activeDropdownItem : ''}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <Layers size={16} />
                                        <span>{m.name}</span>
                                    </Link>
                                    <button 
                                        className={styles.deleteModuleBtn}
                                        onClick={(e) => handleDeleteModule(e, m.slug, m.name)}
                                        title="Elimina modulo"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* QR Code */}
                    {navItems.filter(item => item.label === 'QR Code').map((item: any) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <div className={styles.navItemContent}>
                                {item.icon}
                                <span>{item.label}</span>
                            </div>
                        </Link>
                    ))}

                    <button onClick={handleLogout} className={`${styles.navItem} ${styles.logout}`}>
                        <div className={styles.navItemContent}>
                            <LogOut size={20} />
                            <span>Esci</span>
                        </div>
                    </button>
                </nav>
            </aside>

            <div
                className={`${styles.overlay} ${isMobileMenuOpen ? styles.open : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            <main className={styles.main}>
                <SubscriptionAlert />
                <header className={styles.header}>
                    <button className={styles.mobileToggle} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <MenuIcon size={20} />
                        <span>Menu</span>
                    </button>
                    <div className={styles.userMenu}>
                        <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Benvenuto</span>
                    </div>
                </header>
                <div className={styles.content}>
                    {!isSubscriptionActive && pathname !== '/dashboard/subscription' && subscriptionPlan !== 'PILOT' ? (
                        <ExpiredSubscriptionPaywall isAppMode={isAppMode} />
                    ) : (
                        children
                    )}
                </div>
            </main>
        </div>
    );
}
