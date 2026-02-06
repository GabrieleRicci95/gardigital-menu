import React from 'react';
import SkeletonItem from '@/components/menu/SkeletonItem';

export default function Loading() {
    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ textAlign: 'center', marginBottom: '40px', marginTop: '40px' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: '#f1f1f1',
                    margin: '0 auto 20px',
                    animation: 'pulse 1.5s infinite'
                }} />
                <div style={{
                    height: '32px',
                    width: '200px',
                    background: '#f1f1f1',
                    borderRadius: '4px',
                    margin: '0 auto',
                    animation: 'pulse 1.5s infinite'
                }} />
            </header>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', overflow: 'hidden' }}>
                {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                        height: '36px',
                        width: '100px',
                        background: '#f1f1f1',
                        borderRadius: '20px',
                        flexShrink: 0,
                        animation: 'pulse 1.5s infinite'
                    }} />
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {[1, 2, 3, 4, 5].map(i => (
                    <SkeletonItem key={i} />
                ))}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}} />
        </div>
    );
}
