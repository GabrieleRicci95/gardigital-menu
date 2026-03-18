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
                <h1 className={styles.title}>Abbonamenti Attivi</h1>
            </header>

            <div className={styles.tableCard}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Utente</th>
                                <th>Ristorante</th>
                                <th style={{ textAlign: 'center' }}>Piano</th>
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
                                                        {sub.plan} (€{isMastro ? '14.99' : '15.00'})
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
