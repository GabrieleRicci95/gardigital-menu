'use client';

import { useState, useEffect } from 'react';
import styles from '../premium-dashboard.module.css';

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
    const [isDemo, setIsDemo] = useState(false);

    // Forms states
    const [newMenuName, setNewMenuName] = useState('');
    const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
    const [editMenuName, setEditMenuName] = useState('');

    // Category Form State
    const [newCatData, setNewCatData] = useState<{
        name: string;
    }>({ name: '' });

    const [editingCatId, setEditingCatId] = useState<string | null>(null);
    const [editCatData, setEditCatData] = useState<{
        name: string;
    }>({ name: '' });

    // Item Form State
    const [addingItemTo, setAddingItemTo] = useState<string | null>(null);
    const [newItem, setNewItem] = useState<{
        name: string; description: string; price: string;
        isVegan: boolean; isGlutenFree: boolean; isVegetarian: boolean; spiciness: number;
        allergens: number[];
    }>({
        name: '', description: '', price: '',
        isVegan: false, isGlutenFree: false, isVegetarian: false, spiciness: 0,
        allergens: []
    });

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editItemData, setEditItemData] = useState<{
        name: string; description: string; price: string;
        isVegan: boolean; isGlutenFree: boolean; isVegetarian: boolean; spiciness: number;
        allergens: number[];
    }>({
        name: '', description: '', price: '',
        isVegan: false, isGlutenFree: false, isVegetarian: false, spiciness: 0,
        allergens: []
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
                console.log("Session expired, redirecting...");
                window.location.href = '/login';
                return;
            }

            if (menuRes.ok) {
                const data = await menuRes.json();
                setMenus(data.menus || []);
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
                setIsDemo(!!data.isDemo);
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
        if (isDemo) return alert('Modalità Demo: modifiche non consentite');
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
                alert(`Errore del server (${res.status}): ${text.substring(0, 100)}`);
            }
        } catch (err) {
            console.error("Connection Error:", err);
            alert("Errore di connessione: " + (err instanceof Error ? err.message : String(err)));
        } finally {
            setLoading(false);
        }
    };

    const handleActivateMenu = async (menuId: string) => {
        if (isDemo) return alert('Modalità Demo: modifiche non consentite');
        const res = await fetch(`/api/menus/${menuId}/activate`, { method: 'POST' });
        if (res.ok) {
            setMenus(prev => prev.map(m => ({ ...m, isActive: m.id === menuId })));
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isDemo) return alert('Modalità Demo: modifiche non consentite');
        if (!newCatData.name || !selectedMenuId) return;

        const res = await fetch('/api/menu/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: newCatData.name,
                menuId: selectedMenuId,
            }),
        });

        if (res.ok) {
            setNewCatData({ name: '' });
            fetchCategories(selectedMenuId);
        }
    };

    const handleUpdateCategory = async (e: React.FormEvent, id: string) => {
        e.preventDefault();
        if (isDemo) return alert('Modalità Demo: modifiche non consentite');
        const res = await fetch('/api/menu/categories', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id,
                ...editCatData,
            }),
        });
        if (res.ok) {
            setEditingCatId(null);
            fetchCategories(selectedMenuId!);
        }
    }

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (isDemo) return alert('Modalità Demo: modifiche non consentite');
        if (!addingItemTo || !newItem.name) return;

        try {
            const res = await fetch('/api/menu/items', {
                method: 'POST',
                body: JSON.stringify({
                    ...newItem,
                    categoryId: addingItemTo,
                    allergens: JSON.stringify(newItem.allergens),
                }),
            });
            if (res.ok) {
                setNewItem({
                    name: '', description: '', price: '',
                    isVegan: false, isGlutenFree: false, isVegetarian: false, spiciness: 0,
                    allergens: [],
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
        if (isDemo) return alert('Modalità Demo: modifiche non consentite');
        const res = await fetch('/api/menu/items', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id,
                ...editItemData,
                allergens: JSON.stringify(editItemData.allergens),
                ...overrideData
            }),
        });
        if (res.ok) {
            setEditingId(null);
            if (selectedMenuId) fetchCategories(selectedMenuId);
        }
    };

    const handleQuickUpdate = async (item: MenuItem, updates: any) => {
        if (isDemo) return alert('Modalità Demo: modifiche non consentite');
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
        if (isDemo) return alert('Modalità Demo: modifiche non consentite');
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
                alert("Errore durante l'eliminazione del menu");
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

    const handleUploadClick = (itemId: string) => {
        if (isDemo) return alert('Modalità Demo: caricamento non consentito');
        document.getElementById(`file-input-${itemId}`)?.click();
    };

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
        if (isDemo) return alert('Modalità Demo: modifiche non consentite');
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

    return (
        <div className={styles.container}>
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
                                className={styles.input}
                                style={{ marginBottom: '1.5rem' }}
                            />
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setShowCreateInput(false)} className={styles.btnSecondary}>Annulla</button>
                                <button type="submit" className={styles.btnPrimary} disabled={isDemo || (!isPremium && menus.length >= 1) || !newMenuName.trim()}>
                                    {isDemo ? 'Disabilitato (Demo)' : 'Crea Menu'}
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

            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>I Tuoi Menu</h1>
                    <p className={styles.subtitle}>Crea e gestisci i menu digitali del tuo ristorante.</p>
                </div>
            </header>

            <div className={styles.grid}>
                <div
                    className={styles.card}
                    onClick={() => {
                        if (isDemo) return alert('Modalità Demo: modifiche non consentite');
                        setShowCreateInput(true);
                    }}
                    style={{
                        cursor: isDemo ? 'not-allowed' : 'pointer',
                        border: '2px dashed #e5e7eb',
                        boxShadow: 'none',
                        background: 'transparent',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '200px',
                        opacity: isDemo ? 0.6 : 1
                    }}
                >
                    <div style={{ fontSize: '3rem', color: '#1a1a1a', fontWeight: '300' }}>+</div>
                    <span style={{ fontWeight: 600, color: '#1a1a1a', fontSize: '1.2rem' }}>
                        {isDemo ? 'Bloccato (Demo)' : 'Nuovo Menu'}
                    </span>
                </div>
                {(showAllMenus ? menus : menus.slice(0, 2)).map(menu => (
                    <div key={menu.id}
                        className={styles.card}
                        style={{ border: selectedMenuId === menu.id ? '2px solid #1a1a1a' : 'none', cursor: 'pointer' }}
                        onClick={() => setSelectedMenuId(menu.id)}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0', fontFamily: 'var(--font-playfair, serif)', fontWeight: '700' }}>{menu.name}</h3>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (isDemo) return alert('Modalità Demo: modifiche non consentite');
                                    requestDelete(menu.id, null, false, true);
                                }}
                                className={styles.btnLink}
                                title={isDemo ? "Eliminazione non consentita in Demo" : "Elimina Menu"}
                                style={{ fontSize: '1.5rem', lineHeight: 1, padding: 0 }}
                                disabled={isDemo}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem', fontFamily: 'var(--font-inter, sans-serif)' }}>
                            {menu._count.categories} Categorie
                        </div>

                        {menu.isActive ? (
                            <span className={`${styles.badge} ${styles.badgeSuccess}`}>PUBBLICO</span>
                        ) : (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (isDemo) return alert('Modalità Demo: modifiche non consentite');
                                    handleActivateMenu(menu.id);
                                }}
                                className={styles.btnSecondary}
                                style={{
                                    fontSize: '0.8rem',
                                    padding: '0.4rem 0.8rem',
                                    width: 'fit-content',
                                    cursor: isDemo ? 'not-allowed' : 'pointer',
                                    opacity: isDemo ? 0.6 : 1
                                }}
                                disabled={isDemo}
                            >
                                {isDemo ? 'Privato (Demo)' : 'Pubblica'}
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {menus.length > 2 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', marginTop: '1rem' }}>
                    <button onClick={() => setShowAllMenus(!showAllMenus)} className={styles.btnLink}>
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
                                        className={styles.input}
                                        style={{ fontSize: '1.2rem', padding: '0.4rem' }}
                                    />
                                    <button type="submit" className={styles.btnPrimary} style={{ width: 'auto', padding: '0.5rem 1rem' }} disabled={isDemo}>Salva</button>
                                    <button type="button" className={styles.btnSecondary} onClick={() => setEditingMenuId(null)}>Annulla</button>
                                </form>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <h2 className="h3" style={{ color: '#1a1a1a', marginBottom: '5px', fontFamily: 'var(--font-playfair, serif)' }}>
                                        {menus.find(m => m.id === selectedMenuId)?.name}
                                    </h2>
                                </div>
                            )}

                        </div>
                    </div>

                    <div className={styles.card} style={{ marginBottom: '2rem', padding: '1.5rem', minHeight: 'auto' }}>
                        <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <strong style={{ fontSize: '1.1rem' }}>Nuova Categoria</strong>
                            </div>

                            <div className={styles.newCategoryForm} style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="text"
                                    placeholder="Nome Categoria (es. Antipasti)"
                                    value={newCatData.name}
                                    onChange={e => !isDemo && setNewCatData({ ...newCatData, name: e.target.value })}
                                    className={styles.input}
                                    style={{ flex: 1 }}
                                    readOnly={isDemo}
                                />
                                <button type="submit" className={styles.btnPrimary} style={{ width: 'auto' }} disabled={isDemo}>
                                    {isDemo ? 'Bloccato' : '+ Aggiungi'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className={styles.grid} style={{ gridTemplateColumns: 'minmax(0, 1fr)' }}>
                        {categories.map(cat => (
                            <div key={cat.id} className={styles.card} style={{ gap: '0' }}>
                                <div className={styles.categoryHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1rem' }}>
                                    {editingCatId === cat.id ? (
                                        <form onSubmit={(e) => handleUpdateCategory(e, cat.id)} style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <input value={editCatData.name} onChange={e => setEditCatData({ ...editCatData, name: e.target.value })} className={styles.input} autoFocus style={{ flex: 1 }} />
                                                <button type="submit" className={styles.btnPrimary} style={{ padding: '0.5rem 1rem', width: 'auto' }} disabled={isDemo}>Salva</button>
                                                <button type="button" className={styles.btnSecondary} onClick={() => setEditingMenuId(null)}>Annulla</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, justifyContent: 'space-between' }}>
                                            <h3 style={{ margin: 0, fontSize: '1.3rem', fontFamily: 'var(--font-playfair, serif)' }}>{cat.name}</h3>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    className={styles.btnSecondary}
                                                    style={{
                                                        width: '100px',
                                                        justifyContent: 'center',
                                                        cursor: isDemo ? 'not-allowed' : 'pointer',
                                                        opacity: isDemo ? 0.6 : 1
                                                    }}
                                                    disabled={isDemo}
                                                    onClick={() => {
                                                        if (isDemo) return;
                                                        setEditingCatId(cat.id);
                                                        setEditCatData({
                                                            name: cat.name,
                                                        });
                                                    }}
                                                >
                                                    {isDemo ? 'Inibito' : 'Modifica'}
                                                </button>
                                                <button className={styles.btnDanger} style={{ width: '100px', justifyContent: 'center' }} disabled={isDemo} onClick={() => {
                                                    if (isDemo) return;
                                                    requestDelete(cat.id, cat.id, true, false);
                                                }}>Cancella</button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {!editingCatId && (
                                    <button
                                        onClick={() => !isDemo && setAddingItemTo(cat.id)}
                                        style={{
                                            marginBottom: '1.5rem',
                                            width: '100%',
                                            background: '#f0f9ff',
                                            color: '#0369a1',
                                            border: '1px dashed #bae6fd',
                                            padding: '12px',
                                            borderRadius: '10px',
                                            cursor: isDemo ? 'not-allowed' : 'pointer',
                                            fontWeight: '600',
                                            fontSize: '0.95rem',
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            opacity: isDemo ? 0.6 : 1
                                        }}
                                        onMouseEnter={(e) => !isDemo && (e.currentTarget.style.background = '#e0f2fe')}
                                        onMouseLeave={(e) => !isDemo && (e.currentTarget.style.background = '#f0f9ff')}
                                        disabled={isDemo}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                        {isDemo ? 'Aggiunta disabilitata (Demo)' : 'Aggiungi Piatto'}
                                    </button>
                                )}

                                {addingItemTo === cat.id && (
                                    <div style={{ padding: '1.5rem', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '1.5rem' }}>
                                        <form onSubmit={handleAddItem}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                <strong style={{ fontFamily: 'var(--font-playfair, serif)', fontSize: '1.1rem' }}>Nuovo Piatto</strong>
                                            </div>

                                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                                <input placeholder="Nome Piatto" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} required autoFocus className={styles.input} style={{ flex: 2 }} />
                                                <input placeholder="Prezzo €" type="number" step="0.5" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} onWheel={(e) => (e.target as HTMLInputElement).blur()} className={styles.input} style={{ flex: 1 }} />
                                            </div>
                                            <textarea placeholder="Descrizione ingredienti..." value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} className={styles.input} style={{ minHeight: '80px', marginBottom: '1rem', resize: 'vertical' }} />

                                            <div style={{ marginBottom: '1rem' }}>
                                                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Allergeni:</label>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))', gap: '0.5rem' }}>
                                                    {Array.from({ length: 14 }, (_, i) => i + 1).map(num => (
                                                        <label key={num} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', cursor: 'pointer', padding: '4px', borderRadius: '4px', background: newItem.allergens.includes(num) ? '#e0f2fe' : 'transparent', border: '1px solid transparent', borderColor: newItem.allergens.includes(num) ? '#3b82f6' : 'transparent' }}>
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
                                                <button type="button" onClick={() => setAddingItemTo(null)} className={styles.btnSecondary}>Annulla</button>
                                                <button type="submit" className={styles.btnPrimary} style={{ width: 'auto', padding: '0.5rem 1.5rem' }} disabled={isDemo}>
                                                    {isDemo ? 'Bloccato' : 'Salva Piatto'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {cat.items.map(item => (
                                        editingId === item.id ? (
                                            <div key={item.id} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#fff' }}>
                                                <form onSubmit={(e) => handleUpdateItem(e, item.id)}>
                                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', marginTop: '1rem' }}>
                                                        <input value={editItemData.name} onChange={e => setEditItemData({ ...editItemData, name: e.target.value })} required className={styles.input} style={{ flex: 2 }} />
                                                        <input type="number" step="0.5" value={editItemData.price} onChange={e => setEditItemData({ ...editItemData, price: e.target.value })} onWheel={(e) => (e.target as HTMLInputElement).blur()} className={styles.input} style={{ flex: 1 }} />
                                                    </div>
                                                    <textarea value={editItemData.description} onChange={e => setEditItemData({ ...editItemData, description: e.target.value })} className={styles.input} style={{ minHeight: '80px', marginBottom: '1rem', resize: 'vertical' }} />

                                                    <div style={{ marginBottom: '1rem' }}>
                                                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Allergeni:</label>
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))', gap: '0.5rem' }}>
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
                                                        <button type="button" onClick={() => setEditingId(null)} className={styles.btnSecondary}>Annulla</button>
                                                        <button type="submit" className={styles.btnPrimary} style={{ width: 'auto', padding: '0.4rem 1rem' }} disabled={isDemo}>Salva</button>
                                                    </div>
                                                </form>
                                            </div>
                                        ) : (
                                            <div key={item.id} style={{ display: 'flex', gap: '1.5rem', padding: '1rem', borderBottom: '1px solid #f3f4f6', alignItems: 'flex-start' }}>
                                                <div style={{ marginRight: '0', position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
                                                    {item.imageUrl ? (
                                                        <div style={{ width: '100%', height: '100%', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                                                            <img
                                                                src={item.imageUrl}
                                                                alt={item.name}
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                                                                onClick={() => setExpandedImage(item.imageUrl!)}
                                                            />
                                                            {isPremium && !isDemo && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleQuickUpdate(item, { imageUrl: null });
                                                                    }}
                                                                    style={{
                                                                        position: 'absolute', top: 0, right: 0, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                                    }}
                                                                    title="Rimuovi Foto"
                                                                >
                                                                    ×
                                                                </button>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div style={{ width: '100%', height: '100%', background: '#f3f4f6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                                                            🍽️
                                                        </div>
                                                    )}

                                                    {isPremium && !isDemo && !item.imageUrl && (
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
                                                                style={{
                                                                    position: 'absolute', bottom: '-5px', right: '-5px',
                                                                    background: 'white', border: '1px solid #ccc', borderRadius: '50%',
                                                                    width: '28px', height: '28px', fontSize: '1rem', padding: 0,
                                                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                                }}
                                                                title="Carica Foto"
                                                            >
                                                                +
                                                            </button>
                                                            {uploadingId === item.id && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>...</div>}
                                                        </>
                                                    )}
                                                </div>

                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.2rem', color: '#1f2937' }}>{item.name}</div>
                                                    <div style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: '0.5rem', lineHeight: '1.4' }}>{item.description}</div>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                        {item.isVegan && <span className={`${styles.badge} ${styles.badgeSuccess}`} style={{ fontSize: '0.7rem' }}>VEGAN</span>}
                                                        {item.allergens && (
                                                            (() => {
                                                                try {
                                                                    const nums = JSON.parse(item.allergens);
                                                                    if (Array.isArray(nums) && nums.length > 0) {
                                                                        return <span className={styles.badge} style={{ background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', fontSize: '0.7rem' }}>All: {nums.join(', ')}</span>;
                                                                    }
                                                                } catch (e) { }
                                                                return null;
                                                            })()
                                                        )}
                                                        {item.isVegetarian && <span className={`${styles.badge} ${styles.badgeSuccess}`} style={{ background: '#f0fdf4', color: '#15803d', fontSize: '0.7rem' }}>VEG</span>}
                                                        {item.spiciness > 0 && <span style={{ fontSize: '0.8rem' }}>{'🌶️'.repeat(item.spiciness)}</span>}
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                                    <div style={{ fontWeight: '600', fontSize: '1.1rem', color: '#1a1a1a' }}>
                                                        {item.price !== null && Number(item.price) > 0 ? `€ ${Number(item.price).toFixed(2)}` : ''}
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button className={styles.btnSecondary} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} disabled={isDemo} onClick={() => {
                                                            if (isDemo) return;
                                                            setEditingId(item.id);
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
                                                            });
                                                        }}>Modifica</button>
                                                        <button onClick={() => {
                                                            if (isDemo) return alert('Modalità Demo: modifiche non consentite');
                                                            requestDelete(item.id, cat.id);
                                                        }} className={styles.btnDanger} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} disabled={isDemo}>Cancella</button>
                                                    </div>
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
                <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#f8f9fa', borderRadius: '20px', border: '2px dashed #e0e0e0', color: '#757575', marginTop: '2.5rem' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#555' }}>Seleziona o crea un menu per iniziare</h3>
                    <p>Clicca su "+ Crea Menu" o seleziona una delle schede in alto.</p>
                </div>
            )}
        </div>
    );
}
