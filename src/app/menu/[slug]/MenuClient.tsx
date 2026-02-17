'use client';

import Link from 'next/link';
import { useState, Suspense, memo } from 'react';
import styles from './menu-public.module.css';
import { PreviewManager } from '@/components/menu/PreviewManager';
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
    priceUnit?: string | null;
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
    translations?: { language: string; description: string | null }[];
    customLists?: { id: string; name: string; slug: string; isActive: boolean }[] | null;
    googleReviewsUrl?: string | null;
}
const UI_LABELS: Record<string, any> = {
    it: {
        events: "Eventi e Promozioni",
        fixedMenus: "Menu Fissi",
        wines: "Vini/Bollicine",
        champagne: "Champagne",
        drinks: "Drink",
        book: "Prenota Tavolo",
        translating: "🪄 Traduzione AI in corso...",
        spiciness: "Piccantezza",

        review: "Lasciaci una recensione su Google"
    },
    en: {
        events: "Events & Promos",
        fixedMenus: "Fixed Menus",
        wines: "Wines",
        champagne: "Champagne",
        drinks: "Drinks",
        book: "Book Table",
        translating: "🪄 AI Translation in progress...",
        spiciness: "Spiciness",

        review: "Review us on Google"
    },
    fr: {
        events: "Événements & Promos",
        fixedMenus: "Menus Fixes",
        wines: "Vins",
        champagne: "Champagne",
        drinks: "Boissons",
        book: "Réserver",
        translating: "🪄 Traduction AI en cours...",
        spiciness: "Piquant",

        review: "Laissez-nous un avis su Google"
    },
    de: {
        events: "Events & Promos",
        fixedMenus: "Festmenüs",
        wines: "Weine",
        champagne: "Champagner",
        drinks: "Getränke",
        book: "Reservieren",
        translating: "🪄 KI-Übersetzung läuft...",
        spiciness: "Schärfe",

        review: "Review uns auf Google"
    }
};

const LANGUAGES = [
    { code: 'it', label: '🇮🇹' },
    { code: 'en', label: '🇬🇧' },
    { code: 'fr', label: '🇫🇷' },
    { code: 'de', label: '🇩🇪' },
];

export function MenuClientContent({ restaurant: initialRestaurant }: { restaurant: MenuPageRestaurant }) {
    const [restaurant, setRestaurant] = useState(initialRestaurant);
    const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
    const [language, setLanguage] = useState<string>('it');
    const [isReservationOpen, setIsReservationOpen] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);

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

        const needsTranslation = restaurant.categories.some(cat => {
            const catTrans = cat.translations?.find(t => t.language === newLang);
            if (!catTrans || catTrans.name.startsWith(`[${newLang.toUpperCase()}]`) || catTrans.name === cat.name) return true;

            return cat.items.some(item => {
                const itemTrans = item.translations?.find(t => t.language === newLang);
                return !itemTrans || itemTrans.name.startsWith(`[${newLang.toUpperCase()}]`) || itemTrans.name === item.name;
            });
        }) || (restaurant.description && (!restaurant.translations?.find(t => t.language === newLang) || restaurant.translations?.find(t => t.language === newLang)?.description === restaurant.description));

        if (needsTranslation) {
            setIsTranslating(true);
            try {
                const res = await fetch('/api/public/menu/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ menuId: activeMenuId, targetLanguage: newLang })
                });

                if (res.ok) {
                    // Re-fetch data or update local state? For simplicity, we re-fetch briefly or just hope the next refresh catches it.
                    // Better: re-fetch the restaurant data
                    const slugRes = await fetch(`/api/public/menu?slug=${restaurant.slug}`);
                    if (slugRes.ok) {
                        const newData = await slugRes.json();
                        setRestaurant(newData.restaurant);
                    } else {
                        alert("Errore nel recupero dei dati aggiornati.");
                    }
                } else {
                    const errorData = await res.json();
                    alert(`Errore traduzione: ${errorData.error || 'Errore sconosciuto'}`);
                }
            } catch (error) {
                console.error('Translation failed', error);
                alert("Si è verificato un errore durante la connessione al server.");
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

    const getRestaurantDesc = () => {
        if (language === 'it') return restaurant.description;
        return restaurant.translations?.find(t => t.language === language)?.description || restaurant.description;
    };

    // UI Translation Helper
    const t = UI_LABELS[language] || UI_LABELS.it;

    const isXL = restaurant.slug?.toLowerCase().includes('aperifish') ||
        restaurant.name?.toLowerCase().includes('aperifish');

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
        <div
            style={containerStyle}
        >
            <style jsx global>{`
                :root {
                    --color-primary: ${restaurant.themeColor};
                    --color-text-main: ${restaurant.textColor};
                }
            `}</style>




            {/* Top-Right Floating Controls (Language & WhatsApp) */}
            <div style={{
                position: 'fixed',
                top: '100px',
                right: '20px',
                zIndex: 100,
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start'
            }}>
                {/* 1. Language Selector (on the left) */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    {/* Main Globe Button */}
                    <button
                        onClick={() => setIsLangOpen(!isLangOpen)}
                        style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            border: 'none',
                            backgroundColor: isLangOpen ? 'white' : restaurant.themeColor,
                            color: isLangOpen ? restaurant.themeColor : 'white',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            transform: isLangOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                        title="Translate"
                    >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="2" y1="12" x2="22" y2="12"></line>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                    </button>

                    {/* Expandable Flags Container */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        opacity: isLangOpen ? 1 : 0,
                        transform: isLangOpen ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0.8)',
                        pointerEvents: isLangOpen ? 'auto' : 'none',
                        height: isLangOpen ? 'auto' : 0,
                        overflow: 'hidden'
                    }}>
                        {LANGUAGES.map(lang => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    handleLanguageChange(lang.code);
                                    setIsLangOpen(false);
                                }}
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    backgroundColor: language === lang.code ? restaurant.themeColor : 'white',
                                    color: language === lang.code ? 'white' : 'black',
                                    fontSize: '1.3rem',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s',
                                    opacity: isTranslating ? 0.5 : 1,
                                    pointerEvents: isTranslating ? 'none' : 'auto',
                                    flexShrink: 0
                                }}
                                title={lang.code.toUpperCase()}
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. WhatsApp Reservation Button (on the right) */}
                {restaurant.whatsappNumber && restaurant.subscription?.plan === 'FULL' && (
                    <button
                        onClick={() => setIsReservationOpen(true)}
                        style={{
                            backgroundColor: '#25D366', // WhatsApp Brand Color
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '56px',
                            height: '56px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                    </button>
                )}
            </div>

            <ReservationModal
                isOpen={isReservationOpen}
                onClose={() => setIsReservationOpen(false)}
                restaurantName={restaurant.name}
                whatsappNumber={restaurant.whatsappNumber || ''}
                restaurantId={activeMenuId}
            />

            {/* Hero Section */}
            <header
                className={styles.hero}
                style={restaurant.coverImageUrl ? {
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3)), url('${restaurant.coverImageUrl}')`
                } : undefined}
            >
                {/* Removed dynamic background overlay */}

                <div className={styles.heroContent} style={{ position: 'relative', zIndex: 1 }}>
                    {restaurant.slug?.toLowerCase() === 'demo' || restaurant.name?.toLowerCase().includes('demo') ? (
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '10px', fontWeight: 'bold' }}>Benvenuto</h2>
                    ) : restaurant.logoUrl ? (
                        <img src={restaurant.logoUrl} alt={restaurant.name} className={styles.logo} />
                    ) : null}
                    {restaurant.slug !== 'mastro-arrosticino-884' && (
                        <h1 className={styles.restaurantName}>{restaurant.name}</h1>
                    )}
                    {restaurant.description && (
                        <p className={styles.restaurantDesc}>
                            {getRestaurantDesc()}
                        </p>
                    )}
                </div>
            </header>

            {/* Filter Bar Removed */}

            {/* Sticky Navigation */}
            <div className={styles.stickyNavContainer} style={{ backgroundColor: restaurant.backgroundColor, padding: '10px 0' }}>
                <div style={{ padding: '0 15px', display: 'flex', gap: '10px', alignItems: 'center' }}>

                    {/* 1. Eventi e Promozioni */}
                    {isXL && (
                        <Link href={`/menu/${restaurant.slug}/events`} className={styles.navPill}>{t.events}</Link>
                    )}

                    {/* 2. Menu Fissi */}
                    {isXL && (
                        <Link href={`/menu/${restaurant.slug}/fixed-menus`} className={styles.navPill}>{t.fixedMenus}</Link>
                    )}

                    {/* 3. Standard Categories (Antipasti, Primi, etc.) */}
                    {restaurant.categories
                        .filter(cat => {
                            if (restaurant.slug?.toLowerCase() === 'demo' || restaurant.name?.toLowerCase().includes('demo')) {
                                const name = cat.name.toLowerCase();
                                return !name.includes('champagne') && !name.includes('drink');
                            }
                            return true;
                        })
                        .map(cat => (
                            <a key={cat.id} href={`#cat-${cat.id}`} className={styles.navPill}>{getCatName(cat)}</a>
                        ))}

                    {/* 4. Vini/Bollicine */}
                    {((restaurant.wineList?.isActive || restaurant.wineListUrl) && isXL) && (
                        <Link
                            href={restaurant.wineList?.isActive ? `/menu/${restaurant.slug}/wine-list` : (restaurant.wineListUrl || '#')}
                            target={restaurant.wineList?.isActive ? "_self" : "_blank"}
                            className={styles.navPill}
                        >
                            {t.wines}
                        </Link>
                    )}

                    {/* 5. Drink List */}
                    {(restaurant.drinkList?.isActive && restaurant.slug?.toLowerCase() !== 'demo' && !restaurant.name?.toLowerCase().includes('demo')) && (
                        <Link href={`/menu/${restaurant.slug}/drink-list`} className={styles.navPill}>
                            {language === 'it' ? 'Drink' : t.drinks}
                        </Link>
                    )}

                    {/* 6. Custom Lists (including Gin Selection) */}
                    {restaurant.customLists?.map(list => (
                        <Link key={list.id} href={`/menu/${restaurant.slug}/custom/${list.slug}`} className={styles.navPill}>
                            {list.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Google Reviews Button moved from footer */}
            {restaurant.googleReviewsUrl && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '15px 0', backgroundColor: restaurant.backgroundColor }}>
                    <a
                        href={restaurant.googleReviewsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            backgroundColor: '#4285F4',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '50px',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            boxShadow: '0 4px 12px rgba(66, 133, 244, 0.25)',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.152-1.12 1.12-2.312 2.312-5.912 2.312-5.568 0-9.856-4.48-9.856-10.048 0-5.568 4.288-10.048 9.856-10.048 3.008 0 5.256 1.184 6.848 2.688l2.304-2.304C19.16 1.016 16.32 0 12.48 0 5.648 0 0 5.648 0 12.48S5.648 24.96 12.48 24.96c3.672 0 6.44-1.208 8.616-3.48 2.24-2.24 2.952-5.4 2.952-8.032 0-.768-.064-1.32-.184-1.84H12.48v.312z" />
                        </svg>
                        {t.review}
                    </a>
                </div>
            )}

            {/* Menu Content */}
            <main>
                {restaurant.categories.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>Il menu è in fase di aggiornamento.</p>
                    </div>
                ) : (
                    restaurant.categories
                        .filter(cat => {
                            if (restaurant.slug?.toLowerCase() === 'demo' || restaurant.name?.toLowerCase().includes('demo')) {
                                const name = cat.name.toLowerCase();
                                return !name.includes('champagne') && !name.includes('drink');
                            }
                            return true;
                        })
                        .map(cat => {
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
                                                        {((item.price !== null && Number(item.price) > 0) || item.priceUnit) && (
                                                            <span className={styles.itemPrice} style={{ color: restaurant.themeColor }}>
                                                                {item.price !== null && Number(item.price) > 0
                                                                    ? `€ ${Number(item.price).toFixed(2)} ${item.priceUnit ? item.priceUnit : ''}`
                                                                    : item.priceUnit
                                                                }
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
                                                        {item.spiciness > 0 && <span className={styles.tagSpicy} title={`${t.spiciness} ${item.spiciness}/3`}>{'🌶️'.repeat(item.spiciness)}</span>}
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
            {isXL && (
                <AllergenInfo language={language} />
            )}

            <footer className={styles.footer} style={{ backgroundColor: 'transparent', color: restaurant.textColor, opacity: 0.6 }}>

                <a
                    href={`https://www.gardigital.it?utm_source=menu_footer&utm_medium=referral&utm_campaign=${restaurant.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'inherit', textDecoration: 'none' }}
                >
                    Powered by <strong>Gardigital.it</strong>
                </a>

            </footer>

            {isReservationOpen && (
                <ReservationModal
                    isOpen={isReservationOpen}
                    onClose={() => setIsReservationOpen(false)}
                    restaurantName={restaurant.name}
                    whatsappNumber={restaurant.whatsappNumber || ''}
                    restaurantId={activeMenuId}
                />
            )}
        </div>
    );
}


export default function MenuClient(props: { restaurant: MenuPageRestaurant }) {
    return (
        <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Caricamento...</div>}>
            <PreviewManager />
            <MenuClientContent {...props} />
        </Suspense>
    );
}
