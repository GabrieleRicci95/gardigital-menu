'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './restaurant-dashboard.module.css';

export default function DashboardPage() {
    const [subscription, setSubscription] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isAppMode, setIsAppMode] = useState(false);

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
                setSubscription(data.restaurant?.subscription);
                if (data.restaurant?.id) {
                    fetchStats(data.restaurant.id);
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

    if (loading) return <div className={styles.container}>Caricamento Dashboard...</div>;

    const isPremium = (subscription?.plan === 'PREMIUM' || subscription?.plan === 'FULL') && subscription?.status === 'ACTIVE';

    // Mock Name for greeting (could come from API)
    const restaurantName = subscription?.restaurant?.name || "Ristoratore";

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Bentornato</h1>
                <p className={styles.subtitle}>Ecco una panoramica del tuo ristorante digitale.</p>
            </header>

            {/* Stats Row */}
            {subscription?.hasReservations && (
                <div className={styles.statsRow}>
                    <div className={styles.statCard}>
                        <div className={`${styles.statIcon} ${styles.statToday}`}>📅</div>
                        <div className={styles.statInfo}>
                            <div className={styles.statValue}>{stats?.todayCount || 0}</div>
                            <div className={styles.statLabel}>Prenotazioni Oggi</div>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={`${styles.statIcon} ${styles.statToday}`}>👥</div>
                        <div className={styles.statInfo}>
                            <div className={styles.statValue}>{stats?.todayGuests || 0}</div>
                            <div className={styles.statLabel}>Coperti Oggi</div>
                        </div>
                    </div>
                    <Link href="/dashboard/reservations" style={{ textDecoration: 'none' }}>
                        <div className={`${styles.statCard} ${stats?.pendingCount > 0 ? styles.statAlert : ''}`}>
                            <div className={`${styles.statIcon} ${styles.statPending}`}>⏳</div>
                            <div className={styles.statInfo}>
                                <div className={styles.statValue}>{stats?.pendingCount || 0}</div>
                                <div className={styles.statLabel}>Da Confermare</div>
                            </div>
                        </div>
                    </Link>
                    <div className={styles.statCard}>
                        <div className={`${styles.statIcon} ${styles.statMonth}`}>📈</div>
                        <div className={styles.statInfo}>
                            <div className={styles.statValue}>{stats?.monthCount || 0}</div>
                            <div className={styles.statLabel}>Prenotazioni Mese</div>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.grid}>
                {/* Status Card */}
                <div className={`${styles.card} ${styles.cardPremium}`}>
                    <div className={styles.cardTitle}>
                        Stato Abbonamento
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        {(() => {
                            let parts = ['Menu'];
                            if (subscription?.hasTranslations) parts.push('Traduzioni');
                            if (subscription?.hasReservations) parts.push('Prenotazioni');
                            const statusText = parts.join(' + ');
                            const modulesCount = parts.length;

                            const expiryDate = subscription?.endDate ? new Date(subscription.endDate) : null;
                            const isExpired = expiryDate ? expiryDate < new Date() : false;

                            return (
                                <>
                                    <div className={styles.statusText} style={{
                                        fontSize: '1.4rem',
                                        color: subscription?.plan === 'FULL' ? '#fbc02d' : '#2e7d32',
                                        textTransform: 'uppercase',
                                        marginBottom: '0.5rem'
                                    }}>
                                        {statusText}
                                    </div>
                                    <p className={styles.cardDesc} style={{ marginBottom: '1rem' }}>
                                        {subscription?.plan === 'FULL'
                                            ? 'Hai il pacchetto completo con tutti i moduli attivi.'
                                            : modulesCount > 1
                                                ? 'Hai un piano personalizzato con moduli aggiuntivi.'
                                                : 'Hai il piano base (Solo Menu).'}
                                    </p>

                                    <div style={{
                                        marginTop: 'auto',
                                        padding: '12px',
                                        backgroundColor: isExpired ? '#fee2e2' : '#f8fafc',
                                        borderRadius: '12px',
                                        border: `1px solid ${isExpired ? '#fecaca' : '#e2e8f0'}`,
                                        marginBottom: '1rem'
                                    }}>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>Scadenza Servizio</div>
                                        <div style={{
                                            fontWeight: 'bold',
                                            color: isExpired ? '#991b1b' : '#334155',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            📅 {expiryDate ? expiryDate.toLocaleDateString() : 'Non impostata'}
                                            {isExpired && <span style={{ fontSize: '0.7rem', backgroundColor: '#ef4444', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>SCADUTO</span>}
                                        </div>
                                    </div>

                                    {!isAppMode && (
                                        <Link href="/dashboard/subscription" className={`${styles.button} ${styles.btnPrimary}`} style={{ width: '100%', textAlign: 'center' }}>
                                            Gestisci / Rinnova
                                        </Link>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                </div>

                {/* Menu Link Card */}
                <div className={`${styles.card} ${styles.cardMenu}`}>
                    <div className={styles.cardTitle}>
                        I Tuoi Menu
                    </div>
                    <p className={styles.cardDesc}>Gestisci i piatti, i prezzi e organizza le categorie del tuo menu digitale.</p>
                    <div style={{ marginTop: 'auto' }}>
                        <Link href="/dashboard/menu" className={`${styles.button} ${styles.btnPrimary}`}>
                            Gestisci Menu
                        </Link>
                    </div>
                </div>

                {/* QR Code Card */}
                <div className={`${styles.card} ${styles.cardQr}`}>
                    <div className={styles.cardTitle}>
                        Il Tuo QR Code
                    </div>
                    <p className={styles.cardDesc}>Scarica e stampa il codice QR da posizionare sui tavoli per i tuoi clienti.</p>
                    <div style={{ marginTop: 'auto' }}>
                        <Link href="/dashboard/qrcode" className={`${styles.button} ${styles.btnPrimary}`}>
                            Vedi QR Code
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
