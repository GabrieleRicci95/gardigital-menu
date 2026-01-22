'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

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

    if (loading) return <div className="p-4">Generazione QR Code in corso...</div>;

    if (!menuUrl) return (
        <div className="p-4">
            <h3>Nessun menu trovato.</h3>
            <p>Configura prima il nome del tuo ristorante nella sezione "Il mio Ristorante".</p>
        </div>
    );

    return (
        <div style={{ padding: '2rem', maxWidth: '800px' }}>
            <h1 className="h2 mb-4">Il tuo QR Code</h1>

            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ marginBottom: '2rem', color: '#666' }}>
                    Scansiona questo codice per accedere al menu di <strong>{restaurantName}</strong>
                </p>

                {qrDataUrl && (
                    <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                        <img
                            src={qrDataUrl}
                            alt="QR Code Menu"
                            style={{
                                border: '1px solid #eee',
                                borderRadius: '8px',
                                maxWidth: '100%',
                                height: 'auto'
                            }}
                        />
                    </div>
                )}

                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button onClick={downloadQR} className="btn btn-primary">
                        📥 Scarica PNG
                    </button>
                    <a
                        href={menuUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn"
                        style={{ border: '1px solid #ddd' }}
                    >
                        Apri Link Menu ↗
                    </a>
                </div>

                <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#888' }}>
                    Link diretto: <br />
                    <code style={{ background: '#f5f5f5', padding: '2px 5px', borderRadius: '4px' }}>{menuUrl}</code>
                </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h3 className="h3">Come usarlo?</h3>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#555', lineHeight: '1.6' }}>
                    <li>Stampalo e mettilo sui tavoli (o in un cavaliere in plexiglass).</li>
                    <li>Mettilo in vetrina per i passanti.</li>
                    <li>Inseriscilo nei tuoi volantini o biglietti da visita.</li>
                </ul>
            </div>
        </div>
    );
}
