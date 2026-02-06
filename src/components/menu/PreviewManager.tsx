'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export function PreviewManager() {
    return (
        <Suspense fallback={null}>
            <PreviewContent />
        </Suspense>
    );
}

function PreviewContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [shouldShow, setShouldShow] = useState(false);

    useEffect(() => {
        const urlPreview = searchParams.get('preview') === 'true';
        const sessionPreview = sessionStorage.getItem('gardigital_preview') === 'true';

        if (urlPreview) {
            sessionStorage.setItem('gardigital_preview', 'true');
            setShouldShow(true);
        } else if (sessionPreview) {
            setShouldShow(true);
        }
    }, [searchParams]);

    if (!shouldShow) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '95px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            width: 'auto',
            pointerEvents: 'auto'
        }}>
            <button
                onClick={() => {
                    // Logic to clear preview if we actually exit? 
                    // No, let's keep it until they log out or close.
                    router.push('/dashboard/restaurant');
                }}
                style={{
                    background: '#1a237e',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    boxShadow: '0 10px 25px rgba(26, 35, 126, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap'
                }}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span>Torna alla Dashboard</span>
            </button>
        </div>
    );
}
