import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getRestaurant(inputSlug: string) {
    const slug = inputSlug.endsWith('-solo') ? inputSlug.replace(/-solo$/, '') : inputSlug;
    return await prisma.restaurant.findUnique({
        where: { slug },
        select: {
            name: true,
            themeColor: true,
            backgroundColor: true,
            textColor: true,
            fontFamily: true,
            logoUrl: true,
            coverImageUrl: true
        }
    });
}

export default async function EventsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const restaurant = await getRestaurant(slug);

    if (!restaurant) notFound();

    // Default to Aperifish palette if generic, but respect DB too
    const primaryColor = restaurant.themeColor || '#001f2f';
    const accentColor = '#e2b13c'; // Gold-ish for premium feel
    const bgColor = restaurant.backgroundColor || '#f8f9fa';
    const textColor = restaurant.textColor || '#000';
    const coverImage = 'https://images.unsplash.com/photo-1575444758702-4a6b9222336e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';

    const isAperifish = slug.toLowerCase().includes('aperifish');

    if (isAperifish) {
        return (
            <div style={{
                fontFamily: restaurant.fontFamily === 'playfair' ? '"Playfair Display", serif' : 'var(--font-inter, sans-serif)',
                minHeight: '100vh',
                background: `linear-gradient(135deg, #0a0f18 0%, #001f2f 100%)`,
                color: '#f8fafc',
                position: 'relative',
                overflowX: 'hidden'
            }}>
                {/* Decorative background elements */}
                <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(226,177,60,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
                <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: '30vw', height: '30vw', background: 'radial-gradient(circle, rgba(0,191,255,0.05) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>

                {/* Fixed Back Button */}
                <Link
                    href={`/menu/${slug}`}
                    style={{
                        position: 'fixed',
                        top: '20px',
                        left: '20px',
                        zIndex: 100,
                        padding: '10px 20px',
                        background: 'rgba(0, 31, 47, 0.7)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        color: accentColor,
                        borderRadius: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        textDecoration: 'none',
                        border: `1px solid rgba(226, 177, 60, 0.3)`,
                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <span style={{ fontSize: '1.2rem' }}>←</span> Indietro
                </Link>

                {/* Header */}
                <header style={{
                    padding: '5rem 1.5rem 3rem 1.5rem',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 10
                }}>
                    <h1 style={{ 
                        margin: 0, 
                        fontSize: '3rem', 
                        letterSpacing: '4px', 
                        textTransform: 'uppercase', 
                        color: accentColor,
                        fontWeight: '800',
                        textShadow: '0 0 20px rgba(226,177,60,0.2)'
                    }}>
                        Eventi &<br />Promozioni
                    </h1>
                </header>

                {/* Events Container */}
                <div style={{ padding: '0 1.5rem 4rem 1.5rem', maxWidth: '850px', margin: '0 auto', position: 'relative', zIndex: 10 }}>

                    {/* Pacchero Day Card - Featured */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                        marginBottom: '3rem',
                        color: '#f8fafc',
                        position: 'relative'
                    }}>
                        <div style={{
                            background: accentColor,
                            color: '#001f2f',
                            padding: '0.6rem 1.2rem',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            display: 'inline-block',
                            borderBottomRightRadius: '16px'
                        }}>
                            Ogni Mercoledì
                        </div>

                        <div style={{ padding: '1.5rem 1.5rem 2rem 1.5rem', textAlign: 'center' }}>
                            <h2 style={{ color: '#fff', fontSize: '2.2rem', marginBottom: '0.5rem', fontWeight: '700', letterSpacing: '1px' }}>Pacchero Day</h2>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ height: '1px', width: '50px', background: 'linear-gradient(to right, transparent, rgba(226,177,60,0.5))' }}></div>
                                <div style={{ height: '1px', width: '50px', background: 'linear-gradient(to left, transparent, rgba(226,177,60,0.5))' }}></div>
                            </div>

                            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px' }}>
                                    <div>
                                        <strong style={{ display: 'block', color: '#fff', fontSize: '1.1rem' }}>Pacchero Pistacchio e Mazzancolle</strong>
                                        <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Cremoso e raffinato</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center', fontWeight: 'bold', color: accentColor, fontSize: '0.9rem', letterSpacing: '2px' }}>- OPPURE -</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px' }}>
                                    <div>
                                        <strong style={{ display: 'block', color: '#fff', fontSize: '1.1rem' }}>Pacchero allo Scoglio</strong>
                                        <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Sapore di mare verace</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{
                                background: 'rgba(0,0,0,0.3)',
                                padding: '1.5rem',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                border: '1px solid rgba(255,255,255,0.03)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontWeight: '500', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>Calice incluso</span>
                                </div>
                                <div style={{ fontSize: '2.2rem', fontWeight: '800', color: accentColor, lineHeight: '1' }}>
                                    15€
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Grid for other events */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>

                        {/* Karaoke Card */}
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.02)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '24px',
                            padding: '1.5rem',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            borderTop: `2px solid #e91e63` // Pink accent
                        }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <h3 style={{ margin: 0, color: '#fff', fontSize: '1.4rem', fontWeight: '600' }}>Karaoke Night</h3>
                                </div>
                                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                                    Canta le tue canzoni preferite in compagnia! Divertimento assicurato.
                                </p>
                            </div>
                            <div style={{
                                background: 'rgba(233, 30, 99, 0.15)',
                                color: '#f48fb1',
                                padding: '0.5rem 1rem',
                                borderRadius: '50px',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                alignSelf: 'start',
                                border: '1px solid rgba(233, 30, 99, 0.3)'
                            }}>
                                Ogni Giovedì
                            </div>
                        </div>

                        {/* DJ Set Card */}
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.02)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '24px',
                            padding: '1.5rem',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            borderTop: `2px solid #7c4dff` // Purple accent
                        }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <h3 style={{ margin: 0, color: '#fff', fontSize: '1.4rem', fontWeight: '600' }}>DJ Set & Drink</h3>
                                </div>
                                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                                    Selezione musicale curata per il tuo aperitivo o cena della domenica.
                                </p>
                            </div>
                            <div style={{
                                background: 'rgba(124, 77, 255, 0.15)',
                                color: '#b388ff',
                                padding: '0.5rem 1rem',
                                borderRadius: '50px',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                alignSelf: 'start',
                                border: '1px solid rgba(124, 77, 255, 0.3)'
                            }}>
                                Ogni Domenica
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        );
    }

    return (
        <div style={{
            fontFamily: restaurant.fontFamily === 'playfair' ? '"Playfair Display", serif' : 'var(--font-inter, sans-serif)',
            minHeight: '100vh',
            background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('${coverImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            color: 'white' // Default text color white for contrast
        }}>
            {/* Fixed Back Button */}
            <Link
                href={`/menu/${slug}`}
                style={{
                    position: 'fixed',
                    top: '20px',
                    left: '20px',
                    zIndex: 100,
                    padding: '10px 20px',
                    background: primaryColor,
                    color: 'white',
                    borderRadius: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textDecoration: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    fontSize: '0.95rem',
                    fontWeight: 'bold',
                    border: '2px solid rgba(255,255,255,0.2)'
                }}
            >
                <span>←</span> Indietro
            </Link>

            {/* Header */}
            <header style={{
                padding: '4rem 1rem 2rem 1rem',
                textAlign: 'center',
                background: 'transparent',
                color: 'white',
                marginBottom: '1rem',
                position: 'relative'
            }}>
                <h1 style={{ margin: 0, fontSize: '2.5rem', letterSpacing: '2px', textTransform: 'uppercase', textShadow: '0 2px 10px rgba(0,0,0,0.5)', color: 'white' }}>
                    Eventi &<br />Promozioni
                </h1>
                <div style={{ width: '60px', height: '4px', background: accentColor, margin: '1rem auto 0 auto', borderRadius: '2px', boxShadow: '0 2px 5px rgba(0,0,0,0.3)' }}></div>
            </header>

            {/* Events Container */}
            <div style={{ padding: '0 1rem 4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>

                {/* Pacchero Day Card - Featured */}
                <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    marginBottom: '2rem',
                    border: `1px solid rgba(0,0,0,0.05)`,
                    position: 'relative'
                }}>
                    <div style={{
                        background: accentColor,
                        color: 'white',
                        padding: '0.5rem 1rem',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        display: 'inline-block',
                        borderBottomRightRadius: '12px'
                    }}>
                        Ogni Mercoledì
                    </div>

                    <div style={{ padding: '1.5rem 1.5rem 2rem 1.5rem', textAlign: 'center' }}>
                        <h2 style={{ color: primaryColor, fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'serif' }}>Pacchero Day</h2>
                        <div style={{ width: '50px', height: '3px', background: accentColor, margin: '0 auto 1.5rem auto' }}></div>

                        <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textAlign: 'left' }}>
                                {/* Emoji removed */}
                                <div>
                                    <strong style={{ display: 'block', color: '#333' }}>Pacchero Pistacchio e Mazzancolle</strong>
                                    <span style={{ fontSize: '0.8rem', color: '#777' }}>Cremoso e raffinato</span>
                                </div>
                            </div>
                            <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#ccc', fontSize: '0.8rem', letterSpacing: '2px' }}>- OPPURE -</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textAlign: 'left' }}>
                                {/* Emoji removed */}
                                <div>
                                    <strong style={{ display: 'block', color: '#333' }}>Pacchero allo Scoglio</strong>
                                    <span style={{ fontSize: '0.8rem', color: '#777' }}>Sapore di mare verace</span>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            background: `rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.05)`,
                            padding: '1rem',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {/* Emoji removed */}
                                <span style={{ fontWeight: '600', color: primaryColor }}>Calice incluso</span>
                            </div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: primaryColor }}>
                                15€
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid for other events */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>

                    {/* Karaoke Card */}
                    <div style={{
                        background: 'white',
                        borderRadius: '20px',
                        padding: '1.5rem',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                        borderLeft: `5px solid #e91e63`, // Pink for karaoke
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                <h3 style={{ margin: 0, color: '#333', fontSize: '1.3rem' }}>Karaoke Night</h3>
                                {/* Emoji removed */}
                            </div>
                            <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                                Canta le tue canzoni preferite in compagnia! Divertimento assicurato.
                            </p>
                        </div>
                        <div style={{
                            background: '#fce4ec',
                            color: '#c2185b',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '50px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            alignSelf: 'start'
                        }}>
                            Ogni Giovedì
                        </div>
                    </div>

                    {/* DJ Set Card */}
                    <div style={{
                        background: 'white',
                        borderRadius: '20px',
                        padding: '1.5rem',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                        borderLeft: `5px solid #7c4dff`, // Purple for DJ
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                <h3 style={{ margin: 0, color: '#333', fontSize: '1.3rem' }}>DJ Set & Drink</h3>
                                {/* Emoji removed */}
                            </div>
                            <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                                Selezione musicale curata per il tuo aperitivo o cena della domenica.
                            </p>
                        </div>
                        <div style={{
                            background: '#ede7f6',
                            color: '#512da8',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '50px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            alignSelf: 'start'
                        }}>
                            Ogni Domenica
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
