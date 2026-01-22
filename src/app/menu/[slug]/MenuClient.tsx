'use client';

import { useState } from 'react';
import styles from './menu-public.module.css';

interface MenuPageItem {
    id: string;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    isVegan: boolean;
    isGlutenFree: boolean;
    isVegetarian: boolean;
    spiciness: number;
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
    description: string | null;
    logoUrl: string | null;
    coverImageUrl: string | null;
    themeColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
    cardStyle: string;
    categories: MenuPageCategory[];
}

const LANGUAGES = [
    { code: 'it', label: '🇮🇹' },
    { code: 'en', label: '🇬🇧' },
    { code: 'fr', label: '🇫🇷' },
    { code: 'de', label: '🇩🇪' },
];

export default function MenuClient({ restaurant }: { restaurant: MenuPageRestaurant }) {
    const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
    const [language, setLanguage] = useState<string>('it');

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

            {/* Language Switcher Floating */}
            <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 100, display: 'flex', gap: '5px', background: 'rgba(255,255,255,0.9)', padding: '5px', borderRadius: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                {LANGUAGES.map(lang => (
                    <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        style={{
                            border: 'none',
                            background: language === lang.code ? restaurant.themeColor : 'transparent',
                            color: language === lang.code ? 'white' : '#333',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                        title={lang.code.toUpperCase()}
                    >
                        {lang.label}
                    </button>
                ))}
            </div>

            {/* Hero Section */}
            <header className={styles.hero} style={{
                backgroundImage: restaurant.coverImageUrl ? `url(${restaurant.coverImageUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: restaurant.coverImageUrl ? 'white' : 'inherit',
                textShadow: restaurant.coverImageUrl ? '0 2px 4px rgba(0,0,0,0.5)' : 'none'
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: restaurant.coverImageUrl ? 'rgba(0,0,0,0.4)' : 'transparent',
                    zIndex: 0
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    {restaurant.logoUrl && (
                        <img
                            src={restaurant.logoUrl}
                            alt="Logo Ristorante"
                            className={styles.logo}
                            style={{ borderColor: restaurant.themeColor }}
                        />
                    )}
                    <h1 className={styles.restaurantName} style={{ color: restaurant.coverImageUrl ? 'white' : restaurant.textColor }}>{restaurant.name}</h1>
                    {restaurant.description && (
                        <p className={styles.restaurantDesc} style={{ color: restaurant.coverImageUrl ? 'rgba(255,255,255,0.9)' : restaurant.textColor, opacity: 0.9 }}>{restaurant.description}</p>
                    )}
                </div>
            </header>

            {/* Filter Bar */}
            <div className={styles.filterBar} style={{ backgroundColor: restaurant.backgroundColor, borderColor: 'rgba(0,0,0,0.1)' }}>
                <span style={{ fontSize: '0.9rem', opacity: 0.7, marginRight: '10px' }}>
                    {language === 'it' ? 'Filtra per:' : language === 'en' ? 'Filter by:' : language === 'fr' ? 'Filtrer par:' : 'Filtern nach:'}
                </span>
                <button
                    className={`${styles.filterBtn} ${activeFilters.has('vegetarian') ? styles.active : ''}`}
                    onClick={() => toggleFilter('vegetarian')}
                >
                    {language === 'it' ? 'Vegetariano 🥬' : language === 'en' ? 'Vegetarian 🥬' : language === 'fr' ? 'Végétarien 🥬' : 'Vegetarisch 🥬'}
                </button>
                <button
                    className={`${styles.filterBtn} ${activeFilters.has('vegan') ? styles.active : ''}`}
                    onClick={() => toggleFilter('vegan')}
                >
                    {language === 'it' ? 'Vegano 🌱' : language === 'en' ? 'Vegan 🌱' : language === 'fr' ? 'Végétalien 🌱' : 'Vegan 🌱'}
                </button>
                <button
                    className={`${styles.filterBtn} ${activeFilters.has('glutenFree') ? styles.active : ''}`}
                    onClick={() => toggleFilter('glutenFree')}
                >
                    {language === 'it' ? 'Senza Glutine 🌾' : language === 'en' ? 'Gluten Free 🌾' : language === 'fr' ? 'Sans Gluten 🌾' : 'Glutenfrei 🌾'}
                </button>
            </div>

            {/* Sticky Navigation */}
            <nav className={styles.categoryNav} style={{ backgroundColor: restaurant.backgroundColor }}>
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

            {/* Menu Content */}
            <main>
                {restaurant.categories.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>{language === 'it' ? 'Il menu è in fase di aggiornamento.' : 'Menu is being updated.'}</p>
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
                                                    <span className={styles.itemPrice} style={{ color: restaurant.themeColor }}>
                                                        € {Number(item.price).toFixed(2)}
                                                    </span>
                                                </div>
                                                <p className={styles.itemDesc} style={{ color: restaurant.textColor, opacity: 0.8 }}>{getItemDesc(item)}</p>

                                                <div className={styles.itemTags}>
                                                    {item.isVegetarian && <span className={styles.tagVeg} title="Vegetariano">Veg</span>}
                                                    {item.isVegan && <span className={styles.tagVegan} title="Vegano">Vegan</span>}
                                                    {item.isGlutenFree && <span className={styles.tagGf} title="Senza Glutine">GF</span>}
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

            <footer className={styles.footer} style={{ backgroundColor: 'transparent', color: restaurant.textColor, opacity: 0.6 }}>
                Powered by <strong>Gardigital Menu</strong>
            </footer>
        </div>
    );
}
