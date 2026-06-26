'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../restaurant-dashboard.module.css';
import { Store, MessageSquare, Globe, Heart, Save, ExternalLink, X, AlertTriangle, Trash2, Copy, CheckCircle2 } from 'lucide-react';
import LoadingOverlay from '@/components/common/LoadingOverlay';

export default function RestaurantPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [isDemo, setIsDemo] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    
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
        showNameInPublicMenu: true,
    });

    const [copied, setCopied] = useState(false);

    const handleCopyLink = () => {
        const url = `${window.location.origin}/menu/${formData.slug}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

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

    const handleDeleteAccount = async () => {
        if (!deletePassword) {
            alert("Inserisci la password di accesso per confermare l'eliminazione.");
            return;
        }

        const confirmResult = window.confirm(
            "ATTENZIONE: Questa azione è IRREVERSIBILE.\n\n" +
            "Tutti i dati del tuo ristorante (menù, prezzi, ordini, impostazioni) verranno eliminati definitivamente.\n\n" +
            "Sei sicuro di voler procedere?"
        );

        if (!confirmResult) return;

        setSaving(true);
        try {
            const res = await fetch('/api/auth/delete-account', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: deletePassword })
            });

            if (res.ok) {
                alert("Account e dati eliminati con successo.");
                window.location.href = '/login';
            } else {
                const data = await res.json();
                alert(data.error || "Errore durante l'eliminazione.");
            }
        } catch (error) {
            alert("Errore di connessione durante l'eliminazione.");
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
                        <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                            <span className={styles.helperText} style={{ flex: 1 }}>
                                ℹ️ Invita i clienti a lasciare una recensione a fine pasto.
                            </span>
                            {formData.googleReviewsUrl && (
                                <a 
                                    href={formData.googleReviewsUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={styles.btnSm}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}
                                >
                                    <ExternalLink size={14} /> Vedi Recensioni Live
                                </a>
                            )}
                        </div>
                    </div>
                </form>

                {formData.slug && (
                    <>
                        <div className={styles.linkBox} style={{ marginTop: '3rem' }}>
                            <h3 className={styles.cardTitle}>Il tuo Menu Pubblico</h3>
                            <p className={styles.cardDesc}>
                                Tutto pronto. Usa questo link per accedere alla versione pubblica.
                            </p>
                            <div className={styles.linkContainer}>
                                <code className={styles.linkUrl}>
                                    {`${typeof window !== 'undefined' ? window.location.origin : ''}/menu/${formData.slug}`}
                                </code>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={handleCopyLink}
                                        className={styles.btnSm}
                                        style={{ background: copied ? '#4ade8020' : '', borderColor: copied ? '#4ade80' : '' }}
                                    >
                                        {copied ? <CheckCircle2 size={16} color="#4ade80" /> : <Copy size={16} />}
                                        {copied ? 'Copiato!' : 'Copia Link'}
                                    </button>
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
                        </div>

                        {/* Google Business Profile Integration Guide */}
                        <div className={styles.linkBox} style={{ marginTop: '2rem', border: '1px solid rgba(66, 133, 244, 0.3)', background: 'rgba(66, 133, 244, 0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                                <div style={{ background: '#4285F4', padding: '8px', borderRadius: '12px' }}>
                                    <Globe size={20} color="#fff" />
                                </div>
                                <h3 className={styles.cardTitle} style={{ margin: 0 }}>Aggiungi a Google Search & Maps</h3>
                            </div>
                            <p className={styles.cardDesc}>
                                Rendi il tuo menu accessibile direttamente dai risultati di ricerca di Google.
                            </p>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', fontSize: '0.95rem' }}>
                                <ol style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '10px', color: 'rgba(255,255,255,0.8)' }}>
                                    <li>Accedi al tuo <strong>Google Business Profile</strong>.</li>
                                    <li>Clicca su <strong>"Modifica profilo"</strong>.</li>
                                    <li>Vai nella sezione <strong>"Contatti"</strong> o <strong>"Cibo e bevande"</strong>.</li>
                                    <li>Incolla il link del tuo menu nel campo <strong>"Link al menu"</strong>.</li>
                                </ol>
                                <button
                                    onClick={handleCopyLink}
                                    style={{
                                        marginTop: '1.5rem',
                                        width: '100%',
                                        padding: '12px',
                                        background: '#4285F4',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                                    {copied ? 'Link Copiato!' : 'Copia Link per Google'}
                                </button>
                            </div>
                        </div>
                    </>
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

            {/* Danger Zone - Always visible for Apple Review, but simulated for demo account */}
            <div style={{ marginTop: '5rem', borderTop: '1px solid rgba(239, 68, 68, 0.2)', paddingTop: '3rem' }}>
                <div style={{ 
                    background: 'rgba(239, 68, 68, 0.05)', 
                    border: '1px solid rgba(239, 68, 68, 0.2)', 
                    borderRadius: '24px', 
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ef4444' }}>
                        <AlertTriangle size={24} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>Zona Pericolo</h2>
                    </div>
                    
                    {isDemo && (
                        <div style={{ 
                            padding: '12px 16px', 
                            background: 'rgba(212, 175, 55, 0.1)', 
                            border: '1px solid #d4af37', 
                            borderRadius: '12px',
                            color: '#d4af37',
                            fontSize: '0.95rem',
                            fontWeight: '600'
                        }}>
                            ℹ️ Nota per il revisore: Questo è un account DEMO. L&apos;eliminazione sarà simulata per mostrare il funzionamento completo del sistema senza cancellare i dati condivisi.
                        </div>
                    )}

                    <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: '1.6' }}>
                        L&apos;eliminazione dell&apos;account è definitiva e comporterà la rimozione immediata di tutti i tuoi dati, inclusi i menu pubblici e le impostazioni del ristorante. Questa operazione non può essere annullata.
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '400px' }}>
                        <label style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', fontWeight: '600' }}>
                            Conferma con la tua password di accesso:
                        </label>
                        <input
                            type="password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            placeholder="Inserisci la password"
                            style={{
                                padding: '12px 16px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '12px',
                                color: '#ffffff',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <button
                        onClick={handleDeleteAccount}
                        disabled={saving}
                        style={{
                            background: 'transparent',
                            border: '1px solid #ef4444',
                            color: '#ef4444',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            alignSelf: 'flex-start',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <Trash2 size={18} />
                        Elimina Definitivamente Account e Dati
                    </button>
                </div>
            </div>
        </div>
    );
}
