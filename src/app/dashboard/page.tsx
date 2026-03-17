'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
    Calendar, 
    Users, 
    Clock, 
    TrendingUp, 
    ShieldCheck, 
    Utensils, 
    QrCode,
    CheckCircle2,
    AlertCircle,
    ExternalLink,
    ChevronRight,
    Layers,
    MapPin,
    Wine,
    Store
} from 'lucide-react';
import styles from './restaurant-dashboard.module.css';
import LoadingOverlay from '@/components/common/LoadingOverlay';

export default function DashboardPage() {
    const [subscription, setSubscription] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [recentReservations, setRecentReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAppMode, setIsAppMode] = useState(false);
    const [restaurant, setRestaurant] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const ua = navigator.userAgent || '';
            const params = new URLSearchParams(window.location.search);
            const isWebView = /Android/i.test(ua) && /Version\/[0-9.]+/i.test(ua);
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
            const hasParam = params.get('platform') === 'app' || sessionStorage.getItem('isAppMode') === 'true';

            if (isWebView || isStandalone || hasParam) {
                setIsAppMode(true);
            }
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/restaurant?t=' + Date.now());
            if (res.ok) {
                const data = await res.json();
                setRestaurant(data.restaurant);
                setSubscription(data.restaurant?.subscription);
                if (data.restaurant?.id) {
                    fetchStats(data.restaurant.id);
                    fetchRecentReservations(data.restaurant.id);
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async (restaurantId: string) => {
        try {
            const res = await fetch(`/api/reservations/stats?restaurantId=${restaurantId}&t=${Date.now()}`);
            if (res.ok) {
                const statsData = await res.json();
                setStats(statsData);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const fetchRecentReservations = async (restaurantId: string) => {
        try {
            const res = await fetch(`/api/reservations?restaurantId=${restaurantId}&limit=5&t=${Date.now()}`);
            if (res.ok) {
                const data = await res.json();
                setRecentReservations(data.reservations || []);
            }
        } catch (error) {
            console.error("Error fetching recent reservations:", error);
        }
    };

    if (loading) return <LoadingOverlay />;

    const isPremium = (subscription?.plan === 'PREMIUM' || subscription?.plan === 'FULL') && subscription?.status === 'ACTIVE';
    const restaurantName = restaurant?.name || "Ristoratore";
    const isActive = restaurant?.isActive;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={`${styles.welcomeBadge} ${!isActive ? styles.welcomeBadgeOffline : ''}`}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: isActive ? '#4ade80' : '#ef4444', boxShadow: `0 0 10px ${isActive ? '#4ade80' : '#ef4444'}` }} />
                    {isActive ? 'Menu Online' : 'Menu Offline'}
                </div>
                <h1 className={styles.title}>Benvenuto, {restaurantName}</h1>
                <p className={styles.subtitle}>Gestisci la tua attività digitale da un unico posto.</p>
            </header>

            {/* Stats Row */}
            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statToday}`}>
                        <Calendar size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <div className={styles.statValue}>{stats?.todayCount || 0}</div>
                        <div className={styles.statLabel}>Prenotazioni Oggi</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statToday}`}>
                        <Users size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <div className={styles.statValue}>{stats?.todayGuests || 0}</div>
                        <div className={styles.statLabel}>Coperti Oggi</div>
                    </div>
                </div>
                <Link href="/dashboard/reservations" style={{ textDecoration: 'none', display: 'flex', height: '100%' }}>
                    <div className={`${styles.statCard} ${stats?.pendingCount > 0 ? styles.statAlert : ''}`} style={{ width: '100%' }}>
                        <div className={`${styles.statIcon} ${styles.statPending}`}>
                            <Clock size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <div className={styles.statValue}>{stats?.pendingCount || 0}</div>
                            <div className={styles.statLabel}>Da Confermare</div>
                        </div>
                    </div>
                </Link>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statMonth}`}>
                        <TrendingUp size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <div className={styles.statValue}>{stats?.monthCount || 0}</div>
                        <div className={styles.statLabel}>Prenotazioni Mese</div>
                    </div>
                </div>
            </div>

            <div className={styles.overviewGrid}>
                {/* Agenda Rapida Section */}
                <div className={styles.quickAgendaCard}>
                    <div className={styles.quickAgendaHeader}>
                        <h2 className={styles.quickAgendaTitle}>
                            <Calendar size={22} />
                            Prossime Prenotazioni
                        </h2>
                        <Link href="/dashboard/reservations" className={styles.btnSm} style={{ textDecoration: 'none' }}>
                            Vedi Agenda <ChevronRight size={16} />
                        </Link>
                    </div>

                    <div className={styles.reservationList}>
                        {recentReservations.length > 0 ? (
                            recentReservations.map((res) => (
                                <div key={res.id} className={styles.reservationItem}>
                                    <div className={styles.resLeft}>
                                        <div className={styles.resName}>{res.customerName}</div>
                                        <div className={styles.resMeta}>
                                            <Users size={14} /> {res.guests} persone
                                        </div>
                                    </div>
                                    <div className={styles.resTime}>
                                        {res.time}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.emptyState}>
                                Non ci sono prenotazioni recenti.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side - Management Mini Cards */}
                <div className={styles.managementGrid}>
                    {/* Menu Card */}
                    <Link href="/dashboard/menu" style={{ textDecoration: 'none' }}>
                        <div className={styles.miniCard}>
                            <div className={styles.miniCardHeader}>
                                <Utensils size={18} />
                                I Tuoi Menu
                            </div>
                            <p className={styles.miniCardDesc}>
                                Gestisci piatti, prezzi e categorie. Il tuo menu è il cuore della tua attività.
                            </p>
                            <div className={styles.btnSm} style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>
                                Gestisci
                            </div>
                        </div>
                    </Link>

                    {/* QR Code Card */}
                    <Link href="/dashboard/qrcode" style={{ textDecoration: 'none' }}>
                        <div className={styles.miniCard}>
                            <div className={styles.miniCardHeader}>
                                <QrCode size={18} />
                                QR Code
                            </div>
                            <p className={styles.miniCardDesc}>
                                Visualizza e scarica il tuo QR Code unico per i tavoli.
                            </p>
                            <div className={styles.btnSm} style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>
                                Vedi QR
                            </div>
                        </div>
                    </Link>

                    {/* Restaurant Settings Card */}
                    <Link href="/dashboard/restaurant" style={{ textDecoration: 'none' }}>
                        <div className={styles.miniCard}>
                            <div className={styles.miniCardHeader}>
                                <Store size={18} />
                                Ristorante
                            </div>
                            <p className={styles.miniCardDesc}>
                                Orari, contatti e impostazioni generali della tua attività.
                            </p>
                            <div className={styles.btnSm} style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>
                                Modifica
                            </div>
                        </div>
                    </Link>

                    {/* Subscription Card */}
                    {!isAppMode && (
                        <Link href="/dashboard/subscription" style={{ textDecoration: 'none' }}>
                            <div className={styles.miniCard} style={{ borderColor: 'rgba(212, 175, 55, 0.3)', background: 'rgba(212, 175, 55, 0.03)' }}>
                                <div className={styles.miniCardHeader}>
                                    <ShieldCheck size={18} />
                                    Abbonamento
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#d4af37', fontWeight: '800' }}>
                                    {subscription?.plan || 'SOLO MENU'}
                                </div>
                                <p className={styles.miniCardDesc}>
                                    Gestisci il tuo piano e la fatturazione.
                                </p>
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
