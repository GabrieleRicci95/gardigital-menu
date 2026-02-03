'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import styles from '../../premium-dashboard.module.css';

interface CustomItem {
    id?: string;
    name: string;
    description: string;
    price: string | number;
}

interface CustomSection {
    id?: string;
    name: string;
    items: CustomItem[];
    sortOrder?: number;
}

interface CustomList {
    id?: string;
    name: string;
    isActive: boolean;
    sections: CustomSection[];
}

export default function CustomListPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [customList, setCustomList] = useState<CustomList>({
        name: 'Caricamento...',
        isActive: true,
        sections: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isDemo, setIsDemo] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (slug) fetchCustomList();
    }, [slug]);

    const fetchCustomList = async () => {
        try {
            const res = await fetch(`/api/custom-lists/${slug}`);
            if (res.ok) {
                const data = await res.json();
                setIsDemo(!!data.isDemo);
                if (data) {
                    setCustomList({
                        ...data,
                        sections: (data.sections || []).map((s: any) => ({
                            ...s,
                            items: (s.items || []).map((i: any) => ({
                                ...i,
                                price: Number(i.price)
                            }))
                        }))
                    });
                }
            } else {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Error fetching custom list:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        if (isDemo) {
            alert('Modalità Demo: modifiche non consentite');
            setSaving(false);
            return;
        }
        try {
            const res = await fetch(`/api/custom-lists/${slug}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customList)
            });

            if (res.ok) {
                alert('Modulo salvato con successo!');
                fetchCustomList();
            } else {
                alert('Errore durante il salvataggio');
            }
        } catch (error) {
            alert('Errore di connessione');
        } finally {
            setSaving(false);
        }
    };

    const addSection = () => {
        if (isDemo) return alert('Modalità Demo: modifiche non consentite');
        setCustomList(prev => ({
            ...prev,
            sections: [
                ...prev.sections,
                {
                    id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    name: 'Nuova Categoria',
                    items: []
                }
            ]
        }));
    };

    const removeSection = (index: number) => {
        if (isDemo) return alert('Modalità Demo: modifiche non consentite');
        if (!confirm('Eliminare questa categoria e tutti gli articoli inclusi?')) return;
        setCustomList(prev => {
            const newSections = [...prev.sections];
            newSections.splice(index, 1);
            return { ...prev, sections: newSections };
        });
    };

    const updateSectionName = (index: number, name: string) => {
        setCustomList(prev => {
            const newSections = [...prev.sections];
            newSections[index] = { ...newSections[index], name };
            return { ...prev, sections: newSections };
        });
    };

    const addItem = (sectionIndex: number) => {
        if (isDemo) return alert('Modalità Demo: modifiche non consentite');
        setCustomList(prev => {
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
        if (isDemo) return alert('Modalità Demo: modifiche non consentite');
        setCustomList(prev => {
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

    const updateItem = (sectionIndex: number, itemIndex: number, field: keyof CustomItem, value: any) => {
        setCustomList(prev => {
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
                    background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 10px 25px rgba(26, 35, 126, 0.2)'
                }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1a1a1a', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
                    {customList.name}
                </h1>
                <p style={{ color: '#666', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    Gestisci i contenuti del modulo "{customList.name}". Organizza gli articoli per categorie e presentali con stile.
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
                    <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>Rendi visibile questo modulo sul menu pubblico</p>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '56px', height: '30px', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={customList.isActive}
                        onChange={e => !isDemo && setCustomList({ ...customList, isActive: e.target.checked })}
                        disabled={isDemo}
                        style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                        position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: customList.isActive ? '#10b981' : '#e5e7eb',
                        transition: '.4s', borderRadius: '34px',
                    }}></span>
                    <span style={{
                        position: 'absolute', content: '""', height: '22px', width: '22px', left: '4px', bottom: '4px',
                        backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                        transform: customList.isActive ? 'translateX(26px)' : 'translateX(0)'
                    }}></span>
                </label>
            </div>

            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                <button
                    onClick={addSection}
                    style={{ background: '#1a237e', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 600, boxShadow: '0 4px 12px rgba(26, 35, 126, 0.2)' }}
                >
                    + Aggiungi Nuova Categoria
                </button>
            </div>

            {/* Sections List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {customList.sections.map((section, sIndex) => (
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
                                    placeholder="Nome Categoria (es. I nostri dolci)"
                                    style={{
                                        fontSize: '1.5rem',
                                        fontWeight: '700',
                                        border: 'none',
                                        background: 'transparent',
                                        width: '100%',
                                        outline: 'none',
                                        color: '#333',
                                        padding: '2px 0'
                                    }}
                                    readOnly={isDemo}
                                />
                            </div>
                            <button
                                onClick={() => removeSection(sIndex)}
                                style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px' }}
                                title="Elimina Categoria"
                                disabled={isDemo}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </button>
                        </div>

                        {/* Items List */}
                        <div style={{ padding: '1.5rem' }}>
                            <button
                                onClick={() => !isDemo && addItem(sIndex)}
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
                                disabled={isDemo}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                {isDemo ? 'Aggiunta non consentita (Demo)' : 'Aggiungi Articolo'}
                            </button>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                {section.items.map((item, iIndex) => (
                                    <div key={item.id || iIndex} className={styles.itemGrid}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <div>
                                                <input
                                                    type="text"
                                                    value={item.name}
                                                    onChange={e => updateItem(sIndex, iIndex, 'name', e.target.value)}
                                                    placeholder="Nome Articolo..."
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px 0',
                                                        borderRadius: '0',
                                                        border: 'none',
                                                        borderBottom: '2px solid #eee',
                                                        fontSize: '1.1rem',
                                                        fontWeight: '600',
                                                        outline: 'none'
                                                    }}
                                                    readOnly={isDemo}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    value={item.description}
                                                    onChange={e => updateItem(sIndex, iIndex, 'description', e.target.value)}
                                                    placeholder="Descrizione / Ingredienti..."
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
                                                    readOnly={isDemo}
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.priceContainer}>
                                            <input
                                                type="number"
                                                value={item.price}
                                                onChange={e => updateItem(sIndex, iIndex, 'price', e.target.value)}
                                                onWheel={(e) => (e.target as HTMLInputElement).blur()}
                                                placeholder="0"
                                                readOnly={isDemo}
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
                                            disabled={isDemo}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </button>
                                    </div>
                                ))}

                                {section.items.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: '#aaa', border: '2px dashed #eee', borderRadius: '12px' }}>
                                        Nessun articolo in questa categoria.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
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
                    disabled={saving || isDemo}
                    style={{
                        background: isDemo ? '#ccc' : '#1a237e',
                        color: 'white',
                        padding: '12px 30px',
                        borderRadius: '40px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        border: 'none',
                        cursor: (saving || isDemo) ? 'not-allowed' : 'pointer',
                        opacity: (saving || isDemo) ? 0.7 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: isDemo ? 'none' : '0 4px 12px rgba(26, 35, 126, 0.2)'
                    }}
                >
                    {saving ? 'Salvataggio...' : (isDemo ? 'Modifiche Disabilitate (Demo)' : (
                        <>
                            <span>Salva Modifiche</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                        </>
                    ))}
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
