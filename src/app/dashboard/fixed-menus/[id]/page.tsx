'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../../restaurant-dashboard.module.css';
import { Utensils, Plus, Trash2, Save, X, ChevronLeft } from 'lucide-react';
import LoadingOverlay from '@/components/common/LoadingOverlay';

interface MenuItem {
    id?: string;
    name: string;
    description?: string;
    allergens?: number[]; // Array of allergen IDs
}

interface MenuSection {
    id?: string;
    name: string;
    description?: string;
    items: MenuItem[];
    sortOrder?: number;
}

interface FixedMenu {
    id?: string;
    name: string;
    subtitle?: string;
    price: string | number;
    description?: string;
    isActive: boolean;
    sections: MenuSection[];
}

export default function FixedMenuEditorPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const [menu, setMenu] = useState<FixedMenu>({
        name: '',
        subtitle: '',
        price: '',
        description: '',
        isActive: true,
        sections: []
    });

    const [id, setId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isDemo, setIsDemo] = useState(false);
    const router = useRouter();

    // Dirty state management
    const originalDataRef = useRef<string>('');
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        paramsPromise.then((p) => {
            setId(p.id);
            if (p.id !== 'new') {
                fetchMenu(p.id);
            } else {
                setLoading(false);
                const initialMenu = {
                    name: '',
                    subtitle: '',
                    price: '',
                    description: '',
                    isActive: true,
                    sections: [{
                        id: `temp_${Date.now()}`,
                        name: '',
                        items: []
                    }]
                };
                setMenu(initialMenu);
                originalDataRef.current = JSON.stringify(initialMenu);
            }
        });
    }, [paramsPromise]);

    const fetchMenu = async (menuId: string) => {
        try {
            const res = await fetch(`/api/fixed-menus/${menuId}`);
            if (res.ok) {
                const data = await res.json();
                const formattedData = {
                    ...data,
                    price: Number(data.price),
                    sections: data.sections.map((s: any) => ({
                        ...s,
                        items: s.items.map((i: any) => ({
                            ...i,
                            allergens: i.allergens ? JSON.parse(i.allergens) : []
                        }))
                    }))
                };
                setMenu(formattedData);
                originalDataRef.current = JSON.stringify(formattedData);
                setIsDemo(!!data.isDemo);
            } else {
                alert('Menu non trovato');
                router.push('/dashboard/fixed-menus');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Check for dirty state
    useEffect(() => {
        if (!originalDataRef.current) return;
        const currentDataStr = JSON.stringify(menu);
        setIsDirty(currentDataStr !== originalDataRef.current);
    }, [menu]);

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
        if (!menu.name || !menu.price) {
            alert('Inserisci Nome e Prezzo');
            return;
        }

        if (isDemo) {
            alert('Modalità Demo: modifiche non consentite');
            return;
        }
        setSaving(true);
        try {
            let res;
            if (id === 'new') {
                res = await fetch('/api/fixed-menus', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(menu)
                });
            } else {
                res = await fetch(`/api/fixed-menus/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(menu)
                });
            }

            if (res.ok) {
                const savedMenu = await res.json();
                originalDataRef.current = JSON.stringify(menu);
                setIsDirty(false);
                if (id === 'new') {
                    router.push(`/dashboard/fixed-menus/${savedMenu.id}`);
                } else {
                    alert('Menu salvato con successo');
                }
            } else {
                alert('Errore nel salvataggio');
            }
        } catch (error) {
            console.error(error);
            alert('Errore di connessione');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingOverlay />;

    return (
        <div className={styles.container} style={{ paddingBottom: '140px' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/dashboard/fixed-menus" className={styles.btnSm} style={{ width: 'auto', marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <ChevronLeft size={18} /> Torna ai Menu
                </Link>
                <header className={styles.header}>
                    <div>
                        <h1 className={styles.title}>{id === 'new' ? 'Nuovo Menu Fisso' : 'Modifica Menu Fisso'}</h1>
                        <p className={styles.subtitle}>Configura i dettagli del tuo menu degustazione o a prezzo fisso.</p>
                    </div>
                </header>
            </div>

            <div className={styles.card} style={{ background: 'rgba(212, 175, 55, 0.02)', border: '1px solid rgba(212, 175, 55, 0.1)' }}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Nome Menu</label>
                    <input
                        type="text"
                        value={menu.name}
                        onChange={e => setMenu({ ...menu, name: e.target.value })}
                        placeholder="Es. Menu Degustazione Reale"
                        className={styles.formInput}
                        readOnly={isDemo}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Sottotitolo (opzionale)</label>
                    <input
                        type="text"
                        value={menu.subtitle || ''}
                        onChange={e => setMenu({ ...menu, subtitle: e.target.value })}
                        placeholder="Breve descrizione o dedica"
                        className={styles.formInput}
                        readOnly={isDemo}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Prezzo (€)</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="number"
                            value={menu.price}
                            onChange={e => setMenu({ ...menu, price: e.target.value })}
                            className={styles.formInput}
                            style={{ paddingRight: '30px' }}
                            placeholder="0.00"
                            readOnly={isDemo}
                        />
                        <span style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#d4af37' }}>€</span>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Descrizione Menu</label>
                    <p className={styles.cardDesc} style={{ marginBottom: '10px' }}>Inserisci qui tutto il testo del menu. Puoi andare a capo liberamente.</p>
                    <textarea
                        value={menu.description || ''}
                        onChange={e => setMenu({ ...menu, description: e.target.value })}
                        placeholder="Es. Benvenuto dello Chef, Selezione di Antipasti..."
                        className={styles.formTextarea}
                        style={{ minHeight: '250px' }}
                        readOnly={isDemo}
                    />
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                        <h4 style={{ color: '#fff', margin: 0, fontSize: '1.1rem' }}>Visibilità Pubblica</h4>
                        <p className={styles.cardDesc} style={{ margin: 0, marginTop: '4px' }}>Rendi questo menu selezionabile dai tuoi ospiti.</p>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '32px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={menu.isActive}
                            onChange={e => !isDemo && setMenu({ ...menu, isActive: e.target.checked })}
                            style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: menu.isActive ? '#d4af37' : 'rgba(255,255,255,0.1)',
                            transition: '.4s', borderRadius: '34px',
                            boxShadow: menu.isActive ? '0 0 15px rgba(212, 175, 55, 0.4)' : 'none'
                        }}></span>
                        <span style={{
                            position: 'absolute', height: '24px', width: '24px', left: '4px', bottom: '4px',
                            backgroundColor: '#fff', transition: '.4s', borderRadius: '50%',
                            transform: menu.isActive ? 'translateX(28px)' : 'translateX(0)'
                        }}></span>
                    </label>
                </div>
            </div>

            {/* Sticky Save Bar */}
            <div className={styles.stickySaveBar}>
                <div className={styles.unsavedWarning}>
                    {isDirty ? (
                        <span>Modifiche non salvate!</span>
                    ) : (
                        <span style={{ color: '#4ade80' }}>Menu aggiornato</span>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                        onClick={handleSave} 
                        disabled={saving || !isDirty || isDemo}
                        className={styles.btnPrimary}
                        style={{ padding: '12px 30px', borderRadius: '30px', opacity: (!isDirty && !saving) ? 0.5 : 1 }}
                    >
                        {saving ? 'Salvataggio...' : 'Salva Menu'}
                        <Save size={18} />
                    </button>
                    <button 
                        onClick={() => {
                            if (originalDataRef.current) {
                                setMenu(JSON.parse(originalDataRef.current));
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
