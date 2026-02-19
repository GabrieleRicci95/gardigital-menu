'use client';

import { useState } from 'react';
import styles from './booking.module.css';

interface BookingClientProps {
    restaurant: {
        id: string;
        name: string;
        slug: string;
        logoUrl: string | null;
        themeColor: string;
        bookingMaxGuestsPerSlot: number;
        bookingAutoConfirm: boolean;
        whatsappNumber: string | null;
    };
}

export default function BookingClient({ restaurant }: BookingClientProps) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        date: new Date().toISOString().split('T')[0],
        time: '19:30',
        guests: 2,
        notes: ''
    });
    const [status, setStatus] = useState<'IDLE' | 'SUBMITTING' | 'SUCCESS' | 'ERROR'>('IDLE');

    const themeColorSoft = restaurant.themeColor + '15'; // 15 is hex for ~8% opacity

    const waUrl = (() => {
        const dateStr = new Date(formData.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' });
        const waText = `Ciao ${restaurant.name}! 👋\n` +
            `Ho appena inviato una richiesta di prenotazione tramite il vostro sito.\n\n` +
            `📅 Data: ${dateStr}\n` +
            `⏰ Ora: ${formData.time}\n` +
            `👥 Persone: ${formData.guests}\n` +
            `👤 Nome: ${formData.name}`;

        let cleanNumber = restaurant.whatsappNumber?.replace(/\D/g, '') || '';
        if (cleanNumber.startsWith('00')) cleanNumber = cleanNumber.substring(2);
        if (cleanNumber.length === 10) cleanNumber = '39' + cleanNumber;

        return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(waText)}`;
    })();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('SUBMITTING');

        try {
            const res = await fetch('/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    restaurantId: restaurant.id,
                    ...formData,
                    status: restaurant.bookingAutoConfirm ? 'CONFIRMED' : 'PENDING'
                })
            });

            if (res.ok) {
                setStatus('SUCCESS');
                // Auto-redirect to WhatsApp
                setTimeout(() => {
                    window.open(waUrl, '_blank');
                }, 1000);
            } else {
                setStatus('ERROR');
            }
        } catch (error) {
            console.error('Booking failed:', error);
            setStatus('ERROR');
        }
    };

    if (status === 'SUCCESS') {
        const dateStr = new Date(formData.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' });
        return (
            <div className={styles.container} style={{ '--theme-color': restaurant.themeColor, '--theme-color-soft': themeColorSoft } as any}>
                <div className={styles.card}>
                    <div className={styles.successCard}>
                        <div className={styles.successIcon}>📱</div>
                        <h2 className={styles.title}>Quasi fatto!</h2>
                        <p className={styles.subtitle}>
                            Dati salvati. **Per completare la prenotazione, inviaci ora il messaggio preimpostato su WhatsApp.**
                        </p>
                        <p style={{ fontSize: '0.9rem', color: '#666', margin: '15px 0' }}>
                            Se non si è aperta la chat automaticamente, clicca il tasto qui sotto:
                        </p>

                        {restaurant.whatsappNumber && (
                            <a href={waUrl} target="_blank" rel="noopener noreferrer" className={styles.waBtn}>
                                Invia Messaggio di Conferma
                            </a>
                        )}
                    </div>
                </div>
                <div className={styles.poweredBy}>
                    Powered by <strong>Gardigital Booking</strong>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container} style={{ '--theme-color': restaurant.themeColor, '--theme-color-soft': themeColorSoft } as any}>
            {restaurant.logoUrl && (
                <img src={restaurant.logoUrl} alt={restaurant.name} className={styles.logo} />
            )}
            <h1 className={styles.title}>{restaurant.name}</h1>
            <p className={styles.subtitle}>Prenota il tuo tavolo in pochi secondi</p>

            <div className={styles.card}>
                <form onSubmit={handleSubmit} className={styles.inputGroup}>
                    <div className={styles.section}>
                        <label className={styles.label}>Informazioni Contatto</label>
                        <div className={styles.inputGroup}>
                            <input
                                required
                                type="text"
                                placeholder="Nome e Cognome"
                                className={styles.input}
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                            <input
                                type="tel"
                                placeholder="Telefono"
                                className={styles.input}
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className={styles.section}>
                        <label className={styles.label}>Dettagli Prenotazione</label>
                        <div className={styles.grid}>
                            <input
                                required
                                type="date"
                                className={styles.input}
                                min={new Date().toISOString().split('T')[0]}
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                            <input
                                required
                                type="time"
                                className={styles.input}
                                value={formData.time}
                                onChange={e => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>
                        <div style={{ marginTop: '15px' }}>
                            <label className={styles.label} style={{ fontSize: '0.8rem' }}>Numero di persone</label>
                            <input
                                required
                                type="number"
                                min="1"
                                max={restaurant.bookingMaxGuestsPerSlot || 20}
                                className={styles.input}
                                value={formData.guests}
                                onChange={e => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                            />
                            {formData.guests >= (restaurant.bookingMaxGuestsPerSlot || 20) && (
                                <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '8px', fontStyle: 'italic' }}>
                                    Per gruppi più grandi, ti preghiamo di contattarci telefonicamente.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className={styles.section}>
                        <label className={styles.label}>Note (Opzionale)</label>
                        <textarea
                            className={styles.input}
                            style={{ minHeight: '80px', fontFamily: 'inherit' }}
                            placeholder="Allergie, seggioloni, preferenze tavolo..."
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    {status === 'ERROR' && (
                        <p style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center' }}>
                            Ops! Qualcosa è andato storto. Riprova più tardi.
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={status === 'SUBMITTING'}
                        className={styles.submitBtn}
                    >
                        {status === 'SUBMITTING' ? 'Invio in corso...' : 'Conferma Prenotazione'}
                    </button>
                </form>
            </div>

            <div className={styles.poweredBy}>
                Powered by <strong>Gardigital Booking</strong>
            </div>
        </div>
    );
}
