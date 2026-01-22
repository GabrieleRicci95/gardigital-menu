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

    if (loading) return <div className="p-4">Caricamento Abbonamenti...</div>;

    return (
        <div>
            <h1 className="h2 mb-4" style={{ color: '#1a237e' }}>Abbonamenti Attivi</h1>

            <div className="card">
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #eee', color: '#666' }}>
                                <th style={{ padding: '12px' }}>Utente</th>
                                <th style={{ padding: '12px' }}>Ristorante</th>
                                <th style={{ padding: '12px' }}>Piano</th>
                                <th style={{ padding: '12px' }}>Stato</th>
                                <th style={{ padding: '12px' }}>Scadenza</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscriptions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                                        Nessun abbonamento trovato.
                                    </td>
                                </tr>
                            ) : (
                                subscriptions.map((sub) => (
                                    <tr key={sub.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '12px' }}>
                                            <strong>{sub.restaurant?.owner?.name || 'N/A'}</strong><br />
                                            <span style={{ fontSize: '0.8rem', color: '#666' }}>{sub.restaurant?.owner?.email}</span>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            {sub.restaurant?.name}
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <span style={{
                                                padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold',
                                                background: sub.plan === 'PREMIUM' ? 'linear-gradient(135deg, #ffd700 0%, #ff6f00 100%)' : '#e0e0e0',
                                                color: sub.plan === 'PREMIUM' ? 'white' : '#333'
                                            }}>
                                                {sub.plan}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <span style={{
                                                color: sub.status === 'ACTIVE' ? '#43a047' : '#d32f2f',
                                                fontWeight: 'bold'
                                            }}>
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px', fontSize: '0.9rem' }}>
                                            {sub.endDate ? new Date(sub.endDate).toLocaleDateString() : 'Illimitato'}
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
