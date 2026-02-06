'use client';

import React from 'react';

const SkeletonItem = () => {
    return (
        <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '1.5rem',
            marginBottom: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            display: 'flex',
            gap: '15px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />

            <div style={{ flex: 1 }}>
                <div style={{
                    height: '24px',
                    width: '60%',
                    background: '#f1f1f1',
                    borderRadius: '4px',
                    marginBottom: '12px',
                    position: 'relative'
                }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)', animation: 'shimmer 1.5s infinite' }} />
                </div>
                <div style={{
                    height: '16px',
                    width: '90%',
                    background: '#f1f1f1',
                    borderRadius: '4px',
                    position: 'relative'
                }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)', animation: 'shimmer 1.5s infinite' }} />
                </div>
            </div>

            <div style={{
                width: '80px',
                height: '80px',
                background: '#f1f1f1',
                borderRadius: '12px',
                position: 'relative'
            }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)', animation: 'shimmer 1.5s infinite' }} />
            </div>
        </div>
    );
};

export default SkeletonItem;
