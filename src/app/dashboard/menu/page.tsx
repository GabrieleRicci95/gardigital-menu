'use client';

import { useState, useEffect } from 'react';
import styles from '../restaurant-dashboard.module.css';

interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number | null;
    imageUrl?: string;
    isVegan: boolean;
    isGlutenFree: boolean;
    isVegetarian: boolean;
    spiciness: number;
    allergens: string | null;
    translations: { language: string; name: string; description: string | null }[];
}

const LANGUAGES = [
    { code: 'it', label: '🇮🇹 IT', default: true },
    { code: 'en', label: '🇬🇧 EN' },
    { code: 'fr', label: '🇫🇷 FR' },
    { code: 'de', label: '🇩🇪 DE' },
];

interface Category {
    id: string;
    name: string;
    items: MenuItem[];
    translations: { language: string; name: string }[];
}

interface Menu {
    id: string;
    name: string;
    isActive: boolean;
    _count: { categories: number };
}

export default function MenuBuilderPage() {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [subscription, setSubscription] = useState<any>(null);
    const [restaurantSlug, setRestaurantSlug] = useState<string>('');
    const [uploadingId, setUploadingId] = useState<string | null>(null);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);
    const [showCreateInput, setShowCreateInput] = useState(false);
    const [showAllMenus, setShowAllMenus] = useState(false);

    // Forms states
    const [newMenuName, setNewMenuName] = useState('');
    const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
    const [editMenuName, setEditMenuName] = useState('');

    // Category Form State
    const [activeCatLang, setActiveCatLang] = useState('it');
    const [newCatData, setNewCatData] = useState<{
        name: string;
        translations: Record<string, { name: string }>;
    }>({ name: '', translations: {} });

    const [editingCatId, setEditingCatId] = useState<string | null>(null);
    const [editCatData, setEditCatData] = useState<{
        name: string;
        translations: Record<string, { name: string }>;
    }>({ name: '', translations: {} });

    // Item Form State
    const [addingItemTo, setAddingItemTo] = useState<string | null>(null);
    const [activeItemLang, setActiveItemLang] = useState('it');
    const [newItem, setNewItem] = useState<{
        name: string; description: string; price: string;
        isVegan: boolean; isGlutenFree: boolean; isVegetarian: boolean; spiciness: number;
        allergens: number[];
        translations: Record<string, { name: string; description: string }>;
    }>({
        name: '', description: '', price: '',
        isVegan: false, isGlutenFree: false, isVegetarian: false, spiciness: 0,
        allergens: [],
        translations: {}
    });

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editItemData, setEditItemData] = useState<{
        name: string; description: string; price: string;
        isVegan: boolean; isGlutenFree: boolean; isVegetarian: boolean; spiciness: number;
        allergens: number[];
        translations: Record<string, { name: string; description: string }>;
    }>({
        name: '', description: '', price: '',
        isVegan: false, isGlutenFree: false, isVegetarian: false, spiciness: 0,
        allergens: [],
        translations: {}
    });

    const [error, setError] = useState('');
    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        isOpen: boolean,
        itemId: string | null,
        categoryId: string | null,
        isCategory?: boolean,
        isMenu?: boolean,
        menuId?: string | null
    }>({
        isOpen: false, itemId: null, categoryId: null, isCategory: false, isMenu: false, menuId: null
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (selectedMenuId) {
            fetchCategories(selectedMenuId);
        } else {
            setCategories([]);
        }
    }, [selectedMenuId]);

    const fetchInitialData = async () => {
        const t = Date.now();
        try {
            const [menuRes, restRes] = await Promise.all([
                fetch(`/api/menus?t=${t}`),
                fetch(`/api/restaurant?t=${t}`)
            ]);

            if (menuRes.status === 401 || restRes.status === 401) {
                // Session expired or invalid
                console.log("Session expired, redirecting...");
                window.location.href = '/login';
                return;
            }

            if (menuRes.ok) {
                const data = await menuRes.json();
                setMenus(data.menus || []);
                // Auto-select first menu if exists
                if (data.menus && data.menus.length > 0 && !selectedMenuId) {
                    setSelectedMenuId(data.menus[0].id);
                }
            } else {
                setError('Impossibile caricare i menu. Riprova.');
            }

            if (restRes.ok) {
                const data = await restRes.json();
                setSubscription(data.restaurant?.subscription);
                setRestaurantSlug(data.restaurant?.slug || '');
            }
        } catch (err) {
            console.error("Error loading data", err);
            setError('Errore di connessione. Controlla la rete.');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async (menuId: string) => {
        const res = await fetch(`/api/menu/categories?menuId=${menuId}`);
        if (res.ok) {
            const data = await res.json();
            setCategories(data.categories || []);
        }
    };

    const handleCreateMenu = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMenuName.trim()) return;
        setLoading(true);
        try {
            const res = await fetch('/api/menus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newMenuName })
            });
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await res.json();
                if (res.ok) {
                    setMenus([...menus, data]);
                    setSelectedMenuId(data.id);
                    setNewMenuName('');
                } else {
                    alert(data.error || 'Errore creazione menu');
                }
            } else {
                const text = await res.text();
                console.error(`Server Error (${res.status} ${res.statusText}):`, text);
                alert(`Errore del server (${res.status} ${res.statusText}): ${text.substring(0, 100)}`);
            }
        } catch (err) {
            console.error("Connection Error:", err);
            alert("Errore di connessione: " + (err instanceof Error ? err.message : String(err)));
        } finally {
            setLoading(false);
        }
    };

    const handleActivateMenu = async (menuId: string) => {
        const res = await fetch(`/api/menus/${menuId}/activate`, { method: 'POST' });
        if (res.ok) {
            setMenus(prev => prev.map(m => ({ ...m, isActive: m.id === menuId })));
        }
    };

    // --- CATEGORY ACTIONS ---

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCatData.name || !selectedMenuId) return;

        const res = await fetch('/api/menu/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: newCatData.name,
                menuId: selectedMenuId,
                translations: Object.entries(newCatData.translations).map(([lang, t]) => ({ language: lang, ...t }))
            }),
        });

        if (res.ok) {
            setNewCatData({ name: '', translations: {} });
            fetchCategories(selectedMenuId);
        }
    };

    const handleUpdateCategory = async (e: React.FormEvent, id: string) => {
        e.preventDefault();
        const res = await fetch('/api/menu/categories', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id,
                ...editCatData,
                translations: Object.entries(editCatData.translations).map(([lang, t]) => ({ language: lang, ...t }))
            }),
        });
        if (res.ok) {
            setEditingCatId(null);
            fetchCategories(selectedMenuId!);
        }
    }

    // --- ITEM ACTIONS ---

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!addingItemTo || !newItem.name) return;

        try {
            const res = await fetch('/api/menu/items', {
                method: 'POST',
                body: JSON.stringify({
                    ...newItem,
                    categoryId: addingItemTo,
                    allergens: JSON.stringify(newItem.allergens), // Send as JSON string
                    translations: Object.entries(newItem.translations).map(([lang, t]) => ({ language: lang, ...t }))
                }),
            });
            if (res.ok) {
                setNewItem({
                    name: '', description: '', price: '',
                    isVegan: false, isGlutenFree: false, isVegetarian: false, spiciness: 0,
                    allergens: [],
                    translations: {}
                });
                setAddingItemTo(null);
                if (selectedMenuId) fetchCategories(selectedMenuId);
            } else {
                const data = await res.json();
                setError(data.error || 'Errore aggiunta piatto');
            }
        } catch (e) { setError('Errore connessione'); }
    };

    const handleUpdateItem = async (e: React.FormEvent | null, id: string, overrideData: any = null) => {
        if (e) e.preventDefault();

        // Prepare data: merge current editItemData with possible overrideData (e.g., imageUrl: null)
        // If overrideData is provided, we use that for the specific fields, but mostly we need it for 'imageUrl' which isn't in the form state usually.
        // Actually, for imageUrl deletion, we might just want to send that single field.
        // Let's make it robust: use editItemData BUT if overrideData has keys, use them.

        // Note: editItemData only holds form fields, it doesn't hold 'imageUrl'. So if we only send editItemData, imageUrl is undefined (ignored).
        // If we want to delete image, we pass { imageUrl: null }.

        const res = await fetch('/api/menu/items', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id,
                ...editItemData,
                translations: Object.entries(editItemData.translations).map(([lang, t]) => ({ language: lang, ...t })),
                allergens: JSON.stringify(editItemData.allergens),
                ...overrideData // This will override anything, or add new fields like imageUrl
            }),
        });
        if (res.ok) {
            setEditingId(null);
            if (selectedMenuId) fetchCategories(selectedMenuId);
        }
    };

    const handleQuickUpdate = async (item: MenuItem, updates: any) => {
        const res = await fetch('/api/menu/items', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                isVegan: item.isVegan,
                isGlutenFree: item.isGlutenFree,
                isVegetarian: item.isVegetarian,
                spiciness: item.spiciness,
                translations: item.translations,
                ...updates
            }),
        });
        if (res.ok) {
            if (selectedMenuId) fetchCategories(selectedMenuId);
        } else {
            alert('Errore aggiornamento piatto');
        }
    };

    const requestDelete = (id: string, categoryId: string | null, isCategory: boolean = false, isMenu: boolean = false) => {
        setDeleteConfirmation({
            isOpen: true,
            itemId: (isCategory || isMenu) ? null : id,
            categoryId: isCategory ? id : categoryId,
            isCategory,
            isMenu,
            menuId: isMenu ? id : null
        });
    };

    const confirmDelete = async () => {
        const { itemId, categoryId, isCategory, isMenu, menuId } = deleteConfirmation;
        setDeleteConfirmation({ ...deleteConfirmation, isOpen: false });

        if (isMenu && menuId) {
            const res = await fetch(`/api/menus/${menuId}`, { method: 'DELETE' });
            if (res.ok) {
                setMenus(prev => prev.filter(m => m.id !== menuId));
                if (selectedMenuId === menuId) setSelectedMenuId(null);
            } else {
                const err = await res.text();
                try {
                    const json = JSON.parse(err);
                    alert(json.error || "Errore durante l'eliminazione del menu");
                } catch {
                    alert("Errore durante l'eliminazione del menu: " + res.statusText);
                }
            }
        } else if (isCategory && categoryId) {
            const res = await fetch(`/api/menu/categories?id=${categoryId}`, { method: 'DELETE' });
            if (res.ok) {
                if (selectedMenuId) fetchCategories(selectedMenuId);
            } else {
                alert("Errore eliminazione categoria");
            }
        } else if (itemId) {
            await fetch(`/api/menu/items?id=${itemId}`, { method: 'DELETE' });
            if (selectedMenuId) fetchCategories(selectedMenuId);
        }
    };

    const handleUploadClick = (itemId: string) => document.getElementById(`file-input-${itemId}`)?.click();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingId(itemId);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('itemId', itemId);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        if (res.ok && selectedMenuId) fetchCategories(selectedMenuId);
        setUploadingId(null);
    };

    const handleUpdateMenuName = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMenuId || !editMenuName.trim()) return;

        try {
            const res = await fetch('/api/menus', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editingMenuId, name: editMenuName })
            });

            if (res.ok) {
                const updatedMenu = await res.json();
                setMenus(prev => prev.map(m => m.id === editingMenuId ? updatedMenu : m));
                setEditingMenuId(null);
            } else {
                alert('Errore aggiornamento nome menu');
            }
        } catch (err) {
            console.error(err);
            alert('Errore di connessione');
        }
    };

    if (loading) return <div className={styles.container}>Caricamento Menu...</div>;
    const isPremium = subscription?.plan === 'PREMIUM' && subscription?.status === 'ACTIVE';

    // Helper for Language Tabs
    const LangTabs = ({ active, setActive }: { active: string, setActive: (l: string) => void }) => (
        <div className={styles.langTabs}>
            {LANGUAGES.map(lang => (
                <button
                    key={lang.code}
                    type="button"
                    onClick={() => setActive(lang.code)}
                    className={`${styles.langTab} ${active === lang.code ? styles.langTabActive : ''}`}
                >
                    {lang.label}
                </button>
            ))}
        </div>
    );

    return (
        <div className={styles.container}>
            {/* Modal & Lightbox */}
            {deleteConfirmation.isOpen && (
                <div className={styles.lightboxOverlay} onClick={() => setDeleteConfirmation({ ...deleteConfirmation, isOpen: false })}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h3 className="h3" style={{ marginBottom: '1rem', color: '#d32f2f' }}>
                            {deleteConfirmation.isMenu ? 'Eliminare Menu?' : 'Eliminare?'}
                        </h3>
                        <p style={{ marginBottom: '1.5rem', color: '#666' }}>Sei sicuro di voler procedere?</p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button onClick={confirmDelete} className={`${styles.button} ${styles.btnPrimary}`} style={{ background: '#d32f2f' }}>Sì, Elimina</button>
                            <button onClick={() => setDeleteConfirmation({ isOpen: false, itemId: null, categoryId: null })} className={styles.button} style={{ background: '#f5f5f5', color: '#333' }}>Annulla</button>
                        </div>
                    </div>
                </div>
            )}
            {expandedImage && (
                <div className={styles.lightboxOverlay} onClick={() => setExpandedImage(null)}>
                    <img src={expandedImage} alt="Ingrandimento" style={{ maxHeight: '90vh', maxWidth: '90vw', borderRadius: '12px' }} onClick={(e) => e.stopPropagation()} />
                    <button style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer' }} onClick={() => setExpandedImage(null)}>×</button>
                </div>
            )}

            {/* Create Menu Modal */}
            {showCreateInput && (
                <div className={styles.lightboxOverlay} onClick={() => setShowCreateInput(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h3 className="h3" style={{ marginBottom: '1.5rem', color: '#1a237e' }}>Crea Nuovo Menu</h3>
                        <form onSubmit={(e) => { handleCreateMenu(e); setShowCreateInput(false); }}>
                            <input
                                autoFocus
                                placeholder="Nome del menu (es. Estivo 2024)"
                                value={newMenuName}
                                onChange={e => setNewMenuName(e.target.value)}
                                className={styles.formInput}
                                style={{ marginBottom: '1.5rem' }}
                            />
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateInput(false)}
                                    className={styles.button}
                                    style={{ background: '#f5f5f5', color: '#333' }}
                                >
                                    Annulla
                                </button>
                                <button
                                    type="submit"
                                    className={`${styles.button} ${styles.btnPrimary}`}
                                    disabled={(!isPremium && menus.length >= 1) || !newMenuName.trim()}
                                >
                                    Crea Menu
                                </button>
                            </div>
                            {!isPremium && menus.length >= 1 && (
                                <p style={{ color: '#d32f2f', marginTop: '1rem', fontSize: '0.9rem' }}>
                                    ⚠️ Hai raggiunto il limite di 1 menu per il piano Base. <br />
                                    Passa a Premium per menu illimitati o elimina quello esistente.
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className={styles.header}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className={styles.title}>I Tuoi Menu</h1>
                        <p className={styles.subtitle}>Crea e gestisci i menu digitali del tuo ristorante.</p>
                    </div>
                </div>
            </header>

            {/* Menu List */}
            <div className={styles.menuList}>
                <div
                    className={styles.newMenuCard}
                    onClick={() => setShowCreateInput(true)}
                >
                    <div className={styles.plusButton}>+</div>
                    <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Nuovo Menu</span>
                </div>
                {(showAllMenus ? menus : menus.slice(0, 2)).map(menu => (
                    <div key={menu.id}
                        className={`${styles.menuCard} ${selectedMenuId === menu.id ? styles.menuCardActive : ''}`}
                        onClick={() => setSelectedMenuId(menu.id)}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h3 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0' }}>{menu.name}</h3>
                            <button
                                onClick={(e) => { e.stopPropagation(); requestDelete(menu.id, null, false, true); }}
                                className={styles.btnDeleteCard}
                                title="Elimina Menu"
                            >
                                <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>×</span>
                            </button>
                        </div>

                        <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                            {menu._count.categories} Categorie
                        </div>

                        {menu.isActive ? (
                            <span className={styles.badge} style={{ background: '#4caf50', color: 'white' }}>PUBBLICO</span>
                        ) : (
                            <button
                                onClick={(e) => { e.stopPropagation(); handleActivateMenu(menu.id); }}
                                className={styles.btnSm}
                                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                            >
                                Pubblica
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {menus.length > 2 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                    <button
                        onClick={() => setShowAllMenus(!showAllMenus)}
                        className={styles.btnSm}
                        style={{ border: 'none', background: 'transparent', color: '#1a237e', fontSize: '1rem' }}
                    >
                        {showAllMenus ? '▲ Vedi Meno' : '▼ Vedi Tutti (' + (menus.length - 2) + ')'}
                    </button>
                </div>
            )}

            {selectedMenuId ? (
                <div className="animation-fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            {editingMenuId === selectedMenuId ? (
                                <form onSubmit={handleUpdateMenuName} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <input
                                        autoFocus
                                        value={editMenuName}
                                        onChange={e => setEditMenuName(e.target.value)}
                                        className={styles.formInput}
                                        style={{ fontSize: '1.2rem', padding: '0.4rem' }}
                                    />
                                    <button type="submit" className={`${styles.button} ${styles.btnPrimary}`} style={{ width: 'auto', padding: '0.5rem 1rem' }}>Salva</button>
                                    <button type="button" className={styles.btnSm} onClick={() => setEditingMenuId(null)}>Annulla</button>
                                </form>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <h2 className="h3" style={{ color: '#1a237e', marginBottom: '5px' }}>
                                        {menus.find(m => m.id === selectedMenuId)?.name}
                                    </h2>
                                </div>
                            )}

                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {/* Anteprima Menu removed */}
                        </div>
                    </div>

                    {/* Add Category Form */}
                    <div className={styles.card} style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                        <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <strong style={{ fontSize: '1.1rem' }}>Nuova Categoria</strong>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <input
                                    type="text"
                                    placeholder="Nome Categoria (es. Antipasti)"
                                    value={newCatData.name}
                                    onChange={e => setNewCatData({ ...newCatData, name: e.target.value })}
                                    className={styles.formInput}
                                    style={{ flex: 1 }}
                                />
                                <button type="submit" className={`${styles.button} ${styles.btnPrimary}`} style={{ width: 'auto' }}>+ Aggiungi</button>
                            </div>
                        </form>
                    </div>

                    <div className={styles.categoryList}>
                        {categories.map(cat => (
                            <div key={cat.id} className={styles.categoryCard}>
                                <div className={styles.categoryHeader}>
                                    {editingCatId === cat.id ? (
                                        <form onSubmit={(e) => handleUpdateCategory(e, cat.id)} style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <input value={editCatData.name} onChange={e => setEditCatData({ ...editCatData, name: e.target.value })} className={styles.formInput} autoFocus style={{ flex: 1 }} />
                                                <button type="submit" className={`${styles.button} ${styles.btnPrimary}`} style={{ padding: '0.5rem 1rem', width: 'auto' }}>Salva</button>
                                                <button type="button" className={styles.btnSm} onClick={() => setEditingCatId(null)}>Annulla</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                                            <h3 className={styles.categoryTitle}>{cat.name}</h3>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button className={styles.btnActionEdit} onClick={() => {
                                                    setEditingCatId(cat.id);
                                                    setActiveCatLang('it');
                                                    setEditCatData({
                                                        name: cat.name,
                                                        translations: cat.translations?.reduce((acc, t) => ({ ...acc, [t.language]: { name: t.name } }), {}) || {}
                                                    });
                                                }}>Modifica</button>
                                                <button className={styles.btnSmDanger} onClick={() => {
                                                    requestDelete(cat.id, cat.id, true, false);
                                                }}>Cancella</button>
                                            </div>
                                        </div>
                                    )}

                                    {!editingCatId && (
                                        <button className={styles.addItemBtn} onClick={() => setAddingItemTo(cat.id)}>
                                            + Aggiungi Piatto
                                        </button>
                                    )}
                                </div>

                                {/* ADD ITEM FORM */}
                                {addingItemTo === cat.id && (
                                    <div style={{ padding: '1.5rem', background: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                                        <form onSubmit={handleAddItem}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                <strong>Nuovo Piatto</strong>
                                                {/* LangTabs Removed */}
                                            </div>

                                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                                <input placeholder="Nome Piatto" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} required autoFocus className={styles.formInput} style={{ flex: 2 }} />
                                                <input placeholder="Prezzo €" type="number" step="0.5" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} className={styles.formInput} style={{ flex: 1 }} />
                                            </div>
                                            <textarea placeholder="Descrizione ingredienti..." value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} className={styles.formTextarea} style={{ minHeight: '80px', marginBottom: '1rem' }} />

                                            <div style={{ marginBottom: '1rem' }}>
                                                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Allergeni:</label>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
                                                    {Array.from({ length: 14 }, (_, i) => i + 1).map(num => (
                                                        <label key={num} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', cursor: 'pointer' }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={newItem.allergens.includes(num)}
                                                                onChange={e => {
                                                                    if (e.target.checked) setNewItem({ ...newItem, allergens: [...newItem.allergens, num] });
                                                                    else setNewItem({ ...newItem, allergens: newItem.allergens.filter(n => n !== num) });
                                                                }}
                                                            />
                                                            {num}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                                <button type="button" onClick={() => setAddingItemTo(null)} className={styles.btnSm}>Annulla</button>
                                                <button type="submit" className={`${styles.button} ${styles.btnPrimary}`} style={{ width: 'auto', padding: '0.5rem 1.5rem' }}>Salva Piatto</button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* ITEMS LIST */}
                                <div className={styles.itemsList}>
                                    {cat.items.map(item => (
                                        editingId === item.id ? (
                                            <div key={item.id} className={styles.itemRow} style={{ display: 'block' }}>
                                                <form onSubmit={(e) => handleUpdateItem(e, item.id)}>
                                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', marginTop: '1rem' }}>
                                                        <input value={editItemData.name} onChange={e => setEditItemData({ ...editItemData, name: e.target.value })} required className={styles.formInput} style={{ flex: 2 }} />
                                                        <input type="number" step="0.5" value={editItemData.price} onChange={e => setEditItemData({ ...editItemData, price: e.target.value })} className={styles.formInput} style={{ flex: 1 }} />
                                                    </div>
                                                    <textarea value={editItemData.description} onChange={e => setEditItemData({ ...editItemData, description: e.target.value })} className={styles.formTextarea} style={{ minHeight: '80px', marginBottom: '1rem' }} />

                                                    <div style={{ marginBottom: '1rem' }}>
                                                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Allergeni:</label>
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
                                                            {Array.from({ length: 14 }, (_, i) => i + 1).map(num => (
                                                                <label key={num} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', cursor: 'pointer' }}>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={editItemData.allergens.includes(num)}
                                                                        onChange={e => {
                                                                            if (e.target.checked) setEditItemData({ ...editItemData, allergens: [...editItemData.allergens, num] });
                                                                            else setEditItemData({ ...editItemData, allergens: editItemData.allergens.filter(n => n !== num) });
                                                                        }}
                                                                    />
                                                                    {num}
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                                        <button type="button" onClick={() => setEditingId(null)} className={styles.btnSm}>Annulla</button>
                                                        <button type="submit" className={`${styles.button} ${styles.btnPrimary}`} style={{ width: 'auto', padding: '0.4rem 1rem' }}>Salva</button>
                                                    </div>
                                                </form>
                                            </div>
                                        ) : (
                                            <div key={item.id} className={styles.itemRow}>
                                                {/* IMAGE SECTION */}
                                                <div style={{ marginRight: '1rem', position: 'relative' }}>
                                                    {item.imageUrl ? (
                                                        <div className={styles.itemImageContainer}>
                                                            <img
                                                                src={item.imageUrl}
                                                                alt={item.name}
                                                                className={styles.itemImage}
                                                                onClick={() => setExpandedImage(item.imageUrl!)}
                                                            />
                                                            {isPremium && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleQuickUpdate(item, { imageUrl: null });
                                                                    }}
                                                                    className={styles.btnDeletePhoto}
                                                                    title="Rimuovi Foto"
                                                                >
                                                                    ×
                                                                </button>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className={styles.itemImage} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '1.5rem' }}>
                                                            🍽️
                                                        </div>
                                                    )}

                                                    {isPremium && !item.imageUrl && (
                                                        <>
                                                            <input
                                                                type="file"
                                                                id={`file-input-${item.id}`}
                                                                style={{ display: 'none' }}
                                                                accept="image/*"
                                                                onChange={(e) => handleFileChange(e, item.id)}
                                                            />
                                                            <button
                                                                onClick={() => handleUploadClick(item.id)}
                                                                className={styles.iconBtn}
                                                                style={{
                                                                    position: 'absolute', bottom: '-5px', right: '-5px',
                                                                    background: 'white', border: '1px solid #ccc',
                                                                    width: '24px', height: '24px', fontSize: '0.8rem', padding: 0,
                                                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                                                }}
                                                                title="Carica Foto"
                                                            >
                                                                📷
                                                            </button>
                                                            {uploadingId === item.id && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>...</div>}
                                                        </>
                                                    )}
                                                </div>

                                                <div className={styles.itemInfo}>
                                                    <div className={styles.itemName}>{item.name}</div>
                                                    <div className={styles.itemDesc}>{item.description}</div>
                                                    <div className={styles.itemBadges}>
                                                        {item.isVegan && <span className={`${styles.badge} ${styles.badgeVegan}`}>Vegan</span>}
                                                        {item.allergens && (
                                                            (() => {
                                                                try {
                                                                    const nums = JSON.parse(item.allergens);
                                                                    if (Array.isArray(nums) && nums.length > 0) {
                                                                        return <span className={styles.badge} style={{ background: '#e0f7fa', color: '#006064', border: '1px solid #b2ebf2' }}>All: {nums.join(', ')}</span>;
                                                                    }
                                                                } catch (e) { }
                                                                return null;
                                                            })()
                                                        )}
                                                        {item.isVegetarian && <span className={`${styles.badge} ${styles.badgeVeg}`}>Veg</span>}
                                                        {item.spiciness > 0 && <span style={{ fontSize: '0.7rem' }}>{'🌶️'.repeat(item.spiciness)}</span>}
                                                    </div>
                                                </div>
                                                <div className={styles.itemPrice}>
                                                    {item.price !== null && Number(item.price) > 0 ? `€ ${Number(item.price).toFixed(2)}` : ''}
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button className={styles.btnActionEdit} title="Modifica" onClick={() => {
                                                        setEditingId(item.id);
                                                        setActiveItemLang('it');
                                                        let parsedAllergens: number[] = [];
                                                        try {
                                                            parsedAllergens = item.allergens ? JSON.parse(item.allergens) : [];
                                                        } catch (e) { console.error('Error parsing allergens', e); }

                                                        setEditItemData({
                                                            name: item.name,
                                                            description: item.description,
                                                            price: item.price !== null ? item.price.toString() : '',
                                                            isVegan: item.isVegan,
                                                            isGlutenFree: item.isGlutenFree,
                                                            isVegetarian: item.isVegetarian,
                                                            spiciness: item.spiciness,
                                                            allergens: parsedAllergens,
                                                            translations: item.translations?.reduce((acc, t) => ({ ...acc, [t.language]: { name: t.name, description: t.description } }), {}) || {}
                                                        });
                                                    }}>Modifica</button>
                                                    <button onClick={() => requestDelete(item.id, cat.id)} className={styles.btnSmDanger}>Cancella</button>
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#f8f9fa', borderRadius: '20px', border: '2px dashed #e0e0e0', color: '#757575' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#555' }}>Seleziona o crea un menu per iniziare</h3>
                    <p>Clicca su "+ Crea Menu" o seleziona una delle schede in alto.</p>
                </div>
            )}
        </div>
    );
}
