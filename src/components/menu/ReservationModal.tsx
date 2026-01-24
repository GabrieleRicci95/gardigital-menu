'use client';

import { useState } from 'react';

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    whatsappNumber: string;
    restaurantName: string;
}

export default function ReservationModal({ isOpen, onClose, whatsappNumber, restaurantName }: ReservationModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        time: '',
        guests: 2,
        notes: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Format the message
        const text = `Ciao ${restaurantName}! 👋\n` +
            `Vorrei prenotare un tavolo.\n\n` +
            `📅 Data: ${formData.date}\n` +
            `⏰ Ora: ${formData.time}\n` +
            `👥 Persone: ${formData.guests}\n` +
            `👤 Nome: ${formData.name}\n` +
            (formData.notes ? `📝 Note: ${formData.notes}` : '');

        // Encode for URL
        const encodedText = encodeURIComponent(text);

        // Sanitize phone number (remove spaces, dashes, etc.)
        let cleanNumber = whatsappNumber.replace(/\D/g, '');

        // Check if it has country code (heuristic for Italy). 
        // If it starts with 3 and is 10 digits (e.g. 3401234567), prepend 39.
        // If it starts with 00, remove it.
        if (cleanNumber.startsWith('00')) {
            cleanNumber = cleanNumber.substring(2);
        }

        // If length is 10 (common italian mobile) and doesn't start with 39 (could be 3...), valid italian numbers start with 3.
        // It's safer to just prepend 39 if it's 10 digits.
        if (cleanNumber.length === 10) {
            cleanNumber = '39' + cleanNumber;
        }

        // Open WhatsApp
        const waUrl = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodedText}`;
        window.open(waUrl, '_blank');
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '16px',
                width: '90%',
                maxWidth: '400px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }} onClick={e => e.stopPropagation()}>
                <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#1a237e' }}>Prenota un Tavolo 🍽️</h3>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                    <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>Nome</label>
                        <input
                            required
                            type="text"
                            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }}
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Il tuo nome"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>Data</label>
                            <input
                                required
                                type="date"
                                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }}
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>Ora</label>
                            <input
                                required
                                type="time"
                                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }}
                                value={formData.time}
                                onChange={e => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>Numero Ospiti</label>
                        <input
                            required
                            type="number"
                            min="1"
                            max="20"
                            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }}
                            value={formData.guests}
                            onChange={e => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>Note (Opzionale)</label>
                        <textarea
                            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd', resize: 'vertical' }}
                            rows={2}
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Intolleranze, seggiolone, ecc..."
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            marginTop: '8px',
                            backgroundColor: '#25D366', // WhatsApp Green
                            color: 'white',
                            border: 'none',
                            padding: '12px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        <span>Invia su WhatsApp</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        style={{ border: 'none', background: 'transparent', color: '#666', cursor: 'pointer', marginTop: '4px' }}
                    >
                        Annulla
                    </button>

                </form>
            </div>
        </div>
    );
}
