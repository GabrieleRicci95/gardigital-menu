'use client';

import { useState, useEffect } from 'react';
import { Pencil, X, GripVertical, Plus, Camera, Trash2, Eye, Wine, Utensils, ChevronRight } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import styles from '../restaurant-dashboard.module.css';
import menuStyles from './menu.module.css';

interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number | null;
    imageUrl?: string | null;
    isVegan: boolean;
    isGlutenFree: boolean;
    isVegetarian: boolean;
    spiciness: number;
    priceUnit?: string | null;
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

// ---- Sortable Category Wrapper ----
function SortableCategory({ cat, children }: { cat: Category; children: (dragHandleProps: any) => React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cat.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 999 : 'auto',
    };
    return (
        <div ref={setNodeRef} style={style}>
            {children({ ...attributes, ...listeners })}
        </div>
    );
}

export default function MenuPage() {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploadingId, setUploadingId] = useState<string | null>(null);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);
    const [isDemo, setIsDemo] = useState(false);

    const [newMenuName, setNewMenuName] = useState('');
    const [showCreateInput, setShowCreateInput] = useState(false);
    const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
    const [editMenuName, setEditMenuName] = useState('');

    const [newCatData, setNewCatData] = useState<{ name: string }>({ name: '' });
    const [editingCatId, setEditingCatId] = useState<string | null>(null);
    const [editCatData, setEditCatData] = useState<{ name: string }>({ name: '' });

    const [addingItemTo, setAddingItemTo] = useState<string | null>(null);
    const [newItem, setNewItem] = useState<{
        name: string; description: string; price: string; priceUnit: string;
        isVegan: boolean; isGlutenFree: boolean; isVegetarian: boolean; spiciness: number;
        allergens: number[];
    }>({ name: '', description: '', price: '', priceUnit: '', isVegan: false, isGlutenFree: false, isVegetarian: false, spiciness: 0, allergens: [] });

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editItemData, setEditItemData] = useState<{
        name: string; description: string; price: string; priceUnit: string;
        isVegan: boolean; isGlutenFree: boolean; isVegetarian: boolean; spiciness: number;
        allergens: number[];
    }>({ name: '', description: '', price: '', priceUnit: '', isVegan: false, isGlutenFree: false, isVegetarian: false, spiciness: 0, allergens: [] });

    const [error, setError] = useState('');
    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        isOpen: boolean; itemId: string | null; categoryId: string | null;
        isCategory?: boolean; isMenu?: boolean; menuId?: string | null;
    }>({ isOpen: false, itemId: null, categoryId: null, isCategory: false, isMenu: false, menuId: null });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => { fetchInitialData(); }, []);
    useEffect(() => {
        if (selectedMenuId) fetchCategories(selectedMenuId);
        else setCategories([]);
    }, [selectedMenuId]);

    const fetchInitialData = async () => {
        try {
            const [menuRes, restRes] = await Promise.all([fetch('/api/menus'), fetch('/api/restaurant')]);
            if (menuRes.ok) {
                const data = await menuRes.json();
                setMenus(data.menus || []);
                if (data.menus && data.menus.length > 0 && !selectedMenuId) setSelectedMenuId(data.menus[0].id);
            }
            if (restRes.ok) {
                const data = await restRes.json();
                setIsDemo(!!data.isDemo);
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const fetchCategories = async (menuId: string) => {
        const res = await fetch(`/api/menu/categories?menuId=${menuId}`);
        if (res.ok) { 
            const data = await res.json(); 
            setCategories(data.categories || []); 
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        if (isDemo) return;

        const oldIndex = categories.findIndex(c => c.id === active.id);
        const newIndex = categories.findIndex(c => c.id === over.id);
        const newOrder = arrayMove(categories, oldIndex, newIndex);
        setCategories(newOrder);

        try {
            await Promise.all(
                newOrder.map((cat, idx) =>
                    fetch('/api/menu/categories', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: cat.id, sortOrder: idx })
                    })
                )
            );
        } catch (err) { console.error(err); }
    };

    const handleCreateMenu = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isDemo) return alert('Modalità Demo: modifiche non consentite');
        if (!newMenuName.trim()) return;
        setLoading(true);
        try {
            const res = await fetch('/api/menus', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newMenuName }) });
            if (res.ok) {
                const data = await res.json();
                setMenus(prev => [...prev, data]);
                setSelectedMenuId(data.id);
                setNewMenuName('');
                setShowCreateInput(false);
            } else { const d = await res.json(); alert(d.error || 'Errore creazione menu'); }
        } catch { alert('Errore di connessione'); }
        finally { setLoading(false); }
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
            fetchInitialData();
        } catch (error) { console.error('Error toggling menu:', error); }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isDemo) return alert('Modalità Demo');
        if (!newCatData.name || !selectedMenuId) return;
        const res = await fetch('/api/menu/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newCatData.name, menuId: selectedMenuId }) });
        if (res.ok) { setNewCatData({ name: '' }); fetchCategories(selectedMenuId); }
    };

    const handleUpdateCategory = async (e: React.FormEvent, id: string) => {
        e.preventDefault();
        if (isDemo) return alert('Modalità Demo');
        const res = await fetch('/api/menu/categories', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...editCatData }) });
        if (res.ok) { setEditingCatId(null); fetchCategories(selectedMenuId!); }
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault(); setError('');
        if (isDemo) return alert('Modalità Demo');
        if (!addingItemTo || !newItem.name) return;
        try {
            const res = await fetch('/api/menu/items', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ 
                    ...newItem, 
                    categoryId: addingItemTo, 
                    allergens: JSON.stringify(newItem.allergens) 
                }) 
            });
            if (res.ok) {
                setNewItem({ name: '', description: '', price: '', priceUnit: '', isVegan: false, isGlutenFree: false, isVegetarian: false, spiciness: 0, allergens: [] });
                setAddingItemTo(null);
                if (selectedMenuId) fetchCategories(selectedMenuId);
            } else { const d = await res.json(); setError(d.error || 'Errore'); }
        } catch { setError('Errore connessione'); }
    };

    const handleUpdateItem = async (e: React.FormEvent | null, id: string, overrideData: any = null) => {
        if (e) e.preventDefault();
        if (isDemo) return alert('Modalità Demo');
        const res = await fetch('/api/menu/items', { 
            method: 'PATCH', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ 
                id, 
                ...editItemData, 
                allergens: JSON.stringify(editItemData.allergens), 
                ...overrideData 
            }) 
        });
        if (res.ok) { setEditingId(null); if (selectedMenuId) fetchCategories(selectedMenuId); }
        else { const d = await res.json(); alert('Errore: ' + (d.error || 'sconosciuto')); }
    };

    const handleQuickUpdate = async (item: MenuItem, updates: any) => {
        if (isDemo) return;
        await fetch('/api/menu/items', { 
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
                priceUnit: item.priceUnit, 
                ...updates 
            }) 
        });
        if (selectedMenuId) fetchCategories(selectedMenuId);
    };

    const requestDelete = (id: string, categoryId: string | null, isCategory = false, isMenu = false) => {
        if (isDemo) return alert('Modalità Demo');
        setDeleteConfirmation({ isOpen: true, itemId: (isCategory || isMenu) ? null : id, categoryId: isCategory ? id : categoryId, isCategory, isMenu, menuId: isMenu ? id : null });
    };

    const confirmDelete = async () => {
        const { itemId, categoryId, isCategory, isMenu, menuId } = deleteConfirmation;
        setDeleteConfirmation({ ...deleteConfirmation, isOpen: false });
        if (isMenu && menuId) {
            const res = await fetch(`/api/menus?id=${menuId}`, { method: 'DELETE' });
            if (res.ok) { setMenus(prev => prev.filter(m => m.id !== menuId)); if (selectedMenuId === menuId) setSelectedMenuId(null); }
        } else if (isCategory && categoryId) {
            await fetch(`/api/menu/categories?id=${categoryId}`, { method: 'DELETE' });
            if (selectedMenuId) fetchCategories(selectedMenuId);
        } else if (itemId) {
            await fetch(`/api/menu/items?id=${itemId}`, { method: 'DELETE' });
            if (selectedMenuId) fetchCategories(selectedMenuId);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
        const file = e.target.files?.[0]; if (!file) return;
        setUploadingId(itemId);
        const formData = new FormData(); formData.append('file', file); formData.append('itemId', itemId);
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            if (res.ok && selectedMenuId) fetchCategories(selectedMenuId);
        } catch (err) { console.error(err); }
        setUploadingId(null);
    };

    const handleUpdateMenuName = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isDemo) return alert('Modalità Demo');
        if (!editingMenuId || !editMenuName.trim()) return;
        const res = await fetch('/api/menus', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingMenuId, name: editMenuName }) });
        if (res.ok) { await fetchInitialData(); setEditingMenuId(null); }
    };

    if (loading) return <LoadingOverlay />;

    // --- Shared allergen grid ---
    const AllergenGrid = ({ allergens, onChange }: { allergens: number[], onChange: (nums: number[]) => void }) => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))', gap: '0.5rem' }}>
            {Array.from({ length: 14 }, (_, i) => i + 1).map(num => (
                <label key={num} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px', background: allergens.includes(num) ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${allergens.includes(num) ? 'rgba(212,175,55,0.5)' : 'transparent'}`, color: allergens.includes(num) ? '#d4af37' : 'rgba(255,255,255,0.6)', transition: 'all 0.2s' }}>
                    <input type="checkbox" checked={allergens.includes(num)} onChange={e => {
                        if (e.target.checked) onChange([...allergens, num]);
                        else onChange(allergens.filter(n => n !== num));
                    }} style={{ accentColor: '#d4af37' }} />
                    {num}
                </label>
            ))}
        </div>
    );

    // --- Round action button ---
    const ActionBtn = ({ onClick, title, disabled, variant, children }: {
        onClick: () => void; title: string; disabled?: boolean; variant: 'edit' | 'delete'; children: React.ReactNode;
    }) => (
        <button
            onClick={onClick}
            title={title}
            disabled={disabled}
            className={menuStyles.roundBtn}
            style={{
                background: variant === 'edit' ? 'rgba(212,175,55,0.12)' : 'rgba(239,68,68,0.12)',
                color: variant === 'edit' ? '#d4af37' : '#ef4444',
            }}
        >
            {children}
        </button>
    );

    return (
        <div className={styles.container}>
            {/* Delete Confirmation Modal */}
            {deleteConfirmation.isOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }} onClick={() => setDeleteConfirmation({ ...deleteConfirmation, isOpen: false })}>
                    <div style={{ background: 'rgba(15,15,15,0.98)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '24px', padding: '2.5rem', maxWidth: '400px', width: '90%', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ marginBottom: '1rem', color: '#ef4444', fontSize: '1.4rem' }}>{deleteConfirmation.isMenu ? 'Eliminare Menu?' : 'Eliminare?'}</h3>
                        <p style={{ marginBottom: '1.5rem', color: 'rgba(255,255,255,0.5)' }}>Questa azione è irreversibile.</p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button onClick={confirmDelete} style={{ background: '#ef4444', border: 'none', borderRadius: '10px', color: '#fff', padding: '10px 24px', fontWeight: 600, cursor: 'pointer' }}>Sì, Elimina</button>
                            <button onClick={() => setDeleteConfirmation({ isOpen: false, itemId: null, categoryId: null })} className={styles.btnSm} style={{ width: 'auto' }}>Annulla</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Expanded Image Lightbox */}
            {expandedImage && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, cursor: 'pointer' }} onClick={() => setExpandedImage(null)}>
                    <img src={expandedImage} alt="Ingrandimento" style={{ maxHeight: '90vh', maxWidth: '90vw', borderRadius: '12px' }} onClick={e => e.stopPropagation()} />
                    <button style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer' }} onClick={() => setExpandedImage(null)}>×</button>
                </div>
            )}

            {/* Create Menu Modal */}
            {showCreateInput && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }} onClick={() => setShowCreateInput(false)}>
                    <div style={{ background: 'rgba(15,15,15,0.98)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '24px', padding: '2.5rem', maxWidth: '480px', width: '90%' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ marginBottom: '1.5rem', color: '#d4af37', fontSize: '1.5rem', fontFamily: 'Playfair Display, serif' }}>Crea Nuovo Menu</h3>
                        <form onSubmit={handleCreateMenu}>
                            <input autoFocus placeholder="Nome del menu (es. Menu Estate)" value={newMenuName} onChange={e => setNewMenuName(e.target.value)} className={styles.formInput} style={{ marginBottom: '1.5rem' }} />
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setShowCreateInput(false)} className={styles.btnSm}>Annulla</button>
                                <button type="submit" className={styles.btnPrimary} disabled={isDemo || !newMenuName.trim()} style={{ width: 'auto', padding: '10px 24px' }}>Crea Menu</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <header className={styles.header}>
                <h1 className={styles.title}>I Tuoi Menu</h1>
                <p className={styles.subtitle}>Crea e gestisci i menu digitali del tuo ristorante.</p>
            </header>

            {/* Menu Cards */}
            <div className={menuStyles.menuGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div onClick={() => { if (isDemo) return; setShowCreateInput(true); }} style={{ cursor: 'pointer', border: '2px dashed rgba(212, 175, 55, 0.3)', background: 'rgba(212, 175, 55, 0.03)', borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '8px', minHeight: '140px', transition: 'all 0.3s' }}>
                    <Plus size={32} color="#d4af37" />
                    <span style={{ fontWeight: 600, color: '#d4af37' }}>Nuovo Menu</span>
                </div>

                {menus.map(menu => (
                    <div 
                        key={menu.id} 
                        onClick={() => setSelectedMenuId(menu.id)} 
                        className={`${menuStyles.card} ${selectedMenuId === menu.id ? menuStyles.menuCardActive : ''}`}
                        style={{ 
                            cursor: 'pointer', 
                            background: selectedMenuId === menu.id ? 'rgba(212, 175, 55, 0.08)' : 'rgba(255,255,255,0.03)', 
                            border: selectedMenuId === menu.id ? '2px solid #d4af37' : '1px solid rgba(255,255,255,0.1)', 
                            borderRadius: '24px', 
                            padding: '1.5rem', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '12px', 
                            transition: 'all 0.3s' 
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h3 style={{ fontSize: '1.2rem', margin: 0, fontFamily: 'Playfair Display, serif', fontWeight: 700, color: selectedMenuId === menu.id ? '#d4af37' : '#fff' }}>{menu.name}</h3>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button 
                                    onClick={e => handleToggleActive(menu.id, menu.isActive, e)} 
                                    style={{ background: menu.isActive ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)', color: menu.isActive ? '#4ade80' : 'rgba(255,255,255,0.3)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    title={menu.isActive ? "Menu Attivo" : "Menu Nascosto"}
                                >
                                    <Eye size={14} />
                                </button>
                                <button onClick={e => { e.stopPropagation(); requestDelete(menu.id, null, false, true); }} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{menu._count?.categories || 0} Categorie</div>
                    </div>
                ))}
            </div>

            {selectedMenuId ? (
                <div>
                    {/* Menu Title Editing */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2.5rem' }}>
                        {editingMenuId === selectedMenuId ? (
                            <form onSubmit={handleUpdateMenuName} style={{ display: 'flex', gap: '10px', alignItems: 'center', flex: 1 }}>
                                <input autoFocus value={editMenuName} onChange={e => setEditMenuName(e.target.value)} className={styles.formInput} style={{ fontSize: '1.2rem' }} />
                                <button type="submit" className={styles.btnPrimary} style={{ width: 'auto' }}>Salva</button>
                                <button type="button" className={styles.btnSm} onClick={() => setEditingMenuId(null)}>Annulla</button>
                            </form>
                        ) : (
                            <>
                                <h2 style={{ color: '#d4af37', marginBottom: 0, fontFamily: 'Playfair Display, serif', fontSize: '2rem' }}>{menus.find(m => m.id === selectedMenuId)?.name}</h2>
                                <ActionBtn onClick={() => { setEditingMenuId(selectedMenuId); setEditMenuName(menus.find(m => m.id === selectedMenuId)?.name || ''); }} title="Rinomina menu" variant="edit" disabled={isDemo}><Pencil size={14} /></ActionBtn>
                            </>
                        )}
                    </div>

                    {/* New Category Form */}
                    <div className={styles.card} style={{ marginBottom: '2.5rem', padding: '1.5rem' }}>
                        <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <strong style={{ fontSize: '1.1rem', color: '#d4af37' }}>Nuova Categoria</strong>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input type="text" placeholder="Nome Categoria (es. Antipasti)" value={newCatData.name} onChange={e => !isDemo && setNewCatData({ ...newCatData, name: e.target.value })} className={styles.formInput} style={{ flex: 1 }} readOnly={isDemo} />
                                <button type="submit" disabled={isDemo} style={{ padding: '10px 24px', width: 'auto', background: 'transparent', border: '1px solid rgba(212,175,55,0.5)', borderRadius: '10px', color: '#d4af37', fontWeight: 600, cursor: isDemo ? 'not-allowed' : 'pointer' }}>
                                    + Aggiungi
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Categories with Drag & Drop */}
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={categories.map(c => c.id)} strategy={verticalListSortingStrategy}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                {categories.map(cat => (
                                    <SortableCategory key={cat.id} cat={cat}>
                                        {(dragHandleProps) => (
                                            <div className={`${styles.card} ${menuStyles.categoryCard}`} style={{ padding: 0, overflow: 'hidden' }}>
                                                {/* Category Header */}
                                                <div className={menuStyles.categoryHeader} style={{ background: 'rgba(212,175,55,0.05)', borderBottom: '1px solid rgba(212,175,55,0.1)', padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    {editingCatId === cat.id ? (
                                                        <form onSubmit={e => handleUpdateCategory(e, cat.id)} style={{ display: 'flex', gap: '10px', flex: 1 }}>
                                                            <input value={editCatData.name} onChange={e => setEditCatData({ ...editCatData, name: e.target.value })} className={styles.formInput} autoFocus style={{ flex: 1 }} />
                                                            <button type="submit" className={styles.btnPrimary} style={{ width: 'auto' }}>Salva</button>
                                                            <button type="button" className={styles.btnSm} style={{ width: 'auto' }} onClick={() => setEditingCatId(null)}>Annulla</button>
                                                        </form>
                                                    ) : (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, justifyContent: 'space-between' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                                <div {...dragHandleProps} style={{ cursor: 'grab', color: 'rgba(255,255,255,0.2)', padding: '4px' }}>
                                                                    <GripVertical size={20} />
                                                                </div>
                                                                <h3 style={{ margin: 0, fontSize: '1.3rem', fontFamily: 'Playfair Display, serif', color: '#d4af37' }}>{cat.name}</h3>
                                                            </div>
                                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                                <ActionBtn onClick={() => { if (isDemo) return; setEditingCatId(cat.id); setEditCatData({ name: cat.name }); }} title="Modifica Categoria" variant="edit" disabled={isDemo}><Pencil size={14} /></ActionBtn>
                                                                <ActionBtn onClick={() => { if (isDemo) return; requestDelete(cat.id, cat.id, true, false); }} title="Elimina Categoria" variant="delete" disabled={isDemo}><X size={18} /></ActionBtn>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div style={{ padding: '1.5rem' }}>
                                                    {/* Add Dish Button */}
                                                    {!editingCatId && (
                                                        <button onClick={() => !isDemo && setAddingItemTo(cat.id)} disabled={isDemo} className={menuStyles.addItemBtn} style={{ marginBottom: '1.5rem', width: '100%', background: 'rgba(212,175,55,0.04)', color: '#d4af37', border: '1px dashed rgba(212,175,55,0.3)', padding: '12px', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                            <Plus size={18} /> Aggiungi Piatto
                                                        </button>
                                                    )}

                                                    {/* New Item Form */}
                                                    {addingItemTo === cat.id && (
                                                        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.5rem' }}>
                                                            <form onSubmit={handleAddItem}>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                                    <strong style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: '#d4af37' }}>Nuovo Piatto</strong>
                                                                </div>
                                                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                                                    <input placeholder="Nome Piatto" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} required autoFocus className={styles.formInput} style={{ flex: 2 }} />
                                                                    <input placeholder="Prezzo €" type="number" step="0.5" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} className={styles.formInput} style={{ flex: 1 }} />
                                                                </div>
                                                                <textarea placeholder="Descrizione ingredienti..." value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} className={styles.formTextarea} style={{ minHeight: '80px', marginBottom: '1rem' }} />
                                                                <div style={{ marginBottom: '1.5rem' }}>
                                                                    <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Allergeni (ID)</label>
                                                                    <AllergenGrid allergens={newItem.allergens} onChange={nums => setNewItem({ ...newItem, allergens: nums })} />
                                                                </div>
                                                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                                                    <button type="button" onClick={() => setAddingItemTo(null)} className={styles.btnSm} style={{ width: 'auto' }}>Annulla</button>
                                                                    <button type="submit" className={styles.btnPrimary} style={{ width: 'auto', padding: '10px 24px' }}>Salva Piatto</button>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    )}

                                                    {/* Items List */}
                                                    <div className={menuStyles.itemsList} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: 0 }}>
                                                        {cat.items.map(item => (
                                                            editingId === item.id ? (
                                                                <div key={item.id} style={{ padding: '1.5rem', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '16px', background: 'rgba(212,175,55,0.03)' }}>
                                                                    <form onSubmit={e => handleUpdateItem(e, item.id)}>
                                                                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                                                            <input value={editItemData.name} onChange={e => setEditItemData({ ...editItemData, name: e.target.value })} required className={styles.formInput} style={{ flex: 2 }} />
                                                                            <input type="number" step="0.5" value={editItemData.price} onChange={e => setEditItemData({ ...editItemData, price: e.target.value })} className={styles.formInput} style={{ flex: 1 }} />
                                                                        </div>
                                                                        <textarea value={editItemData.description} onChange={e => setEditItemData({ ...editItemData, description: e.target.value })} className={styles.formTextarea} style={{ minHeight: '80px', marginBottom: '1rem' }} />
                                                                        <div style={{ marginBottom: '1.5rem' }}>
                                                                            <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Allergeni</label>
                                                                            <AllergenGrid allergens={editItemData.allergens} onChange={nums => setEditItemData({ ...editItemData, allergens: nums })} />
                                                                        </div>
                                                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                                                            <button type="button" onClick={() => setEditingId(null)} className={styles.btnSm} style={{ width: 'auto' }}>Annulla</button>
                                                                            <button type="submit" className={styles.btnPrimary} style={{ width: 'auto', padding: '10px 24px' }}>Aggiorna</button>
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                            ) : (
                                                                <div key={item.id} className={menuStyles.itemRow}>
                                                                    <div className={menuStyles.itemContent}>
                                                                        <div className={menuStyles.itemPhotoContainer}>
                                                                            {item.imageUrl ? (
                                                                                <div style={{ width: '100%', height: '100%', borderRadius: '14px', overflow: 'hidden', position: 'relative' }}>
                                                                                    <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onClick={() => setExpandedImage(item.imageUrl!)} />
                                                                                    {!isDemo && <button onClick={e => { e.stopPropagation(); handleQuickUpdate(item, { imageUrl: null }); }} style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer' }}>×</button>}
                                                                                </div>
                                                                            ) : (
                                                                                <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.04)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>🍽️</div>
                                                                            )}
                                                                            {!isDemo && (
                                                                                <>
                                                                                    <input type="file" id={`file-${item.id}`} style={{ display: 'none' }} accept="image/*" onChange={e => handleFileChange(e, item.id)} />
                                                                                    <button onClick={() => document.getElementById(`file-${item.id}`)?.click()} style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: '#d4af37', border: 'none', borderRadius: '50%', width: '26px', height: '26px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                                                                                       {uploadingId === item.id ? "..." : <Plus size={16} />}
                                                                                    </button>
                                                                                </>
                                                                            )}
                                                                        </div>

                                                                        <div className={menuStyles.itemInfo}>
                                                                            <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: '#fff' }}>{item.name}</h4>
                                                                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>{item.description}</p>
                                                                        </div>
                                                                    </div>

                                                                    <div className={menuStyles.itemPriceActions} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                                                                        <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#d4af37' }}>
                                                                            € {item.price ? Number(item.price).toFixed(2) : '0.00'}
                                                                        </div>
                                                                        <div className={menuStyles.itemActions} style={{ display: 'flex', gap: '8px' }}>
                                                                            <ActionBtn onClick={() => {
                                                                                if (isDemo) return;
                                                                                setEditingId(item.id);
                                                                                let pA: number[] = [];
                                                                                try { pA = item.allergens ? JSON.parse(item.allergens as string) : []; } catch { }
                                                                                setEditItemData({ 
                                                                                    name: item.name, description: item.description, price: item.price?.toString() || '',
                                                                                    isVegan: item.isVegan, isGlutenFree: item.isGlutenFree, isVegetarian: item.isVegetarian,
                                                                                    spiciness: item.spiciness, priceUnit: item.priceUnit || '', allergens: pA 
                                                                                });
                                                                            }} title="Modifica" variant="edit" disabled={isDemo}><Pencil size={14} /></ActionBtn>
                                                                            <ActionBtn onClick={() => requestDelete(item.id, cat.id)} title="Elimina" variant="delete" disabled={isDemo}><X size={16} /></ActionBtn>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </SortableCategory>
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '8rem 2rem', background: 'rgba(212, 175, 55, 0.02)', borderRadius: '40px', border: '1px dashed rgba(212, 175, 55, 0.15)' }}>
                    <Wine size={48} color="rgba(212, 175, 55, 0.3)" style={{ marginBottom: '1.5rem' }} />
                    <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '1rem', fontFamily: 'Playfair Display, serif' }}>Scegli un'opera culinaria</h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '400px', margin: '0 auto' }}>Seleziona un menu in alto o creane uno nuovo per iniziare a progettare la tua offerta.</p>
                </div>
            )}
        </div>
    );
}
