'use client';

import { useState, useEffect } from 'react';
import styles from '../restaurant-dashboard.module.css';

export default function RestaurantPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [isDemo, setIsDemo] = useState(false);
    const [newModuleTitle, setNewModuleTitle] = useState('');
    const [creatingModule, setCreatingModule] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        themeColor: '#1a237e',
        slug: '',
        whatsappNumber: '',
        googleReviewsUrl: '',
        isWineActive: false,
        isChampagneActive: false,
        isDrinkActive: false,
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
                        isWineActive: !!data.restaurant.wineList?.isActive,
                        isChampagneActive: !!data.restaurant.champagneList?.isActive,
                        isDrinkActive: !!data.restaurant.drinkList?.isActive,
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

    const handleCreateModule = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newModuleTitle.trim()) return;
        if (isDemo) {
            setMessage('Modalità Demo: modifiche non consentite');
            return;
        }
        setCreatingModule(true);
        try {
            const res = await fetch('/api/custom-lists', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newModuleTitle }),
            });
            if (res.ok) {
                setMessage('Nuovo modulo creato con successo! Ricarica per vedere le modifiche.');
                setNewModuleTitle('');
                window.location.reload();
            } else {
                setMessage('Errore nella creazione del modulo.');
            }
        } catch (error) {
            setMessage('Errore di connessione.');
        } finally {
            setCreatingModule(false);
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

                    <div style={{ marginTop: '2.5rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1a237e' }}>Moduli Menù Extra</h3>
                        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>Attiva le sezioni speciali per il tuo menu digitale.</p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '15px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', transition: 'all 0.2s' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.isWineActive}
                                    onChange={e => setFormData({ ...formData, isWineActive: e.target.checked })}
                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                />
                                <div>
                                    <span style={{ fontWeight: 600, display: 'block', color: '#1e293b' }}>Carta dei Vini</span>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Gestisci una lista vini professionale.</p>
                                </div>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '15px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', transition: 'all 0.2s' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.isChampagneActive}
                                    onChange={e => setFormData({ ...formData, isChampagneActive: e.target.checked })}
                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                />
                                <div>
                                    <span style={{ fontWeight: 600, display: 'block', color: '#1e293b' }}>Carta degli Champagne</span>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Ideale per wine bar o ristoranti chic.</p>
                                </div>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '15px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', transition: 'all 0.2s' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.isDrinkActive}
                                    onChange={e => setFormData({ ...formData, isDrinkActive: e.target.checked })}
                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                />
                                <div>
                                    <span style={{ fontWeight: 600, display: 'block', color: '#1e293b' }}>Carta dei Drink / Cocktail</span>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Sezione dedicata ai Barman e mixology.</p>
                                </div>
                            </label>
                        </div>

                        <div style={{ marginTop: '2rem', background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>+ Crea un Modulo Personalizzato</h4>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>Esempio: "I nostri Amari", "Carta dei Dessert", "Angolo Sigari".</p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="text"
                                    value={newModuleTitle}
                                    onChange={e => setNewModuleTitle(e.target.value)}
                                    placeholder="Nome del modulo..."
                                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                />
                                <button
                                    onClick={handleCreateModule}
                                    disabled={creatingModule || !newModuleTitle.trim()}
                                    style={{ padding: '10px 20px', borderRadius: '8px', background: '#1a237e', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600, opacity: (creatingModule || !newModuleTitle.trim()) ? 0.6 : 1 }}
                                >
                                    {creatingModule ? 'Creazione...' : 'Crea'}
                                </button>
                            </div>
                        </div>
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
