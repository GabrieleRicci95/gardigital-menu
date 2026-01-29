'use client';

import { useState, useEffect } from 'react';
import styles from './reservations.module.css';

interface Reservation {
    id: string;
    name: string;
    date: string;
    guests: number;
    phone: string;
    email?: string;
    status: string;
    notes?: string;
}

export default function ReservationsPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]); // Default today

    useEffect(() => {
        fetchReservations();
    }, [filterDate]);

    const fetchReservations = async () => {
        setLoading(true);
        try {
            // Need to get restaurantId somehow - usually from a context or a separate API call
            // For now, let's assume we can get it from the /api/restaurant endpoint which returns the current user's restaurant
            const restaurantRes = await fetch('/api/restaurant');
            const restaurantData = await restaurantRes.json();

            if (restaurantData.restaurant) {
                const res = await fetch(`/api/reservations?restaurantId=${restaurantData.restaurant.id}&date=${filterDate}`);
                if (res.ok) {
                    const data = await res.json();
                    setReservations(data);
                }
            }
        } catch (error) {
            console.error('Error fetching reservations:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return <span className={`${styles.badge} ${styles.badgeSuccess}`}>Confermata</span>;
            case 'REJECTED': return <span className={`${styles.badge} ${styles.badgeError}`}>Rifiutata</span>;
            case 'CANCELLED': return <span className={`${styles.badge} ${styles.badgeGray}`}>Cancellata</span>;
            default: return <span className={`${styles.badge} ${styles.badgeWarning}`}>In Attesa</span>;
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Prenotazioni</h1>
                    <p className={styles.subtitle}>Gestisci le richieste per il tuo locale.</p>
                </div>
                <div className={styles.controls}>
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className={styles.dateInput}
                    />
                    <button className={styles.btnPrimary} onClick={() => fetchReservations()}>
                        🔄 Aggiorna
                    </button>
                </div>
            </header>

            {loading ? (
                <div className={styles.loading}>Caricamento...</div>
            ) : reservations.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>📅</div>
                    <h3>Nessuna prenotazione per questa data</h3>
                    <p>Cambia data o attendi nuove richieste.</p>
                </div>
            ) : (
                <div className={styles.list}>
                    {reservations.map(res => (
                        <div key={res.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.timeInfo}>
                                    <span className={styles.time}>{new Date(res.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    {getStatusBadge(res.status)}
                                </div>
                                <div className={styles.guestInfo}>
                                    <strong>{res.guests}</strong> Persone
                                </div>
                            </div>
                            <div className={styles.cardBody}>
                                <h3 className={styles.customerName}>{res.name}</h3>
                                {res.phone && <a href={`tel:${res.phone}`} className={styles.contactLink}>📞 {res.phone}</a>}
                                {res.notes && <p className={styles.notes}>📝 "{res.notes}"</p>}
                            </div>
                            <div className={styles.cardActions}>
                                {res.status === 'PENDING' && (
                                    <>
                                        <button className={styles.btnActionSuccess}>✅ Accetta</button>
                                        <button className={styles.btnActionDanger}>❌ Rifiuta</button>
                                    </>
                                )}
                                <a
                                    href={`https://wa.me/${res.phone.replace(/\s/g, '')}?text=Ciao ${res.name}, confermiamo la tua prenotazione da noi per ${res.guests} persone alle ${new Date(res.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}!`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={styles.btnWhatsapp}
                                >
                                    💬 WhatsApp
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
