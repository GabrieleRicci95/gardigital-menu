'use client';

import { useState, useEffect } from 'react';
import styles from '../restaurant-dashboard.module.css';

export default function RestaurantPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [isDemo, setIsDemo] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        themeColor: '#1a237e',
        slug: '',
        whatsappNumber: '',
        googleReviewsUrl: '',
    });

    useEffect(() => {
        fetch('/api/restaurant')
            .then(res => res.json())
            .then(data => {
                if (data.restaurant) {
                    setIsDemo(!!data.isDemo);
                    setFormData({
                        name: data.restaurant.name || '',
                        description: data.restaurant.description || '',
                        themeColor: data.restaurant.themeColor || '#1a237e',
                        slug: data.restaurant.slug || '',
                        whatsappNumber: data.restaurant.whatsappNumber || '',
                        googleReviewsUrl: data.restaurant.googleReviewsUrl || '',
                    });
                }
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isDemo) {
            setMessage('Modalità Demo: modifiche non consentite');
            return;
        }
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

    if (loading) return <div className={styles.container}>Caricamento...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Il Mio Ristorante</h1>
                <p className={styles.subtitle}>Gestisci le informazioni principali del tuo locale.</p>
            </header>

            <div className={styles.card}>
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
                            className={styles.formInput}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="description">Descrizione Breve</label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Racconta la storia e le specialità del tuo locale..."
                            rows={4}
                            className={styles.formTextarea}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="whatsappNumber">Numero WhatsApp</label>
                        <input
                            type="text"
                            id="whatsappNumber"
                            value={formData.whatsappNumber || ''}
                            onChange={e => setFormData({ ...formData, whatsappNumber: e.target.value })}
                            placeholder="Es. 3401234567 (senza spazi)"
                            className={styles.formInput}
                        />
                        <span className={styles.helperText}>
                            ℹ️ Se inserito, apparirà un pulsante "Prenota Tavolo" sul tuo menu pubblico.
                        </span>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="googleReviewsUrl">Link Recensioni Google</label>
                        <input
                            type="text"
                            id="googleReviewsUrl"
                            value={formData.googleReviewsUrl || ''}
                            onChange={e => setFormData({ ...formData, googleReviewsUrl: e.target.value })}
                            placeholder="Incolla qui il link 'Scrivi una recensione' di Google"
                            className={styles.formInput}
                        />
                        <span className={styles.helperText}>
                            ℹ️ Se inserito, apparirà un invito a lasciare una recensione sul tuo menu pubblico.
                        </span>
                    </div>

                    <div className={styles.actions}>
                        <button type="submit" className={`${styles.button} ${styles.btnPrimary}`} style={{ width: 'auto', background: isDemo ? '#ccc' : '' }} disabled={saving || isDemo}>
                            {saving ? 'Salvataggio...' : (isDemo ? 'Disabilitato (Demo)' : 'Salva Modifiche')}
                        </button>
                        {message && <span className={styles.message}>✅ {message}</span>}
                    </div>
                </form>

                {formData.slug && (
                    <div className={styles.linkBox}>
                        <h3 className={styles.cardTitle}>Il tuo Menu Pubblico</h3>
                        <p className={styles.cardDesc}>
                            Condividi questo link con i tuoi clienti o genera il QR Code.
                        </p>

                        <div className={styles.linkContainer}>
                            <code className={styles.linkUrl}>
                                {`${window.location.origin}/menu/${formData.slug}`}
                            </code>
                            <a
                                href={`/menu/${formData.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.btnSm}
                            >
                                Anteprima Menu ↗
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
