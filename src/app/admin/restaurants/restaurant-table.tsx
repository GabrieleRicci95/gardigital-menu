'use client';

import { useState } from 'react';
import styles from '../../dashboard/dashboard.module.css';

interface Restaurant {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    owner: { email: string };
    subscription: { plan: string; status: string } | null;
}

export default function RestaurantTable({ initialRestaurants }: { initialRestaurants: Restaurant[] }) {
    const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants);
    const [updating, setUpdating] = useState<string | null>(null);

    const handleUpdatePlan = async (restaurantId: string, newPlan: string) => {
        setUpdating(restaurantId);

        try {
            const res = await fetch('/api/admin/subscriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    restaurantId,
                    plan: newPlan,
                    status: 'ACTIVE'
                }),
            });

            if (res.ok) {
                // Optimistic update locally
                setRestaurants(prev => prev.map(r => {
                    if (r.id === restaurantId) {
                        return {
                            ...r,
                            subscription: {
                                ...r.subscription,
                                plan: newPlan,
                                status: 'ACTIVE'
                            }
                        };
                    }
                    return r;
                }));
            } else {
                alert('Errore aggiornamento piano');
            }
        } catch (e) {
            alert('Errore di connessione');
        } finally {
            setUpdating(null);
        }
    };

    return (
        <div className="card" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                        <th style={{ padding: '1rem' }}>Ristorante</th>
                        <th style={{ padding: '1rem' }}>Proprietario</th>
                        <th style={{ padding: '1rem' }}>Data Iscrizione</th>
                        <th style={{ padding: '1rem' }}>Piano Attivo</th>
                        <th style={{ padding: '1rem' }}>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {restaurants.length === 0 ? (
                        <tr>
                            <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                                Nessun ristorante trovato.
                            </td>
                        </tr>
                    ) : (
                        restaurants.map((rest) => (
                            <tr key={rest.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: '600' }}>{rest.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>/{rest.slug}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>{rest.owner.email}</td>
                                <td style={{ padding: '1rem' }}>
                                    {new Date(rest.createdAt).toLocaleDateString('it-IT')}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                        backgroundColor: rest.subscription?.plan === 'PREMIUM' ? '#fff8e1' : '#f5f5f5',
                                        color: rest.subscription?.plan === 'PREMIUM' ? '#ff8f00' : '#757575',
                                        border: rest.subscription?.plan === 'PREMIUM' ? '1px solid #ffcdd2' : '1px solid #e0e0e0'
                                    }}>
                                        {rest.subscription?.plan || 'FREE'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        {rest.subscription?.plan !== 'PREMIUM' ? (
                                            <button
                                                onClick={() => handleUpdatePlan(rest.id, 'PREMIUM')}
                                                disabled={updating === rest.id}
                                                className="btn btn-sm"
                                                style={{ backgroundColor: '#2e7d32', color: 'white', border: 'none' }}
                                            >
                                                {updating === rest.id ? '...' : 'Promuovi a Premium'}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleUpdatePlan(rest.id, 'FREE')}
                                                disabled={updating === rest.id}
                                                className="btn btn-sm"
                                                style={{ backgroundColor: '#757575', color: 'white', border: 'none' }}
                                            >
                                                {updating === rest.id ? '...' : 'Downgrade a Base'}
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
