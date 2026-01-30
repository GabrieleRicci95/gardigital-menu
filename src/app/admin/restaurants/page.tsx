'use client';

import { useState, useEffect } from 'react';

interface Restaurant {
    id: string;
    name: string;
    owner: {
        name: string | null;
        email: string;
    };
    subscription?: {
        plan: string;
        status: string;
        endDate?: string | null;
    } | null;
    createdAt: string;
}

import styles from '../admin.module.css';

export default function AdminRestaurantsPage() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            const res = await fetch('/api/admin/restaurants');
            if (res.ok) {
                const data = await res.json();
                setRestaurants(data.restaurants || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePlanChange = async (restaurantId: string, newPlan: string, durationMonths: number = 0) => {
        // Optimistic update
        setRestaurants(prev => {
            if (newPlan === 'DELETED') {
                return prev.filter(r => r.id !== restaurantId);
            }
            return prev.map(r => {
                if (r.id === restaurantId) {
                    return {
                        ...r,
                        subscription: newPlan === 'BLOCKED' ? null : {
                            ...r.subscription,
                            plan: newPlan,
                            status: 'ACTIVE',
                            endDate: durationMonths > 0 ? new Date(Date.now() + durationMonths * 30 * 24 * 60 * 60 * 1000).toISOString() : null
                        }
                    };
                }
                return r;
            });
        });

        const res = await fetch('/api/admin/restaurants/update-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ restaurantId, newPlan, durationMonths })
        });

        if (!res.ok) {
            alert("Errore aggiornamento piano");
            fetchRestaurants(); // Revert
        }
    };

    const filteredRestaurants = restaurants.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.owner.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.owner.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className={styles.container} style={{ padding: '2rem' }}>Caricamento ristoranti...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Gestione Ristoranti</h1>
            </header>

            <div className={styles.searchContainer}>
                <span className={styles.searchIcon}>In</span>
                <input
                    type="text"
                    placeholder="Cerca ristorante o proprietario..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Ristorante</th>
                                <th>Proprietario</th>
                                <th>Stato Abbonamento</th>
                                <th>Iscrizione</th>
                                <th>Azioni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRestaurants.map(r => {
                                const isPremium = r.subscription?.plan === 'PREMIUM';
                                return (
                                    <tr key={r.id}>
                                        <td style={{ fontWeight: '600' }}>{r.name}</td>
                                        <td>
                                            <div className={styles.ownerName}>{r.owner.name || 'N/D'}</div>
                                            <div className={styles.ownerEmail}>{r.owner.email}</div>
                                        </td>
                                        <td>
                                            {(!r.subscription || r.subscription.status !== 'ACTIVE') ? (
                                                <span style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 'bold',
                                                    backgroundColor: '#fff3e0',
                                                    color: '#e65100',
                                                    border: '1px solid #ffe0b2'
                                                }}>
                                                    In attesa di convalidazione
                                                </span>
                                            ) : (
                                                <span style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 'bold',
                                                    backgroundColor: r.subscription?.plan === 'PREMIUM' ? '#e8f5e9' : r.subscription?.plan === 'FULL' ? '#fff8e1' : r.subscription?.plan === 'WEBSITE' ? '#f3e5f5' : '#f5f5f5',
                                                    color: r.subscription?.plan === 'PREMIUM' ? '#2e7d32' : r.subscription?.plan === 'FULL' ? '#f57f17' : r.subscription?.plan === 'WEBSITE' ? '#7b1fa2' : '#757575',
                                                    border: r.subscription?.plan === 'PREMIUM' ? '1px solid #c8e6c9' : r.subscription?.plan === 'FULL' ? '1px solid #ffecb3' : r.subscription?.plan === 'WEBSITE' ? '1px solid #e1bee7' : '1px solid #e0e0e0'
                                                }}>
                                                    {r.subscription?.plan === 'FREE' ? 'BASE' : r.subscription?.plan}
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                            {new Date(r.createdAt).toLocaleDateString('it-IT')}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                                <button
                                                    onClick={() => handlePlanChange(r.id, 'FREE')}
                                                    className={`${styles.btnAction} ${styles.btnOutline}`}
                                                    style={{ backgroundColor: '#757575', color: 'white', border: 'none', fontSize: '0.75rem', padding: '4px 8px' }}
                                                >
                                                    Base
                                                </button>
                                                <button
                                                    onClick={() => handlePlanChange(r.id, 'PREMIUM', 0)}
                                                    className={`${styles.btnAction} ${styles.btnGreen}`}
                                                    style={{ backgroundColor: '#2e7d32', color: 'white', border: 'none', fontSize: '0.75rem', padding: '4px 8px' }}
                                                >
                                                    Premium
                                                </button>
                                                <button
                                                    onClick={() => handlePlanChange(r.id, 'FULL', 0)}
                                                    className={`${styles.btnAction}`}
                                                    style={{ backgroundColor: '#fbc02d', color: 'black', border: 'none', fontSize: '0.75rem', padding: '4px 8px' }}
                                                >
                                                    Full
                                                </button>
                                                <button
                                                    onClick={() => handlePlanChange(r.id, 'BLOCKED')}
                                                    className={`${styles.btnAction} ${styles.btnRed}`}
                                                    style={{ backgroundColor: '#e53935', color: 'white', border: 'none', fontSize: '0.75rem', padding: '4px 8px' }}
                                                    title="Rimuovi abbonamento (torna in attesa)"
                                                >
                                                    Blocca
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Sei sicuro di voler ELIMINARE definitivamente questo ristorante e utente?')) {
                                                            handlePlanChange(r.id, 'DELETED');
                                                        }
                                                    }}
                                                    className={`${styles.btnAction}`}
                                                    style={{ backgroundColor: '#000', color: 'white', border: 'none', fontSize: '0.75rem', padding: '4px 8px' }}
                                                    title="Elimina account definitivamente"
                                                >
                                                    Elimina
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
