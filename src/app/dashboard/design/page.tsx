'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from '../restaurant-dashboard.module.css';
import { Palette, Image as ImageIcon, Type, Layout, Save, X } from 'lucide-react';
import LoadingOverlay from '@/components/common/LoadingOverlay';

interface Restaurant {
    id: string;
    name: string;
    description: string;
    slug: string;
    logoUrl: string | null;
    coverImageUrl: string | null;
    themeColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
    cardStyle: string;
}

export default function DesignPage() {
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null); // 'logo' or 'cover'
    const [isDemo, setIsDemo] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Dirty state management
    const originalDataRef = useRef<Restaurant | null>(null);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        fetchRestaurant();
    }, []);

    const fetchRestaurant = async () => {
        try {
            const res = await fetch('/api/restaurant');
            const data = await res.json();
            if (data.restaurant) {
                setRestaurant(data.restaurant);
                originalDataRef.current = { ...data.restaurant };
                setIsDemo(!!data.isDemo);
            }
        } catch (error) {
            console.error('Error fetching restaurant:', error);
        } finally {
            setLoading(false);
        }
    };

    // Check for dirty state
    useEffect(() => {
        if (!restaurant || !originalDataRef.current) return;
        const hasChanged = JSON.stringify(restaurant) !== JSON.stringify(originalDataRef.current);
        setIsDirty(hasChanged);
    }, [restaurant]);

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

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (isDemo) {
            setMessage({ type: 'error', text: 'Modalità Demo: modifiche non consentite' });
            return;
        }
        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch('/api/restaurant', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(restaurant),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Design aggiornato con successo!' });
                originalDataRef.current = { ...restaurant! };
                setIsDirty(false);
            } else {
                setMessage({ type: 'error', text: 'Errore durante il salvataggio' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Errore di connessione' });
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'logoUrl' | 'coverImageUrl') => {
        const file = e.target.files?.[0];
        if (!file || !restaurant) return;
        if (isDemo) {
            setMessage({ type: 'error', text: 'Modalità Demo: caricamento non consentito' });
            return;
        }

        setUploading(fieldName);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('restaurantId', restaurant.id);
        formData.append('fieldName', fieldName);

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            if (res.ok) {
                const data = await res.json();
                setRestaurant({ ...restaurant, [fieldName]: data.imageUrl });
                setMessage({ type: 'success', text: 'Immagine caricata con successo!' });
            } else {
                setMessage({ type: 'error', text: 'Errore caricamento immagine' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Errore caricamento' });
        } finally {
            setUploading(null);
        }
    };

    if (loading) return <LoadingOverlay />;
    if (!restaurant) return <div className={styles.container}>Ristorante non trovato.</div>;

    const fontOptions = [
        { value: 'inter', label: 'Inter (Moderno)' },
        { value: 'playfair', label: 'Playfair Display (Elegante)' },
        { value: 'roboto', label: 'Roboto (Neutro)' },
        { value: 'lato', label: 'Lato (Friendly)' },
        { value: 'montserrat', label: 'Montserrat (Geometrico)' }
    ];

    const cardStyleOptions = [
        { value: 'minimal', label: 'Minimal (Pulito)' },
        { value: 'shadow', label: 'Ombreggiato (Depth)' },
        { value: 'border', label: 'Bordato (Classico)' },
        { value: 'glass', label: 'Glassmorphism (Moderno)' }
    ];

    return (
        <div className={styles.container} style={{ paddingBottom: '140px' }}>
            <div className={styles.header}>
                <h1 className={styles.title}>Aspetto & Design</h1>
                <p className={styles.subtitle}>Personalizza l&apos;identità visiva del tuo menù digitale con uno stile Premium.</p>
            </div>

            {message && (
                <div className={styles.message} style={{
                    marginBottom: '2rem',
                    padding: '1.2rem',
                    borderRadius: '16px',
                    background: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(74, 222, 128, 0.1)',
                    border: `1px solid ${message.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(74, 222, 128, 0.2)'}`,
                    color: message.type === 'error' ? '#ef4444' : '#4ade80',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    {message.type === 'error' ? '❌' : '✅'} {message.text}
                </div>
            )}

            <form onSubmit={handleSave} className={styles.form} style={{ maxWidth: '100%' }}>
                <div className={styles.grid}>
                    {/* Branding Section */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}><ImageIcon size={20} /> Branding & Logo</h2>
                        <div className={styles.cardDesc}>
                            Gestisci il logo e l&apos;immagine di copertina del tuo ristorante per un brand riconoscibile.
                        </div>

                        <div className={styles.inputGroup} style={{ marginBottom: '1.5rem' }}>
                            <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Logo Ristorante</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginTop: '1rem' }}>
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.05)',
                                    overflow: 'hidden',
                                    border: '1px solid rgba(212, 175, 55, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                                }}>
                                    {restaurant.logoUrl ? (
                                        <img src={restaurant.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <ImageIcon size={32} color="rgba(212, 175, 55, 0.3)" />
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="logo-upload"
                                        onChange={(e) => handleFileUpload(e, 'logoUrl')}
                                        style={{ display: 'none' }}
                                    />
                                    <label htmlFor="logo-upload" className={styles.btnPrimary} style={{
                                        cursor: isDemo ? 'not-allowed' : 'pointer',
                                        display: 'inline-flex',
                                        opacity: isDemo ? 0.6 : 1,
                                        width: 'auto',
                                        padding: '10px 20px',
                                        fontSize: '0.85rem'
                                    }}>
                                        {uploading === 'logoUrl' ? 'Caricamento...' : (isDemo ? 'Disabilitato' : 'Sostituisci Logo')}
                                    </label>
                                    <p className={styles.helperText}>PNG o JPG quadrata (consigliato 500x500px)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Style Section */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}><Palette size={20} /> Stile & Tipografia</h2>
                        <div className={styles.cardDesc}>
                            Personalizza i font e l&apos;aspetto delle schede per un&apos;esperienza di lettura superiore.
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div className={styles.inputGroup}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Type size={16} color="#d4af37" /> Font (Carattere)
                                </label>
                                <select
                                    value={restaurant.fontFamily}
                                    onChange={(e) => setRestaurant({ ...restaurant, fontFamily: e.target.value })}
                                    className={styles.formInput}
                                    style={{ background: 'rgba(0,0,0,0.3)' }}
                                >
                                    {fontOptions.map(opt => (
                                        <option key={opt.value} value={opt.value} style={{ background: '#1a1a1a', color: '#fff' }}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.inputGroup}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Layout size={16} color="#d4af37" /> Stile Schede Piatti
                                </label>
                                <select
                                    value={restaurant.cardStyle}
                                    onChange={(e) => setRestaurant({ ...restaurant, cardStyle: e.target.value })}
                                    className={styles.formInput}
                                    style={{ background: 'rgba(0,0,0,0.3)' }}
                                >
                                    {cardStyleOptions.map(opt => (
                                        <option key={opt.value} value={opt.value} style={{ background: '#1a1a1a', color: '#fff' }}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {/* Sticky Save Bar */}
            <div className={styles.stickySaveBar}>
                <div className={styles.unsavedWarning}>
                    {isDirty ? (
                        <span>Hai modifiche non salvate!</span>
                    ) : (
                        <span style={{ color: '#4ade80' }}>Tutte le modifiche salvate</span>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                        onClick={() => handleSave()} 
                        disabled={saving || !isDirty || isDemo}
                        className={styles.btnPrimary}
                        style={{ padding: '12px 30px', borderRadius: '30px', opacity: (!isDirty && !saving) ? 0.5 : 1 }}
                    >
                        {saving ? 'Salvataggio...' : 'Salva Stile'}
                        <Save size={18} />
                    </button>
                    <button 
                        onClick={() => {
                            setRestaurant({ ...originalDataRef.current! });
                            setIsDirty(false);
                            setMessage(null);
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
