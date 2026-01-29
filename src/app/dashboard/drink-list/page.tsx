'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './drink-list.module.css';

interface DrinkItem {
    id?: string;
    name: string;
    description: string;
    price: string | number;
}

interface DrinkSection {
    id?: string;
    name: string;
    items: DrinkItem[];
    sortOrder?: number;
}

interface DrinkList {
    id?: string;
    isActive: boolean;
    sections: DrinkSection[];
}

export default function DrinkListPage() {
    const [drinkList, setDrinkList] = useState<DrinkList>({
        isActive: true,
        sections: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchDrinkList();
    }, []);

    const fetchDrinkList = async () => {
        try {
            const res = await fetch('/api/drink-list');
            if (res.ok) {
                const data = await res.json();
                if (data && data.sections) {
                    setDrinkList({
                        ...data,
                        sections: data.sections.map((s: any) => ({
                            ...s,
                            items: s.items.map((i: any) => ({
                                ...i,
                                price: Number(i.price)
                            }))
                        }))
                    });
                } else {
                    // Empty state is fine
                }
            }
        } catch (error) {
            console.error('Error fetching drink list:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/drink-list', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(drinkList)
            });

            if (res.ok) {
                alert('Lista Drink salvata con successo!');
                fetchDrinkList();
            } else {
                alert('Errore durante il salvataggio');
            }
        } catch (error) {
            alert('Errore di connessione');
        } finally {
            setSaving(false);
        }
    };

    // --- State Management Helpers ---

    const addSection = () => {
        setDrinkList(prev => ({
            ...prev,
            sections: [
                ...prev.sections,
                {
                    id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    name: '',
                    items: []
                }
            ]
        }));
    };

    const removeSection = (index: number) => {
        if (!confirm('Eliminare questa categoria e tutti i drink inclusi?')) return;
        setDrinkList(prev => {
            const newSections = [...prev.sections];
            newSections.splice(index, 1);
            return { ...prev, sections: newSections };
        });
    };

    const updateSectionName = (index: number, name: string) => {
        setDrinkList(prev => {
            const newSections = [...prev.sections];
            newSections[index] = { ...newSections[index], name };
            return { ...prev, sections: newSections };
        });
    };

    const addItem = (sectionIndex: number) => {
        setDrinkList(prev => {
            const newSections = prev.sections.map((section, sIdx) => {
                if (sIdx !== sectionIndex) return section;
                return {
                    ...section,
                    items: [
                        ...section.items,
                        {
                            id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_item`,
                            name: '',
                            description: '',
                            price: ''
                        }
                    ]
                };
            });
            return { ...prev, sections: newSections };
        });
    };

    const removeItem = (sectionIndex: number, itemIndex: number) => {
        setDrinkList(prev => {
            const newSections = prev.sections.map((section, sIdx) => {
                if (sIdx !== sectionIndex) return section;
                return {
                    ...section,
                    items: section.items.filter((_, iIdx) => iIdx !== itemIndex)
                };
            });
            return { ...prev, sections: newSections };
        });
    };

    const updateItem = (sectionIndex: number, itemIndex: number, field: keyof DrinkItem, value: any) => {
        setDrinkList(prev => {
            const newSections = prev.sections.map((section, sIdx) => {
                if (sIdx !== sectionIndex) return section;
                const newItems = [...section.items];
                newItems[itemIndex] = {
                    ...newItems[itemIndex],
                    [field]: value
                };
                return { ...section, items: newItems };
            });
            return { ...prev, sections: newSections };
        });
    };

    if (loading) return <div style={{ padding: '2rem' }}>Caricamento...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem', paddingBottom: '120px', fontFamily: 'var(--font-inter, sans-serif)' }}>

            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', // Blue gradient for Drinks
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
                }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1a1a1a', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
                    Lista Drink & Cocktail
                </h1>
                <p style={{ color: '#666', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    Organizza la tua selezione di drink. Crea categorie come Cocktail, Birre, Bibite e Amari.
                </p>
            </header>

            {/* Global Settings Card */}
            <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '16px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                marginBottom: '2.5rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid #f0f0f0'
            }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Stato Pubblicazione</h3>
                    <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>Rendi visibile la lista drink sul menu pubblico</p>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '56px', height: '30px', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={drinkList.isActive}
                        onChange={e => setDrinkList({ ...drinkList, isActive: e.target.checked })}
                        style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                        position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: drinkList.isActive ? '#10b981' : '#e5e7eb',
                        transition: '.4s', borderRadius: '34px',
                    }}></span>
                    <span style={{
                        position: 'absolute', content: '""', height: '22px', width: '22px', left: '4px', bottom: '4px',
                        backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                        transform: drinkList.isActive ? 'translateX(26px)' : 'translateX(0)'
                    }}></span>
                </label>
            </div>

            {/* Sections List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {drinkList.sections.map((section, sIndex) => (
                    <div key={section.id || sIndex} style={{
                        background: 'white',
                        borderRadius: '20px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.03), 0 4px 6px -2px rgba(0, 0, 0, 0.01)',
                        border: '1px solid #f0f0f0',
                        overflow: 'hidden'
                    }}>
                        {/* Section Header */}
                        <div style={{
                            padding: '1.5rem',
                            borderBottom: '1px solid #f5f5f5',
                            background: '#fafafa',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ flex: 1 }}>
                                <input
                                    type="text"
                                    value={section.name}
                                    onChange={e => updateSectionName(sIndex, e.target.value)}
                                    placeholder="Es. Cocktail Classici"
                                    style={{
                                        fontSize: '1.5rem',
                                        fontWeight: '700',
                                        border: 'none',
                                        background: 'transparent',
                                        width: '100%',
                                        outline: 'none',
                                        color: '#333'
                                    }}
                                />
                            </div>
                            <button
                                onClick={() => removeSection(sIndex)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#ef4444',
                                    padding: '8px',
                                    borderRadius: '8px',
                                    transition: 'all 0.2s'
                                }}
                                title="Elimina Categoria"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        {/* Items List */}
                        <div style={{ padding: '1.5rem' }}>
                            <button
                                onClick={() => addItem(sIndex)}
                                style={{
                                    marginBottom: '1.5rem',
                                    width: '100%',
                                    background: '#f0f9ff',
                                    color: '#0369a1',
                                    border: '1px dashed #bae6fd',
                                    padding: '12px',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#e0f2fe'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#f0f9ff'}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                Aggiungi Drink alla categoria "{section.name || '...'}"
                            </button>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {section.items.map((item, iIndex) => (
                                    <div key={item.id || iIndex} className={styles.itemGrid}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <div>
                                                <input
                                                    type="text"
                                                    value={item.name}
                                                    onChange={e => updateItem(sIndex, iIndex, 'name', e.target.value)}
                                                    placeholder="Nome Drink (es. Negroni)"
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px 0',
                                                        borderRadius: '0',
                                                        border: 'none',
                                                        borderBottom: '2px solid #eee',
                                                        fontSize: '1.1rem',
                                                        fontWeight: '600',
                                                        outline: 'none',
                                                        transition: 'border-color 0.2s'
                                                    }}
                                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                                    onBlur={(e) => e.target.style.borderColor = '#eee'}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    value={item.description}
                                                    onChange={e => updateItem(sIndex, iIndex, 'description', e.target.value)}
                                                    placeholder="Ingredienti (es. Gin, Campari, Vermouth Rosso)"
                                                    style={{
                                                        width: '100%',
                                                        padding: '8px',
                                                        borderRadius: '8px',
                                                        border: '1px solid transparent',
                                                        backgroundColor: '#f9f9f9',
                                                        fontSize: '0.95rem',
                                                        color: '#555',
                                                        outline: 'none'
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.backgroundColor = '#fff';
                                                        e.target.style.borderColor = '#ddd';
                                                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.backgroundColor = '#f9f9f9';
                                                        e.target.style.borderColor = 'transparent';
                                                        e.target.style.boxShadow = 'none';
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.priceContainer}>
                                            <input
                                                type="number"
                                                value={item.price}
                                                onChange={e => updateItem(sIndex, iIndex, 'price', e.target.value)}
                                                placeholder="0"
                                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                                onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
                                            />
                                            <span className={styles.priceSymbol}>€</span>
                                        </div>

                                        <button
                                            onClick={() => removeItem(sIndex, iIndex)}
                                            style={{
                                                marginTop: '1.2rem',
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#bbb',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                padding: '5px',
                                                borderRadius: '6px',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = '#fee2e2'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.color = '#bbb'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                                            title="Rimuovi Drink"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </button>
                                    </div>
                                ))}

                                {section.items.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: '#aaa', border: '2px dashed #eee', borderRadius: '12px' }}>
                                        Nessun drink in questa categoria.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add Category Card */}
                <div
                    onClick={addSection}
                    style={{
                        background: 'rgba(255,255,255,0.6)',
                        border: '2px dashed #ccc',
                        borderRadius: '20px',
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        color: '#666',
                        gap: '1rem'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = '#f0f9ff'; e.currentTarget.style.color = '#3b82f6'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#ccc'; e.currentTarget.style.background = 'rgba(255,255,255,0.6)'; e.currentTarget.style.color = '#666'; }}
                >
                    <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </div>
                    <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>Aggiungi Nuova Categoria</span>
                </div>
            </div>


            {/* Sticky Save Bar */}
            <div style={{
                position: 'fixed',
                bottom: 30,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0,0,0,0.1)',
                padding: '10px 10px',
                borderRadius: '50px',
                display: 'flex',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                zIndex: 100,
                gap: '10px'
            }}>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                        background: '#000',
                        color: 'white',
                        padding: '12px 30px',
                        borderRadius: '40px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        border: 'none',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        opacity: saving ? 0.7 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}
                >
                    {saving ? 'Salvataggio...' : (
                        <>
                            <span>Salva Modifiche</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                        </>
                    )}
                </button>
                <Link href="/dashboard" style={{
                    background: '#f3f4f6',
                    color: '#333',
                    padding: '12px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    border: '1px solid #ddd'
                }} title="Torna alla Dashboard">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </Link>
            </div>

            <button
                onClick={addSection}
                style={{
                    position: 'fixed',
                    bottom: '100px', // Above the save bar
                    right: '30px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: '#1a1a1a',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                    border: 'none',
                    cursor: 'pointer',
                    zIndex: 90
                }}
                title="Aggiungi Categoria"
            >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
        </div>
    );
}
