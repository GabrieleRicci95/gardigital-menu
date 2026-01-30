'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../restaurant-dashboard.module.css';

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
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchRestaurant();
    }, []);

    const fetchRestaurant = async () => {
        try {
            const res = await fetch('/api/restaurant');
            const data = await res.json();
            if (data.restaurant) {
                setRestaurant(data.restaurant);
            }
        } catch (error) {
            console.error('Error fetching restaurant:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
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

    if (loading) return <div className={styles.container}>Caricamento impostazioni...</div>;
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
        <div className={styles.container} style={{ paddingBottom: '120px' }}>
            <div className={styles.header}>
                <h1 className={styles.title}>Aspetto & Design</h1>
                <p className={styles.subtitle}>Personalizza l'identità visiva del tuo menù digitale.</p>
            </div>

            {message && (
                <div className={styles.message} style={{ marginBottom: '1.5rem', color: message.type === 'error' ? '#c62828' : undefined }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSave} className={styles.form} style={{ maxWidth: '100%' }}>

                <div className={styles.grid}>
                    {/* Branding Section */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Branding & Logo</h2>
                        <div className={styles.cardDesc}>
                            Gestisci il logo e l'immagine di copertina del tuo ristorante.
                        </div>

                        <div className={styles.inputGroup} style={{ marginBottom: '1.5rem' }}>
                            <label>Logo Ristorante</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: '#f5f5f5',
                                    overflow: 'hidden',
                                    border: '2px solid #eee',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {restaurant.logoUrl ? (
                                        <img src={restaurant.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span style={{ fontSize: '2rem', color: '#ccc' }}>📷</span>
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
                                    <label htmlFor="logo-upload" className={styles.btnSm} style={{ cursor: 'pointer', display: 'inline-flex' }}>
                                        {uploading === 'logoUrl' ? 'Caricamento...' : 'Carica Logo'}
                                    </label>
                                    <p className={styles.helperText}>Formato consigliato: PNG o JPG quadrata (500x500px)</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Style Section */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Stile & Tipografia</h2>
                        <div className={styles.cardDesc}>
                            Personalizza i colori e i font del tuo menù.
                        </div>

                        <div className={styles.form} style={{ gap: '1.5rem' }}>
                            <div className={styles.inputGroup}>
                                <label>Font (Carattere)</label>
                                <select
                                    value={restaurant.fontFamily}
                                    onChange={(e) => setRestaurant({ ...restaurant, fontFamily: e.target.value })}
                                    className={styles.formInput}
                                >
                                    {fontOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Stile Schede Piatti</label>
                                <select
                                    value={restaurant.cardStyle}
                                    onChange={(e) => setRestaurant({ ...restaurant, cardStyle: e.target.value })}
                                    className={styles.formInput}
                                >
                                    {cardStyleOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

            </form>

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
                    onClick={() => handleSave()}
                    disabled={saving}
                    style={{
                        background: '#000',
                        color: 'white',
                        padding: '12px 30px',
                        borderRadius: '40px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        border: 'none',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        opacity: saving ? 0.7 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}
                >
                    {saving ? 'Salvataggio...' : (
                        <>
                            <span>Salva Modifiche</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                        </>
                    )}
                </button>
                <Link href="/dashboard" style={{
                    background: '#f3f4f6',
                    color: '#333',
                    padding: '12px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    border: '1px solid #ddd'
                }} title="Torna alla Dashboard">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </Link>
            </div>
        </div>
    );
}
