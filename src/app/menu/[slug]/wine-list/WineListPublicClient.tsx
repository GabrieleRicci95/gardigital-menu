'use client';

import Link from 'next/link';
import { useState } from 'react';

interface WineItem {
    id: string;
    name: string;
    description: string | null;
    price: number;
}

interface WineSection {
    id: string;
    name: string;
    items: WineItem[];
}

interface WineList {
    id: string;
    isActive: boolean;
    sections: WineSection[];
}

interface Restaurant {
    name: string;
    slug: string;
    themeColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
    logoUrl: string | null;
}

export default function WineListPublicClient({ restaurant, wineList }: { restaurant: Restaurant, wineList: WineList | null }) {

    // Premium Wine List Design (Gold/Premium Theme override or mix)
    const goldAccent = '#d4af37';

    const containerStyle = {
        backgroundColor: restaurant.backgroundColor,
        color: restaurant.textColor,
        fontFamily: restaurant.fontFamily === 'inter' ? 'var(--font-inter)' :
            restaurant.fontFamily === 'playfair' ? '"Playfair Display", serif' :
                restaurant.fontFamily === 'roboto' ? '"Roboto", sans-serif' :
                    restaurant.fontFamily === 'lato' ? '"Lato", sans-serif' :
                        '"Montserrat", sans-serif',
        minHeight: '100vh',
    } as React.CSSProperties;

    // ... (scrollToSection remains same)

    return (
        <div style={containerStyle}>
            {/* ... (styles and nav remain same) ... */}
            <style jsx global>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
            `}</style>

            {/* ... (nav code, kept as is, just context) ... */}
            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                backgroundColor: `${restaurant.backgroundColor}E6`, // 90% opacity hex
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                padding: '0.8rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Link href={`/menu/${restaurant.slug}`} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: restaurant.themeColor,
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    padding: '8px 12px',
                    borderRadius: '50px',
                    backgroundColor: `${restaurant.themeColor}10`
                }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    Torna al Menu
                </Link>
            </nav>

            {/* Hero Header */}
            <header style={{
                padding: '10rem 1.5rem 8rem 1.5rem',
                textAlign: 'center',
                background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop') center/cover no-repeat`,
                color: 'white',
                marginBottom: '3rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>

                <h1 style={{
                    fontSize: '3rem',
                    margin: '0 0 0.5rem 0',
                    color: 'white',
                    lineHeight: 1.1,
                    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                    fontFamily: '"Playfair Display", serif'
                }} className="animate-fade-in">
                    {restaurant.name}
                </h1>
            </header>

            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem 1.5rem 4rem 1.5rem' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    marginBottom: '3rem',
                    marginTop: '1rem'
                }}>
                    <span style={{ flex: 1, height: '1px', background: `${goldAccent}40` }}></span>
                    <h2 style={{
                        margin: 0,
                        fontSize: '2rem',
                        color: restaurant.textColor,
                        fontFamily: '"Playfair Display", serif',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        fontWeight: 400
                    }}>
                        Vini/Bollicine
                    </h2>
                    <span style={{ flex: 1, height: '1px', background: `${goldAccent}40` }}></span>
                </div>

                {!wineList || !wineList.isActive || wineList.sections.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 1rem', opacity: 0.6 }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍷</div>
                        <p style={{ fontSize: '1.1rem' }}>La carta dei vini è in fase di aggiornamento.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                        {wineList.sections.map((section, idx) => (
                            <section key={section.id} id={section.id} style={{ scrollMarginTop: '120px' }} className="animate-fade-in">
                                {true && (
                                    <h2 style={{
                                        color: goldAccent, // Gold for headers
                                        fontSize: '1.75rem',
                                        marginBottom: '1.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px'
                                    }}>
                                        <span style={{ flex: 1, height: '1px', background: `${goldAccent}30` }}></span>
                                        <span>{section.name}</span>
                                        <span style={{ flex: 1, height: '1px', background: `${goldAccent}30` }}></span>
                                    </h2>
                                )}

                                <div style={{ display: 'grid', gap: '1.5rem' }}>
                                    {section.items.map(item => (
                                        <article key={item.id} style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            paddingBottom: '1.5rem',
                                            borderBottom: '1px dashed rgba(0,0,0,0.1)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
                                                <h3 style={{
                                                    margin: 0,
                                                    fontSize: '1.15rem',
                                                    fontWeight: 600,
                                                    color: restaurant.textColor
                                                }}>
                                                    {item.name}
                                                </h3>
                                                {Number(item.price) > 0 && (
                                                    <div style={{
                                                        fontWeight: 700,
                                                        fontSize: '1.1rem',
                                                        color: goldAccent,
                                                        whiteSpace: 'nowrap',
                                                        marginLeft: '1rem'
                                                    }}>
                                                        € {Number(item.price).toFixed(2)}
                                                    </div>
                                                )}
                                            </div>

                                            {item.description && (
                                                <p style={{
                                                    margin: 0,
                                                    fontSize: '0.95rem',
                                                    lineHeight: 1.5,
                                                    opacity: 0.75,
                                                    fontStyle: restaurant.fontFamily === 'playfair' ? 'italic' : 'normal'
                                                }}>
                                                    {item.description}
                                                </p>
                                            )}
                                        </article>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </main>

            <footer style={{
                textAlign: 'center',
                padding: '3rem 1rem 8rem 1rem',
                borderTop: '1px solid rgba(0,0,0,0.05)',
                marginTop: '2rem'
            }}>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.5, letterSpacing: '2px', textTransform: 'uppercase' }}>
                    {restaurant.name}
                </p>
                <div style={{
                    marginTop: '1.5rem',
                    fontSize: '0.75rem',
                    opacity: 0.4
                }}>
                    Powered by <strong>Gardigital.it</strong>
                </div>
            </footer>

            {/* Scroll to Top Button (visible on scroll could be added, but keeping it clean for now) */}
        </div>
    );
}
