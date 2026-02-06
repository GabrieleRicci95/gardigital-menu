'use client';

import React, { useState, useEffect } from 'react';

const IOSPrompt = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Check if it's iOS and not already in standalone mode
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        const isStandalone = (window.navigator as any).standalone;

        // Check if the user has already dismissed it in this session
        const isDismissed = sessionStorage.getItem('ios-prompt-dismissed');

        if (isIOS && !isStandalone && !isDismissed) {
            // Delay to not annoy the user immediately
            const timer = setTimeout(() => setShow(true), 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    if (!show) return null;

    const handleDismiss = () => {
        setShow(false);
        sessionStorage.setItem('ios-prompt-dismissed', 'true');
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '90px',
            left: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            padding: '20px',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            zIndex: 2000,
            border: '1px solid rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            animation: 'slideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>Installazione App</h3>
                <button onClick={handleDismiss} style={{ background: 'none', border: 'none', padding: '5px', cursor: 'pointer', color: '#999' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>

            <p style={{ margin: 0, fontSize: '0.9rem', color: '#444', lineHeight: '1.4' }}>
                Installa questo menu sulla tua Home Screen per un'esperienza a schermo intero e un accesso più rapido.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8f9fa', padding: '12px', borderRadius: '12px', fontSize: '0.85rem' }}>
                <span style={{ fontSize: '1.2rem' }}>1.</span>
                <span>Tocca il pulsante Condividi <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" style={{ verticalAlign: 'middle' }}><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg></span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8f9fa', padding: '12px', borderRadius: '12px', fontSize: '0.85rem' }}>
                <span style={{ fontSize: '1.2rem' }}>2.</span>
                <span>Seleziona <strong>"Aggiungi alla schermata Home"</strong></span>
            </div>
        </div>
    );
};

export default IOSPrompt;
