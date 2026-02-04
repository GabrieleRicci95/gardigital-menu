import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getRestaurantAndMenus(slug: string) {
    const restaurant = await prisma.restaurant.findUnique({
        where: { slug },
        include: {
            fixedMenus: {
                where: { isActive: true },
                orderBy: { createdAt: 'desc' },
                include: {
                    sections: {
                        orderBy: { sortOrder: 'asc' },
                        include: {
                            items: true
                        }
                    }
                }
            }
        }
    });
    return restaurant;
}

const allergensData = [
    { id: 1, name: 'Glutine', icon: '🌾' },
    { id: 2, name: 'Crostacei', icon: '🦞' },
    { id: 3, name: 'Uova', icon: '🥚' },
    { id: 4, name: 'Pesce', icon: '🐟' },
    { id: 5, name: 'Arachidi', icon: '🥜' },
    { id: 6, name: 'Soia', icon: '🫘' },
    { id: 7, name: 'Latte', icon: '🥛' },
    { id: 8, name: 'Frutta a Guscio', icon: '🌰' },
    { id: 9, name: 'Sedano', icon: '🥬' },
    { id: 10, name: 'Senape', icon: '🧴' },
    { id: 11, name: 'Sesamo', icon: '🌱' },
    { id: 12, name: 'Lupini', icon: '🧆' },
    { id: 13, name: 'Molluschi', icon: '🐚' },
    { id: 14, name: 'Anidride Solforosa', icon: '🧪' },
];

export default async function FixedMenusPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const restaurant = await getRestaurantAndMenus(slug);
    console.log('Fetched Restaurant Data:', JSON.stringify(restaurant, null, 2));

    if (!restaurant) notFound();

    const primaryColor = restaurant.themeColor || '#001f2f';
    const accentColor = '#e2b13c';

    // Using the same "Pub" background as requested for events
    const coverImage = 'https://images.unsplash.com/photo-1575444758702-4a6b9222336e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';

    return (
        <div style={{
            fontFamily: restaurant.fontFamily === 'playfair' ? '"Playfair Display", serif' : 'var(--font-inter, sans-serif)',
            minHeight: '100vh',
            background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('${coverImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            color: 'white'
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
                    Menu Fissi
                </h1>
            </header>

            {/* Menus Container */}
            <div style={{ padding: '0 1rem 4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>

                {restaurant.fixedMenus.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.9)', borderRadius: '12px', color: '#333' }}>
                        <p>Al momento non ci sono menu fissi disponibili.</p>
                    </div>
                ) : (
                    restaurant.fixedMenus.map(menu => (
                        <div key={menu.id} style={{
                            background: 'white',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                            marginBottom: '2rem',
                            color: '#333',
                            border: `2px solid ${accentColor}`
                        }}>
                            <div style={{ background: primaryColor, padding: '1rem', textAlign: 'center' }}>
                                <h2 style={{ margin: 0, color: 'white', fontSize: '1.5rem' }}>{menu.name}</h2>
                                {menu.subtitle && (
                                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginTop: '4px', fontStyle: 'italic' }}>
                                        {menu.subtitle}
                                    </div>
                                )}
                            </div>

                            <div style={{ padding: '2rem' }}>

                                {menu.description && (
                                    <div style={{
                                        textAlign: 'center',
                                        whiteSpace: 'pre-wrap',
                                        lineHeight: '1.6',
                                        fontSize: '1.1rem',
                                        color: '#333',
                                        marginBottom: '2rem'
                                    }}>
                                        {menu.description}
                                    </div>
                                )}

                                <div style={{
                                    borderTop: `1px solid ${accentColor}`,
                                    paddingTop: '1rem',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '10px' }}>
                                        <span style={{ fontWeight: 'bold', color: primaryColor, fontSize: '1.1rem' }}>Prezzo a persona</span>
                                        <span style={{ fontSize: '2rem', fontWeight: 'bold', color: primaryColor }}>{Number(menu.price).toFixed(2)}€</span>
                                    </div>
                                    {!['apericena cotto e crudo', 'aperifish crudo', 'aperifish cotto'].map(s => s.toLowerCase()).some(s => menu.name.toLowerCase().includes(s)) && (
                                        <div style={{ fontSize: '0.8rem', color: '#777', fontStyle: 'italic', marginTop: '5px' }}>
                                            Bevande escluse
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {/* Allergen Legend */}
                <div style={{ marginTop: '3rem', background: 'rgba(255,255,255,0.9)', padding: '1.5rem', borderRadius: '12px', color: '#333' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: primaryColor }}>Legenda Allergeni</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                        {allergensData.map(a => (
                            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                                <span style={{ fontSize: '1.1rem' }}>{a.icon}</span>
                                <strong>{a.id}.</strong> {a.name}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
