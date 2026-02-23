'use client';

import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, Zap, ShieldCheck, ArrowRight, Calendar, AlertCircle, Star, Crown, Sparkles } from 'lucide-react';

export default function SubscriptionPage() {
    const [restaurant, setRestaurant] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const res = await fetch('/api/restaurant');
                if (res.ok) {
                    const data = await res.json();
                    setRestaurant(data.restaurant);
                }
            } catch (err) {
                console.error("Failed to fetch restaurant data");
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurantData();
    }, []);

    const handlePayment = async (planType: string = 'MENU') => {
        try {
            setLoading(true);
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planType })
            });
            const data = await res.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                alert(data.error || "Errore durante l'inizializzazione del pagamento.");
            }
        } catch (err) {
            console.error("Payment redirect failed", err);
            alert("Si è verificato un errore di rete. Riprova più tardi.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !restaurant) return <div style={{ padding: '2rem', textAlign: 'center' }}>Caricamento...</div>;

    const expiryDate = restaurant?.subscription?.endDate ? new Date(restaurant.subscription.endDate) : null;
    const isExpired = expiryDate ? expiryDate < new Date() : false;
    const plan = restaurant?.subscription?.plan || 'BASE';

    // Get URL Params for feedback
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const isSuccess = searchParams?.get('success') === 'true';
    const isCanceled = searchParams?.get('canceled') === 'true';

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            {isSuccess && (
                <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', textAlign: 'center', border: '1px solid #bbf7d0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <CheckCircle size={20} />
                        <strong>Pagamento Riuscito!</strong> La tua sottoscrizione è stata estesa.
                    </div>
                </div>
            )}

            {isCanceled && (
                <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', textAlign: 'center', border: '1px solid #fecaca' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <AlertCircle size={20} />
                        <strong>Pagamento Annullato.</strong> Non è stato effettuato alcun addebito.
                    </div>
                </div>
            )}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', color: '#1a237e', marginBottom: '0.5rem' }}>Abbonamento Menu Digitale</h1>
                <p style={{ color: '#666', fontSize: '1.1rem' }}>Scegli la sicurezza e la professionalità per il tuo locale</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                {/* Current Status */}
                <div style={{ background: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                        <Calendar color="#1a237e" />
                        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Stato Account</h2>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            display: 'inline-block',
                            padding: '6px 20px',
                            borderRadius: '20px',
                            fontWeight: 'bold',
                            backgroundColor: isExpired ? '#fee2e2' : '#dcfce7',
                            color: isExpired ? '#991b1b' : '#166534',
                            marginBottom: '10px'
                        }}>
                            {isExpired ? 'SCADUTO' : 'ATTIVO'}
                        </div>
                        <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                            {expiryDate ? `Scadenza: ${expiryDate.toLocaleDateString()}` : 'Data non disponibile'}
                        </p>
                    </div>
                </div>

                {/* Plan Info */}
                <div style={{ background: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                        <Zap color="#1a237e" />
                        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Piano {plan}</h2>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <CheckCircle size={16} color="#4caf50" /> Menu Digitale Interattivo
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <CheckCircle size={16} color="#4caf50" /> Traduzione AI automatica
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <CheckCircle size={16} color="#4caf50" /> Gestione Prenotazioni
                        </li>
                    </ul>
                </div>
            </div>

            {/* Plan Selection */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem', justifyContent: 'start' }}>
                {[
                    { id: 'MENU', name: 'Menu Base', price: '15,00', features: ['Menu Interattivo', 'QR Code Illimitati', 'Supporto 24/7'] },
                    { id: 'MENU_AI', name: 'Menu + AI', price: '25,00', features: ['Menu Interattivo', 'Traduzioni AI', 'Supporto 24/7'] },
                    { id: 'MENU_AGENDA', name: 'Menu + Agenda', price: '25,00', features: ['Menu Interattivo', 'Gestione prenotazioni', 'Supporto 24/7'] },
                    { id: 'FULL', name: 'PACCHETTO FULL', price: '35,00', features: ['Menu', 'Traduzioni AI', 'Agenda', 'Supporto 24/7'], highlight: true },
                ].filter(p => {
                    // SE IL RISTORANTE È MASTRO ARROSTICINO, MOSTRA SOLO IL PACCHETTO FULL
                    const isMastro = restaurant?.id === 'cmlmuyjwe0002hgn2a547whlk' || restaurant?.slug?.includes('mastro-arrosticino');
                    if (isMastro) {
                        return p.id === 'FULL';
                    }
                    return true;
                }).map((p) => {
                    const isMastro = restaurant?.id === 'cmlmuyjwe0002hgn2a547whlk' || restaurant?.slug?.includes('mastro-arrosticino');

                    // SPECIAL PRICE FOR PILOT PARTNER: Mastroarrosticino (Gaspare)
                    let displayPrice = p.price;
                    if (p.id === 'FULL' && isMastro) {
                        displayPrice = '15,00';
                    }

                    const isCurrentPlan = restaurant?.subscription?.plan === p.id;
                    const isRecurring = restaurant?.subscription?.isRecurring;
                    const endDate = restaurant?.subscription?.endDate;

                    return (
                        <div key={p.id} style={{
                            background: p.highlight ? '#1a237e' : 'white',
                            color: p.highlight ? 'white' : '#333',
                            padding: '2rem',
                            borderRadius: '24px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                            border: p.highlight ? 'none' : '1px solid #eee',
                            display: 'flex',
                            flexDirection: 'column',
                            transform: (p.highlight || isCurrentPlan) ? 'scale(1.02)' : 'none',
                            zIndex: (p.highlight || isCurrentPlan) ? 1 : 0,
                            maxWidth: '400px',
                            margin: '0',
                            position: 'relative'
                        }}>
                            {/* Recurring Status Badge */}
                            {isCurrentPlan && isRecurring && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-12px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    backgroundColor: '#4caf50',
                                    color: 'white',
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    whiteSpace: 'nowrap'
                                }}>
                                    <ShieldCheck size={14} /> RINNOVO AUTOMATICO ATTIVO
                                </div>
                            )}

                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 'bold' }}>{p.name}</h3>
                            <div style={{ marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                    <span style={{ fontSize: '2.5rem', fontWeight: '800' }}>€{displayPrice}</span>
                                    <small style={{ opacity: 0.7 }}>/mese</small>
                                </div>
                                {isMastro && (
                                    <div style={{ color: '#fbbf24', fontSize: '0.8rem', fontWeight: '600', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Star size={12} fill="currentColor" /> Prezzo di favore applicato
                                    </div>
                                )}

                                {isCurrentPlan && endDate && (
                                    <div style={{ fontSize: '0.85rem', marginTop: '12px', color: p.highlight ? 'rgba(255,255,255,0.8)' : '#666' }}>
                                        {isRecurring ? 'Prossimo addebito:' : 'Scade il:'} <strong>{new Date(endDate).toLocaleDateString('it-IT')}</strong>
                                    </div>
                                )}
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', flexGrow: 1 }}>
                                {p.features.map(f => (
                                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '0.95rem' }}>
                                        <CheckCircle size={14} color={p.highlight ? '#fff' : '#4caf50'} /> {f}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handlePayment(p.id)}
                                style={{
                                    backgroundColor: p.highlight ? 'white' : '#1a237e',
                                    color: p.highlight ? '#1a237e' : 'white',
                                    border: 'none',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    width: '100%',
                                    transition: '0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                                disabled={isCurrentPlan && isRecurring}
                            >
                                {isCurrentPlan && isRecurring ? 'ABBONAMENTO ATTIVO' : (isMastro ? 'RINNOVA' : 'Attiva Abbonamento')}
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Support Message */}
            <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', marginTop: 'auto' }}>
                <ShieldCheck size={16} style={{ marginBottom: '-3px', marginRight: '5px' }} />
                Pagamenti criptati e sicuri tramite Stripe. Fatturazione automatica ogni 30 giorni.
            </div>
        </div>
    );
}
