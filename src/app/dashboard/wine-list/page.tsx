'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../restaurant-dashboard.module.css';
import { Wine, Plus, Trash2, Save, X, ChevronRight } from 'lucide-react';
import LoadingOverlay from '@/components/common/LoadingOverlay';

interface WineItem {
    id?: string;
    name: string;
    description: string;
    price: string | number;
}

interface WineSection {
    id?: string;
    name: string;
    items: WineItem[];
    sortOrder?: number;
}

interface WineList {
    id?: string;
    isActive: boolean;
    sections: WineSection[];
}

export default function WineListPage() {
    const [wineList, setWineList] = useState<WineList>({
        isActive: true,
        sections: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isDemo, setIsDemo] = useState(false);
    const router = useRouter();

    // Dirty state management
    const originalDataRef = useRef<string>('');
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        fetchWineList();
    }, []);

    const fetchWineList = async () => {
        try {
            const res = await fetch('/api/wine-list');
            if (res.ok) {
                const data = await res.json();
                setIsDemo(!!data.isDemo);
                if (data && data.sections) {
                    const formattedData = {
                        ...data,
                        sections: data.sections.map((s: any) => ({
                            ...s,
                            items: s.items.map((i: any) => ({
                                ...i,
                                price: Number(i.price)
                            }))
                        }))
                    };
                    setWineList(formattedData);
                    originalDataRef.current = JSON.stringify(formattedData);
                }
            }
        } catch (error) {
            console.error('Error fetching wine list:', error);
        } finally {
            setLoading(false);
        }
    };

    // Check for dirty state
    useEffect(() => {
        if (!originalDataRef.current) return;
        const currentDataStr = JSON.stringify(wineList);
        setIsDirty(currentDataStr !== originalDataRef.current);
    }, [wineList]);

    // Before unload protection
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    const handleSave = async () => {
        setSaving(true);
        if (isDemo) {
            alert('Modalità Demo: modifiche non consentite');
            setSaving(false);
            return;
        }
        try {
            const res = await fetch('/api/wine-list', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(wineList)
            });

            if (res.ok) {
                originalDataRef.current = JSON.stringify(wineList);
                setIsDirty(false);
                alert('Carta dei Vini salvata con successo!');
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
        setWineList(prev => ({
            ...prev,
            sections: [
                {
                    id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    name: '',
                    items: []
                },
                ...prev.sections
            ]
        }));
    };

    const removeSection = (index: number) => {
        if (isDemo) return alert('Modalità Demo: modifiche non consentite');
        if (!confirm('Eliminare questa categoria e tutti i vini inclusi?')) return;
        setWineList(prev => {
            const newSections = [...prev.sections];
            newSections.splice(index, 1);
            return { ...prev, sections: newSections };
        });
    };

    const updateSectionName = (index: number, name: string) => {
        setWineList(prev => {
            const newSections = [...prev.sections];
            newSections[index] = { ...newSections[index], name };
            return { ...prev, sections: newSections };
        });
    };

    const addItem = (sectionIndex: number) => {
        if (isDemo) return alert('Modalità Demo: modifiche non consentite');
        setWineList(prev => {
            const newSections = prev.sections.map((section, sIdx) => {
                if (sIdx !== sectionIndex) return section;
                return {
                    ...section,
                    items: [
                        {
                            id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_item`,
                            name: '',
                            description: '',
                            price: ''
                        },
                        ...section.items
                    ]
                };
            });
            return { ...prev, sections: newSections };
        });
    };

    const removeItem = (sectionIndex: number, itemIndex: number) => {
        if (isDemo) return alert('Modalità Demo: modifiche non consentite');
        setWineList(prev => {
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

    const updateItem = (sectionIndex: number, itemIndex: number, field: keyof WineItem, value: any) => {
        setWineList(prev => {
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

    if (loading) return <LoadingOverlay />;

    return (
        <div className={styles.container} style={{ paddingBottom: '140px' }}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Carta dei Vini</h1>
                    <p className={styles.subtitle}>Gestisci la tua cantina digitale con l&apos;eleganza di un sommelier.</p>
                </div>
                <button onClick={addSection} className={styles.btnPrimary} style={{ width: 'auto' }}>
                    <Plus size={20} /> Nuova Categoria
                </button>
            </header>

            {/* Global Settings */}
            <div className={styles.card} style={{ marginBottom: '2.5rem', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 className={styles.cardTitle} style={{ margin: 0 }}><Wine size={20} /> Stato Pubblicazione</h3>
                        <p className={styles.cardDesc} style={{ margin: 0, marginTop: '4px' }}>Rendi visibile la carta dei vini sul tuo menu pubblico.</p>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '32px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={wineList.isActive}
                            onChange={e => !isDemo && setWineList({ ...wineList, isActive: e.target.checked })}
                            style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: wineList.isActive ? '#d4af37' : 'rgba(255,255,255,0.1)',
                            transition: '.4s', borderRadius: '34px',
                            boxShadow: wineList.isActive ? '0 0 15px rgba(212, 175, 55, 0.4)' : 'none'
                        }}></span>
                        <span style={{
                            position: 'absolute', height: '24px', width: '24px', left: '4px', bottom: '4px',
                            backgroundColor: '#fff', transition: '.4s', borderRadius: '50%',
                            transform: wineList.isActive ? 'translateX(28px)' : 'translateX(0)'
                        }}></span>
                    </label>
                </div>
            </div>

            {/* Sections List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                {wineList.sections.map((section, sIndex) => (
                    <div key={section.id || sIndex} className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{ background: 'rgba(212, 175, 55, 0.05)', padding: '1.5rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(212, 175, 55, 0.1)' }}>
                            <input
                                type="text"
                                value={section.name}
                                onChange={(e) => updateSectionName(sIndex, e.target.value)}
                                placeholder="Nome Categoria (es. Vini Rossi)"
                                style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    border: 'none',
                                    background: 'transparent',
                                    outline: 'none',
                                    color: '#d4af37',
                                    fontFamily: 'Playfair Display, serif',
                                    width: '100%'
                                }}
                                readOnly={isDemo}
                            />
                            <button onClick={() => removeSection(sIndex)} className={styles.iconBtnDelete} style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '10px' }}>
                                <Trash2 size={20} />
                            </button>
                        </div>

                        <div style={{ padding: '2rem 2.5rem' }}>
                            <button
                                onClick={() => addItem(sIndex)}
                                className={styles.btnSm}
                                style={{ width: '100%', marginBottom: '2rem', borderStyle: 'dashed' }}
                                disabled={isDemo}
                            >
                                <Plus size={18} /> Aggiungi Bottiglia
                            </button>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {section.items.map((item, iIndex) => (
                                    <div key={item.id || iIndex} style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.5rem' }}>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <input
                                                type="text"
                                                value={item.name}
                                                onChange={e => updateItem(sIndex, iIndex, 'name', e.target.value)}
                                                placeholder="Nome del Vino"
                                                className={styles.formInput}
                                                style={{ fontSize: '1.1rem', fontWeight: 600 }}
                                                readOnly={isDemo}
                                            />
                                            <textarea
                                                value={item.description}
                                                onChange={e => updateItem(sIndex, iIndex, 'description', e.target.value)}
                                                placeholder="Annata, Vitigno, Regione..."
                                                className={styles.formTextarea}
                                                style={{ minHeight: '60px', padding: '10px' }}
                                                rows={2}
                                                readOnly={isDemo}
                                            />
                                        </div>
                                        <div style={{ width: '120px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <div style={{ position: 'relative' }}>
                                                <input
                                                    type="number"
                                                    value={item.price}
                                                    onChange={e => updateItem(sIndex, iIndex, 'price', e.target.value)}
                                                    className={styles.formInput}
                                                    style={{ textAlign: 'right', paddingRight: '25px' }}
                                                    placeholder="0.00"
                                                    readOnly={isDemo}
                                                />
                                                <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#d4af37' }}>€</span>
                                            </div>
                                            <button onClick={() => removeItem(sIndex, iIndex)} className={styles.btnSm} style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                                                Rimuovi
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Sticky Save Bar */}
            <div className={styles.stickySaveBar}>
                <div className={styles.unsavedWarning}>
                    {isDirty ? (
                        <span>Modifiche non salvate!</span>
                    ) : (
                        <span style={{ color: '#4ade80' }}>Cantina aggiornata</span>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                        onClick={handleSave} 
                        disabled={saving || !isDirty || isDemo}
                        className={styles.btnPrimary}
                        style={{ padding: '12px 30px', borderRadius: '30px', opacity: (!isDirty && !saving) ? 0.5 : 1 }}
                    >
                        {saving ? 'Salvataggio...' : 'Salva Cantina'}
                        <Save size={18} />
                    </button>
                    <button 
                        onClick={() => {
                            if (originalDataRef.current) {
                                setWineList(JSON.parse(originalDataRef.current));
                                setIsDirty(false);
                            }
                        }}
                        disabled={!isDirty || saving}
                        className={styles.btnSm}
                        style={{ borderRadius: '30px', padding: '12px' }}
                        title="Annulla modifiche"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

        </div>
    );
}
