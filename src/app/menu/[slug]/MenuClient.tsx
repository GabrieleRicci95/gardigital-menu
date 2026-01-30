'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './menu-public.module.css';
import ReservationModal from '@/components/menu/ReservationModal';
import AllergenInfo from '@/components/menu/AllergenInfo';

interface MenuPageItem {
    id: string;
    name: string;
    description: string | null;
    price: number | null;
    imageUrl: string | null;
    isVegan: boolean;
    isGlutenFree: boolean;
    isVegetarian: boolean;
    spiciness: number;
    allergens: string | null;
    translations?: { language: string; name: string; description: string | null }[];
}

interface MenuPageCategory {
    id: string;
    name: string;
    items: MenuPageItem[];
    translations?: { language: string; name: string }[];
}

export interface MenuPageRestaurant {
    name: string;
    slug: string;
    description: string | null;
    logoUrl: string | null;
    coverImageUrl: string | null;
    themeColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
    cardStyle: string;
    whatsappNumber: string | null;
    wineListUrl: string | null;
    wineList?: { isActive: boolean } | null;
    champagneList?: { isActive: boolean } | null;
    drinkList?: { isActive: boolean } | null;
    subscription?: { plan: string } | null;
    categories: MenuPageCategory[];
}


const LANGUAGES = [
    { code: 'it', label: '🇮🇹' },
    { code: 'en', label: '🇬🇧' },
    { code: 'fr', label: '🇫🇷' },
    { code: 'de', label: '🇩🇪' },
];

export default function MenuClient({ restaurant: initialRestaurant }: { restaurant: MenuPageRestaurant }) {
    const [restaurant, setRestaurant] = useState(initialRestaurant);
    const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
    const [language, setLanguage] = useState<string>('it');
    const [isReservationOpen, setIsReservationOpen] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);

    // Get any active categories/items context if we need it for menu lookup
    const activeMenuId = (initialRestaurant as any).menus?.[0]?.id || (initialRestaurant as any).id;

    const toggleFilter = (filter: string) => {
        const newFilters = new Set(activeFilters);
        if (newFilters.has(filter)) {
            newFilters.delete(filter);
        } else {
            newFilters.add(filter);
        }
        setActiveFilters(newFilters);
    };

    const filterItem = (item: MenuPageItem) => {
        if (activeFilters.has('vegan') && !item.isVegan) return false;
        if (activeFilters.has('glutenFree') && !item.isGlutenFree) return false;
        if (activeFilters.has('vegetarian') && !item.isVegetarian) return false;
        return true;
    };

    const handleLanguageChange = async (newLang: string) => {
        if (newLang === 'it') {
            setLanguage('it');
            return;
        }

        const needsTranslation = restaurant.categories.some(cat =>
            !cat.translations?.find(t => t.language === newLang) ||
            cat.items.some(item => !item.translations?.find(t => t.language === newLang))
        );

        if (needsTranslation) {
            setIsTranslating(true);
            try {
                const res = await fetch('/api/menu/translate-public', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ menuId: activeMenuId, targetLanguage: newLang })
                });

                if (res.ok) {
                    // Re-fetch data or update local state? For simplicity, we re-fetch briefly or just hope the next refresh catches it.
                    // Better: re-fetch the restaurant data
                    const slugRes = await fetch(`/api/menu/public?slug=${restaurant.slug}`);
                    if (slugRes.ok) {
                        const newData = await slugRes.json();
                        setRestaurant(newData.restaurant);
                    }
                }
            } catch (error) {
                console.error('Translation failed', error);
            } finally {
                setIsTranslating(false);
            }
        }

        setLanguage(newLang);
    };

    // Helper to get translated texts
    const getCatName = (cat: MenuPageCategory) => {
        if (language === 'it') return cat.name;
        return cat.translations?.find(t => t.language === language)?.name || cat.name;
    };

    const getItemName = (item: MenuPageItem) => {
        if (language === 'it') return item.name;
        return item.translations?.find(t => t.language === language)?.name || item.name;
    };

    const getItemDesc = (item: MenuPageItem) => {
        if (language === 'it') return item.description;
        return item.translations?.find(t => t.language === language)?.description || item.description;
    };


    // Dynamic Styles
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

    const getCardClass = () => {
        switch (restaurant.cardStyle) {
            case 'shadow': return styles.cardShadow;
            case 'border': return styles.cardBorder;
            case 'glass': return styles.cardGlass;
            default: return styles.cardMinimal;
        }
    };

    return (
        <div style={containerStyle}>
            <style jsx global>{`
                :root {
                    --color-primary: ${restaurant.themeColor};
                    --color-text-main: ${restaurant.textColor};
                }
            `}</style>



            {/* Floating Language Selector */}
            <div style={{
                position: 'fixed',
                bottom: '80px', // Above the reservation button if it exists
                right: '20px',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
            }}>
                {LANGUAGES.map(lang => (
                    <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            border: 'none',
                            backgroundColor: language === lang.code ? restaurant.themeColor : 'white',
                            color: language === lang.code ? 'white' : 'black',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                            opacity: isTranslating ? 0.5 : 1,
                            pointerEvents: isTranslating ? 'none' : 'auto'
                        }}
                        title={lang.code.toUpperCase()}
                    >
                        {lang.label}
                    </button>
                ))}
            </div>

            {/* Translating Overlay */}
            {isTranslating && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}>
                    <div className={styles.spinner}></div>
                    <p style={{ marginTop: '15px', fontWeight: 'bold' }}>🪄 Traduzione AI in corso...</p>
                </div>
            )}

            {/* Floating Reservation Button - Only if WhatsApp number exists AND Plan is FULL */}
            {restaurant.whatsappNumber && restaurant.subscription?.plan === 'FULL' && (
                <>
                    <button
                        onClick={() => setIsReservationOpen(true)}
                        style={{
                            position: 'fixed',
                            bottom: '20px',
                            right: '20px',
                            zIndex: 100,
                            backgroundColor: '#25D366', // WhatsApp Brand Color
                            color: 'white',
                            border: 'none',
                            borderRadius: '50px',
                            padding: '12px 24px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <span>Prenota Tavolo</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                    </button>

                    <ReservationModal
                        isOpen={isReservationOpen}
                        onClose={() => setIsReservationOpen(false)}
                        whatsappNumber={restaurant.whatsappNumber!}
                        restaurantName={restaurant.name}
                        // We need restaurant ID. The MenuClient interface seems to not have it exposed in the props type. 
                        // I will assume for now it's passed or available. Wait, let's look at the file provided in step 556.
                        // MenuPageRestaurant interface DOES NOT have `id`.
                        // I must add `id` to the interface and ensure it's passed.
                        restaurantId={(restaurant as any).id}
                    />
                </>
            )}

            {/* Hero Section */}
            <header className={styles.hero}>
                {/* Removed dynamic background overlay */}

                <div className={styles.heroContent} style={{ position: 'relative', zIndex: 1 }}>
                    {restaurant.logoUrl && (
                        <img
                            src={restaurant.logoUrl}
                            alt="Logo Ristorante"
                            className={styles.logo}
                        />
                    )}
                    <h1 className={styles.restaurantName}>
                        {restaurant.name.split('&').map((part, i, arr) => (
                            <span key={i}>
                                {part}
                                {i < arr.length - 1 && <span className={styles.ampersand}>&</span>}
                            </span>
                        ))}
                    </h1>
                    {restaurant.description && (
                        <p className={styles.restaurantDesc}>{restaurant.description}</p>
                    )}
                </div>
            </header>

            {/* Filter Bar Removed */}

            {/* Sticky Navigation */}
            <div className={styles.stickyNavContainer} style={{ backgroundColor: restaurant.backgroundColor }}>
                <div style={{ padding: '0 0 0 15px', flexShrink: 0, display: 'flex', gap: '10px' }}>
                    {/* Events & Fixed Menus - Currently specific to Aperifish */}
                    {restaurant.name.toLowerCase().includes('aperifish') && (
                        <>
                            <Link
                                href={`/menu/${restaurant.slug}/events`}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    backgroundColor: '#001f2f',
                                    color: 'white',
                                    padding: '8px 16px',
                                    borderRadius: '50px',
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                    fontSize: '0.85rem',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                Eventi e Promozioni
                            </Link>
                            <Link
                                href={`/menu/${restaurant.slug}/fixed-menus`}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    backgroundColor: '#001f2f',
                                    color: 'white',
                                    padding: '8px 16px',
                                    borderRadius: '50px',
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                    fontSize: '0.85rem',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                Menu Fissi
                            </Link>
                        </>
                    )}

                    {/* Carta dei Vini Button - Internal Link */}
                    {(restaurant.wineList?.isActive || restaurant.wineListUrl) && (
                        <Link
                            href={restaurant.wineList?.isActive ? `/menu/${restaurant.slug}/wine-list` : (restaurant.wineListUrl || '#')}
                            target={restaurant.wineList?.isActive ? "_self" : "_blank"}
                            rel={restaurant.wineList?.isActive ? undefined : "noopener noreferrer"}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                backgroundColor: '#001f2f',
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: '50px',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                fontSize: '0.85rem',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Vini
                        </Link>
                    )}

                    {/* Carta Champagne Button */}
                    {(restaurant.champagneList?.isActive) && (
                        <Link
                            href={`/menu/${restaurant.slug}/champagne-list`}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                backgroundColor: '#001f2f',
                                color: 'white', // Changed to white as requested
                                padding: '8px 16px',
                                borderRadius: '50px',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                fontSize: '0.85rem',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Champagne
                        </Link>
                    )}

                    {/* Drink List Button */}
                    {(restaurant.drinkList?.isActive) && (
                        <Link
                            href={`/menu/${restaurant.slug}/drink-list`}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                backgroundColor: '#001f2f',
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: '50px',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                fontSize: '0.85rem',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Drink
                        </Link>
                    )}
                </div>
                <nav className={styles.categoryNav} style={{
                    position: 'relative',
                    top: 'auto',
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    flex: '0 0 auto',
                    overflow: 'visible' // Disable internal scroll
                }}>
                    {restaurant.categories.map(cat => (
                        <a
                            key={cat.id}
                            href={`#cat-${cat.id}`}
                            className={styles.navLink}
                        >
                            {getCatName(cat)}
                        </a>
                    ))}
                </nav>
            </div>

            {/* Menu Content */}
            <main>
                {restaurant.categories.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>Il menu è in fase di aggiornamento.</p>
                    </div>
                ) : (
                    restaurant.categories.map(cat => {
                        const filteredItems = cat.items.filter(filterItem);
                        if (filteredItems.length === 0) return null;

                        return (
                            <section
                                key={cat.id}
                                id={`cat-${cat.id}`}
                                className={styles.menuSection}
                                style={{ backgroundColor: 'transparent', borderBottom: '1px solid rgba(0,0,0,0.05)' }}
                            >
                                <h2 className={styles.categoryTitle} style={{ color: restaurant.themeColor, borderBottomColor: restaurant.themeColor }}>
                                    {getCatName(cat)}
                                </h2>
                                <div className={styles.itemsGrid}>
                                    {filteredItems.map(item => (
                                        <article key={item.id} className={`${styles.itemCard} ${getCardClass()}`} style={{ backgroundColor: restaurant.cardStyle === 'glass' ? 'rgba(255,255,255,0.7)' : 'white' }}>
                                            <div className={styles.itemInfo}>
                                                <div className={styles.itemHeader}>
                                                    <h3 className={styles.itemName} style={{ color: restaurant.textColor }}>{getItemName(item)}</h3>
                                                    {item.price !== null && Number(item.price) > 0 && (
                                                        <span className={styles.itemPrice} style={{ color: restaurant.themeColor }}>
                                                            € {Number(item.price).toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className={styles.itemDesc} style={{ color: restaurant.textColor, opacity: 0.8 }}>{getItemDesc(item)}</p>

                                                <div className={styles.itemTags}>
                                                    {item.isVegetarian && <span className={styles.tagVeg} title="Vegetariano">Veg</span>}
                                                    {item.isVegan && <span className={styles.tagVegan} title="Vegano">Vegan</span>}
                                                    {item.allergens && (
                                                        (() => {
                                                            try {
                                                                const nums = JSON.parse(item.allergens);
                                                                if (Array.isArray(nums) && nums.length > 0) {
                                                                    return (
                                                                        <span className={styles.tagGf} style={{ background: '#e3f2fd', color: '#0d47a1' }} title="Allergeni">
                                                                            All: {nums.join(', ')}
                                                                        </span>
                                                                    );
                                                                }
                                                            } catch (e) { }
                                                            return null;
                                                        })()
                                                    )}
                                                    {item.spiciness > 0 && <span className={styles.tagSpicy} title={`Piccantezza ${item.spiciness}/3`}>{'🌶️'.repeat(item.spiciness)}</span>}
                                                </div>
                                            </div>
                                            {item.imageUrl && (
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    className={styles.itemImage}
                                                />
                                            )}
                                        </article>
                                    ))}
                                </div>
                            </section>
                        );
                    })
                )}
            </main>

            {/* Show allergen info only for Aperifish */}
            {restaurant.name.toLowerCase().includes('aperifish') && (
                <AllergenInfo />
            )}

            <footer className={styles.footer} style={{ backgroundColor: 'transparent', color: restaurant.textColor, opacity: 0.6 }}>
                Powered by <strong>Gardigital Menu</strong>
                <details style={{ marginTop: '20px', fontSize: '10px' }}>
                    <summary>Debug Info</summary>
                    <pre>{JSON.stringify({
                        name: restaurant.name,
                        whatsapp: restaurant.whatsappNumber,
                        id: (restaurant as any).id
                    }, null, 2)}</pre>
                </details>
            </footer>
        </div>
    );
}
