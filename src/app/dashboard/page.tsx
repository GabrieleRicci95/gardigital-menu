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
    const [loading, setLoading] = useState(true);
    const [restaurant, setRestaurant] = useState<any>(null);

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

    if (loading) return <LoadingOverlay />;

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
                <p className={styles.subtitle}>Ecco un riepilogo della tua attività per oggi.</p>
            </header>

            {/* Stats Row */}
            {subscription?.hasReservations && (
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
            )}
        </div>
    );
}
