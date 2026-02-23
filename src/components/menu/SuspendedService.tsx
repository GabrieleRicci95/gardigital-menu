'use client';

import React from 'react';
import { AlertTriangle, Clock, Phone, Globe } from 'lucide-react';

export default function SuspendedService({ restaurantName, themeColor }: { restaurantName: string, themeColor: string }) {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backgroundColor: '#f8fafc',
            fontFamily: 'sans-serif',
            textAlign: 'center'
        }}>
            <div style={{
                maxWidth: '450px',
                width: '100%',
                backgroundColor: 'white',
                padding: '40px 30px',
                borderRadius: '24px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                border: '1px solid #e2e8f0'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#fff7ed',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    color: '#f97316'
                }}>
                    <Clock size={40} />
                </div>

                <h1 style={{
                    fontSize: '1.75rem',
                    color: '#1e293b',
                    marginBottom: '16px',
                    fontWeight: '800'
                }}>
                    Servizio Temporaneamente Sospeso
                </h1>

                <p style={{
                    color: '#64748b',
                    lineHeight: '1.6',
                    marginBottom: '32px',
                    fontSize: '1rem'
                }}>
                    Il menù digitale di <strong>{restaurantName}</strong> non è al momento disponibile per manutenzione ordinaria o scadenza del piano.
                </p>

                <div style={{
                    padding: '20px',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '16px',
                    marginBottom: '32px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#475569', marginBottom: '12px', justifyContent: 'center' }}>
                        <Phone size={18} />
                        <span style={{ fontSize: '0.9rem' }}>Rivolgiti al personale in sala</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#475569', justifyContent: 'center' }}>
                        <AlertTriangle size={18} />
                        <span style={{ fontSize: '0.9rem' }}>Il servizio tornerà presto attivo</span>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
                    <a
                        href="https://www.gardigital.it"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#94a3b8',
                            fontSize: '0.85rem',
                            textDecoration: 'none'
                        }}
                    >
                        <Globe size={14} />
                        Powered by Gardigital.it
                    </a>
                </div>
            </div>
        </div>
    );
}
