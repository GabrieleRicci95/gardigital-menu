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
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <h2 style={{ color: '#c62828' }}>Si è verificato un errore nel pannello admin</h2>
            <p style={{ margin: '20px 0', color: '#666' }}>{error.message || 'Errore imprevisto'}</p>
            {error.digest && <p style={{ fontSize: '0.8rem', color: '#999' }}>ID Errore: {error.digest}</p>}
            <button
                onClick={() => reset()}
                style={{
                    padding: '10px 20px',
                    background: '#1a237e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                }}
            >
                Riprova
            </button>
        </div>
    );
}
