'use client';

import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, Zap, ShieldCheck, ArrowRight, Calendar, AlertCircle, Star, Crown, Sparkles, Utensils } from 'lucide-react';

export default function SubscriptionPage() {
    const [restaurant, setRestaurant] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isAppMode, setIsAppMode] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const params = new URLSearchParams(window.location.search);
                const ua = navigator.userAgent || '';

                const hasParam = params.get('platform') === 'app';
                const hasSession = sessionStorage.getItem('isAppMode') === 'true';
                const isWebView = /Android/i.test(ua) && /Version\/[0-9.]+/i.test(ua);
                const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;

                const isCapacitorNative = (window as any).Capacitor?.isNativePlatform?.() === true;

                if (hasParam || hasSession || isWebView || isStandalone || isCapacitorNative) {
                    setIsAppMode(true);
                }
            } catch (e) {
                console.warn("Storage access restricted", e);
            }
        }
    }, []);

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
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh', 
                flexDirection: 'column', 
                gap: '20px',
                background: '#050505',
                color: '#d4af37'
            }}>
                <div className="spinner" style={{ 
                    width: '48px', 
                    height: '48px', 
                    border: '3px solid rgba(212, 175, 55, 0.1)', 
                    borderTop: '3px solid #d4af37', 
                    borderRadius: '50%', 
                    animation: 'spin 1s linear infinite' 
                }} />
                <p style={{ fontWeight: '600', fontFamily: 'Inter, sans-serif' }}>Caricamento Abbonamento...</p>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    const currentPlan = restaurant?.subscription?.plan || 'BASE';
    const isRecurring = !!restaurant?.subscription?.isRecurring;
    const endDate = restaurant?.subscription?.endDate;
    const isExpired = currentPlan === 'PILOT' ? false : (endDate ? new Date(endDate) < new Date() : true);
    const isPilot = currentPlan === 'PILOT';


    // Get URL Params for feedback
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const isSuccess = searchParams?.get('success') === 'true';
    const isCanceled = searchParams?.get('canceled') === 'true';

    // UI per modalità App (Protezione Store)
    if (isAppMode) {
        return (
            <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
                <div style={{
                    background: '#0f0f0f',
                    padding: '60px 40px',
                    borderRadius: '32px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    border: '1px solid rgba(212, 175, 55, 0.1)',
                    marginTop: '40px',
                    color: '#ffffff'
                }}>
                    <ShieldCheck size={64} color="#d4af37" style={{ marginBottom: '24px' }} />
                    <h1 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '16px', fontFamily: 'Playfair Display, serif' }}>Gestione Abbonamento</h1>
                    <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6', marginBottom: '32px' }}>
                        Per garantire la massima sicurezza e trasparenza, la gestione dei pagamenti e delle fatture è disponibile esclusivamente tramite il nostro portale web ufficiale.
                    </p>
                    <div style={{
                        background: 'rgba(212, 175, 55, 0.05)',
                        padding: '24px',
                        borderRadius: '20px',
                        border: '1px dashed rgba(212, 175, 55, 0.3)',
                        marginBottom: '32px'
                    }}>
                        <p style={{ fontWeight: '700', color: '#d4af37', marginBottom: '8px' }}>Accedi da Computer o Browser su:</p>
                        <code style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: '900' }}>master.gardigital.it</code>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)' }}>
                        Le tue funzionalità attive rimarranno operative nell'app dopo il rinnovo via web.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            padding: '2rem',
            maxWidth: '1200px',
            margin: '0 auto',
            fontFamily: 'Inter, sans-serif',
            color: '#ffffff',
            background: '#050505',
            minHeight: '100vh',
            boxSizing: 'border-box'
        }} className="main-container">
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-5px); }
                    100% { transform: translateY(0px); }
                }
                .glass-card {
                    background: rgba(15, 15, 15, 0.6) !important;
                    backdrop-filter: blur(20px) !important;
                    border: 1px solid rgba(212, 175, 55, 0.1) !important;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.4) !important;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
                }
                .status-pill {
                    padding: 8px 16px;
                    border-radius: 50px;
                    font-size: 0.85rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    border: 1px solid rgba(212, 175, 55, 0.2);
                    background: rgba(212, 175, 55, 0.05);
                    color: #d4af37;
                    letter-spacing: 0.5px;
                }
                @media (max-width: 768px) {
                    .main-container { padding: 1rem !important; }
                    .status-bar { flex-direction: column !important; align-items: stretch !important; padding: 1.5rem !important; }
                    .status-group { flex-direction: column !important; gap: 1rem !important; }
                    .divider { display: none !important; }
                }
            `}</style>

            {/* Slim Premium Status Bar */}
            <div className="glass-card status-bar" style={{
                padding: '1.2rem 2rem',
                borderRadius: '24px',
                marginBottom: '4rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.5rem'
            }}>
                <div className="status-group" style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>Stato Account</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="status-pill">
                                <Crown size={14} />
                                {currentPlan}
                            </div>
                            <span style={{ 
                                fontSize: '0.9rem', 
                                fontWeight: '700',
                                color: isExpired ? '#ef4444' : '#4ade80'
                            }}>
                                {isExpired ? 'SOSPESO' : 'ATTIVO'}
                            </span>
                        </div>
                    </div>

                    <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.1)' }} className="divider" />
                    
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>
                            {isPilot ? 'Validità' : (isExpired ? 'Scaduto il' : 'Prossimo Rinnovo')}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', fontWeight: 'bold', fontSize: '0.95rem' }}>
                            <Calendar size={14} color="#d4af37" />
                            {isPilot ? 'Illimitata' : (endDate ? new Date(endDate).toLocaleDateString('it-IT') : '---')}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>Rinnovo Auto</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: isRecurring ? '#4ade80' : '#ef4444',
                                boxShadow: `0 0 10px ${isRecurring ? '#4ade80' : '#ef4444'}`
                            }} />
                            <span style={{ fontWeight: '700', fontSize: '0.85rem', color: isRecurring ? '#4ade80' : '#ef4444' }}>
                                {isRecurring ? 'ON' : 'OFF'}
                            </span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    {!isExpired && (isRecurring || restaurant?.subscription?.stripeSubscriptionId) && (
                        <>
                            <button
                                onClick={handlePortal}
                                disabled={loading}
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    color: '#ffffff',
                                    padding: '10px 18px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    fontWeight: '600',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    transition: '0.3s all'
                                }}
                            >
                                <CreditCard size={14} />
                                Fatture
                            </button>

                            {isRecurring && (
                                <button
                                    onClick={handleCancel}
                                    disabled={loading}
                                    style={{
                                        background: 'rgba(239, 68, 68, 0.08)',
                                        color: '#ef4444',
                                        padding: '10px 18px',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        border: '1px solid rgba(239, 68, 68, 0.2)',
                                        fontWeight: '600',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        transition: '0.3s all'
                                    }}
                                >
                                    Disdici
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {isSuccess && (
                <div style={{ background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', padding: '1.2rem', borderRadius: '16px', marginBottom: '2.5rem', textAlign: 'center', border: '1px solid rgba(74, 222, 128, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <CheckCircle size={20} />
                        <strong style={{ fontWeight: '800' }}>PAGAMENTO RIUSCITO!</strong> La tua sottoscrizione è stata aggiornata con successo.
                    </div>
                </div>
            )}

            {isCanceled && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1.2rem', borderRadius: '16px', marginBottom: '2.5rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <AlertCircle size={20} />
                        <strong style={{ fontWeight: '800' }}>OPERAZIONE ANNULLATA.</strong> Nessun addebito è stato effettuato sul tuo conto.
                    </div>
                </div>
            )}

            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 style={{ 
                    fontFamily: 'Playfair Display, serif', 
                    fontSize: '2.5rem', 
                    marginBottom: '1rem',
                    color: '#d4af37',
                    fontWeight: '900'
                }}>
                    Piani di Successo
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    Scegli la configurazione perfetta per elevare l'esperienza digitale del tuo ristorante.
                </p>
            </div>

            {/* Plan Selection Grid */}
            <div className="plans-grid" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                gap: '1.5rem', 
                marginBottom: '5rem', 
                justifyContent: 'center', 
                width: '100%' 
            }}>
                {[
                    { id: 'MENU', name: 'Menu Base', price: '15,00', features: ['Menu Interattivo', 'QR Code Illimitati', 'Supporto 24/7'], icon: <Utensils size={22} /> },
                    { id: 'MENU_AI', name: 'Menu + AI', price: '25,00', features: ['Menu Interattivo', 'Traduzioni AI', 'Supporto 24/7'], icon: <Sparkles size={22} /> },
                    { id: 'MENU_AGENDA', name: 'Menu + Agenda', price: '25,00', features: ['Menu Interattivo', 'Gestione prenotazioni', 'Supporto 24/7'], icon: <Calendar size={22} /> },
                    { id: 'FULL', name: 'PACCHETTO FULL', price: '29,99', features: ['Menu', 'Traduzioni AI', 'Agenda', 'Supporto 24/7'], highlight: true, icon: <Crown size={24} /> },
                ].filter(p => {
                    const isMastro = restaurant?.id === 'cmlmuyjwe0002hgn2a547whlk' || restaurant?.slug?.includes('mastro-arrosticino');
                    if (isMastro) return p.id === 'FULL';
                    return true;
                }).map((p) => {
                    const isMastro = restaurant?.id === 'cmlmuyjwe0002hgn2a547whlk' || restaurant?.slug?.includes('mastro-arrosticino');
                    let displayPrice = p.price;
                    if (p.id === 'FULL' && isMastro) displayPrice = '15,00';

                    const isCurrentPlan = restaurant?.subscription?.plan === p.id;

                    return (
                        <div key={p.id} className="glass-card" style={{
                            padding: '2rem 1.5rem',
                            borderRadius: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            transform: (p.highlight || isCurrentPlan) ? 'translateY(-5px)' : 'none',
                            border: (p.highlight || isCurrentPlan) ? '1px solid #d4af37' : '1px solid rgba(212, 175, 55, 0.1)',
                            position: 'relative',
                            boxShadow: (p.highlight || isCurrentPlan) ? '0 20px 40px rgba(0,0,0,0.6), 0 0 15px rgba(212, 175, 55, 0.1)' : '0 15px 30px rgba(0,0,0,0.4)',
                        }}>
                            {p.highlight && !isCurrentPlan && (
                                <div style={{
                                    position: 'absolute',
                                    top: '16px',
                                    right: '16px',
                                    background: 'linear-gradient(135deg, #d4af37, #f1d58a)',
                                    color: '#000',
                                    padding: '4px 10px',
                                    borderRadius: '50px',
                                    fontSize: '0.6rem',
                                    fontWeight: '900',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}>
                                    TOP
                                </div>
                            )}

                            <div style={{ color: '#d4af37', marginBottom: '1.2rem', animation: 'float 3s ease-in-out infinite' }}>
                                {p.icon}
                            </div>

                            <h3 style={{ 
                                fontSize: '1.2rem', 
                                marginBottom: '0.8rem', 
                                fontWeight: '700', 
                                fontFamily: 'Playfair Display, serif',
                                color: '#ffffff'
                            }}>
                                {p.name}
                            </h3>

                            <div style={{ marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                    <span style={{ fontSize: '2rem', fontWeight: '800', color: '#ffffff', fontFamily: 'Playfair Display, serif' }}>€{displayPrice}</span>
                                    <small style={{ opacity: 0.5, color: '#ffffff', fontSize: '0.8rem' }}>/mese</small>
                                </div>
                                {isMastro && (
                                    <div style={{ color: '#d4af37', fontSize: '0.65rem', fontWeight: '700', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Star size={10} fill="currentColor" /> EXCLUSIVE PRICE
                                    </div>
                                )}
                            </div>

                            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2.5rem', flexGrow: 1 }}>
                                {p.features.map(f => (
                                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.8rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                                        <CheckCircle size={14} color="#d4af37" /> {f}
                                    </li>
                                ))}
                            </ul>

                            {isCurrentPlan && !isExpired ? (
                                <div style={{
                                    background: 'rgba(212, 175, 55, 0.1)',
                                    color: '#d4af37',
                                    padding: '0.8rem',
                                    borderRadius: '12px',
                                    fontWeight: '900',
                                    textAlign: 'center',
                                    border: '1px solid rgba(212, 175, 55, 0.3)',
                                    fontSize: '0.8rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}>
                                    <CheckCircle size={16} />
                                    Attivo
                                </div>
                            ) : (
                                <button
                                    onClick={() => handlePayment(p.id)}
                                    style={{
                                        background: p.highlight ? 'linear-gradient(135deg, #d4af37, #aa8c2c)' : 'transparent',
                                        color: p.highlight ? '#000' : '#d4af37',
                                        border: p.highlight ? 'none' : '1px solid rgba(212, 175, 55, 0.4)',
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        fontWeight: '800',
                                        cursor: 'pointer',
                                        width: '100%',
                                        transition: 'all 0.3s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        fontSize: '0.85rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        if (!p.highlight) e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        if (!p.highlight) e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    Scegli
                                    <ArrowRight size={16} />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Support Message */}
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', marginTop: 'auto', paddingBottom: '3rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                    <ShieldCheck size={14} color="#d4af37" />
                    <span style={{ fontWeight: '600', color: 'rgba(255,255,255,0.5)' }}>SISTEMA DI PAGAMENTO SICURO</span>
                </div>
                Transazioni protette da Stripe. Fatturazione automatica mensile con possibilità di disdetta in ogni momento.
            </div>
        </div>
    );
}
