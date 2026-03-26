'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import styles from '../../restaurant-dashboard.module.css';
import { LayoutPanelLeft, Plus, Trash2, Save, X, Camera, GripVertical } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
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

interface CustomItem {
    id?: string;
    name: string;
    description: string;
    price: string | number;
    imageUrl?: string;
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

    // Dirty state management
    const originalDataRef = useRef<string>('');
    const [isDirty, setIsDirty] = useState(false);

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
                    const formattedData = {
                        ...data,
                        sections: (data.sections || []).map((s: any) => ({
                            ...s,
                            items: (s.items || []).map((i: any) => ({
                                ...i,
                                price: Number(i.price)
                            }))
                        }))
                    };
                    setCustomList(formattedData);
                    originalDataRef.current = JSON.stringify(formattedData);
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

    // Check for dirty state
    useEffect(() => {
        if (!originalDataRef.current) return;
        const currentDataStr = JSON.stringify(customList);
        setIsDirty(currentDataStr !== originalDataRef.current);
    }, [customList]);

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
            ...customList,
            sections: customList.sections.map((s, idx) => ({ ...s, sortOrder: idx }))
        };
        try {
            const res = await fetch(`/api/custom-lists/${slug}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(listToSave)
            });

            if (res.ok) {
                originalDataRef.current = JSON.stringify(customList);
                setIsDirty(false);
                alert('Modulo salvato con successo!');
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
                    updateItem(sectionIndex, itemIndex, 'imageUrl', data.imageUrl);
                }
            } else {
                alert('Errore caricamento immagine');
            }
        } catch (error) {
            console.error('Upload Error', error);
            alert('Errore di connessione');
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (event.over && active.id !== over?.id) {
            setCustomList((prev) => {
                if (!prev) return prev;
                const oldIndex = prev.sections.findIndex((s) => (s.id || `section-${prev.sections.indexOf(s)}`) === active.id);
                const newIndex = prev.sections.findIndex((s) => (s.id || `section-${prev.sections.indexOf(s)}`) === over?.id);
                return {
                    ...prev,
                    sections: arrayMove(prev.sections, oldIndex, newIndex),
                };
            });
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
                            price: '',
                            imageUrl: ''
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

    if (loading) return <LoadingOverlay />;

    return (
        <div className={styles.container} style={{ paddingBottom: '140px' }}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>{customList.name}</h1>
                    <p className={styles.subtitle}>Gestisci i contenuti del modulo "{customList.name}". Organizza tutto con eleganza.</p>
                </div>
                <button onClick={addSection} className={styles.newSectionBtn}>
                    <Plus size={20} /> Nuova Categoria
                </button>
            </header>

            {/* Global Settings */}
            <div className={styles.card} style={{ marginBottom: '2.5rem', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 className={styles.cardTitle} style={{ margin: 0 }}><LayoutPanelLeft size={20} /> Stato Pubblicazione</h3>
                        <p className={styles.cardDesc} style={{ margin: 0, marginTop: '4px' }}>Rendi visibile questo modulo sul tuo menu pubblico.</p>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '32px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={customList.isActive}
                            onChange={e => !isDemo && setCustomList({ ...customList, isActive: e.target.checked })}
                            style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: customList.isActive ? '#d4af37' : 'rgba(255,255,255,0.1)',
                            transition: '.4s', borderRadius: '34px',
                            boxShadow: customList.isActive ? '0 0 15px rgba(212, 175, 55, 0.4)' : 'none'
                        }}></span>
                        <span style={{
                            position: 'absolute', height: '24px', width: '24px', left: '4px', bottom: '4px',
                            backgroundColor: '#fff', transition: '.4s', borderRadius: '50%',
                            transform: customList.isActive ? 'translateX(28px)' : 'translateX(0)'
                        }}></span>
                    </label>
                </div>
            </div>

            {/* Sections List */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={customList.sections.map((s, idx) => s.id || `section-${idx}`)} strategy={verticalListSortingStrategy}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        {customList.sections.map((section, sIndex) => (
                            <SortableSection key={section.id || `section-${sIndex}`} section={section} index={sIndex}>
                                {(dragHandleProps) => (
                                    <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
                                        <div style={{ background: 'rgba(212, 175, 55, 0.05)', padding: '1.5rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(212, 175, 55, 0.1)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                                <div {...dragHandleProps} className={styles.dragHandle}>
                                                    <GripVertical size={20} />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={section.name}
                                                    onChange={(e) => updateSectionName(sIndex, e.target.value)}
                                                    placeholder="Nome Categoria"
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
                                            </div>
                                            <button onClick={() => removeSection(sIndex)} className={styles.iconBtnDelete} style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '10px' }}>
                                                <Trash2 size={20} />
                                            </button>
                                        </div>

                                        <div style={{ padding: '2rem 2.5rem' }}>
                                            <button
                                                onClick={() => addItem(sIndex)}
                                                className={styles.btnSm}
                                                style={{ width: '100%', marginBottom: '2rem' }}
                                                disabled={isDemo}
                                            >
                                                <Plus size={18} /> Aggiungi Articolo
                                            </button>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                                {section.items.map((item, iIndex) => (
                                                    <div key={item.id || iIndex} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px', gap: '2rem', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.5rem' }}>
                                                        {/* Image Column */}
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
                                                                {item.imageUrl ? (
                                                                    <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                                                            {item.imageUrl && (
                                                                <button onClick={() => updateItem(sIndex, iIndex, 'imageUrl', '')} style={{ border: 'none', background: 'transparent', color: '#ef4444', fontSize: '0.7rem' }}>Rimuovi</button>
                                                            )}
                                                        </div>

                                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                            <input
                                                                type="text"
                                                                value={item.name}
                                                                onChange={e => updateItem(sIndex, iIndex, 'name', e.target.value)}
                                                                placeholder="Nome Articolo"
                                                                className={styles.formInput}
                                                                style={{ fontSize: '1.1rem', fontWeight: 600 }}
                                                                readOnly={isDemo}
                                                            />
                                                            <textarea
                                                                value={item.description}
                                                                onChange={e => updateItem(sIndex, iIndex, 'description', e.target.value)}
                                                                placeholder="Descrizione..."
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
                                )}
                            </SortableSection>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {/* Sticky Save Bar */}
            <div className={styles.stickySaveBar}>
                <div className={styles.unsavedWarning}>
                    {isDirty ? (
                        <span>Modifiche non salvate!</span>
                    ) : (
                        <span style={{ color: '#4ade80' }}>Modulo aggiornato</span>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                        onClick={handleSave} 
                        disabled={saving || !isDirty || isDemo}
                        className={styles.btnPrimary}
                        style={{ padding: '12px 30px', borderRadius: '30px', opacity: (!isDirty && !saving) ? 0.5 : 1 }}
                    >
                        {saving ? 'Salvataggio...' : 'Salva Modulo'}
                        <Save size={18} />
                    </button>
                    <button 
                        onClick={() => {
                            if (originalDataRef.current) {
                                setCustomList(JSON.parse(originalDataRef.current));
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
