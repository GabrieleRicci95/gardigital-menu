'use client';

import { useState, useEffect } from 'react';

interface Subscription {
    id: string;
    plan: string;
    status: string;
    startDate: string;
    endDate: string | null;
    restaurant: {
        name: string;
        owner: {
            name: string;
            email: string;
        }
    };
    hasReservations: boolean;
    hasTranslations: boolean;
    stripeSubscriptionId: string | null;
}

import styles from '../admin.module.css';

export default function AdminSubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubs = async () => {
            try {
                const res = await fetch('/api/admin/subscriptions');
                if (res.ok) {
                    const data = await res.json();
                    setSubscriptions(data.subscriptions || []);
                }
            } catch (error) {
                console.error("Error fetching subscriptions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubs();
    }, []);

    if (loading) return <div className={styles.container} style={{ padding: '2rem' }}>Caricamento Abbonamenti...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Monitoraggio Abbonamenti</h1>
                <p className={styles.subtitle}>Gestisci le sottoscrizioni e i pagamenti della piattaforma.</p>
            </header>

            {/* KPI Cards */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V7l8-4 8 4v14M8 21v-4h8v4" /></svg>
                    </div>
                    <div className={styles.statInfo}>
                        <p className={styles.statValue}>{subscriptions.length}</p>
                        <span className={styles.statLabel}>Totale Ristoranti</span>
                    </div>
                </div>
                <div className={`${styles.statCard} ${styles.statActive}`}>
                    <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </div>
                    <div className={styles.statInfo}>
                        <p className={styles.statValue}>{subscriptions.filter(s => s.status === 'ACTIVE').length}</p>
                        <span className={styles.statLabel}>Abbonati Attivi</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                    <div className={styles.statInfo}>
                        <p className={styles.statValue}>{subscriptions.filter(s => !s.stripeSubscriptionId && s.status === 'ACTIVE').length}</p>
                        <span className={styles.statLabel}>Utenti in Prova</span>
                    </div>
                </div>
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Utente</th>
                                <th>Ristorante</th>
                                <th style={{ textAlign: 'center' }}>Piano</th>
                                <th style={{ textAlign: 'center' }}>Pagamento</th>
                                <th>Stato</th>
                                <th>Iscrizione</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscriptions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                                        Nessun abbonamento trovato.
                                    </td>
                                </tr>
                            ) : (
                                subscriptions.map((sub) => {
                                    const isMastro = sub.restaurant?.name.toLowerCase().includes('mastro');
                                    const isPilot = sub.plan === 'PILOT';
                                    
                                    return (
                                        <tr key={sub.id}>
                                            <td>
                                                <div className={styles.ownerName}>{sub.restaurant?.owner?.name || 'N/A'}</div>
                                                <div className={styles.ownerEmail}>{sub.restaurant?.owner?.email}</div>
                                            </td>
                                            <td style={{ fontWeight: '700', color: 'var(--color-primary)' }}>
                                                {sub.restaurant?.name}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                {isPilot ? (
                                                    <span className={`${styles.badge} ${styles.badgeActive}`} style={{ background: 'rgba(162, 28, 175, 0.1)', color: '#a21caf', border: '1px solid rgba(162, 28, 175, 0.2)' }}>
                                                        Socio Pilota
                                                    </span>
                                                ) : (
                                                    <span className={`${styles.badge} ${styles.badgeActive}`}>
                                                        {sub.plan} (€{(isMastro ? 15 : (sub.hasReservations ? 25 : 15)).toFixed(2)})
                                                    </span>
                                                )}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                {sub.stripeSubscriptionId ? (
                                                    <span className={`${styles.badge} ${styles.badgeActive}`} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                                                        💳 Collegata
                                                    </span>
                                                ) : (
                                                    <span className={styles.badge} style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255, 255, 255, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                                        Nessuna
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <span className={`${styles.badge} ${sub.status === 'ACTIVE' ? styles.badgeActive : styles.badgeExpired}`}>
                                                    {sub.status === 'ACTIVE' ? 'ATTIVO' : sub.status}
                                                </span>
                                            </td>
                                            <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', opacity: 0.6 }}>
                                                {(sub.restaurant as any).createdAt ? new Date((sub.restaurant as any).createdAt).toLocaleDateString('it-IT') : '-'}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
