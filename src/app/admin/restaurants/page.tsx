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
        hasTranslations?: boolean;
        hasReservations?: boolean;
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

    const handleToggleFeature = async (restaurantId: string, feature: 'hasTranslations' | 'hasReservations', currentValue: boolean) => {
        // Optimistic update
        setRestaurants(prev => prev.map(r => {
            if (r.id === restaurantId && r.subscription) {
                return {
                    ...r,
                    subscription: {
                        ...r.subscription,
                        [feature]: !currentValue
                    }
                };
            }
            return r;
        }));

        try {
            const res = await fetch('/api/admin/restaurants/update-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    restaurantId,
                    [feature]: !currentValue
                }),
            });

            if (!res.ok) {
                alert('Errore aggiornamento funzione');
                fetchRestaurants();
            }
        } catch (e) {
            alert('Errore di connessione');
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
                    const isFull = newPlan === 'FULL';
                    return {
                        ...r,
                        subscription: newPlan === 'BLOCKED' ? null : {
                            ...r.subscription,
                            plan: newPlan,
                            status: 'ACTIVE',
                            hasTranslations: isFull,
                            hasReservations: isFull,
                            endDate: durationMonths > 0 ? new Date(Date.now() + durationMonths * 30 * 24 * 60 * 60 * 1000).toISOString() : null
                        } as any
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
                                                    In attesa / Scaduto
                                                </span>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    <span style={{
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 'bold',
                                                        backgroundColor: '#e8f5e9',
                                                        color: '#2e7d32',
                                                        border: '1px solid #c8e6c9'
                                                    }}>
                                                        Standard (€15)
                                                    </span>
                                                    {r.subscription?.hasTranslations && <span title="Traduzioni Attive">🌍</span>}
                                                    {r.subscription?.hasReservations && <span title="Prenotazioni Attive">📅</span>}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                            {new Date(r.createdAt).toLocaleDateString('it-IT')}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
                                                {/* Plan Toggles */}
                                                <button
                                                    onClick={() => handlePlanChange(r.id, 'PREMIUM', 0)}
                                                    className={`${styles.btnAction}`}
                                                    style={{
                                                        backgroundColor: '#2e7d32',
                                                        color: 'white',
                                                        border: 'none',
                                                        fontSize: '0.75rem',
                                                        padding: '4px 8px',
                                                        opacity: (r.subscription?.status === 'ACTIVE' && !r.subscription.hasTranslations && !r.subscription.hasReservations) ? 0.5 : 1
                                                    }}
                                                    title="Attiva solo Piano Base (€15)"
                                                >
                                                    Menu
                                                </button>
                                                <button
                                                    onClick={() => handlePlanChange(r.id, 'FULL', 0)}
                                                    className={`${styles.btnAction}`}
                                                    style={{
                                                        backgroundColor: '#fbc02d',
                                                        color: 'black',
                                                        border: 'none',
                                                        fontSize: '0.75rem',
                                                        padding: '4px 8px',
                                                        opacity: (r.subscription?.hasTranslations && r.subscription?.hasReservations) ? 0.5 : 1
                                                    }}
                                                    title="Attiva Tutto (€25)"
                                                >
                                                    Full
                                                </button>

                                                <div style={{ width: '1px', height: '20px', backgroundColor: '#ddd', margin: '0 5px' }} />

                                                {/* Micro-service Toggles */}
                                                <button
                                                    onClick={() => handleToggleFeature(r.id, 'hasTranslations', !!r.subscription?.hasTranslations)}
                                                    disabled={!r.subscription}
                                                    className={styles.btnAction}
                                                    style={{
                                                        backgroundColor: r.subscription?.hasTranslations ? '#1976d2' : '#f5f5f5',
                                                        color: r.subscription?.hasTranslations ? 'white' : '#666',
                                                        border: '1px solid #ddd',
                                                        fontSize: '0.75rem',
                                                        padding: '4px 8px',
                                                        cursor: 'pointer'
                                                    }}
                                                    title="Toggle Traduzioni (+€10)"
                                                >
                                                    🌍 Trad
                                                </button>

                                                <button
                                                    onClick={() => handleToggleFeature(r.id, 'hasReservations', !!r.subscription?.hasReservations)}
                                                    disabled={!r.subscription}
                                                    className={styles.btnAction}
                                                    style={{
                                                        backgroundColor: r.subscription?.hasReservations ? '#7b1fa2' : '#f5f5f5',
                                                        color: r.subscription?.hasReservations ? 'white' : '#666',
                                                        border: '1px solid #ddd',
                                                        fontSize: '0.75rem',
                                                        padding: '4px 8px',
                                                        cursor: 'pointer'
                                                    }}
                                                    title="Toggle Prenotazioni (+€10)"
                                                >
                                                    📅 Pren
                                                </button>

                                                <div style={{ width: '1px', height: '20px', backgroundColor: '#ddd', margin: '0 5px' }} />

                                                <button
                                                    onClick={() => handlePlanChange(r.id, 'BLOCKED')}
                                                    className={`${styles.btnAction} ${styles.btnRed}`}
                                                    style={{ backgroundColor: '#e53935', color: 'white', border: 'none', fontSize: '0.75rem', padding: '4px 8px' }}
                                                    title="Rimuovi abbonamento"
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
                                                    title="Elimina definitivamente"
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
