'use client';

import { useState } from 'react';
import styles from '../../dashboard/dashboard.module.css';

interface Restaurant {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    owner: { email: string };
    subscription: { plan: string; status: string; hasTranslations?: boolean; hasReservations?: boolean } | null;
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
                                            In attesa / Scaduto
                                        </span>
                                    ) : (
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
                                    )}
                                    {rest.subscription?.hasTranslations && <span style={{ marginLeft: '5px', fontSize: '0.8rem' }}>🌍</span>}
                                    {rest.subscription?.hasReservations && <span style={{ marginLeft: '5px', fontSize: '0.8rem' }}>📅</span>}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
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
                                                opacity: rest.subscription?.status === 'ACTIVE' ? 0.5 : 1
                                            }}
                                            title="Attiva solo Piano Base (€15)"
                                        >
                                            Base
                                        </button>
                                        <button
                                            onClick={() => handleUpdatePlan(rest.id, 'FULL')} // Need to handle features in backend
                                            disabled={updating === rest.id}
                                            className="btn btn-sm"
                                            style={{
                                                backgroundColor: '#fbc02d',
                                                color: 'black',
                                                border: 'none',
                                                fontSize: '0.75rem',
                                                padding: '4px 8px',
                                                cursor: 'pointer'
                                            }}
                                            title="Attiva Tutto (Base + Trad + Prenotazioni) - €25"
                                        >
                                            Full (€25)
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
