'use client';

import { useState, useEffect } from 'react';
import styles from '../dashboard.module.css'; // Reusing dashboard styles

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

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
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

    if (loading) return <div className="p-8">Caricamento impostazioni...</div>;
    if (!restaurant) return <div className="p-8">Ristorante non trovato.</div>;

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
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem' }}>
            <h1 className="h2" style={{ marginBottom: '1.5rem' }}>Personalizzazione Grafica</h1>

            {message && (
                <div style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    background: message.type === 'success' ? '#e8f5e9' : '#ffebee',
                    color: message.type === 'success' ? '#2e7d32' : '#c62828'
                }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Branding Section */}
                <section className={styles.card}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-primary)' }}>Branding</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {/* Logo Upload */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Logo</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {restaurant.logoUrl && (
                                    <img src={restaurant.logoUrl} alt="Logo" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #ddd' }} />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(e, 'logoUrl')}
                                />
                                {uploading === 'logoUrl' && <span style={{ fontSize: '0.9rem', color: '#1a237e' }}>Caricamento...</span>}
                            </div>
                        </div>

                        {/* Cover Image Upload */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Immagine di Copertina</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {restaurant.coverImageUrl && (
                                    <img src={restaurant.coverImageUrl} alt="Cover" style={{ width: '100px', height: '64px', borderRadius: '4px', objectFit: 'cover', border: '1px solid #ddd' }} />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(e, 'coverImageUrl')}
                                />
                                {uploading === 'coverImageUrl' && <span style={{ fontSize: '0.9rem', color: '#1a237e' }}>Caricamento...</span>}
                            </div>
                        </div>
                    </div>
                </section>



                {/* Typography & Style Section */}
                <section className={styles.card}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-primary)' }}>Stile & Tipografia</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Font (Carattere)</label>
                            <select
                                value={restaurant.fontFamily}
                                onChange={(e) => setRestaurant({ ...restaurant, fontFamily: e.target.value })}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem' }}
                            >
                                {fontOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Stile Schede Piatti</label>
                            <select
                                value={restaurant.cardStyle}
                                onChange={(e) => setRestaurant({ ...restaurant, cardStyle: e.target.value })}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem' }}
                            >
                                {cardStyleOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                {/* Preview Link */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
                    <span style={{ color: '#555' }}>
                        Anteprima pubblica: <a href={`/menu/${restaurant.slug}`} target="_blank" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>/menu/{restaurant.slug}</a>
                    </span>
                    <button
                        type="submit"
                        disabled={saving}
                        className="btn btn-primary"
                        style={{ opacity: saving ? 0.7 : 1 }}
                    >
                        {saving ? 'Salvataggio...' : 'Salva Modifiche'}
                    </button>
                </div>

            </form>
        </div>
    );
}
