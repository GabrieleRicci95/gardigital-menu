"use client";

import React from 'react';
import { Lock, CreditCard, ExternalLink, ShieldAlert, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface ExpiredSubscriptionPaywallProps {
    isAppMode: boolean;
    onManageClick?: () => void;
}

export default function ExpiredSubscriptionPaywall({ isAppMode, onManageClick }: ExpiredSubscriptionPaywallProps) {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(5, 5, 5, 0.9)',
            backdropFilter: 'blur(15px)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            textAlign: 'center',
            color: 'white',
            fontFamily: 'Inter, sans-serif'
        }}>
            <div style={{
                background: '#0f0f0f',
                padding: '60px 40px',
                borderRadius: '32px',
                maxWidth: '500px',
                width: '100%',
                boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '24px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px',
                    color: '#ef4444'
                }}>
                    <Lock size={40} />
                </div>

                <h2 style={{ 
                    fontSize: '2rem', 
                    fontWeight: '900', 
                    marginBottom: '16px', 
                    fontFamily: 'Playfair Display, serif' 
                }}>
                    Attiva SoloMenu
                </h2>
                
                <p style={{ 
                    fontSize: '1.1rem', 
                    color: 'rgba(255,255,255,0.7)', 
                    lineHeight: '1.6', 
                    marginBottom: '32px' 
                }}>
                    {isAppMode 
                        ? "L'abbonamento aziendale per questo ristorante è scaduto o non è attivo. L'accesso alle funzionalità di gestione è riservato agli utenti con una licenza valida fornita da SoloMenu."
                        : "Registra ora un metodo di pagamento per sbloccare la dashboard e attivare i tuoi 7 GIORNI DI PROVA GRATUITA. Nessun addebito verrà effettuato prima della fine della prova."
                    }
                </p>

                {isAppMode ? (
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    }}>
                        <div style={{
                            background: 'rgba(212, 175, 55, 0.05)',
                            padding: '20px',
                            borderRadius: '16px',
                            border: '1px dashed rgba(212, 175, 55, 0.3)',
                            width: '100%',
                            color: '#d4af37',
                            fontWeight: '500'
                        }}>
                            Servizio Aziendale Sospeso
                        </div>
                        
                        <button 
                            onClick={() => alert("Nessun acquisto In-App trovato per questo Apple ID. Se hai un abbonamento attivo gestito dalla tua azienda, contatta il supporto tecnico.")}
                            style={{
                                background: 'transparent',
                                color: 'rgba(255,255,255,0.6)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                padding: '12px',
                                borderRadius: '12px',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            <RefreshCw size={14} /> Ripristina Acquisti
                        </button>
                    </div>
                ) : (
                    <Link 
                        href="/dashboard/subscription"
                        style={{
                            background: 'linear-gradient(135deg, #d4af37, #aa8c2c)',
                            color: '#000',
                            padding: '16px 32px',
                            borderRadius: '14px',
                            fontWeight: '800',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontSize: '1rem',
                            transition: 'transform 0.2s'
                        }}
                    >
                        <CreditCard size={18} />
                        GESTISCI ABBONAMENTO
                    </Link>
                )}
                
                {!isAppMode && (
                    <p style={{ marginTop: '24px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
                        Il tuo menu pubblico è stato disattivato automaticamente.
                    </p>
                )}
            </div>
        </div>
    );
}
