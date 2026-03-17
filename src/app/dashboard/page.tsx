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
    ExternalLink
} from 'lucide-react';
import styles from './restaurant-dashboard.module.css';
import LoadingOverlay from '@/components/common/LoadingOverlay';

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

    if (loading) return <LoadingOverlay />;

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

            <div className={styles.grid}>
                {/* Status Card */}
                <div className={`${styles.card} ${styles.cardPremium}`}>
                    <div className={styles.cardTitle}>
                        <ShieldCheck size={20} className={styles.titleIcon} />
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
                                        fontSize: '1.2rem',
                                        color: '#d4af37',
                                        textTransform: 'uppercase',
                                        marginBottom: '0.8rem',
                                        fontWeight: '800',
                                        letterSpacing: '1px'
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
                                        padding: '16px',
                                        backgroundColor: isExpired ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                                        backdropFilter: 'blur(8px)',
                                        borderRadius: '16px',
                                        border: `1px solid ${isExpired ? 'rgba(239, 68, 68, 0.3)' : 'rgba(212, 175, 55, 0.1)'}`,
                                        marginBottom: '1.5rem'
                                    }}>
                                        <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Scadenza Servizio</div>
                                        <div style={{
                                            fontWeight: 'bold',
                                            color: isExpired ? '#ef4444' : '#ffffff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            fontSize: '1.1rem'
                                        }}>
                                            <Calendar size={18} className={styles.titleIcon} style={{ opacity: 1 }} />
                                            {expiryDate ? expiryDate.toLocaleDateString() : 'Non impostata'}
                                        </div>
                                    </div>

                                    {!isAppMode && (
                                        <Link href="/dashboard/subscription" className={`${styles.button} ${styles.btnPrimary}`} style={{ width: '100%', textAlign: 'center' }}>
                                            Abbonamento
                                        </Link>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                </div>

                {/* Restaurant Settings Card */}
                <div className={`${styles.card} ${styles.cardRestaurant}`}>
                    <div className={styles.cardTitle}>
                        <ShieldCheck size={20} className={styles.titleIcon} />
                        Il Mio Ristorante
                    </div>
                    <p className={styles.cardDesc}>Aggiorna le informazioni di base, contatti e social della tua attività.</p>
                    <div style={{ marginTop: 'auto' }}>
                        <Link href="/dashboard/restaurant" className={`${styles.button} ${styles.btnPrimary}`}>
                            Configura
                        </Link>
                    </div>
                </div>

                {/* Design Card */}
                <div className={`${styles.card} ${styles.cardDesign}`}>
                    <div className={styles.cardTitle}>
                        <ShieldCheck size={20} className={styles.titleIcon} />
                        Aspetto & Design
                    </div>
                    <p className={styles.cardDesc}>Personalizza colori, font e stile per rendere unico il tuo menu.</p>
                    <div style={{ marginTop: 'auto' }}>
                        <Link href="/dashboard/design" className={`${styles.button} ${styles.btnPrimary}`}>
                            Personalizza
                        </Link>
                    </div>
                </div>

                {/* Reservations Card */}
                <div className={`${styles.card} ${styles.cardAgenda}`}>
                    <div className={styles.cardTitle}>
                        <Calendar size={20} className={styles.titleIcon} />
                        Agenda
                    </div>
                    <p className={styles.cardDesc}>Visualizza e gestisci le prenotazioni dei tuoi tavoli in tempo reale.</p>
                    <div style={{ marginTop: 'auto' }}>
                        <Link href="/dashboard/reservations" className={`${styles.button} ${styles.btnPrimary}`}>
                            Apri Agenda
                        </Link>
                    </div>
                </div>

                {/* Menu Link Card */}
                <div className={`${styles.card} ${styles.cardMenu}`}>
                    <div className={styles.cardTitle}>
                        <Utensils size={20} className={styles.titleIcon} />
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
                        <QrCode size={20} className={styles.titleIcon} />
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
