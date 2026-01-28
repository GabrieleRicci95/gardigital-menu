'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ChampagneItem {
    id?: string;
    name: string;
    description: string;
    price: string | number;
}

interface ChampagneSection {
    id?: string;
    name: string;
    items: ChampagneItem[];
    sortOrder?: number;
}

interface ChampagneList {
    id?: string;
    isActive: boolean;
    sections: ChampagneSection[];
}

export default function ChampagneListPage() {
    const [champagneList, setChampagneList] = useState<ChampagneList>({
        isActive: true,
        sections: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchChampagneList();
    }, []);

    const fetchChampagneList = async () => {
        try {
            const res = await fetch('/api/champagne-list');
            if (res.ok) {
                const data = await res.json();
                if (data && data.sections) {
                    setChampagneList({
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
            console.error('Error fetching champagne list:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/champagne-list', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(champagneList)
            });

            if (res.ok) {
                alert('Carta Champagne salvata con successo!');
                fetchChampagneList();
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
        setChampagneList(prev => ({
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
        if (!confirm('Eliminare questa categoria e tutti gli champagne inclusi?')) return;
        setChampagneList(prev => {
            const newSections = [...prev.sections];
            newSections.splice(index, 1);
            return { ...prev, sections: newSections };
        });
    };

    const updateSectionName = (index: number, name: string) => {
        setChampagneList(prev => {
            const newSections = [...prev.sections];
            newSections[index] = { ...newSections[index], name };
            return { ...prev, sections: newSections };
        });
    };

    const addItem = (sectionIndex: number) => {
        setChampagneList(prev => {
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
        setChampagneList(prev => {
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

    const updateItem = (sectionIndex: number, itemIndex: number, field: keyof ChampagneItem, value: any) => {
        setChampagneList(prev => {
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
                    background: 'linear-gradient(135deg, #d4af37 0%, #f9e076 100%)', // Gold gradient for Champagne
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 10px 25px rgba(212, 175, 55, 0.3)'
                }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 22h8M12 2v6M12 22v-9" />
                        <path d="M12 2a5 5 0 0 1 5 5v3H7V7a5 5 0 0 1 5-5z" />
                        <circle cx="12" cy="14" r="2" /> {/* Bubbles */}
                        <circle cx="10" cy="11" r="1" />
                        <circle cx="14" cy="11" r="1" />
                    </svg>
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1a1a1a', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
                    Carta Champagne
                </h1>
                <p style={{ color: '#666', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    Gestisci la tua selezione di Champagne. Organizza le bottiglie per categorie (Millesimati, Rosé, Magnum) e presentale con eleganza.
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
                    <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>Rendi visibile la carta champagne sul menu pubblico</p>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '56px', height: '30px', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={champagneList.isActive}
                        onChange={e => setChampagneList({ ...champagneList, isActive: e.target.checked })}
                        style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                        position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: champagneList.isActive ? '#10b981' : '#e5e7eb',
                        transition: '.4s', borderRadius: '34px',
                    }}></span>
                    <span style={{
                        position: 'absolute', content: '""', height: '22px', width: '22px', left: '4px', bottom: '4px',
                        backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                        transform: champagneList.isActive ? 'translateX(26px)' : 'translateX(0)'
                    }}></span>
                </label>
            </div>

            {/* Sections List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {champagneList.sections.map((section, sIndex) => (
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
                                <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '700', color: '#888', marginBottom: '0.25rem', letterSpacing: '0.5px' }}>
                                    Categoria {sIndex + 1}
                                </label>
                                <input
                                    type="text"
                                    value={section.name}
                                    onChange={e => updateSectionName(sIndex, e.target.value)}
                                    placeholder="Es. Grand Cuvée"
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
                                    color: '#ef4444',
                                    background: '#fee2e2',
                                    border: 'none',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                                title="Elimina Categoria"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                Elimina
                            </button>
                        </div>

                        {/* Items List */}
                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {section.items.map((item, iIndex) => (
                                    <div key={item.id || iIndex} style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 120px 40px',
                                        gap: '1rem',
                                        alignItems: 'start',
                                        background: '#fff',
                                        padding: '1.25rem',
                                        borderRadius: '12px',
                                        border: '1px solid #e5e5e5',
                                        transition: 'all 0.2s',
                                    }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <div>
                                                <input
                                                    type="text"
                                                    value={item.name}
                                                    onChange={e => updateItem(sIndex, iIndex, 'name', e.target.value)}
                                                    placeholder="Nome Champagne (es. Dom Pérignon Vintage)"
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
                                                    onFocus={(e) => e.target.style.borderColor = '#d4af37'}
                                                    onBlur={(e) => e.target.style.borderColor = '#eee'}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    value={item.description}
                                                    onChange={e => updateItem(sIndex, iIndex, 'description', e.target.value)}
                                                    placeholder="Descrizione (es. Note floreali, 2012)"
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
                                                        e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.1)';
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.backgroundColor = '#f9f9f9';
                                                        e.target.style.borderColor = 'transparent';
                                                        e.target.style.boxShadow = 'none';
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div style={{ position: 'relative' }}>
                                            <label style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#999', marginBottom: '2px', display: 'block' }}>PREZZO €</label>
                                            <input
                                                type="number"
                                                value={item.price}
                                                onChange={e => updateItem(sIndex, iIndex, 'price', e.target.value)}
                                                placeholder="0.00"
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e5e5e5',
                                                    fontSize: '1.1rem',
                                                    fontWeight: '700',
                                                    textAlign: 'right',
                                                    outline: 'none',
                                                    color: '#333'
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = '#d4af37'}
                                                onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
                                            />
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
                                            title="Rimuovi Champagne"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </button>
                                    </div>
                                ))}

                                {section.items.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: '#aaa', border: '2px dashed #eee', borderRadius: '12px' }}>
                                        Nessuno champagne in questa categoria.
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => addItem(sIndex)}
                                style={{
                                    marginTop: '1.5rem',
                                    width: '100%',
                                    background: '#fffbf0',
                                    color: '#b8860b',
                                    border: '1px dashed #fceeb5',
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
                                onMouseEnter={(e) => e.currentTarget.style.background = '#fff8e1'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#fffbf0'}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                Aggiungi Champagne a "{section.name || '...'}"
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={addSection}
                style={{
                    marginTop: '3rem',
                    width: '100%',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    border: '2px dashed #e5e7eb',
                    background: 'white',
                    color: '#6b7280',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#374151'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#6b7280'; }}
            >
                <div style={{ background: '#f3f4f6', padding: '10px', borderRadius: '50%' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </div>
                Aggiungi Nuova Categoria
            </button>

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
                        background: '#1a1a1a',
                        color: '#d4af37', // Gold text
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
        </div>
    );
}
