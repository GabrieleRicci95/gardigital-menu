'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './dashboard.module.css';

export default function DashboardPage() {
    const [subscription, setSubscription] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/restaurant?t=' + Date.now());
            if (res.ok) {
                const data = await res.json();
                setSubscription(data.restaurant?.subscription);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePlan = async (newPlan: 'BASE' | 'PREMIUM') => {
        if (!confirm(`Sei sicuro di voler passare al piano ${newPlan}?`)) return;
        setUpdating(true);
        try {
            const res = await fetch('/api/subscription', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: newPlan })
            });

            if (res.ok) {
                const updatedSub = await res.json();
                setSubscription(updatedSub);
                alert(`Piano aggiornato con successo a ${newPlan}!`);
            } else {
                alert("Errore durante l'aggiornamento del piano.");
            }
        } catch (error) {
            alert("Errore di connessione.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="p-4">Caricamento Dashboard...</div>;

    const isPremium = subscription?.plan === 'PREMIUM' && subscription?.status === 'ACTIVE';

    return (
        <div>
            <h1 className="h2 mb-4">Panoramica</h1>

            <div className={styles.grid}>
                {/* Status Card */}
                <div className="card">
                    <h3>Stato Abbonamento</h3>
                    <p className={styles.stat} style={{ color: isPremium ? '#43a047' : '#ffa000' }}>
                        {isPremium ? 'PREMIUM 👑' : 'BASE'}
                    </p>
                    <p className={styles.desc}>
                        {isPremium
                            ? 'Hai accesso illimitato a tutte le funzionalità.'
                            : 'Hai accesso limitato (1 Menu). Passa a Premium per sbloccare tutto!'}
                    </p>
                </div>

                {/* Menu Link Card */}
                <div className="card">
                    <h3>I Tuoi Menu</h3>
                    <p className={styles.desc}>Gestisci i piatti, prezzi e categorie.</p>
                    <Link href="/dashboard/menu" className="btn btn-primary mt-2">Gestisci Menu</Link>
                </div>

                {/* QR Code Card */}
                <div className="card">
                    <h3>Il Tuo QR Code</h3>
                    <p className={styles.desc}>Scarica e stampa il tuo codice per i tavoli.</p>
                    <Link href="/dashboard/qrcode" className="btn btn-primary mt-2">Scarica QR</Link>
                </div>

                {/* Subscription Management Card */}
                <div className="card" style={{ gridColumn: '1 / -1', marginTop: '1rem', borderTop: '2px solid #eee' }}>
                    <h3>Gestione Abbonamento</h3>
                    <p className={styles.desc}>Cambia il tuo piano in qualsiasi momento (Simulazione).</p>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '1rem' }}>
                        {isPremium ? (
                            <button
                                onClick={() => handleChangePlan('BASE')}
                                disabled={updating}
                                className="btn"
                                style={{ border: '1px solid #757575', color: '#757575' }}
                            >
                                {updating ? 'Attendere...' : 'Torna al piano Base'}
                            </button>
                        ) : (
                            <button
                                onClick={() => handleChangePlan('PREMIUM')}
                                disabled={updating}
                                className="btn"
                                style={{ background: 'linear-gradient(135deg, #ffd700 0%, #ff6f00 100%)', color: 'white', border: 'none', fontWeight: 'bold' }}
                            >
                                {updating ? 'Attendere...' : 'Passa a Premium 👑'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
