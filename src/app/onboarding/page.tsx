'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSelectPlan = async (plan: 'BASE' | 'PREMIUM') => {
        setLoading(true);
        try {
            const res = await fetch('/api/subscription', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan }) // Ensure the API handles creating if not exists or updating
            });

            if (res.ok) {
                router.push('/dashboard');
            } else {
                alert("Errore durante la selezione del piano. Riprova.");
            }
        } catch (error) {
            console.error(error);
            alert("Errore di connessione.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f5f5f5',
            padding: '2rem'
        }}>
            <h1 className="h2" style={{ marginBottom: '2rem', color: '#1a237e' }}>Scegli il tuo piano</h1>
            <p style={{ marginBottom: '3rem', fontSize: '1.2rem', color: '#555' }}>Seleziona l'abbonamento più adatto alle tue esigenze per iniziare.</p>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {/* BASE PLAN */}
                <div className="card" style={{ width: '300px', textAlign: 'center', border: '1px solid #ddd' }}>
                    <h2 style={{ color: '#555' }}>Base</h2>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '1rem 0' }}>Gratis</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '2rem 0', textAlign: 'left' }}>
                        <li style={{ marginBottom: '0.5rem' }}>✅ 1 Menu Digitale</li>
                        <li style={{ marginBottom: '0.5rem' }}>✅ QR Code Base</li>
                        <li style={{ marginBottom: '0.5rem' }}>❌ Statistiche Avanzate</li>
                        <li style={{ marginBottom: '0.5rem' }}>❌ Supporto Dedicato</li>
                    </ul>
                    <button
                        onClick={() => handleSelectPlan('BASE')}
                        disabled={loading}
                        className="btn"
                        style={{ width: '100%', border: '1px solid #1a237e', color: '#1a237e' }}
                    >
                        {loading ? 'Attendi...' : 'Scegli Base'}
                    </button>
                </div>

                {/* PREMIUM PLAN */}
                <div className="card" style={{ width: '300px', textAlign: 'center', border: '2px solid #1a237e', transform: 'scale(1.05)' }}>
                    <div style={{ background: '#1a237e', color: 'white', padding: '0.5rem', borderRadius: '4px', display: 'inline-block', marginBottom: '1rem' }}>Consigliato</div>
                    <h2 style={{ color: '#1a237e' }}>Premium</h2>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '1rem 0' }}>€ 19<span style={{ fontSize: '1rem' }}>/mese</span></p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '2rem 0', textAlign: 'left' }}>
                        <li style={{ marginBottom: '0.5rem' }}>✅ Menu Illimitati</li>
                        <li style={{ marginBottom: '0.5rem' }}>✅ QR Code Personalizzabile</li>
                        <li style={{ marginBottom: '0.5rem' }}>✅ Statistiche Avanzate</li>
                        <li style={{ marginBottom: '0.5rem' }}>✅ Supporto Prioritario</li>
                    </ul>
                    <button
                        onClick={() => handleSelectPlan('PREMIUM')}
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                    >
                        {loading ? 'Attendi...' : 'Scegli Premium 👑'}
                    </button>
                </div>
            </div>
        </div>
    );
}
