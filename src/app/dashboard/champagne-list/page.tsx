'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../restaurant-dashboard.module.css';
import { Wine, Plus, Trash2, Save, X, ChevronRight, GripVertical } from 'lucide-react';
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

// ---- Sortable Section Wrapper ----
function SortableSection({ section, index, children }: { section: ChampagneSection; index: number; children: (dragHandleProps: any) => React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id || `section-${index}` });
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

// ---- Sortable Section Wrapper ----
function SortableSection({ section, index, children }: { section: ChampagneSection; index: number; children: (dragHandleProps: any) => React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id || `section-${index}` });
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

export default function ChampagneListPage() {
    const [champagneList, setChampagneList] = useState<ChampagneList>({
        isActive: true,
        sections: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isDemo, setIsDemo] = useState(false);
    const router = useRouter();

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 300, tolerance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // Dirty state management
    const originalDataRef = useRef<string>('');
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        fetchChampagneList();
    }, []);

    const fetchChampagneList = async () => {
        try {
            const res = await fetch('/api/champagne-list');
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
                    setChampagneList(formattedData);
                    originalDataRef.current = JSON.stringify(formattedData);
                }
            }
        } catch (error) {
            console.error('Error fetching champagne list:', error);
        } finally {
            setLoading(false);
        }
    };

    // Check for dirty state
    useEffect(() => {
        if (!originalDataRef.current) return;
        const currentDataStr = JSON.stringify(champagneList);
        setIsDirty(currentDataStr !== originalDataRef.current);
    }, [champagneList]);

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
            ...champagneList,
            sections: champagneList.sections.map((s, idx) => ({ ...s, sortOrder: idx }))
        };
        try {
            const res = await fetch('/api/champagne-list', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(listToSave)
            });

            if (res.ok) {
                originalDataRef.current = JSON.stringify(champagneList);
                setIsDirty(false);
                alert('Carta Champagne salvata con successo!');
            } else {
                alert('Errore durante il salvataggio');
            }
        } catch (error) {
            alert('Errore di connessione');
        } finally {
            setSaving(false);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (event.over && active.id !== over?.id) {
            setChampagneList((prev) => {
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
        setChampagneList(prev => ({
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
        if (isDemo) return alert('Modalità Demo: modifiche non consentite');
        setChampagneList(prev => {
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

    if (loading) return <LoadingOverlay />;

    return (
        <div className={styles.container} style={{ paddingBottom: '140px' }}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Carta Champagne</h1>
                    <p className={styles.subtitle}>Gestisci la tua selezione di Champagne. Organizza le bottiglie con la massima esclusività.</p>
                </div>
                <button onClick={addSection} className={styles.newSectionBtn}>
                    <Plus size={20} /> Nuova Categoria
                </button>
            </header>

            {/* Global Settings */}
            <div className={styles.card} style={{ marginBottom: '2.5rem', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 className={styles.cardTitle} style={{ margin: 0 }}><Wine size={20} /> Stato Pubblicazione</h3>
                        <p className={styles.cardDesc} style={{ margin: 0, marginTop: '4px' }}>Rendi visibile la carta champagne sul tuo menu pubblico.</p>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '32px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={champagneList.isActive}
                            onChange={e => !isDemo && setChampagneList({ ...champagneList, isActive: e.target.checked })}
                            style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: champagneList.isActive ? '#d4af37' : 'rgba(255,255,255,0.1)',
                            transition: '.4s', borderRadius: '34px',
                            boxShadow: champagneList.isActive ? '0 0 15px rgba(212, 175, 55, 0.4)' : 'none'
                        }}></span>
                        <span style={{
                            position: 'absolute', height: '24px', width: '24px', left: '4px', bottom: '4px',
                            backgroundColor: '#fff', transition: '.4s', borderRadius: '50%',
                            transform: champagneList.isActive ? 'translateX(28px)' : 'translateX(0)'
                        }}></span>
                    </label>
                </div>
            </div>

            {/* Sections List */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={champagneList.sections.map((s, idx) => s.id || `section-${idx}`)} strategy={verticalListSortingStrategy}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        {champagneList.sections.map((section, sIndex) => (
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
                                                    placeholder="Nome Categoria (es. Millesimati)"
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
                                                <Plus size={18} /> Aggiungi Champagne
                                            </button>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                                {section.items.map((item, iIndex) => (
                                                    <div key={item.id || iIndex} style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.5rem' }}>
                                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                            <input
                                                                type="text"
                                                                value={item.name}
                                                                onChange={e => updateItem(sIndex, iIndex, 'name', e.target.value)}
                                                                placeholder="Nome dello Champagne"
                                                                className={styles.formInput}
                                                                style={{ fontSize: '1.1rem', fontWeight: 600 }}
                                                                readOnly={isDemo}
                                                            />
                                                            <textarea
                                                                value={item.description}
                                                                onChange={e => updateItem(sIndex, iIndex, 'description', e.target.value)}
                                                                placeholder="Note di degustazione, Millesimo..."
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
                        <span style={{ color: '#4ade80' }}>Carta aggiornata</span>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                        onClick={handleSave} 
                        disabled={saving || !isDirty || isDemo}
                        className={styles.btnPrimary}
                        style={{ padding: '12px 30px', borderRadius: '30px', opacity: (!isDirty && !saving) ? 0.5 : 1 }}
                    >
                        {saving ? 'Salvataggio...' : 'Salva Champagne'}
                        <Save size={18} />
                    </button>
                    <button 
                        onClick={() => {
                            if (originalDataRef.current) {
                                setChampagneList(JSON.parse(originalDataRef.current));
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
