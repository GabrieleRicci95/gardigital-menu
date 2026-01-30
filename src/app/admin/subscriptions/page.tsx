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
                                <th>Piano</th>
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
                                subscriptions.map((sub) => (
                                    <tr key={sub.id}>
                                        <td>
                                            <div className={styles.ownerName}>{sub.restaurant?.owner?.name || 'N/A'}</div>
                                            <div className={styles.ownerEmail}>{sub.restaurant?.owner?.email}</div>
                                        </td>
                                        <td style={{ fontWeight: '500' }}>
                                            {sub.restaurant?.name}
                                        </td>
                                        <td>
                                            <span className={`${styles.badge} ${sub.plan === 'PREMIUM' ? styles.badgePremium : sub.plan === 'FULL' ? styles.badgeFull : styles.badgeBase}`} style={{
                                                backgroundColor: sub.plan === 'FULL' ? '#fff8e1' : undefined,
                                                color: sub.plan === 'FULL' ? '#f57f17' : undefined,
                                                border: sub.plan === 'FULL' ? '1px solid #ffecb3' : undefined
                                            }}>
                                                {sub.plan === 'PREMIUM' ? '✨ PREMIUM' : sub.plan === 'FULL' ? '🚀 FULL' : sub.plan}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{
                                                color: sub.status === 'ACTIVE' ? '#2e7d32' : '#c62828',
                                                fontWeight: '700',
                                                fontSize: '0.85rem',
                                                background: sub.status === 'ACTIVE' ? '#e8f5e9' : '#ffebee',
                                                padding: '4px 8px',
                                                borderRadius: '4px'
                                            }}>
                                                {sub.status === 'ACTIVE' ? 'ATTIVO' : sub.status}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                            {(sub.restaurant as any).createdAt ? new Date((sub.restaurant as any).createdAt).toLocaleDateString('it-IT') : '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
