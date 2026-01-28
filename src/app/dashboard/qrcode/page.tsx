'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import styles from '../restaurant-dashboard.module.css';

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

                    // Generate QR
                    const qr = await QRCode.toDataURL(url, {
                        width: 400,
                        margin: 2,
                        color: {
                            dark: '#000000',
                            light: '#ffffff'
                        }
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

    if (loading) return <div className={styles.container}> Generazione QR Code in corso...</div>;

    if (!menuUrl) return (
        <div className={styles.container}>
            <div className={styles.card} style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
                <h3 className={styles.cardTitle}>Nessun menu trovato.</h3>
                <p className={styles.cardDesc}>Configura prima il nome del tuo ristorante nella sezione "Il mio Ristorante".</p>
                <a href="/dashboard/restaurant" className={styles.btnSm} style={{ display: 'inline-block' }}>Configura Ristorante</a>
            </div>
        </div>
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Il tuo QR Code</h1>
                <p className={styles.subtitle}>Scarica e stampa il codice per permettere ai clienti di accedere al menu.</p>
            </div>

            <div className={styles.grid}>
                {/* QR Card */}
                <div className={`${styles.card} ${styles.cardQr}`} style={{ alignItems: 'center', textAlign: 'center' }}>
                    <h2 className={styles.cardTitle} style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Scansionami</h2>
                    <p className={styles.cardDesc}>Accesso diretto al menu di <br /><strong>{restaurantName}</strong></p>

                    {qrDataUrl ? (
                        <div style={{
                            padding: '1.5rem',
                            background: 'white',
                            borderRadius: '20px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                            marginBottom: '2rem',
                            border: '1px solid #eee'
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
                        <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Caricamento...</div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                        <button onClick={downloadQR} className={`${styles.button} ${styles.btnPrimary}`}>
                            Scarica PNG
                        </button>
                        <a
                            href={menuUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.button}
                            style={{ background: 'white', border: '1px solid #ccc', color: '#555' }}
                        >
                            Apri Link Menu ↗
                        </a>
                    </div>


                </div>

                {/* Instructions Card */}
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Come usarlo al meglio?</h3>
                    <div className={styles.cardDesc}>
                        Ecco alcuni consigli per ottenere il massimo dal tuo menu digitale:
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '2rem', background: '#e3f2fd', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>🪑</span>
                            <div>
                                <strong style={{ display: 'block', color: '#333' }}>Sui Tavoli</strong>
                                <span className={styles.helperText}>Inseriscilo in un cavaliere in plexiglass su ogni tavolo.</span>
                            </div>
                        </li>
                        <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '2rem', background: '#fff3e0', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>🪟</span>
                            <div>
                                <strong style={{ display: 'block', color: '#333' }}>In Vetrina</strong>
                                <span className={styles.helperText}>Attirara i passanti permettendo loro di vedere i prezzi da fuori.</span>
                            </div>
                        </li>
                        <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '2rem', background: '#e8f5e9', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>🥡</span>
                            <div>
                                <strong style={{ display: 'block', color: '#333' }}>Asporto & Social</strong>
                                <span className={styles.helperText}>Stampalo sui volantini o condividi il link su Instagram/Facebook.</span>
                            </div>
                        </li>
                    </ul>

                    <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #eee' }}>
                        <div className={styles.helperText} style={{ marginBottom: '0.5rem' }}>Link diretto (da condividere su WhatsApp/Social):</div>
                        <div className={styles.linkContainer} style={{ padding: '0.8rem' }}>
                            <code className={styles.linkUrl} style={{ fontSize: '0.85rem' }}>{menuUrl}</code>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
