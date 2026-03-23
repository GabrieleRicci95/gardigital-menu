"use client";

import React from 'react';
import { Lock, CreditCard, ExternalLink, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface ExpiredSubscriptionPaywallProps {
    isAppMode: boolean;
    onManageClick?: () => void;
}

export default function ExpiredSubscriptionPaywall({ isAppMode, onManageClick }: ExpiredSubscriptionPaywallProps) {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(5, 5, 5, 0.95)',
            backdropFilter: 'blur(10px)',
            zIndex: 2000,
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
                    Servizio Sospeso
                </h2>
                
                <p style={{ 
                    fontSize: '1.1rem', 
                    color: 'rgba(255,255,255,0.7)', 
                    lineHeight: '1.6', 
                    marginBottom: '32px' 
                }}>
                    {isAppMode 
                        ? "Il tuo abbonamento è scaduto. Per continuare a gestire il tuo menu e riattivare il servizio, accedi al portale web da computer o browser mobile."
                        : "Il tuo abbonamento è scaduto. Rinnova ora per sbloccare le funzionalità della dashboard e riattivare il tuo menu pubblico."
                    }
                </p>

                {isAppMode ? (
                    <div style={{
                        background: 'rgba(212, 175, 55, 0.05)',
                        padding: '20px',
                        borderRadius: '16px',
                        border: '1px dashed rgba(212, 175, 55, 0.3)',
                        width: '100%'
                    }}>
                        <p style={{ fontWeight: '700', color: '#d4af37', marginBottom: '8px', fontSize: '0.9rem' }}>Accedi su:</p>
                        <code style={{ fontSize: '1.1rem', color: '#ffffff', fontWeight: '900' }}>master.gardigital.it</code>
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
