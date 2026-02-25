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
                alert("Errore nel caricamento del pagamento: " + (data.error || 'Errore sconosciuto'));
            }
        } catch (err) {
            console.error("Payment error", err);
            alert("Errore tecnico durante il collegamento a Stripe.");
        } finally {
            setLoading(false);
        }
    };

    const handlePortal = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/checkout/portal', {
                method: 'POST',
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                // Friendly message if Stripe account is not found
                if (res.status === 404) {
                    alert("Account Stripe non trovato per questo indirizzo email. Se hai attivato l'abbonamento manualmente o tramite un altro indirizzo, contatta l'assistenza Gardigital.");
                } else {
                    alert("Errore nel caricamento del portale: " + (data.error || 'Errore sconosciuto'));
                }
            }
        } catch (err) {
            console.error("Portal error", err);
            alert("Errore tecnico durante il collegamento al portale Stripe.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!confirm("Sei sicuro di voler disdire il rinnovo automatico? L'abbonamento rimarrà attivo fino alla scadenza attuale, ma non verrà effettuato alcun addebito futuro.")) {
            return;
        }

        try {
            setLoading(true);
            const res = await fetch('/api/checkout/cancel', {
                method: 'POST',
            });
            const data = await res.json();
            if (res.ok) {
                alert("Rinnovo automatico disattivato con successo.");
                window.location.reload();
            } else {
                alert("Errore durante la disdetta: " + (data.error || 'Errore sconosciuto'));
            }
        } catch (err) {
            console.error("Cancel error", err);
            alert("Errore tecnico durante la disdetta.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !restaurant) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '20px' }}>
                <div className="spinner" style={{ width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #1a237e', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <p style={{ fontWeight: '600', color: '#1a237e' }}>Caricamento dati ristorante...</p>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    const currentPlan = restaurant?.subscription?.plan || 'BASE';
    const isRecurring = !!restaurant?.subscription?.isRecurring;
    const endDate = restaurant?.subscription?.endDate;
    const isExpired = currentPlan === 'PILOT' ? false : (endDate ? new Date(endDate) < new Date() : true);
    const isPilot = currentPlan === 'PILOT';

    const [isAppMode, setIsAppMode] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('platform') === 'app' || sessionStorage.getItem('isAppMode') === 'true') {
                setIsAppMode(true);
            }
        }
    }, []);

    // Get URL Params for feedback
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const isSuccess = searchParams?.get('success') === 'true';
    const isCanceled = searchParams?.get('canceled') === 'true';

    // UI per modalità App (Protezione Store)
    if (isAppMode) {
        return (
            <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
                <div style={{
                    background: 'white',
                    padding: '60px 40px',
                    borderRadius: '32px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                    border: '1px solid #eee',
                    marginTop: '40px'
                }}>
                    <ShieldCheck size={64} color="#1e3a8a" style={{ marginBottom: '24px' }} />
                    <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#0f172a', marginBottom: '16px' }}>Gestione Abbonamento</h1>
                    <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: '1.6', marginBottom: '32px' }}>
                        Per garantire la massima sicurezza e trasparenza, la gestione dei pagamenti e delle fatture è disponibile esclusivamente tramite il nostro portale web ufficiale.
                    </p>
                    <div style={{
                        background: '#f8fafc',
                        padding: '24px',
                        borderRadius: '20px',
                        border: '1px dashed #cbd5e1',
                        marginBottom: '32px'
                    }}>
                        <p style={{ fontWeight: '700', color: '#1e3a8a', marginBottom: '8px' }}>Accedi da Computer o Browser su:</p>
                        <code style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: '900' }}>master.gardigital.it</code>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                        Le tue funzionalità attive rimarranno operative nell'app dopo il rinnovo via web.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(2deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
                @keyframes pulse-gold {
                    0% { filter: drop-shadow(0 0 5px rgba(251, 191, 36, 0.4)); }
                    50% { filter: drop-shadow(0 0 15px rgba(251, 191, 36, 0.8)); }
                    100% { filter: drop-shadow(0 0 5px rgba(251, 191, 36, 0.4)); }
                }
                @keyframes mesh-bg {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>

            {/* Header Section - Premium Redesign */}
            <div style={{
                textAlign: 'center',
                marginBottom: '40px',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 25%, #1e3a8a 50%, #1e1b4b 75%, #0f172a 100%)',
                backgroundSize: '400% 400%',
                animation: 'mesh-bg 15s ease infinite',
                padding: '80px 20px',
                borderRadius: '32px',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 30px 60px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.1)'
            }}>
                {/* Decorative Glass Elements */}
                <div style={{ position: 'absolute', top: '10%', right: '5%', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(30px)' }} />
                <div style={{ position: 'absolute', bottom: '15%', left: '8%', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(20px)' }} />

                {/* Floating Rings */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '600px',
                    height: '600px',
                    border: '1px solid rgba(255,255,255,0.03)',
                    borderRadius: '50%',
                    pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) rotate(45deg)',
                    width: '800px',
                    height: '800px',
                    border: '1px solid rgba(255,255,255,0.02)',
                    borderRadius: '50%',
                    pointerEvents: 'none'
                }} />

                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ animation: 'float 4s ease-in-out infinite' }}>
                        <Crown size={56} style={{ marginBottom: '24px', color: '#fbbf24', animation: 'pulse-gold 3s ease-in-out infinite' }} />
                    </div>

                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: '900',
                        marginBottom: '20px',
                        letterSpacing: '-2px',
                        background: 'linear-gradient(to bottom, #ffffff 30%, #cbd5e1 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 10px 30px rgba(0,0,0,0.3)'
                    }}>
                        Scegli il tuo Successo
                    </h1>

                    <p style={{
                        fontSize: '1.25rem',
                        color: '#94a3b8',
                        maxWidth: '650px',
                        margin: '0 auto',
                        lineHeight: '1.7',
                        fontWeight: '500'
                    }}>
                        Sblocca tutto il potenziale del tuo ristorante con strumenti progettati <br /> per rivoluzionare la tua esperienza digitale.
                    </p>

                    {/* Status Bar - Glassmorphism Refresh */}
                    <div style={{
                        marginTop: '40px',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '20px',
                        flexWrap: 'wrap',
                        alignItems: 'center'
                    }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            padding: '12px 24px',
                            borderRadius: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            border: '1px solid rgba(255,255,255,0.08)',
                            backdropFilter: 'blur(12px)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                        }}>
                            <ShieldCheck size={20} color="#4ade80" />
                            <span style={{ fontWeight: '600', fontSize: '0.95rem', letterSpacing: '0.3px' }}>
                                Piano: <span style={{ color: '#fbbf24' }}>{currentPlan}</span>
                            </span>
                        </div>

                        {endDate && (
                            <div style={{
                                background: 'rgba(255,255,255,0.03)',
                                padding: '12px 24px',
                                borderRadius: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                border: '1px solid rgba(255,255,255,0.08)',
                                backdropFilter: 'blur(12px)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                            }}>
                                <Calendar size={20} color={isPilot ? "#fbbf24" : (isExpired ? "#ef4444" : "#fbbf24")} />
                                <span style={{ fontWeight: '600', fontSize: '0.95rem', letterSpacing: '0.3px' }}>
                                    {isPilot ? 'Status: ' : (isExpired ? 'Scaduto il: ' : 'Fino al: ')}
                                    <strong>{isPilot ? 'Accesso Vitalizio' : new Date(endDate).toLocaleDateString('it-IT')}</strong>
                                </span>
                            </div>
                        )}

                        <div style={{
                            background: isRecurring ? 'rgba(74, 222, 128, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                            padding: '12px 24px',
                            borderRadius: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            border: `1px solid ${isRecurring ? 'rgba(74, 222, 128, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                            backdropFilter: 'blur(12px)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                        }}>
                            <div style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                backgroundColor: isRecurring ? '#4ade80' : '#ef4444',
                                boxShadow: `0 0 10px ${isRecurring ? '#4ade80' : '#ef4444'}`
                            }} />
                            <span style={{ fontWeight: '600', fontSize: '0.95rem', letterSpacing: '0.3px' }}>
                                Rinnovo Automatico: <strong style={{ color: isRecurring ? '#4ade80' : '#ef4444' }}>{isRecurring ? 'ATTIVO' : 'DISATTIVATO'}</strong>
                            </span>
                        </div>

                        {/* Actions in Header Bar */}
                        {!isExpired && (isRecurring || restaurant?.subscription?.stripeSubscriptionId) && (
                            <div style={{ display: 'flex', gap: '12px', marginLeft: '10px' }}>
                                <button
                                    onClick={handlePortal}
                                    disabled={loading}
                                    title="Gestisci fatture e metodi di pagamento"
                                    style={{
                                        background: 'rgba(255,255,255,0.95)',
                                        color: '#0f172a',
                                        padding: '12px 24px',
                                        borderRadius: '50px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        border: 'none',
                                        fontWeight: '800',
                                        cursor: 'pointer',
                                        transition: '0.3s all',
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                                        fontSize: '0.95rem'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
                                    }}
                                >
                                    <CreditCard size={18} />
                                    Info Pagamenti
                                </button>

                                {isRecurring && (
                                    <button
                                        onClick={handleCancel}
                                        disabled={loading}
                                        style={{
                                            background: '#ef4444',
                                            color: 'white',
                                            padding: '12px 24px',
                                            borderRadius: '50px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            border: 'none',
                                            fontWeight: '800',
                                            cursor: 'pointer',
                                            transition: '0.3s all',
                                            boxShadow: '0 10px 25px rgba(239, 68, 68, 0.4)',
                                            fontSize: '0.95rem'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 15px 30px rgba(239, 68, 68, 0.5)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 10px 25px rgba(239, 68, 68, 0.4)';
                                        }}
                                    >
                                        <AlertCircle size={18} />
                                        Disdici Rinnovo
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

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
            {/* The original h1 and p tags are now part of the new Header Section */}

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
                            backgroundColor: isPilot ? '#fdf4ff' : (isExpired ? '#fee2e2' : '#dcfce7'),
                            color: isPilot ? '#a21caf' : (isExpired ? '#991b1b' : '#166534'),
                            marginBottom: '10px',
                            border: isPilot ? '1px solid #f0abfc' : 'none'
                        }}>
                            {isPilot ? 'PARTNER GARDIGITAL' : (isExpired ? 'SCADUTO' : 'ATTIVO')}
                        </div>
                        <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                            {isPilot ? 'Accesso Vitalizio' : (endDate ? `Scadenza: ${new Date(endDate).toLocaleDateString()}` : 'Data non disponibile')}
                        </p>
                    </div>
                </div>

                {/* Plan Info */}
                <div style={{ background: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                        <Zap color="#1a237e" />
                        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Piano {currentPlan}</h2>
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
                    { id: 'FULL', name: 'PACCHETTO FULL', price: '29,99', features: ['Menu', 'Traduzioni AI', 'Agenda', 'Supporto 24/7'], highlight: true },
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

                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 'bold', color: p.highlight ? 'white' : 'inherit' }}>{p.name}</h3>
                            <div style={{ marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                    <span style={{ fontSize: '2.5rem', fontWeight: '800', color: p.highlight ? 'white' : 'inherit' }}>€{displayPrice}</span>
                                    <small style={{ opacity: 0.7, color: p.highlight ? 'white' : 'inherit' }}>/mese</small>
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
                            {isCurrentPlan && !isExpired ? (
                                <div style={{
                                    backgroundColor: p.highlight ? 'rgba(255,255,255,0.1)' : 'rgba(26, 35, 126, 0.05)',
                                    color: p.highlight ? 'white' : '#1a237e',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    fontWeight: '800',
                                    textAlign: 'center',
                                    border: p.highlight ? '1px solid rgba(255,255,255,0.3)' : '1px solid #1a237e',
                                    fontSize: '1rem',
                                    marginTop: 'auto',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}>
                                    <CheckCircle size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                                    PIANO ATTIVO
                                </div>
                            ) : (
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
                                        gap: '8px',
                                        marginTop: 'auto'
                                    }}
                                    disabled={isCurrentPlan && isRecurring}
                                >
                                    {isCurrentPlan ? (isRecurring ? 'ABBONAMENTO ATTIVO' : 'Rinnova Abbonamento') : (isMastro ? 'RINNOVA' : 'Attiva Abbonamento')}
                                    <ArrowRight size={18} />
                                </button>
                            )}
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
