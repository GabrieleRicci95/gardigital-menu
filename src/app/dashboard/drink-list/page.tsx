'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../restaurant-dashboard.module.css';
import { GlassWater, Plus, Trash2, Save, X, Camera } from 'lucide-react';
import LoadingOverlay from '@/components/common/LoadingOverlay';

interface DrinkItem {
    id?: string;
    name: string;
    description: string;
    price: string | number;
    logoUrl?: string;
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
    const [isDemo, setIsDemo] = useState(false);
    const router = useRouter();

    // Dirty state management
    const originalDataRef = useRef<string>('');
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        fetchDrinkList();
    }, []);

    const fetchDrinkList = async () => {
        try {
            const res = await fetch('/api/drink-list');
            const resRest = await fetch('/api/restaurant');
            const dataRest = await resRest.json();
            setIsDemo(!!dataRest.isDemo);

            if (res.ok) {
                const data = await res.json();
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
                    setDrinkList(formattedData);
                    originalDataRef.current = JSON.stringify(formattedData);
                }
            }
        } catch (error) {
            console.error('Error fetching drink list:', error);
        } finally {
            setLoading(false);
        }
    };

    // Check for dirty state
    useEffect(() => {
        if (!originalDataRef.current) return;
        const currentDataStr = JSON.stringify(drinkList);
        setIsDirty(currentDataStr !== originalDataRef.current);
    }, [drinkList]);

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
        if (isDemo) {
            alert('Modalità Demo: modifiche non consentite');
            return;
        }
        setSaving(true);
        const listToSave = {
            ...drinkList,
            sections: drinkList.sections.map((s, idx) => ({ ...s, sortOrder: idx }))
        };
        try {
            const res = await fetch('/api/drink-list', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(listToSave)
            });

            if (res.ok) {
                originalDataRef.current = JSON.stringify(drinkList);
                setIsDirty(false);
                alert('Lista Drink salvata con successo!');
            } else {
                alert('Errore durante il salvataggio');
            }
        } catch (error) {
            alert('Errore di connessione');
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = async (sectionIndex: number, itemIndex: number, file: File) => {
        if (!file) return;
        if (isDemo) {
            alert('Modalità Demo: caricamento non consentito');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                if (data.imageUrl) {
                    updateItem(sectionIndex, itemIndex, 'logoUrl', data.imageUrl);
                }
            } else {
                alert('Errore caricamento immagine');
            }
        } catch (error) {
            console.error('Upload Error', error);
            alert('Errore di connessione');
        }
    };

    const moveSection = (index: number, direction: 'up' | 'down') => {
        if (isDemo) return;
        setDrinkList(prev => {
            const newSections = [...prev.sections];
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            if (targetIndex < 0 || targetIndex >= newSections.length) return prev;
            
            const temp = newSections[index];
            newSections[index] = newSections[targetIndex];
            newSections[targetIndex] = temp;
            
            return { ...prev, sections: newSections };
        });
    };

    const addSection = () => {
        if (isDemo) return alert('Modalità Demo: modifiche non consentite');
        setDrinkList(prev => ({
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
        if (isDemo) return alert('Modalità Demo: modifiche non consentite');
        setDrinkList(prev => {
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

    if (loading) return <LoadingOverlay />;

    return (
        <div className={styles.container} style={{ paddingBottom: '140px' }}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Drink & Cocktail</h1>
                    <p className={styles.subtitle}>Gestisci la tua selezione di drink. Crea categorie come Cocktail, Birre, Bibite e Amari.</p>
                </div>
                <button onClick={addSection} className={styles.newSectionBtn}>
                    <Plus size={20} /> Nuova Categoria
                </button>
            </header>

            {/* Global Settings */}
            <div className={styles.card} style={{ marginBottom: '2.5rem', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 className={styles.cardTitle} style={{ margin: 0 }}><GlassWater size={20} /> Stato Pubblicazione</h3>
                        <p className={styles.cardDesc} style={{ margin: 0, marginTop: '4px' }}>Rendi visibile la lista drink sul tuo menu pubblico.</p>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '32px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={drinkList.isActive}
                            onChange={e => !isDemo && setDrinkList({ ...drinkList, isActive: e.target.checked })}
                            style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: drinkList.isActive ? '#d4af37' : 'rgba(255,255,255,0.1)',
                            transition: '.4s', borderRadius: '34px',
                            boxShadow: drinkList.isActive ? '0 0 15px rgba(212, 175, 55, 0.4)' : 'none'
                        }}></span>
                        <span style={{
                            position: 'absolute', height: '24px', width: '24px', left: '4px', bottom: '4px',
                            backgroundColor: '#fff', transition: '.4s', borderRadius: '50%',
                            transform: drinkList.isActive ? 'translateX(28px)' : 'translateX(0)'
                        }}></span>
                    </label>
                </div>
            </div>

            {/* Sections List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                {drinkList.sections.map((section, sIndex) => (
                    <div key={section.id || sIndex} className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{ background: 'rgba(212, 175, 55, 0.05)', padding: '1.5rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(212, 175, 55, 0.1)' }}>
                            <input
                                type="text"
                                value={section.name}
                                onChange={(e) => updateSectionName(sIndex, e.target.value)}
                                placeholder="Nome Categoria (es. Cocktail Classici)"
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
                            <div className={styles.sortActions}>
                                <button 
                                    onClick={() => moveSection(sIndex, 'up')} 
                                    disabled={sIndex === 0 || isDemo}
                                    className={styles.sortBtn}
                                    title="Sposta Su"
                                >
                                    <ChevronUp size={18} />
                                </button>
                                <button 
                                    onClick={() => moveSection(sIndex, 'down')} 
                                    disabled={sIndex === drinkList.sections.length - 1 || isDemo}
                                    className={styles.sortBtn}
                                    title="Sposta Giù"
                                >
                                    <ChevronDown size={18} />
                                </button>
                                <button onClick={() => removeSection(sIndex)} className={styles.iconBtnDelete} style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '10px', marginLeft: '8px' }}>
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>

                        <div style={{ padding: '2rem 2.5rem' }}>
                            <button
                                onClick={() => addItem(sIndex)}
                                className={styles.btnSm}
                                style={{ width: '100%', marginBottom: '2rem' }}
                                disabled={isDemo}
                            >
                                <Plus size={18} /> Aggiungi Drink
                            </button>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {section.items.map((item, iIndex) => (
                                    <div key={item.id || iIndex} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px', gap: '2rem', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.5rem' }}>
                                        {/* Logo Column */}
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                            <div
                                                onClick={() => !isDemo && document.getElementById(`file-${sIndex}-${iIndex}`)?.click()}
                                                style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    borderRadius: '12px',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    border: '1px solid rgba(212, 175, 55, 0.2)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: isDemo ? 'not-allowed' : 'pointer',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                {item.logoUrl ? (
                                                    <img src={item.logoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <Camera size={24} color="rgba(212, 175, 55, 0.3)" />
                                                )}
                                                <input
                                                    type="file"
                                                    id={`file-${sIndex}-${iIndex}`}
                                                    style={{ display: 'none' }}
                                                    accept="image/*"
                                                    onChange={(e) => e.target.files && handleFileUpload(sIndex, iIndex, e.target.files[0])}
                                                />
                                            </div>
                                            {item.logoUrl && (
                                                <button onClick={() => updateItem(sIndex, iIndex, 'logoUrl', '')} style={{ border: 'none', background: 'transparent', color: '#ef4444', fontSize: '0.7rem' }}>Rimuovi</button>
                                            )}
                                        </div>

                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <input
                                                type="text"
                                                value={item.name}
                                                onChange={e => updateItem(sIndex, iIndex, 'name', e.target.value)}
                                                placeholder="Nome del Drink"
                                                className={styles.formInput}
                                                style={{ fontSize: '1.1rem', fontWeight: 600 }}
                                                readOnly={isDemo}
                                            />
                                            <textarea
                                                value={item.description}
                                                onChange={e => updateItem(sIndex, iIndex, 'description', e.target.value)}
                                                placeholder="Ingredienti..."
                                                className={styles.formTextarea}
                                                style={{ minHeight: '60px', padding: '10px' }}
                                                rows={2}
                                                readOnly={isDemo}
                                            />
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                        <span style={{ color: '#4ade80' }}>Lista aggiornata</span>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                        onClick={handleSave} 
                        disabled={saving || !isDirty || isDemo}
                        className={styles.btnPrimary}
                        style={{ padding: '12px 30px', borderRadius: '30px', opacity: (!isDirty && !saving) ? 0.5 : 1 }}
                    >
                        {saving ? 'Salvataggio...' : 'Salva Drink'}
                        <Save size={18} />
                    </button>
                    <button 
                        onClick={() => {
                            if (originalDataRef.current) {
                                setDrinkList(JSON.parse(originalDataRef.current));
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
