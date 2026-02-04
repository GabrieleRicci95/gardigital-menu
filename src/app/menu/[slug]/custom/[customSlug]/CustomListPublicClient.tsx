'use client';

import Link from 'next/link';
import { useState } from 'react';

interface CustomItem {
    id: string;
    name: string;
    description: string | null;
    price: number | string;
    imageUrl?: string | null;
}

interface CustomSection {
    id: string;
    name: string;
    items: CustomItem[];
}

interface CustomList {
    id: string;
    name: string;
    isActive: boolean;
    sections: CustomSection[];
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

export default function CustomListPublicClient({ restaurant, customList }: { restaurant: Restaurant, customList: CustomList | null }) {

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

    return (
        <div style={containerStyle}>
            <style jsx global>{`
                html { scroll-behavior: smooth; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
            `}</style>

            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                backgroundColor: `${restaurant.backgroundColor}E6`,
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

            <header style={{
                padding: '8rem 1.5rem 6rem 1.5rem',
                textAlign: 'center',
                background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop') center/cover no-repeat`,
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
                    fontFamily: restaurant.fontFamily === 'playfair' ? '"Playfair Display", serif' : 'inherit'
                }} className="animate-fade-in">
                    {customList?.name || 'Lista'}
                </h1>
                <p style={{ opacity: 0.9, fontSize: '1.2rem', maxWidth: '600px', margin: '0.5rem auto 0' }}>{restaurant.name}</p>
            </header>

            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem 1.5rem 4rem 1.5rem' }}>
                {!customList || !customList.isActive || customList.sections.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 1rem', opacity: 0.6 }}>
                        <p style={{ fontSize: '1.1rem' }}>Contenuto in fase di aggiornamento.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        {customList.sections.map((section) => (
                            <section key={section.id} id={section.id} style={{ scrollMarginTop: '120px' }} className="animate-fade-in">
                                <h2 style={{
                                    color: restaurant.themeColor,
                                    fontSize: '1.75rem',
                                    marginBottom: '1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    fontWeight: 700
                                }}>
                                    <span>{section.name}</span>
                                    <span style={{ flex: 1, height: '1px', background: `${restaurant.themeColor}20` }}></span>
                                </h2>

                                <div style={{ display: 'grid', gap: '1.5rem' }}>
                                    {section.items.map(item => (
                                        <article key={item.id} style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            paddingBottom: '1.0rem',
                                            borderBottom: '1px solid rgba(0,0,0,0.05)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.3rem' }}>
                                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px' }}>
                                                    <h3 style={{
                                                        margin: 0,
                                                        fontSize: '1.25rem',
                                                        fontWeight: 600,
                                                        color: restaurant.textColor
                                                    }}>
                                                        {item.name}
                                                    </h3>
                                                    {item.imageUrl && (
                                                        <img
                                                            src={item.imageUrl}
                                                            alt={`${item.name} logo`}
                                                            style={{
                                                                height: '110px',
                                                                width: 'auto',
                                                                maxHeight: '110px',
                                                                maxWidth: '250px',
                                                                objectFit: 'contain'
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                                {Number(item.price) > 0 && (
                                                    <div style={{
                                                        fontWeight: 700,
                                                        fontSize: '1.1rem',
                                                        color: restaurant.themeColor,
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
                                                    opacity: 0.7,
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
                padding: '3rem 1rem 6rem 1rem',
                borderTop: '1px solid rgba(0,0,0,0.05)',
                marginTop: '2rem'
            }}>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.5 }}>
                    {restaurant.name}
                </p>
                <div style={{
                    marginTop: '1.5rem',
                    fontSize: '0.75rem',
                    opacity: 0.4
                }}>
                    Powered by <strong>Gardigital Menu</strong>
                </div>
            </footer>
        </div>
    );
}
