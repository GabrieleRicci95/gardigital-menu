'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../restaurant-dashboard.module.css';
import { Plus, Edit3, Trash2, Camera, MoreVertical, Coffee, Wine, Pizza, Utensils, Save, X, Eye, ChevronRight } from 'lucide-react';

interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    isVegan: boolean;
    isGlutenFree: boolean;
    isVegetarian: boolean;
    spiciness: number;
}

interface Category {
    id: string;
    name: string;
    items: MenuItem[];
}

interface Menu {
    id: string;
    name: string;
    isActive: boolean;
    _count: { categories: number };
    categories?: Category[];
}

export default function MenuPage() {
    const router = useRouter();
    const [menus, setMenus] = useState<Menu[]>([]);
    const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDemo, setIsDemo] = useState(false);

    useEffect(() => {
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        try {
            const res = await fetch('/api/menus');
            const data = await res.json();
            setMenus(data.menus || []);
            setIsDemo(!!data.isDemo);
            if (data.menus && data.menus.length > 0) {
                // Fetch categories for the first menu by default
                fetchMenuDetails(data.menus[0].id);
            }
        } catch (error) {
            console.error('Error fetching menus:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMenuDetails = async (menuId: string) => {
        try {
            const res = await fetch(`/api/menu/categories?menuId=${menuId}`);
            if (res.ok) {
                const data = await res.json();
                const menu = menus.find(m => m.id === menuId);
                if (menu) {
                    setSelectedMenu({ ...menu, categories: data.categories || [] });
                } else {
                    // If menus not loaded yet or something, create a partial
                    setSelectedMenu({ id: menuId, name: '', isActive: true, _count: { categories: 0 }, categories: data.categories || [] });
                }
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleMenuClick = (menu: Menu) => {
        setSelectedMenu(menu);
        fetchMenuDetails(menu.id);
    };

    const handleCreateMenu = async () => {
        if (isDemo) {
            alert('Modalità Demo: modifiche non consentite');
            return;
        }
        const name = prompt('Nome del nuovo menu (es. Menu Estate, Carta dei Vini...):');
        if (!name) return;

        try {
            const res = await fetch('/api/menus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
            if (res.ok) {
                fetchMenus();
            }
        } catch (error) {
            console.error('Error creating menu:', error);
        }
    };

    const handleDeleteMenu = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (isDemo) {
            alert('Modalità Demo: modifiche non consentite');
            return;
        }
        if (!confirm('Sei sicuro di voler eliminare l\'intero menu?')) return;

        try {
            const res = await fetch(`/api/menus?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchMenus();
                if (selectedMenu?.id === id) setSelectedMenu(null);
            }
        } catch (error) {
            console.error('Error deleting menu:', error);
        }
    };

    const handleToggleActive = async (menuId: string, currentStatus: boolean, e: React.MouseEvent) => {
        e.stopPropagation();
        if (isDemo) return;
        try {
            await fetch('/api/menus', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: menuId, isActive: !currentStatus }),
            });
            fetchMenus();
        } catch (error) {
            console.error('Error toggling menu:', error);
        }
    };

    if (loading) return (
        <div className={styles.container}>
            <div className={styles.loaderContainer}>
                <div className={styles.spinner}></div>
                <p className={styles.loaderText}>Il tuo Atelier dei Gusti sta arrivando...</p>
            </div>
        </div>
    );

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Architettura dei Menu</h1>
                    <p className={styles.subtitle}>Progetta l&apos;esperienza culinaria perfetta per i tuoi ospiti.</p>
                </div>
            </header>

            {/* Menu Tabs / Selector */}
            <div style={{ marginBottom: '3rem' }}>
                <h3 className={styles.cardTitle} style={{ fontSize: '0.9rem', color: 'rgba(212, 175, 55, 0.6)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem', fontWeight: 600 }}>
                    I Tuoi Menu
                </h3>
                <div className={styles.menuList} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {menus.map((menu) => (
                        <div
                            key={menu.id}
                            onClick={() => handleMenuClick(menu)}
                            className={`${styles.card} ${selectedMenu?.id === menu.id ? styles.menuCardActive : ''}`}
                            style={{
                                cursor: 'pointer',
                                background: selectedMenu?.id === menu.id ? 'rgba(212, 175, 55, 0.08)' : 'rgba(255,255,255,0.03)',
                                border: selectedMenu?.id === menu.id ? '1px solid #d4af37' : '1px solid rgba(255,255,255,0.1)',
                                padding: '24px',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                boxShadow: selectedMenu?.id === menu.id ? '0 10px 40px rgba(212, 175, 55, 0.15)' : 'none'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <span style={{
                                    fontSize: '1.3rem',
                                    fontWeight: 700,
                                    color: selectedMenu?.id === menu.id ? '#d4af37' : '#fff',
                                    fontFamily: 'Playfair Display, serif'
                                }}>
                                    {menu.name}
                                </span>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={(e) => handleToggleActive(menu.id, menu.isActive, e)}
                                        style={{
                                            background: menu.isActive ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            color: menu.isActive ? '#4ade80' : '#ef4444',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '28px',
                                            height: '28px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s'
                                        }}
                                        title={menu.isActive ? 'Attivo (Visibile)' : 'Nascosto'}
                                    >
                                        <Eye size={14} />
                                    </button>
                                    {!isDemo && (
                                        <button
                                            onClick={(e) => handleDeleteMenu(menu.id, e)}
                                            style={{
                                                background: 'rgba(239, 68, 68, 0.05)',
                                                border: 'none',
                                                color: '#ef4444',
                                                cursor: 'pointer',
                                                padding: '6px',
                                                borderRadius: '50%',
                                                transition: 'all 0.3s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                                    {menu._count?.categories || 0} CATEGORIE
                                </span>
                                {menu.isActive && (
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 10px #4ade80' }}></div>
                                )}
                            </div>
                        </div>
                    ))}
                    <div
                        onClick={handleCreateMenu}
                        style={{
                            minHeight: 'auto',
                            padding: '24px',
                            background: 'rgba(212, 175, 55, 0.03)',
                            border: '1px dashed rgba(212, 175, 55, 0.3)',
                            borderRadius: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            color: '#d4af37',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212, 175, 55, 0.08)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(212, 175, 55, 0.03)'}
                    >
                        <Plus size={24} /> Aggiungi Menu
                    </div>
                </div>
            </div>

            {selectedMenu ? (
                <div className={styles.grid} style={{ gridTemplateColumns: '1fr' }}>
                    <div className={styles.card} style={{ padding: '2rem', background: 'rgba(15, 15, 15, 0.4)', border: '1px solid rgba(212, 175, 55, 0.1)' }}>                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <h2 className={styles.cardTitle} style={{ margin: 0, fontSize: '2rem' }}>
                                    {selectedMenu.name}
                                </h2>
                            </div>
                        </div>


                        <div className={styles.categoryList} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {selectedMenu.categories?.length === 0 ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '5rem 2rem',
                                    background: 'rgba(255,255,255,0.02)',
                                    borderRadius: '32px',
                                    border: '1px dashed rgba(255,255,255,0.1)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '1.5rem'
                                }}>
                                    <div style={{ background: 'rgba(212, 175, 55, 0.05)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Utensils size={40} color="rgba(212, 175, 55, 0.3)" />
                                    </div>
                                    <div>
                                        <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '8px' }}>Nessuna Categoria</h3>
                                        <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '400px' }}>Inizia definendo le sezioni del tuo menu (es. Antipasti, Primi, Dessert).</p>
                                    </div>
                                    <Link href={`/dashboard/menu/${selectedMenu.id}`} className={styles.btnSm} style={{ width: 'auto', padding: '12px 30px' }}>
                                        Aggiungi Prima Sezione
                                    </Link>
                                </div>
                            ) : (
                                selectedMenu.categories?.map((cat) => (
                                    <div key={cat.id} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', overflow: 'hidden', transition: 'transform 0.3s' }}>
                                        <div style={{ background: 'rgba(212, 175, 55, 0.05)', borderBottom: '1px solid rgba(212, 175, 55, 0.1)', padding: '1.5rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <h3 style={{ fontSize: '1.4rem', color: '#d4af37', margin: 0, fontFamily: 'Playfair Display, serif' }}>{cat.name}</h3>
                                            <span style={{ fontSize: '0.85rem', color: 'rgba(212, 175, 55, 0.6)', fontWeight: 600, background: 'rgba(212, 175, 55, 0.1)', padding: '6px 14px', borderRadius: '20px' }}>
                                                {cat.items?.length || 0} PIATTI
                                            </span>
                                        </div>
                                        <div style={{ padding: '1rem 0' }}>
                                            {cat.items?.length === 0 ? (
                                                <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                                                    Nessun piatto in questa categoria.
                                                </div>
                                            ) : (
                                                cat.items?.map((item) => (
                                                    <div key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', padding: '1.2rem 2.5rem', display: 'flex', alignItems: 'center', gap: '2rem', transition: 'background 0.3s' }} className="menu-item-row">
                                                        <style jsx>{`
                                                            .menu-item-row:hover { background: rgba(255,255,255,0.02); }
                                                            .menu-item-row:last-child { border-bottom: none; }
                                                        `}</style>
                                                        <div style={{ width: '70px', height: '70px', background: 'rgba(255,255,255,0.05)', borderRadius: '14px', overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(212, 175, 55, 0.1)' }}>
                                                            {item.imageUrl ? (
                                                                <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            ) : (
                                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                    <Camera size={24} color="rgba(212, 175, 55, 0.2)" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                                                <span style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600 }}>{item.name}</span>
                                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                                    {item.isVegan && <span title="Vegan" style={{ background: '#4ade80', width: '8px', height: '8px', borderRadius: '50%' }}></span>}
                                                                    {item.isGlutenFree && <span title="Senza Glutine" style={{ background: '#fbbf24', width: '8px', height: '8px', borderRadius: '50%' }}></span>}
                                                                </div>
                                                            </div>
                                                            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem', maxWidth: '600px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                {item.description || 'Nessuna descrizione.'}
                                                            </div>
                                                        </div>
                                                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                                            <div style={{ color: '#d4af37', fontSize: '1.3rem', fontWeight: 800, fontFamily: 'Inter, sans-serif' }}>
                                                                €{item.price ? Number(item.price).toFixed(2) : '0.00'}
                                                            </div>
                                                        </div>
                                                        <ChevronRight size={20} color="rgba(255,255,255,0.1)" />
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '8rem 2rem', background: 'rgba(212, 175, 55, 0.02)', borderRadius: '40px', border: '1px solid rgba(212, 175, 55, 0.05)' }}>
                    <div style={{ background: 'rgba(212, 175, 55, 0.05)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem' }}>
                        <Wine size={48} color="#d4af37" />
                    </div>
                    <h2 style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '1.2rem', fontFamily: 'Playfair Display, serif' }}>Crea il tuo Capolavoro</h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '550px', margin: '0 auto 3rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
                        Inizia progetando un nuovo menu. Potrai creare liste separate per il pranzo, la cena o eventi speciali con un tocco di esclusività.
                    </p>
                    <button onClick={handleCreateMenu} className={styles.btnPrimary} style={{ width: 'auto', padding: '16px 40px', fontSize: '1.1rem' }}>
                        Inizia Ora
                    </button>
                </div>
            )}

        </div>
    );
}
