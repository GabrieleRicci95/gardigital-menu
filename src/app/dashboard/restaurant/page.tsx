'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../restaurant-dashboard.module.css';
import { Store, MessageSquare, Globe, Heart, Save, ExternalLink, X } from 'lucide-react';
import LoadingOverlay from '@/components/common/LoadingOverlay';

export default function RestaurantPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [isDemo, setIsDemo] = useState(false);
    
    // Original data to compare for dirty state
    const originalDataRef = useRef<any>(null);
    const [isDirty, setIsDirty] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        themeColor: '#d4af37',
        slug: '',
        whatsappNumber: '',
        googleReviewsUrl: '',
        isWineActive: false,
        isChampagneActive: false,
        isDrinkActive: false,
        showNameInPublicMenu: true,
    });

    useEffect(() => {
        fetch('/api/restaurant')
            .then(res => res.json())
            .then(data => {
                if (data.restaurant) {
                    setIsDemo(!!data.isDemo);
                    const initialData = {
                        name: data.restaurant.name || '',
                        description: data.restaurant.description || '',
                        themeColor: data.restaurant.themeColor || '#d4af37',
                        slug: data.restaurant.slug || '',
                        whatsappNumber: data.restaurant.whatsappNumber || '',
                        googleReviewsUrl: data.restaurant.googleReviewsUrl || '',
                        isWineActive: !!data.restaurant.wineList?.isActive,
                        isChampagneActive: !!data.restaurant.champagneList?.isActive,
                        isDrinkActive: !!data.restaurant.drinkList?.isActive,
                        showNameInPublicMenu: data.restaurant.showNameInPublicMenu ?? true,
                    };
                    setFormData(initialData);
                    originalDataRef.current = initialData;
                }
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, []);

    // Dirty state check
    useEffect(() => {
        if (!originalDataRef.current) return;
        const hasChanged = JSON.stringify(formData) !== JSON.stringify(originalDataRef.current);
        setIsDirty(hasChanged);
    }, [formData]);

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

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
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
                originalDataRef.current = { ...formData };
                setIsDirty(false);
            } else {
                setMessage('Errore durante il salvataggio.');
            }
        } catch (error) {
            setMessage('Errore di connessione.');
        } finally {
            setSaving(false);
        }
    };


    if (loading) return <LoadingOverlay />;

    return (
        <div className={styles.container} style={{ paddingBottom: '120px' }}>
            <header className={styles.header}>
                <h1 className={styles.title}>Il Mio Ristorante</h1>
                <p className={styles.subtitle}>Gestisci le informazioni principali del tuo locale con l&apos;esclusività SoloMenu.</p>
            </header>

            <div className={styles.card}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup} style={{ marginBottom: '1rem' }}>
                        <label htmlFor="showNameInPublicMenu" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                id="showNameInPublicMenu"
                                checked={formData.showNameInPublicMenu}
                                onChange={e => setFormData({ ...formData, showNameInPublicMenu: e.target.checked })}
                                style={{ width: '22px', height: '22px', accentColor: '#d4af37' }}
                            />
                            <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Mostra Nome Ristorante nel Menu Pubblico</span>
                        </label>
                        <span className={styles.helperText}>
                            ℹ️ Se disattivato, il nome non apparirà nell&apos;intestazione del menu pubblico per un look più minimale.
                        </span>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Store size={18} color="#d4af37" /> Nome Ristorante
                        </label>
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
                        <label htmlFor="description" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Heart size={18} color="#d4af37" /> Descrizione Breve
                        </label>
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
                        <label htmlFor="whatsappNumber" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <MessageSquare size={18} color="#d4af37" /> Numero WhatsApp per Prenotazioni
                        </label>
                        <input
                            type="text"
                            id="whatsappNumber"
                            value={formData.whatsappNumber || ''}
                            onChange={e => setFormData({ ...formData, whatsappNumber: e.target.value })}
                            placeholder="Es. 3401234567"
                            className={styles.formInput}
                        />
                        <span className={styles.helperText}>
                            ℹ️ Abilita il pulsante &quot;Prenota Tavolo&quot; sul tuo menu pubblico.
                        </span>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="googleReviewsUrl" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Globe size={18} color="#d4af37" /> Link Recensioni Google
                        </label>
                        <input
                            type="text"
                            id="googleReviewsUrl"
                            value={formData.googleReviewsUrl || ''}
                            onChange={e => setFormData({ ...formData, googleReviewsUrl: e.target.value })}
                            placeholder="Link 'Scrivi una recensione' di Google"
                            className={styles.formInput}
                        />
                        <span className={styles.helperText}>
                            ℹ️ Invita i clienti a lasciare una recensione a fine pasto.
                        </span>
                    </div>

                </form>

                {formData.slug && (
                    <div className={styles.linkBox} style={{ marginTop: '3rem' }}>
                        <h3 className={styles.cardTitle}>Il tuo Menu Pubblico</h3>
                        <p className={styles.cardDesc}>
                            Tutto pronto. Usa questo link per accedere alla versione pubblica.
                        </p>
                        <div className={styles.linkContainer}>
                            <code className={styles.linkUrl}>
                                {`${typeof window !== 'undefined' ? window.location.origin : ''}/menu/${formData.slug}`}
                            </code>
                            <a
                                href={`/menu/${formData.slug}?preview=true`}
                                className={styles.btnSm}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ExternalLink size={16} /> Anteprima
                            </a>
                        </div>
                    </div>
                )}
            </div>

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
                        onClick={() => handleSubmit()} 
                        disabled={saving || !isDirty || isDemo}
                        className={styles.btnPrimary}
                        style={{ padding: '12px 30px', borderRadius: '30px', opacity: (!isDirty && !saving) ? 0.5 : 1 }}
                    >
                        {saving ? 'Salvataggio...' : 'Salva Modifiche'}
                        <Save size={18} />
                    </button>
                    <button 
                        onClick={() => {
                            setFormData({ ...originalDataRef.current });
                            setIsDirty(false);
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
