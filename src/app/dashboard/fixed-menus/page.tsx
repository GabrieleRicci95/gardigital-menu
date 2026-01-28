'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FixedMenu {
    id: string;
    name: string;
    price: number;
    isActive: boolean;
    sections: { id: string }[];
}

export default function FixedMenusPage() {
    const [menus, setMenus] = useState<FixedMenu[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        try {
            const res = await fetch('/api/fixed-menus');
            if (res.ok) {
                const data = await res.json();
                setMenus(data);
            }
        } catch (error) {
            console.error('Error fetching menus:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Sei sicuro di voler eliminare questo menu?')) return;

        try {
            const res = await fetch(`/api/fixed-menus/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setMenus(menus.filter(m => m.id !== id));
            }
        } catch (error) {
            console.error('Error deleting menu:', error);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>Menu Fissi</h1>
                <Link
                    href="/dashboard/fixed-menus/new"
                    style={{
                        background: '#0070f3',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    + Nuovo Menu
                </Link>
            </div>

            {loading ? (
                <div>Caricamento...</div>
            ) : menus.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: '#f5f5f5', borderRadius: '12px' }}>
                    <h3>Nessun menu fisso creato</h3>
                    <p>Inizia creando il tuo primo menu fisso per eventi o offerte speciali.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {menus.map(menu => (
                        <div key={menu.id} style={{
                            background: 'white',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                            display: 'flex',
                            flexWrap: 'wrap', // Allow wrapping
                            gap: '1rem', // Add gap between wrapped items
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            border: '1px solid #eaeaea'
                        }}>
                            <div style={{ minWidth: '200px' }}>
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{menu.name}</h3>
                                <div style={{ display: 'flex', gap: '1rem', color: '#666', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                                    <span style={{ fontWeight: 'bold', color: '#0070f3' }}>€{Number(menu.price).toFixed(2)}</span>
                                    <span>{menu.sections.length} Sezioni</span>
                                    {menu.isActive ? (
                                        <span style={{ color: 'green', background: '#e6ffe6', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem' }}>Attivo</span>
                                    ) : (
                                        <span style={{ color: 'orange', background: '#fff5e6', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem' }}>Non attivo</span>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', width: '100%', maxWidth: '300px', justifyContent: 'flex-end' }}>
                                <Link
                                    href={`/dashboard/fixed-menus/${menu.id}`}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        background: '#f0f0f0',
                                        color: '#333',
                                        textDecoration: 'none',
                                        fontSize: '0.9rem',
                                        textAlign: 'center',
                                        flex: 1
                                    }}
                                >
                                    Modifica
                                </Link>
                                <button
                                    onClick={() => handleDelete(menu.id)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        background: '#fff0f0',
                                        color: '#d32f2f',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        textAlign: 'center',
                                        flex: 1
                                    }}
                                >
                                    Elimina
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
