'use client';

import { useState, useEffect } from 'react';
import styles from './restaurant.module.css';

export default function RestaurantPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        themeColor: '#1a237e',
        slug: '',
    });

    useEffect(() => {
        fetch('/api/restaurant')
            .then(res => res.json())
            .then(data => {
                if (data.restaurant) {
                    setFormData({
                        name: data.restaurant.name || '',
                        description: data.restaurant.description || '',
                        themeColor: data.restaurant.themeColor || '#1a237e',
                        slug: data.restaurant.slug || '',
                    });
                }
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const res = await fetch('/api/restaurant', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setMessage('Impostazioni salvate con successo!');
            } else {
                setMessage('Errore durante il salvataggio.');
            }
        } catch (error) {
            setMessage('Errore di connessione.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-4">Caricamento...</div>;

    return (
        <div className={styles.container}>
            <h1 className="h2 mb-4">Profilo Ristorante</h1>

            <div className="card">
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="name">Nome Ristorante</label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                            placeholder="Es. La Trattoria Bella"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="description">Descrizione Breve</label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="La migliore cucina tradizionale..."
                            rows={3}
                        />
                    </div>



                    <div className={styles.actions}>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? 'Salvataggio...' : 'Salva Modifiche'}
                        </button>
                        {message && <span className={styles.message}>{message}</span>}
                    </div>
                </form>

                {formData.slug && (
                    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #eee' }}>
                        <h3 className="h3 mb-2">Il tuo Menu Pubblico</h3>
                        <p style={{ color: '#666', marginBottom: '10px' }}>Condividi questo link con i tuoi clienti o genera il QR Code.</p>

                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            background: '#f5f5f5',
                            padding: '10px',
                            borderRadius: '8px',
                            alignItems: 'center'
                        }}>
                            <code style={{ flex: 1, wordBreak: 'break-all' }}>
                                {`${window.location.origin}/menu/${formData.slug}`}
                            </code>
                            <a
                                href={`/menu/${formData.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm"
                                style={{ background: 'white', border: '1px solid #ddd' }}
                            >
                                Apri ↗
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
