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
    } | null;
}

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

    const handlePlanChange = async (restaurantId: string, newPlan: 'FREE' | 'PREMIUM', durationMonths?: number) => {
        // Optimistic update
        setRestaurants(prev => prev.map(r => {
            if (r.id === restaurantId) {
                return { ...r, subscription: { ...r.subscription, plan: newPlan, status: 'ACTIVE' } };
            }
            return r;
        }));

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

    if (loading) return <div className="p-4">Caricamento ristoranti...</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <h1 className="h2 mb-4">Gestione Ristoranti</h1>

            <input
                type="text"
                placeholder="Cerca ristorante o proprietario..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    width: '100%',
                    maxWidth: '400px',
                    marginBottom: '2rem'
                }}
            />

            <div style={{ overflowX: 'auto', background: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left', color: '#666' }}>
                            <th style={{ padding: '1rem' }}>Ristorante</th>
                            <th style={{ padding: '1rem' }}>Proprietario</th>
                            <th style={{ padding: '1rem' }}>Stato Abbonamento</th>
                            <th style={{ padding: '1rem' }}>Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRestaurants.map(r => {
                            const isPremium = r.subscription?.plan === 'PREMIUM';
                            return (
                                <tr key={r.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{r.name}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: '500' }}>{r.owner.name || 'N/D'}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#888' }}>{r.owner.email}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold',
                                            background: isPremium ? '#e8f5e9' : '#f5f5f5',
                                            color: isPremium ? '#2e7d32' : '#616161'
                                        }}>
                                            {isPremium ? 'PREMIUM ✨' : 'BASE'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {isPremium ? (
                                            <button
                                                onClick={() => handlePlanChange(r.id, 'FREE')}
                                                style={{ border: '1px solid #ddd', background: 'white', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                                            >
                                                ⬇️ Downgrade a Base
                                            </button>
                                        ) : (
                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                <button
                                                    onClick={() => handlePlanChange(r.id, 'PREMIUM', 1)}
                                                    style={{ border: 'none', background: '#4caf50', color: 'white', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                                                    title="Regala 1 Mese"
                                                >
                                                    +1 Mese
                                                </button>
                                                <button
                                                    onClick={() => handlePlanChange(r.id, 'PREMIUM', 12)}
                                                    style={{ border: 'none', background: '#2196f3', color: 'white', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                                                    title="Regala 1 Anno"
                                                >
                                                    +1 Anno
                                                </button>
                                                <button
                                                    onClick={() => handlePlanChange(r.id, 'PREMIUM')}
                                                    style={{ border: 'none', background: '#1a237e', color: 'white', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                                                    title="Attiva senza scadenza (o standard)"
                                                >
                                                    ♾️ Illimitato
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
