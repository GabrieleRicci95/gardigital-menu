'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './subscription.module.css'; // We'll assume a new CSS module or inline styles for simplicity first, but let's use inline for speed as per pattern

export default function SubscriptionPage() {
    const [loading, setLoading] = useState(true);
    const [currentPlan, setCurrentPlan] = useState('FREE');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetch('/api/restaurant')
            .then(res => res.json())
            .then(data => {
                if (data.restaurant?.subscription?.plan) {
                    setCurrentPlan(data.restaurant.subscription.plan);
                }
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, []);

    const handleUpgrade = async () => {
        setProcessing(true);

        // Simulate payment delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const res = await fetch('/api/subscription/upgrade', { method: 'POST' });
            if (res.ok) {
                alert('🎉 Pagamento riuscito! Benvenuto in Premium.');
                window.location.reload();
            } else {
                alert('Errore durante il pagamento simulato.');
            }
        } catch (error) {
            alert('Errore di connessione.');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="p-4">Caricamento piani...</div>;

    const isPremium = currentPlan === 'PREMIUM';

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1 className="h2" style={{ margin: 0 }}>Scegli il tuo Piano</h1>
            </div>

            <p style={{ textAlign: 'center', color: '#666', marginBottom: '3rem' }}>
                Sblocca tutto il potenziale del tuo menu digitale.
            </p>

            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>

                {/* BASIC PLAN */}
                <div style={{
                    border: '1px solid #ddd',
                    borderRadius: '12px',
                    padding: '2rem',
                    flex: '1',
                    minWidth: '300px',
                    background: 'white',
                    position: 'relative'
                }}>
                    <h3 style={{ color: '#555', fontSize: '1.2rem' }}>Piano Base</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '1rem 0' }}>€9,<span style={{ fontSize: '0.6em' }}>99</span><span style={{ fontSize: '1rem', fontWeight: 'normal' }}>/mese</span></div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '2rem 0', lineHeight: '2' }}>
                        <li>✅ Menu Digitale Semplice</li>
                        <li>✅ Fino a 20 Piatti</li>
                        <li>✅ QR Code Standard</li>
                        <li style={{ color: '#ccc' }}>❌ Foto Piatti</li>
                        <li style={{ color: '#ccc' }}>❌ Descrizioni AI</li>
                        <li style={{ color: '#ccc' }}>❌ Traduzione Multilingua</li>
                    </ul>
                    {isPremium ? (
                        <button disabled className="btn" style={{ width: '100%', border: '1px solid #ddd', background: '#f5f5f5' }}>
                            Incluso
                        </button>
                    ) : (
                        <button disabled className="btn btn-primary" style={{ width: '100%', background: '#757575', cursor: 'default' }}>
                            Piano Attuale
                        </button>
                    )}
                </div>

                {/* PREMIUM PLAN */}
                <div style={{
                    border: '2px solid #1a237e',
                    borderRadius: '12px',
                    padding: '2rem',
                    flex: '1',
                    minWidth: '300px',
                    background: 'white',
                    position: 'relative',
                    boxShadow: '0 10px 30px rgba(26, 35, 126, 0.1)'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#1a237e',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                    }}>CONSIGLIATO</div>

                    <h3 style={{ color: '#1a237e', fontSize: '1.2rem' }}>Premium</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '1rem 0', color: '#1a237e' }}>
                        <span style={{ textDecoration: 'line-through', fontSize: '0.5em', color: '#999', marginRight: '10px' }}>€29,99</span>
                        €14,99<span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#666' }}>/mese</span>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '2rem 0', lineHeight: '2' }}>
                        <li>✅ <strong>Tutto incluso nel Base</strong></li>
                        <li>✅ <strong>Piatti Illimitati</strong></li>
                        <li>✅ <strong>Foto per ogni piatto</strong></li>
                        <li>✅ <strong>Descrizioni via Intelligenza Artificiale</strong></li>
                        <li>✅ QR Code Personalizzato</li>
                        <li>✅ Traduzione Multilingua</li>
                    </ul>

                    {isPremium ? (
                        <button className="btn btn-primary" style={{ width: '100%', background: '#1a237e', cursor: 'default' }} disabled>
                            Gia Attivo ✨
                        </button>
                    ) : (
                        <Link
                            href="/contact?plan=Premium"
                            className="btn btn-primary"
                            style={{
                                display: 'block',
                                width: '100%',
                                background: '#25D366', // Green
                                boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)',
                                textAlign: 'center',
                                textDecoration: 'none',
                                lineHeight: 'normal',
                                padding: '12px'
                            }}
                        >
                            Contattaci per Attivare 📱
                        </Link>
                    )}
                </div>

            </div>
        </div>
    );
}
