'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../premium-dashboard.module.css';


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
    const [isDemo, setIsDemo] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        try {
            const res = await fetch('/api/fixed-menus');
            if (res.ok) {
                const data = await res.json();
                // If it's the overview route it might be different structure, let's check restaurant api too
                const restRes = await fetch('/api/restaurant');
                if (restRes.ok) {
                    const restData = await restRes.json();
                    setIsDemo(!!restData.isDemo);
                }
                setMenus(data);
            }
        } catch (error) {
            console.error('Error fetching menus:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (isDemo) return alert('Modalità Demo: modifiche non consentite');
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

    if (loading) return <div className={styles.loading}>Caricamento...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Menu Fissi</h1>
                    <p className={styles.subtitle}>Gestisci i menu per eventi e ricorrenze.</p>
                </div>
                <Link
                    href="/dashboard/fixed-menus/new"
                    className={styles.btnPrimary}
                >
                    + Nuovo Menu
                </Link>
            </div>

            {menus.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}></div>
                    <h3>Nessun menu fisso creato</h3>
                    <p>Inizia creando il tuo primo menu fisso per eventi o offerte speciali.</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {menus.map(menu => (
                        <div key={menu.id} className={styles.card}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontFamily: 'var(--font-playfair, serif)', fontWeight: '700' }}>{menu.name}</h3>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#1a1a1a' }}>€{Number(menu.price).toFixed(2)}</span>
                                        {menu.isActive ? (
                                            <span className={`${styles.badge} ${styles.badgeSuccess}`}>ATTIVO</span>
                                        ) : (
                                            <span className={`${styles.badge} ${styles.badgeWarning}`}>NON ATTIVO</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                                <Link
                                    href={`/dashboard/fixed-menus/${menu.id}`}
                                    className={styles.btnSecondary}
                                    style={{ flex: 1, textDecoration: 'none' }}
                                >
                                    Modifica
                                </Link>
                                <button
                                    onClick={() => handleDelete(menu.id)}
                                    className={styles.btnDanger}
                                    style={{ flex: 1, opacity: isDemo ? 0.5 : 1 }}
                                    disabled={isDemo}
                                >
                                    {isDemo ? 'Bloccato' : 'Elimina'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
