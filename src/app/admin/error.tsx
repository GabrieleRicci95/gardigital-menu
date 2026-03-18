'use client';

import { useEffect } from 'react';

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Admin Error:', error);
    }, [error]);

    return (
        <div style={{ padding: '60px', textAlign: 'center', backgroundColor: 'var(--color-background)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h2 style={{ color: '#ef4444', fontFamily: 'var(--font-family-serif)', fontSize: '2.5rem', marginBottom: '1rem' }}>Spiacenti, si è verificato un errore</h2>
            <p style={{ margin: '20px 0', color: 'rgba(255, 255, 255, 0.6)', maxWidth: '500px', lineHeight: '1.6' }}>{error.message || 'Si è verificato un problema imprevisto nel pannello amministrativo.'}</p>
            {error.digest && <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.3)', marginBottom: '2rem' }}>Codice Errore: {error.digest}</p>}
            <button
                onClick={() => reset()}
                style={{
                    padding: '12px 32px',
                    background: 'var(--color-primary)',
                    color: '#000',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}
            >
                Riprova
            </button>
        </div>
    );
}
