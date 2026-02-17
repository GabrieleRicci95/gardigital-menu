'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './restaurant-dashboard.module.css';

export default function DashboardPage() {
    const [subscription, setSubscription] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
                    <div>
                        {isPremium ? (
                            <div className={styles.statusText} style={{ color: subscription?.plan === 'FULL' ? '#fbc02d' : undefined }}>{subscription?.plan}</div>
                        ) : (
                            <div className={styles.statusBase}>BASE</div>
                        )}
                        <p className={styles.cardDesc}>
                            {isPremium
                                ? 'Hai accesso illimitato a tutte le funzionalità esclusive.'
                                : 'Hai accesso limitato (1 Menu).'}
                        </p>
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
