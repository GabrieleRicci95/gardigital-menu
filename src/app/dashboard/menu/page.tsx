'use client';

import { useState, useEffect } from 'react';
import styles from './menu.module.css';

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
    const [uploadingId, setUploadingId] = useState<string | null>(null);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);
    const [showCreateInput, setShowCreateInput] = useState(false);

    // Forms states
    const [newMenuName, setNewMenuName] = useState('');

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
        translations: Record<string, { name: string; description: string }>;
    }>({
        name: '', description: '', price: '',
        isVegan: false, isGlutenFree: false, isVegetarian: false, spiciness: 0,
        translations: {}
    });

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editItemData, setEditItemData] = useState<{
        name: string; description: string; price: string;
        isVegan: boolean; isGlutenFree: boolean; isVegetarian: boolean; spiciness: number;
        translations: Record<string, { name: string; description: string }>;
    }>({
        name: '', description: '', price: '',
        isVegan: false, isGlutenFree: false, isVegetarian: false, spiciness: 0,
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
        const [menuRes, restRes] = await Promise.all([
            fetch(`/api/menus?t=${t}`),
            fetch(`/api/restaurant?t=${t}`)
        ]);

        if (menuRes.ok) {
            const data = await menuRes.json();
            setMenus(data.menus || []);
            // Auto-select first menu if exists
            if (data.menus && data.menus.length > 0 && !selectedMenuId) {
                setSelectedMenuId(data.menus[0].id);
            }
        }

        if (restRes.ok) {
            const data = await restRes.json();
            setSubscription(data.restaurant?.subscription);
        }
        setLoading(false);
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
                    setMenus([data, ...menus]);
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
        if (!addingItemTo || !newItem.name || !newItem.price) return;

        try {
            const res = await fetch('/api/menu/items', {
                method: 'POST',
                body: JSON.stringify({
                    ...newItem,
                    categoryId: addingItemTo,
                    translations: Object.entries(newItem.translations).map(([lang, t]) => ({ language: lang, ...t }))
                }),
            });
            if (res.ok) {
                setNewItem({
                    name: '', description: '', price: '',
                    isVegan: false, isGlutenFree: false, isVegetarian: false, spiciness: 0,
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

    const handleUpdateItem = async (e: React.FormEvent, id: string) => {
        e.preventDefault();
        const res = await fetch('/api/menu/items', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id,
                ...editItemData,
                translations: Object.entries(editItemData.translations).map(([lang, t]) => ({ language: lang, ...t }))
            }),
        });
        if (res.ok) {
            setEditingId(null);
            if (selectedMenuId) fetchCategories(selectedMenuId);
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
                console.error("Delete failed:", err);
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

    if (loading) return <div className="p-4">Caricamento Menu...</div>;
    const isPremium = subscription?.plan === 'PREMIUM' && subscription?.status === 'ACTIVE';

    // Helper for Language Tabs
    const LangTabs = ({ active, setActive }: { active: string, setActive: (l: string) => void }) => (
        <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
            {LANGUAGES.map(lang => (
                <button
                    key={lang.code}
                    type="button"
                    onClick={() => setActive(lang.code)}
                    style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        background: active === lang.code ? '#e3f2fd' : 'white',
                        fontWeight: active === lang.code ? 'bold' : 'normal',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                    }}
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
                <div className={styles.lightboxOverlay}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', textAlign: 'center', maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ marginBottom: '1rem', color: '#d32f2f' }}>
                            {deleteConfirmation.isMenu ? 'Eliminare Menu?' : 'Eliminare?'}
                        </h3>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button onClick={confirmDelete} className="btn btn-primary" style={{ background: '#d32f2f' }}>Sì, Elimina</button>
                            <button onClick={() => setDeleteConfirmation({ isOpen: false, itemId: null, categoryId: null })} className="btn">Annulla</button>
                        </div>
                    </div>
                </div>
            )}
            {expandedImage && (
                <div className={styles.lightboxOverlay} onClick={() => setExpandedImage(null)}>
                    <img src={expandedImage} alt="Ingrandimento" className={styles.lightboxImage} onClick={(e) => e.stopPropagation()} />
                    <button style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'white', fontSize: '2rem' }} onClick={() => setExpandedImage(null)}>×</button>
                </div>
            )}



            {/* Create Menu Modal */}
            {showCreateInput && (
                <div className={styles.lightboxOverlay} onClick={() => setShowCreateInput(false)}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', minWidth: '350px' }} onClick={e => e.stopPropagation()}>
                        <h3 className="h3" style={{ marginBottom: '1.5rem', color: '#1a237e' }}>Crea Nuovo Menu</h3>
                        <form onSubmit={(e) => { handleCreateMenu(e); setShowCreateInput(false); }}>
                            <input
                                autoFocus
                                placeholder="Nome del menu (es. Estivo 2024)"
                                value={newMenuName}
                                onChange={e => setNewMenuName(e.target.value)}
                                className={styles.input}
                                style={{ width: '100%', marginBottom: '1.5rem', fontSize: '1.1rem', padding: '12px' }}
                            />
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateInput(false)}
                                    className="btn"
                                    style={{ background: '#f5f5f5', color: '#333' }}
                                >
                                    Annulla
                                </button>
                                <button
                                    type="submit"
                                    className={styles.primaryBtn}
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

            {/* Menu Header */}
            <div style={{ padding: '0 0 2rem 0', borderBottom: '1px solid #eee', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h1 className={styles.headerTitle}>I Tuoi Menu</h1>
                    <div className={styles.actions}>
                        <button
                            onClick={() => setShowCreateInput(true)}
                            className={styles.primaryBtn}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Crea Menu
                        </button>


                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                    {menus.map(menu => (
                        <div key={menu.id} onClick={() => setSelectedMenuId(menu.id)}
                            style={{
                                position: 'relative',
                                padding: '1rem', borderRadius: '8px',
                                border: selectedMenuId === menu.id ? '2px solid #1a237e' : '1px solid #ddd',
                                background: selectedMenuId === menu.id ? '#e8eaf6' : 'white',
                                minWidth: '200px', cursor: 'pointer'
                            }}
                        >
                            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{menu.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>{menu._count.categories} Categorie</div>
                            {menu.isActive ? (
                                <span style={{ display: 'inline-block', marginTop: '10px', background: '#4caf50', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem' }}>PUBBLICO</span>
                            ) : (
                                <button onClick={(e) => { e.stopPropagation(); handleActivateMenu(menu.id); }} style={{ marginTop: '10px', background: 'transparent', border: '1px solid #ccc', borderRadius: '12px', padding: '2px 8px', fontSize: '0.7rem', cursor: 'pointer' }}>Rendi Pubblico</button>
                            )}
                            <button
                                onClick={(e) => { e.stopPropagation(); requestDelete(menu.id, null, false, true); }}
                                style={{
                                    position: 'absolute', top: '2px', right: '5px',
                                    background: 'transparent', color: '#000000', border: 'none',
                                    width: '24px', height: '24px',
                                    cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    lineHeight: 1
                                }}
                                title="Elimina Menu"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {selectedMenuId ? (
                <>
                    <h2 className="h3" style={{ marginBottom: '1rem', color: '#1a237e' }}>
                        Modifica: {menus.find(m => m.id === selectedMenuId)?.name}
                    </h2>

                    {/* Add Category Form with Multilang */}
                    <div className={styles.addCategory}>
                        <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '500px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <strong>Nuova Categoria</strong>
                                <LangTabs active={activeCatLang} setActive={setActiveCatLang} />
                            </div>

                            {activeCatLang === 'it' ? (
                                <input
                                    type="text"
                                    placeholder="Nome Categoria (es. Antipasti)"
                                    value={newCatData.name}
                                    onChange={e => setNewCatData({ ...newCatData, name: e.target.value })}
                                    className={styles.input}
                                />
                            ) : (
                                <input
                                    type="text"
                                    placeholder={`Nome Categoria (${activeCatLang})`}
                                    value={newCatData.translations[activeCatLang]?.name || ''}
                                    onChange={e => setNewCatData({
                                        ...newCatData,
                                        translations: {
                                            ...newCatData.translations,
                                            [activeCatLang]: { name: e.target.value }
                                        }
                                    })}
                                    className={styles.input}
                                />
                            )}
                            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Aggiungi Categoria</button>
                        </form>
                    </div>

                    <div className={styles.categoriesList}>
                        {categories.map(cat => (
                            <div key={cat.id} className={styles.categoryCard}>
                                <div className={styles.categoryHeader}>
                                    {editingCatId === cat.id ? (
                                        <form onSubmit={(e) => handleUpdateCategory(e, cat.id)} style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                                            <LangTabs active={activeCatLang} setActive={setActiveCatLang} />
                                            {activeCatLang === 'it' ? (
                                                <input value={editCatData.name} onChange={e => setEditCatData({ ...editCatData, name: e.target.value })} className={styles.input} autoFocus />
                                            ) : (
                                                <input
                                                    value={editCatData.translations[activeCatLang]?.name || ''}
                                                    onChange={e => setEditCatData({
                                                        ...editCatData,
                                                        translations: { ...editCatData.translations, [activeCatLang]: { name: e.target.value } }
                                                    })}
                                                    className={styles.input}
                                                    placeholder={`Nome (${activeCatLang})`}
                                                />
                                            )}
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button type="submit" className="btn btn-primary btn-sm">Salva</button>
                                                <button type="button" className="btn btn-sm" onClick={() => setEditingCatId(null)}>Annulla</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                                            <h3>{cat.name}</h3>
                                            <button className={styles.iconBtn} onClick={() => {
                                                setEditingCatId(cat.id);
                                                setActiveCatLang('it');
                                                setEditCatData({
                                                    name: cat.name,
                                                    translations: cat.translations?.reduce((acc, t) => ({ ...acc, [t.language]: { name: t.name } }), {}) || {}
                                                });
                                            }}>✏️</button>
                                            <button className={styles.iconBtn} onClick={() => {
                                                requestDelete(cat.id, cat.id, true, false);
                                            }} style={{ color: '#d32f2f' }}>🗑️</button>
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
                                    <form onSubmit={handleAddItem} className={styles.itemForm}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <strong>Nuovo Piatto</strong>
                                            <LangTabs active={activeItemLang} setActive={setActiveItemLang} />
                                        </div>

                                        {activeItemLang === 'it' ? (
                                            <>
                                                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                                    <input placeholder="Nome" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} required autoFocus style={{ flex: 1 }} />
                                                    <input placeholder="€" type="number" step="0.5" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} required style={{ width: '80px' }} />
                                                </div>
                                                <textarea placeholder="Descrizione" value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} style={{ width: '100%', marginBottom: '10px' }} />
                                            </>
                                        ) : (
                                            <>
                                                <div style={{ marginBottom: '5px', fontSize: '0.8rem', color: '#666' }}>Traduzione {LANGUAGES.find(l => l.code === activeItemLang)?.label}</div>
                                                <input
                                                    placeholder={`Nome (${activeItemLang})`}
                                                    value={newItem.translations[activeItemLang]?.name || ''}
                                                    onChange={e => setNewItem({
                                                        ...newItem,
                                                        translations: {
                                                            ...newItem.translations,
                                                            [activeItemLang]: { ...newItem.translations[activeItemLang], name: e.target.value, description: newItem.translations[activeItemLang]?.description || '' }
                                                        }
                                                    })}
                                                    style={{ width: '100%', marginBottom: '10px' }}
                                                />
                                                <textarea
                                                    placeholder={`Descrizione (${activeItemLang})`}
                                                    value={newItem.translations[activeItemLang]?.description || ''}
                                                    onChange={e => setNewItem({
                                                        ...newItem,
                                                        translations: {
                                                            ...newItem.translations,
                                                            [activeItemLang]: { ...newItem.translations[activeItemLang], description: e.target.value, name: newItem.translations[activeItemLang]?.name || '' }
                                                        }
                                                    })}
                                                    style={{ width: '100%', marginBottom: '10px' }}
                                                />
                                            </>
                                        )}

                                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem' }}><input type="checkbox" checked={newItem.isVegan} onChange={e => setNewItem({ ...newItem, isVegan: e.target.checked })} /> Vegan</label>
                                            <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem' }}><input type="checkbox" checked={newItem.isGlutenFree} onChange={e => setNewItem({ ...newItem, isGlutenFree: e.target.checked })} /> GF</label>
                                            <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem' }}><input type="checkbox" checked={newItem.isVegetarian} onChange={e => setNewItem({ ...newItem, isVegetarian: e.target.checked })} /> Veg</label>
                                            <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem' }}>🌶️ <input type="number" min="0" max="3" value={newItem.spiciness} onChange={e => setNewItem({ ...newItem, spiciness: parseInt(e.target.value) })} style={{ width: '40px', marginLeft: '5px' }} /></label>
                                        </div>
                                        <div className={styles.formActions}>
                                            <button type="submit" className="btn btn-primary btn-sm">Salva</button>
                                            <button type="button" onClick={() => setAddingItemTo(null)} className="btn btn-sm">Annulla</button>
                                        </div>
                                    </form>
                                )}

                                {/* ITEMS LIST */}
                                <div className={styles.itemsList}>

                                    {cat.items.map(item => (
                                        editingId === item.id ? (
                                            <div key={item.id} className={styles.itemRow} style={{ display: 'block' }}>
                                                {/* ... Edit Form (Unchanged for now) ... */}
                                                <form onSubmit={(e) => handleUpdateItem(e, item.id)}>
                                                    <LangTabs active={activeItemLang} setActive={setActiveItemLang} />

                                                    {activeItemLang === 'it' ? (
                                                        <>
                                                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                                                <input value={editItemData.name} onChange={e => setEditItemData({ ...editItemData, name: e.target.value })} required style={{ flex: 1 }} />
                                                                <input type="number" step="0.5" value={editItemData.price} onChange={e => setEditItemData({ ...editItemData, price: e.target.value })} required style={{ width: '80px' }} />
                                                            </div>
                                                            <textarea value={editItemData.description} onChange={e => setEditItemData({ ...editItemData, description: e.target.value })} style={{ width: '100%', marginBottom: '10px' }} />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div style={{ marginBottom: '5px', fontSize: '0.8rem', color: '#666' }}>Traduzione {LANGUAGES.find(l => l.code === activeItemLang)?.label}</div>
                                                            <input
                                                                placeholder={`Nome (${activeItemLang})`}
                                                                value={editItemData.translations?.[activeItemLang]?.name || ''}
                                                                onChange={e => setEditItemData({
                                                                    ...editItemData,
                                                                    translations: {
                                                                        ...editItemData.translations,
                                                                        [activeItemLang]: { ...editItemData.translations[activeItemLang], name: e.target.value, description: editItemData.translations[activeItemLang]?.description || '' }
                                                                    }
                                                                })}
                                                                style={{ width: '100%', marginBottom: '10px' }}
                                                            />
                                                            <textarea
                                                                placeholder={`Descrizione (${activeItemLang})`}
                                                                value={editItemData.translations?.[activeItemLang]?.description || ''}
                                                                onChange={e => setEditItemData({
                                                                    ...editItemData,
                                                                    translations: {
                                                                        ...editItemData.translations,
                                                                        [activeItemLang]: { ...editItemData.translations[activeItemLang], description: e.target.value, name: editItemData.translations[activeItemLang]?.name || '' }
                                                                    }
                                                                })}
                                                                style={{ width: '100%', marginBottom: '10px' }}
                                                            />
                                                        </>
                                                    )}

                                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                                        <label><input type="checkbox" checked={editItemData.isVegan} onChange={e => setEditItemData({ ...editItemData, isVegan: e.target.checked })} /> Vegan</label>
                                                        <label><input type="checkbox" checked={editItemData.isGlutenFree} onChange={e => setEditItemData({ ...editItemData, isGlutenFree: e.target.checked })} /> GF</label>
                                                        <label><input type="checkbox" checked={editItemData.isVegetarian} onChange={e => setEditItemData({ ...editItemData, isVegetarian: e.target.checked })} /> Veg</label>
                                                        <label>🌶️ <input type="number" min="0" max="3" value={editItemData.spiciness} onChange={e => setEditItemData({ ...editItemData, spiciness: parseInt(e.target.value) })} style={{ width: '40px' }} /></label>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                        <button type="submit" className="btn btn-primary btn-sm">Salva</button>
                                                        <button type="button" onClick={() => setEditingId(null)} className="btn btn-sm">Annulla</button>
                                                    </div>
                                                </form>
                                            </div>
                                        ) : (
                                            <div key={item.id} className={styles.itemRow}>
                                                {/* IMAGE SECTION */}
                                                <div style={{ marginRight: '15px', position: 'relative' }}>
                                                    {item.imageUrl ? (
                                                        <img
                                                            src={item.imageUrl}
                                                            alt={item.name}
                                                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }}
                                                            onClick={() => setExpandedImage(item.imageUrl!)}
                                                        />
                                                    ) : (
                                                        <div style={{ width: '60px', height: '60px', background: '#eee', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                                                            🍽️
                                                        </div>
                                                    )}

                                                    {isPremium && (
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
                                                                    background: 'white', border: '1px solid #ccc', borderRadius: '50%',
                                                                    width: '24px', height: '24px', fontSize: '0.8rem', padding: 0,
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                                }}
                                                                title="Carica Foto"
                                                            >
                                                                📷
                                                            </button>
                                                            {uploadingId === item.id && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>...</div>}
                                                        </>
                                                    )}
                                                </div>

                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                                                    <div style={{ fontSize: '0.9rem', color: '#666' }}>{item.description}</div>
                                                    <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                                                        {item.isVegan && <span style={{ fontSize: '0.7rem', padding: '2px 4px', background: '#e8f5e9', color: '#2e7d32', borderRadius: '4px' }}>Vegan</span>}
                                                        {item.isGlutenFree && <span style={{ fontSize: '0.7rem', padding: '2px 4px', background: '#fff3e0', color: '#ef6c00', borderRadius: '4px' }}>GF</span>}
                                                        {item.isVegetarian && <span style={{ fontSize: '0.7rem', padding: '2px 4px', background: '#f3e5f5', color: '#7b1fa2', borderRadius: '4px' }}>Veg</span>}
                                                        {item.spiciness > 0 && <span style={{ fontSize: '0.7rem' }}>{'🌶️'.repeat(item.spiciness)}</span>}
                                                    </div>
                                                </div>
                                                <div style={{ fontWeight: 'bold' }}>€ {Number(item.price).toFixed(2)}</div>
                                                <div>
                                                    <button className={styles.iconBtn} title="Modifica" onClick={() => {
                                                        setEditingId(item.id);
                                                        setActiveItemLang('it');
                                                        setEditItemData({
                                                            name: item.name,
                                                            description: item.description,
                                                            price: item.price.toString(),
                                                            isVegan: item.isVegan,
                                                            isGlutenFree: item.isGlutenFree,
                                                            isVegetarian: item.isVegetarian,
                                                            spiciness: item.spiciness,
                                                            translations: item.translations?.reduce((acc, t) => ({ ...acc, [t.language]: { name: t.name, description: t.description } }), {}) || {}
                                                        });
                                                    }}>✏️</button>
                                                    <button onClick={() => requestDelete(item.id, cat.id)} className={styles.deleteBtn}>×</button>
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                    Seleziona un menu per iniziare a modificarlo.
                </div>
            )}
        </div>
    );
}
