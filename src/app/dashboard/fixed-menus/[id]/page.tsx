'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface MenuItem {
    id?: string;
    name: string;
    description?: string;
    allergens?: number[]; // Array of allergen IDs
}

const allergensData = [
    { id: 1, name: 'Glutine', icon: '🌾' },
    { id: 2, name: 'Crostacei', icon: '🦞' },
    { id: 3, name: 'Uova', icon: '🥚' },
    { id: 4, name: 'Pesce', icon: '🐟' },
    { id: 5, name: 'Arachidi', icon: '🥜' },
    { id: 6, name: 'Soia', icon: '🫘' },
    { id: 7, name: 'Latte', icon: '🥛' },
    { id: 8, name: 'Frutta a Guscio', icon: '🌰' },
    { id: 9, name: 'Sedano', icon: '🥬' },
    { id: 10, name: 'Senape', icon: '🧴' },
    { id: 11, name: 'Sesamo', icon: '🌱' },
    { id: 12, name: 'Lupini', icon: '🧆' },
    { id: 13, name: 'Molluschi', icon: '🐚' },
    { id: 14, name: 'Anidride Solforosa', icon: '🧪' },
];

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

export default function FixedMenuEditorPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params using React.use() or await in async component. 
    // Since this is a client component, we use the useParams hook or async unwrapping.
    // Next.js 15: params is a promise.

    const [menu, setMenu] = useState<FixedMenu>({
        name: '',
        subtitle: '',
        price: '',
        description: '',
        isActive: true,
        sections: []
    });

    // We need to handle the unwrapping of params properly
    const [id, setId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isDemo, setIsDemo] = useState(false);
    const router = useRouter();

    useEffect(() => {
        params.then((p) => {
            setId(p.id);
            if (p.id !== 'new') {
                fetchMenu(p.id);
            } else {
                setLoading(false);
                // Auto-add one section for better UX
                setMenu(prev => ({
                    ...prev,
                    sections: [{
                        id: `temp_${Date.now()}`,
                        name: '',
                        items: []
                    }]
                }));
            }
        });
    }, [params]);

    const fetchMenu = async (menuId: string) => {
        try {
            const res = await fetch(`/api/fixed-menus/${menuId}`);
            if (res.ok) {
                const data = await res.json();
                setMenu({
                    ...data,
                    price: Number(data.price),
                    sections: data.sections.map((s: any) => ({
                        ...s,
                        items: s.items.map((i: any) => ({
                            ...i,
                            allergens: i.allergens ? JSON.parse(i.allergens) : []
                        }))
                    }))
                });
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

    const handleSave = async () => {
        if (!menu.name || !menu.price) {
            alert('Inserisci Nome e Prezzo');
            return;
        }

        if (isDemo) {
            alert('Modalità Demo: modifiche non consentite');
            setSaving(false);
            return;
        }
        setSaving(true);
        try {
            let res;
            if (id === 'new') {
                // Create
                res = await fetch('/api/fixed-menus', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(menu)
                });
            } else {
                // Update
                res = await fetch(`/api/fixed-menus/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(menu)
                });
            }

            if (res.ok) {
                const savedMenu = await res.json();
                // If created, might need to redirect to edit page or back to list
                if (id === 'new') {
                    router.push(`/dashboard/fixed-menus/${savedMenu.id}`);
                } else {
                    alert('Menu salvato con successo');
                    fetchMenu(id!); // Refresh data
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

    // --- Form Handlers ---

    const addSection = () => {
        setMenu(prev => ({
            ...prev,
            sections: [
                ...prev.sections,
                {
                    id: `temp_${Date.now()}`,
                    name: '',
                    items: []
                }
            ]
        }));
    };

    const removeSection = (index: number) => {
        setMenu(prev => {
            const newSections = [...prev.sections];
            newSections.splice(index, 1);
            return { ...prev, sections: newSections };
        });
    };

    const updateSection = (index: number, field: keyof MenuSection, value: any) => {
        setMenu(prev => {
            const newSections = [...prev.sections];
            newSections[index] = { ...newSections[index], [field]: value };
            return { ...prev, sections: newSections };
        });
    };

    const addItem = (sectionIndex: number) => {
        setMenu(prev => {
            const newSections = [...prev.sections];
            newSections[sectionIndex].items.push({
                id: `temp_${Date.now()}`,
                name: ''
            });
            return { ...prev, sections: newSections };
        });
    };

    const removeItem = (sectionIndex: number, itemIndex: number) => {
        setMenu(prev => {
            const newSections = [...prev.sections];
            newSections[sectionIndex].items.splice(itemIndex, 1);
            return { ...prev, sections: newSections };
        });
    };

    const updateItem = (sectionIndex: number, itemIndex: number, field: keyof MenuItem, value: any) => {
        setMenu(prev => {
            const newSections = [...prev.sections];
            newSections[sectionIndex].items[itemIndex] = {
                ...newSections[sectionIndex].items[itemIndex],
                [field]: value
            };
            return { ...prev, sections: newSections };
        });
    };

    const toggleAllergen = (sectionIndex: number, itemIndex: number, allergenId: number) => {
        setMenu(prev => {
            const newSections = [...prev.sections];
            const item = newSections[sectionIndex].items[itemIndex];
            const currentAllergens = item.allergens || [];

            let newAllergens;
            if (currentAllergens.includes(allergenId)) {
                newAllergens = currentAllergens.filter(id => id !== allergenId);
            } else {
                newAllergens = [...currentAllergens, allergenId];
            }

            newSections[sectionIndex].items[itemIndex] = { ...item, allergens: newAllergens };
            return { ...prev, sections: newSections };
        });
    };

    if (loading) return <div style={{ padding: '2rem' }}>Caricamento...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', paddingBottom: '100px' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/dashboard/fixed-menus" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 20px',
                    borderRadius: '12px',
                    background: 'white',
                    color: '#333',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                    border: '1px solid #eee',
                    marginBottom: '1rem'
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Torna ai Menu
                </Link>
                <h1 style={{ marginTop: '1rem', fontSize: '2rem' }}>
                    {id === 'new' ? 'Nuovo Menu Fisso' : 'Modifica Menu'}
                </h1>
            </div>

            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Nome Menu</label>
                    <input
                        type="text"
                        value={menu.name}
                        onChange={e => setMenu({ ...menu, name: e.target.value })}
                        placeholder="Es. Menu Degustazione"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem' }}
                    />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Sottotitolo (opzionale)</label>
                    <input
                        type="text"
                        value={menu.subtitle || ''}
                        onChange={e => setMenu({ ...menu, subtitle: e.target.value })}
                        placeholder="Breve descrizione"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem' }}
                    />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Prezzo (€)</label>
                        <input
                            type="number"
                            value={menu.price}
                            onChange={e => setMenu({ ...menu, price: e.target.value })}
                            onWheel={(e) => (e.target as HTMLInputElement).blur()}
                            placeholder="0.00"
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Descrizione Menu</label>
                        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem', marginTop: 0 }}>Inserisci qui tutto il testo del menu (piatti, allergeni, note). Puoi andare a capo.</p>
                        <textarea
                            value={menu.description || ''}
                            onChange={e => setMenu({ ...menu, description: e.target.value })}
                            placeholder="Inserisci qui il contenuto del menu..."
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '6px',
                                border: '1px solid #ccc',
                                fontSize: '1rem',
                                minHeight: '200px',
                                fontFamily: 'inherit',
                                resize: 'vertical',
                                lineHeight: '1.5'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={menu.isActive}
                                onChange={e => setMenu({ ...menu, isActive: e.target.checked })}
                                style={{ width: '20px', height: '20px' }}
                            />
                            <span style={{ fontSize: '1rem' }}>Visibile ai clienti</span>
                        </label>
                    </div>
                </div>

                {/* Sticky Save Bar */}
                <div style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'white',
                    borderTop: '1px solid #eaeaea',
                    padding: '1rem',
                    display: 'flex',
                    justifyContent: 'center',
                    boxShadow: '0 -4px 20px rgba(0,0,0,0.05)'
                }}>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{
                            background: isDemo ? '#ccc' : '#0070f3',
                            color: 'white',
                            padding: '12px 40px',
                            borderRadius: '50px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: (saving || isDemo) ? 'not-allowed' : 'pointer',
                            opacity: (saving || isDemo) ? 0.7 : 1
                        }}
                    >
                        {saving ? 'Salvataggio...' : (isDemo ? 'Disabilitato (Demo)' : 'Salva Modifiche')}
                    </button>
                </div>
            </div >
        </div >
    );
}
