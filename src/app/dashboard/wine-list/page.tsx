'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../premium-dashboard.module.css';

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
    const router = useRouter();

    useEffect(() => {
        fetchWineList();
    }, []);

    const fetchWineList = async () => {
        try {
            const res = await fetch('/api/wine-list');
            if (res.ok) {
                const data = await res.json();
                if (data && data.sections) {
                    setWineList({
                        ...data,
                        sections: data.sections.map((s: any) => ({
                            ...s,
                            items: s.items.map((i: any) => ({
                                ...i,
                                price: Number(i.price)
                            }))
                        }))
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching wine list:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/wine-list', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(wineList)
            });

            if (res.ok) {
                // Show a small success feedback or just reload data
                fetchWineList();
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
        setWineList(prev => ({
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

    const addWine = (sectionIndex: number) => {
        setWineList(prev => {
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

    const removeWine = (sectionIndex: number, itemIndex: number) => {
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

    const updateWine = (sectionIndex: number, itemIndex: number, field: keyof WineItem, value: any) => {
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

    if (loading) return <div className={styles.container}>Caricamento...</div>;

    return (
        <div className={styles.container}>

            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Carta dei Vini</h1>
                    <p className={styles.subtitle}>Gestisci la tua cantina digitale.</p>
                </div>
            </header>

            {/* Global Settings Card */}
            <div className={styles.card} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.25rem', fontFamily: 'var(--font-playfair, serif)' }}>Stato Pubblicazione</h3>
                    <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>Rendi visibile la carta dei vini sul menu pubblico</p>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '56px', height: '30px', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={wineList.isActive}
                        onChange={e => setWineList({ ...wineList, isActive: e.target.checked })}
                        style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                        position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: wineList.isActive ? '#10b981' : '#e5e7eb',
                        transition: '.4s', borderRadius: '34px',
                    }}></span>
                    <span style={{
                        position: 'absolute', content: '""', height: '22px', width: '22px', left: '4px', bottom: '4px',
                        backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                        transform: wineList.isActive ? 'translateX(26px)' : 'translateX(0)'
                    }}></span>
                </label>
            </div>

            {/* Add Section Button */}
            <div style={{ marginBottom: '2rem' }}>
                <button
                    onClick={addSection}
                    className={styles.btnSecondary}
                    style={{ width: '100%', justifyContent: 'center', padding: '1rem', borderStyle: 'dashed' }}
                >
                    + Aggiungi Sezione (es. Rossi, Bianchi)
                </button>
            </div>

            {/* Sections List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {wineList.sections.map((section, sIndex) => (
                    <div key={section.id || sIndex} className={styles.card}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1.5rem',
                            borderBottom: '1px solid #eee',
                            paddingBottom: '1rem'
                        }}>
                            <input
                                type="text"
                                value={section.name}
                                onChange={e => updateSectionName(sIndex, e.target.value)}
                                placeholder="Nome Sezione (es. Vini Rossi)"
                                className={styles.input}
                                style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: 'var(--font-playfair, serif)', border: 'none', padding: 0, background: 'transparent' }}
                            />
                            <button
                                onClick={() => removeSection(sIndex)}
                                className={styles.btnDanger}
                                title="Elimina Sezione"
                            >
                                Elimina
                            </button>
                        </div>

                        {/* Wines List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {section.items.map((item, iIndex) => (
                                <div key={item.id || iIndex} style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    alignItems: 'flex-start',
                                    padding: '1rem',
                                    background: '#f9fafb',
                                    borderRadius: '12px',
                                    border: '1px solid #e5e7eb'
                                }}>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <input
                                            type="text"
                                            value={item.name}
                                            onChange={e => updateWine(sIndex, iIndex, 'name', e.target.value)}
                                            placeholder="Nome del Vino"
                                            className={styles.input}
                                            style={{ fontWeight: '600' }}
                                        />
                                        <textarea
                                            value={item.description}
                                            onChange={e => updateWine(sIndex, iIndex, 'description', e.target.value)}
                                            placeholder="Descrizione (Cantina, Annata, ecc.)"
                                            className={styles.input}
                                            style={{ minHeight: '60px', fontSize: '0.9rem', resize: 'vertical' }}
                                        />
                                    </div>

                                    <div style={{ width: '100px' }}>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="number"
                                                value={item.price}
                                                onChange={e => updateWine(sIndex, iIndex, 'price', e.target.value)}
                                                placeholder="0.00"
                                                className={styles.input}
                                                style={{ paddingRight: '20px' }}
                                            />
                                            <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999' }}>€</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => removeWine(sIndex, iIndex)}
                                        className={styles.btnSecondary}
                                        style={{ color: '#ef4444', borderColor: '#fee2e2', background: '#fef2f2' }}
                                        title="Rimuovi Vino"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}

                            <button
                                onClick={() => addWine(sIndex)}
                                className={styles.btnLink}
                                style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
                            >
                                + Aggiungi Vino
                            </button>
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
                    disabled={saving}
                    className={styles.btnPrimary}
                    style={{
                        borderRadius: '40px',
                        padding: '12px 30px',
                        fontSize: '1rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        width: 'auto',
                        opacity: saving ? 0.7 : 1
                    }}
                >
                    {saving ? 'Salvataggio...' : 'Salva Modifiche'}
                </button>
                <Link href="/dashboard"
                    className={styles.btnSecondary}
                    style={{
                        borderRadius: '50%',
                        width: '46px',
                        height: '46px',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #ddd'
                    }} title="Torna alla Dashboard">
                    ←
                </Link>
            </div>
        </div>
    );
}
