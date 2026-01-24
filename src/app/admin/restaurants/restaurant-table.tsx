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
            const res = await fetch('/api/admin/restaurants/update-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    restaurantId,
                    newPlan,
                    durationMonths: 12 // Default duration
                }),
            });

            if (res.ok) {
                // Optimistic update locally
                setRestaurants(prev => prev.map(r => {
                    if (r.id === restaurantId) {
                        return {
                            ...r,
                            subscription: newPlan === 'BLOCKED' ? null : {
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
                        <th style={{ padding: '1rem' }}>Stato Abbonamento</th>
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
                                    {(!rest.subscription || rest.subscription.status !== 'ACTIVE') ? (
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
                                            backgroundColor: rest.subscription?.plan === 'PREMIUM' ? '#e8f5e9' : rest.subscription?.plan === 'WEBSITE' ? '#f3e5f5' : '#f5f5f5',
                                            color: rest.subscription?.plan === 'PREMIUM' ? '#2e7d32' : rest.subscription?.plan === 'WEBSITE' ? '#7b1fa2' : '#757575',
                                            border: rest.subscription?.plan === 'PREMIUM' ? '1px solid #c8e6c9' : rest.subscription?.plan === 'WEBSITE' ? '1px solid #e1bee7' : '1px solid #e0e0e0'
                                        }}>
                                            {rest.subscription?.plan === 'FREE' ? 'BASE' : rest.subscription?.plan}
                                        </span>
                                    )}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                        <button
                                            onClick={() => handleUpdatePlan(rest.id, 'FREE')}
                                            disabled={updating === rest.id}
                                            className="btn btn-sm"
                                            style={{
                                                backgroundColor: '#757575',
                                                color: 'white',
                                                border: 'none',
                                                fontSize: '0.75rem',
                                                padding: '4px 8px',
                                                cursor: 'pointer',
                                                opacity: rest.subscription?.plan === 'FREE' && rest.subscription?.status === 'ACTIVE' ? 0.5 : 1
                                            }}
                                        >
                                            Base
                                        </button>
                                        <button
                                            onClick={() => handleUpdatePlan(rest.id, 'PREMIUM')}
                                            disabled={updating === rest.id}
                                            className="btn btn-sm"
                                            style={{
                                                backgroundColor: '#2e7d32',
                                                color: 'white',
                                                border: 'none',
                                                fontSize: '0.75rem',
                                                padding: '4px 8px',
                                                cursor: 'pointer',
                                                opacity: rest.subscription?.plan === 'PREMIUM' && rest.subscription?.status === 'ACTIVE' ? 0.5 : 1
                                            }}
                                        >
                                            Premium
                                        </button>
                                        <button
                                            onClick={() => handleUpdatePlan(rest.id, 'BLOCKED')}
                                            disabled={updating === rest.id}
                                            className="btn btn-sm"
                                            style={{
                                                backgroundColor: '#c62828',
                                                color: 'white',
                                                border: 'none',
                                                fontSize: '0.75rem',
                                                padding: '4px 8px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Blocca
                                        </button>
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
