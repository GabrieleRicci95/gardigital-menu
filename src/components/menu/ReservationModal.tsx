'use client';

import { useState } from 'react';
import styles from './reservation.module.css';

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    whatsappNumber: string;
    restaurantName: string;
}

export default function ReservationModal({ isOpen, onClose, whatsappNumber, restaurantName, restaurantId }: ReservationModalProps & { restaurantId: string }) {
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        time: '',
        guests: 2,
        notes: '',
        phone: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const text = `Ciao ${restaurantName}! 👋\n` +
            `Vorrei prenotare un tavolo.\n\n` +
            `📅 Data: ${formData.date}\n` +
            `⏰ Ora: ${formData.time}\n` +
            `👥 Persone: ${formData.guests}\n` +
            `👤 Nome: ${formData.name}\n` +
            (formData.notes ? `📝 Note: ${formData.notes}` : '');

        const encodedText = encodeURIComponent(text);
        let cleanNumber = whatsappNumber.replace(/\D/g, '');
        if (cleanNumber.startsWith('00')) cleanNumber = cleanNumber.substring(2);
        if (cleanNumber.length === 10) cleanNumber = '39' + cleanNumber;

        const waUrl = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodedText}`;

        window.open(waUrl, '_blank');
        onClose();

        try {
            await fetch('/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    restaurantId,
                    ...formData,
                    phone: formData.phone || '0000000000',
                    time: formData.time
                })
            });
        } catch (error) {
            console.error('Error saving:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className={styles.closeButton}>✕</button>

                <div className={styles.header}>
                    <h3 className={styles.title}>Prenota Tavolo</h3>

                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Chi sei?</label>
                        <input
                            required
                            type="text"
                            className={styles.input}
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Nome e Cognome"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Telefono</label>
                        <input
                            required
                            type="tel"
                            className={styles.input}
                            placeholder="Numero di telefono"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    {/* VERTICAL STACK FOR DATE AND TIME */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Quando?</label>
                        <input
                            required
                            type="date"
                            className={styles.input}
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>A che ora?</label>
                        <input
                            required
                            type="time"
                            className={styles.input}
                            value={formData.time}
                            onChange={e => setFormData({ ...formData, time: e.target.value })}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Quante persone?</label>
                        <input
                            required
                            type="number"
                            min="1"
                            max="20"
                            className={styles.input}
                            value={formData.guests}
                            onChange={e => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={styles.submitButton}
                    >
                        <span>{isSubmitting ? 'Invio...' : 'Invia Richiesta'}</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                    </button>
                </form>
            </div>
        </div>
    );
}
