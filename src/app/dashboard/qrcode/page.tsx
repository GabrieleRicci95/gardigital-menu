'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import styles from '../restaurant-dashboard.module.css';
import { QrCode, Download, ExternalLink, Box, Layout as LayoutIcon, Share2, Copy } from 'lucide-react';
import LoadingOverlay from '@/components/common/LoadingOverlay';

export default function QRCodePage() {
    const [loading, setLoading] = useState(true);
    const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
    const [menuUrl, setMenuUrl] = useState<string | null>(null);
    const [restaurantName, setRestaurantName] = useState('');

    useEffect(() => {
        const fetchAndGenerate = async () => {
            try {
                const res = await fetch('/api/restaurant');
                const data = await res.json();

                if (data.restaurant && data.restaurant.slug) {
                    const url = `${window.location.origin}/menu/${data.restaurant.slug}`;
                    setMenuUrl(url);
                    setRestaurantName(data.restaurant.name);

                    // Generate QR - High quality for print
                    const qr = await QRCode.toDataURL(url, {
                        width: 800,
                        margin: 2,
                        color: {
                            dark: '#000000',
                            light: '#ffffff'
                        },
                        errorCorrectionLevel: 'H'
                    });
                    setQrDataUrl(qr);
                }
            } catch (err) {
                console.error("Error generating QR", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAndGenerate();
    }, []);

    const downloadQR = () => {
        if (!qrDataUrl) return;
        const link = document.createElement('a');
        link.download = `qrcode-${restaurantName.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.href = qrDataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const copyToClipboard = () => {
        if (!menuUrl) return;
        navigator.clipboard.writeText(menuUrl);
        alert('Link copiato negli appunti!');
    };

    if (loading) return <LoadingOverlay />;

    if (!menuUrl) return (
        <div className={styles.container}>
            <div className={styles.card} style={{ textAlign: 'center', maxWidth: '600px', margin: '4rem auto' }}>
                <h3 className={styles.cardTitle}>Nessun menu trovato</h3>
                <p className={styles.cardDesc}>Configura prima il nome del tuo ristorante nella sezione dedicata per generare il tuo codice unico.</p>
                <Link href="/dashboard/restaurant" className={`${styles.button} ${styles.btnPrimary}`} style={{ width: 'auto', display: 'inline-flex' }}>
                    Configura Ristorante
                </Link>
            </div>
        </div>
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Il tuo QR Code</h1>
                <p className={styles.subtitle}>Scarica e stampa il codice per permettere ai clienti di accedere al menu con un tocco di classe.</p>
            </div>

            <div className={styles.grid}>
                {/* QR Card */}
                <div className={styles.card} style={{ alignItems: 'center', textAlign: 'center' }}>
                    <h2 className={styles.cardTitle} style={{ fontSize: '1.8rem', justifyContent: 'center' }}>
                        <QrCode size={28} /> Scansionami
                    </h2>
                    <p className={styles.cardDesc}>Accesso immediato al menu digitale di <br /><strong style={{ color: '#fff' }}>{restaurantName}</strong></p>

                    {qrDataUrl ? (
                        <div style={{
                            padding: '2rem',
                            background: 'white',
                            borderRadius: '24px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                            marginBottom: '2.5rem',
                            border: '4px solid #d4af37',
                            position: 'relative'
                        }}>
                            <img
                                src={qrDataUrl}
                                alt="QR Code Menu"
                                style={{
                                    width: '100%',
                                    maxWidth: '280px',
                                    height: 'auto',
                                    display: 'block'
                                }}
                            />
                        </div>
                    ) : (
                        <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div className={styles.spinner}></div>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                        <button onClick={downloadQR} className={`${styles.button} ${styles.btnPrimary}`} style={{ flex: 1, minWidth: '180px' }}>
                            <Download size={18} /> Scarica PNG
                        </button>
                        <a
                            href={menuUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.btnSm}
                            style={{ flex: 1, minWidth: '180px', justifyContent: 'center' }}
                        >
                            <ExternalLink size={18} /> Apri Link
                        </a>
                    </div>
                </div>

                {/* Instructions Card */}
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Guida all&apos;uso Premium</h3>
                    <div className={styles.cardDesc}>
                        Ottimizza l&apos;esperienza dei tuoi clienti posizionando strategicamente il tuo QR Code.
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'start' }}>
                            <div style={{ fontSize: '1.5rem', background: 'rgba(212, 175, 55, 0.1)', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', flexShrink: 0, border: '1px solid rgba(212, 175, 55, 0.2)' }}>🪑</div>
                            <div>
                                <strong style={{ display: 'block', color: '#fff', fontSize: '1.1rem', marginBottom: '4px' }}>Sui Tavoli</strong>
                                <span className={styles.helperText} style={{ fontSize: '0.95rem' }}>Inseriscilo in eleganti supporti in plexiglass o legno su ogni tavolo.</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'start' }}>
                            <div style={{ fontSize: '1.5rem', background: 'rgba(212, 175, 55, 0.1)', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', flexShrink: 0, border: '1px solid rgba(212, 175, 55, 0.2)' }}>🖼️</div>
                            <div>
                                <strong style={{ display: 'block', color: '#fff', fontSize: '1.1rem', marginBottom: '4px' }}>In Vetrina</strong>
                                <span className={styles.helperText} style={{ fontSize: '0.95rem' }}>Mostra il menu ai passanti per incuriosirli prima ancora che entrino.</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'start' }}>
                            <div style={{ fontSize: '1.5rem', background: 'rgba(212, 175, 55, 0.1)', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', flexShrink: 0, border: '1px solid rgba(212, 175, 55, 0.2)' }}>📱</div>
                            <div>
                                <strong style={{ display: 'block', color: '#fff', fontSize: '1.1rem', marginBottom: '4px' }}>Digital & Social</strong>
                                <span className={styles.helperText} style={{ fontSize: '0.95rem' }}>Condividi il link su Instagram, Facebook e WhatsApp Business.</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '2.5rem', borderTop: '1px solid rgba(212, 175, 55, 0.1)' }}>
                        <div className={styles.helperText} style={{ marginBottom: '0.8rem', fontWeight: 600, color: '#d4af37' }}>Link Diretto Menu:</div>
                        <div className={styles.linkContainer} style={{ background: 'rgba(0,0,0,0.3)' }}>
                            <code className={styles.linkUrl} style={{ fontSize: '0.9rem' }}>{menuUrl}</code>
                            <button onClick={copyToClipboard} className={styles.btnSm} style={{ padding: '8px' }} title="Copia Link">
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
