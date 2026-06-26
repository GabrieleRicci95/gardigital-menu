import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getRestaurantAndMenus(inputSlug: string) {
    const slug = inputSlug.endsWith('-solo') ? inputSlug.replace(/-solo$/, '') : inputSlug;
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

    if (restaurant && restaurant.fixedMenus) {
        restaurant.fixedMenus.sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            const priceA = Number(a.price);
            const priceB = Number(b.price);

            // Priority 1: Aperigusto with price 22
            const isA22_A = nameA.includes('aperigusto') && Math.abs(priceA - 22) < 0.1;
            const isA22_B = nameB.includes('aperigusto') && Math.abs(priceB - 22) < 0.1;
            if (isA22_A && !isA22_B) return -1;
            if (!isA22_A && isA22_B) return 1;

            // Priority 2: Aperigusto with price 29
            const isA29_A = nameA.includes('aperigusto') && Math.abs(priceA - 29) < 0.1;
            const isA29_B = nameB.includes('aperigusto') && Math.abs(priceB - 29) < 0.1;
            if (isA29_A && !isA29_B) return -1;
            if (!isA29_A && isA29_B) return 1;

            return 0;
        });
    }

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
                        I Nostri Percorsi
                    </h1>
                    <p style={{ marginTop: '1rem', color: '#94a3b8', fontSize: '1.1rem', fontStyle: 'italic', maxWidth: '600px', margin: '1rem auto 0 auto' }}>
                        Lasciati guidare in un'esperienza culinaria unica, pensata per esaltare i sapori del mare.
                    </p>
                </header>

                {/* Menus Container */}
                <div style={{ padding: '0 1.5rem 4rem 1.5rem', maxWidth: '850px', margin: '0 auto', position: 'relative', zIndex: 10 }}>

                    {restaurant.fixedMenus.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#cbd5e1' }}>
                            <p>I percorsi degustazione sono in fase di aggiornamento.</p>
                        </div>
                    ) : (
                        restaurant.fixedMenus.map((menu) => (
                            <div key={menu.id} style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                                marginBottom: '3rem',
                                color: '#f8fafc',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            }}>
                                {/* Card Header */}
                                <div style={{ 
                                    padding: '2rem 1.5rem 1.5rem 1.5rem', 
                                    textAlign: 'center',
                                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <h2 style={{ 
                                        margin: 0, 
                                        color: '#fff', 
                                        fontSize: '2rem', 
                                        fontWeight: '700',
                                        letterSpacing: '1px'
                                    }}>
                                        {menu.name}
                                    </h2>
                                    {menu.subtitle && (
                                        <div style={{ color: accentColor, fontSize: '1.1rem', marginTop: '0.8rem', fontStyle: 'italic', fontWeight: '500' }}>
                                            ~ {menu.subtitle} ~
                                        </div>
                                    )}
                                </div>

                                {/* Card Body */}
                                <div style={{ padding: '2rem 1.5rem' }}>

                                    {menu.description && (
                                        <div style={{
                                            textAlign: 'center',
                                            whiteSpace: 'pre-wrap',
                                            lineHeight: '1.8',
                                            fontSize: '1.15rem',
                                            color: '#cbd5e1',
                                            marginBottom: '2.5rem',
                                            padding: '0 1rem'
                                        }}>
                                            {menu.description}
                                        </div>
                                    )}

                                    {menu.sections && menu.sections.length > 0 && (
                                        <div style={{ marginBottom: '2rem' }}>
                                            {menu.sections.map(section => (
                                                <div key={section.id} style={{ marginBottom: '2rem', textAlign: 'center' }}>
                                                    {section.name && section.name !== 'Cosa include' && section.name !== 'Il Nostro Menu' && (
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                                            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(226,177,60,0.3))' }}></div>
                                                            <h3 style={{ color: accentColor, fontSize: '1.3rem', margin: 0, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '2px' }}>
                                                                {section.name}
                                                            </h3>
                                                            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(226,177,60,0.3))' }}></div>
                                                        </div>
                                                    )}
                                                    {section.description && (
                                                        <p style={{ fontStyle: 'italic', color: '#94a3b8', marginBottom: '1.5rem', fontSize: '1rem' }}>
                                                            {section.description}
                                                        </p>
                                                    )}
                                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                        {section.items && section.items.map(item => (
                                                            <li key={item.id} style={{ marginBottom: '1.5rem' }}>
                                                                <div style={{ fontWeight: '600', fontSize: '1.2rem', color: '#fff', letterSpacing: '0.5px' }}>
                                                                    {item.name}
                                                                </div>
                                                                {item.description && (
                                                                    <div style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '6px', lineHeight: '1.5' }}>
                                                                        {item.description}
                                                                    </div>
                                                                )}
                                                                {item.allergens && item.allergens !== '[]' && (
                                                                    <div style={{ marginTop: '8px', fontSize: '0.9rem', display: 'flex', justifyContent: 'center', gap: '5px' }}>
                                                                        {(() => {
                                                                            try {
                                                                                const allergenIds = JSON.parse(item.allergens as string);
                                                                                return allergensData
                                                                                    .filter(a => allergenIds.includes(a.id))
                                                                                    .map(a => <span key={a.id} title={a.name} style={{ opacity: 0.8 }}>{a.icon}</span>);
                                                                            } catch (e) { return null; }
                                                                        })()}
                                                                    </div>
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Price Tag */}
                                    <div style={{
                                        marginTop: '3rem',
                                        padding: '1.5rem',
                                        background: 'rgba(0,0,0,0.2)',
                                        borderRadius: '16px',
                                        textAlign: 'center',
                                        border: '1px solid rgba(255,255,255,0.03)'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '5px' }}>
                                            <span style={{ fontWeight: '500', color: '#cbd5e1', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Prezzo a persona</span>
                                            <span style={{ fontSize: '2.8rem', fontWeight: '800', color: accentColor, lineHeight: '1' }}>{Number(menu.price).toFixed(2)}€</span>
                                        </div>
                                        {!['apericena cotto e crudo', 'apericena cotto-crudo', 'aperifish crudo', 'aperifish cotto'].map(s => s.toLowerCase()).some(s => menu.name.toLowerCase().includes(s)) && (
                                            <div style={{ fontSize: '0.9rem', color: '#64748b', fontStyle: 'italic', marginTop: '10px' }}>
                                                Bevande escluse
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {/* Allergen Legend */}
                    <div style={{ 
                        marginTop: '4rem', 
                        background: 'rgba(0,0,0,0.3)', 
                        border: '1px solid rgba(255,255,255,0.05)',
                        padding: '2rem', 
                        borderRadius: '20px', 
                        color: '#94a3b8' 
                    }}>
                        <h4 style={{ margin: '0 0 1.5rem 0', color: '#fff', fontSize: '1.2rem', textAlign: 'center', fontWeight: '600' }}>
                            Legenda Allergeni
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px' }}>
                            {allergensData.map(a => (
                                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                                    <span style={{ fontSize: '1.2rem', opacity: 0.8 }}>{a.icon}</span>
                                    <span><strong>{a.id}.</strong> {a.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        );
    }

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

                                {menu.sections && menu.sections.length > 0 && (
                                    <div style={{ marginBottom: '2rem' }}>
                                        {menu.sections.map(section => (
                                            <div key={section.id} style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                                                {section.name && section.name !== 'Cosa include' && section.name !== 'Il Nostro Menu' && (
                                                    <h3 style={{ color: primaryColor, fontSize: '1.3rem', marginBottom: '0.5rem', borderBottom: `1px solid ${accentColor}`, paddingBottom: '0.3rem', display: 'inline-block' }}>
                                                        {section.name}
                                                    </h3>
                                                )}
                                                {section.description && (
                                                    <p style={{ fontStyle: 'italic', color: '#666', marginBottom: '1rem', fontSize: '0.95rem' }}>
                                                        {section.description}
                                                    </p>
                                                )}
                                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                    {section.items && section.items.map(item => (
                                                        <li key={item.id} style={{ marginBottom: '1rem' }}>
                                                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#111' }}>{item.name}</div>
                                                            {item.description && (
                                                                <div style={{ color: '#555', fontSize: '1rem', marginTop: '4px' }}>{item.description}</div>
                                                            )}
                                                            {item.allergens && item.allergens !== '[]' && (
                                                                <div style={{ marginTop: '6px', fontSize: '0.9rem' }}>
                                                                    {(() => {
                                                                        try {
                                                                            const allergenIds = JSON.parse(item.allergens as string);
                                                                            return allergensData
                                                                                .filter(a => allergenIds.includes(a.id))
                                                                                .map(a => <span key={a.id} title={a.name} style={{ marginRight: '4px' }}>{a.icon}</span>);
                                                                        } catch (e) { return null; }
                                                                    })()}
                                                                </div>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
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
                                    {!['apericena cotto e crudo', 'apericena cotto-crudo', 'aperifish crudo', 'aperifish cotto'].map(s => s.toLowerCase()).some(s => menu.name.toLowerCase().includes(s)) && (
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
