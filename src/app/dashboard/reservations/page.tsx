'use client';

import { useState, useEffect } from 'react';
import styles from './reservations.module.css';

interface Reservation {
    id: string;
    name: string;
    date: string;
    guests: number;
    phone: string | null;
    email?: string;
    status: string;
    notes?: string;
}

export default function ReservationsPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [restaurant, setRestaurant] = useState<any>(null);
    const [isDemo, setIsDemo] = useState(false);
    const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Settings state
    const [bookingSettings, setBookingSettings] = useState({
        bookingMaxGuestsPerSlot: 10,
        bookingAutoConfirm: false
    });

    useEffect(() => {
        fetchRestaurant();
    }, []);

    useEffect(() => {
        if (restaurant) {
            fetchReservations();
        }
    }, [filterDate, restaurant]);

    const fetchRestaurant = async () => {
        try {
            const res = await fetch('/api/restaurant');
            const data = await res.json();
            if (data.restaurant) {
                setRestaurant(data.restaurant);
                setIsDemo(!!data.isDemo);
                setBookingSettings({
                    bookingMaxGuestsPerSlot: data.restaurant.bookingMaxGuestsPerSlot,
                    bookingAutoConfirm: data.restaurant.bookingAutoConfirm
                });
            }
        } catch (error) {
            console.error('Error fetching restaurant:', error);
        }
    };

    const fetchReservations = async () => {
        if (!restaurant) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/reservations?restaurantId=${restaurant.id}&date=${filterDate}`, {
                cache: 'no-store'
            });
            if (res.ok) {
                const data = await res.json();
                setReservations(data);
            }
        } catch (error) {
            console.error('Error fetching reservations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        if (isDemo) return alert('Modalità Demo: modifiche non consentite');
        if (!confirm('Sei sicuro?')) return;

        const reservation = reservations.find(r => r.id === id);
        if (!reservation) return;

        // 1. Optimistic WhatsApp Open
        // We open the window immediately to avoid popup blockers that trigger after async delays
        let message = '';
        const dateStr = new Date(reservation.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' });
        const timeStr = new Date(reservation.date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', hour12: false });

        if (newStatus === 'CONFIRMED') {
            message = `Ciao ${reservation.name}, confermiamo con piacere la tua prenotazione per il ${dateStr} alle ${timeStr} per ${reservation.guests} persone! Ti aspettiamo`;
        } else if (newStatus === 'REJECTED') {
            message = `Ciao ${reservation.name}, ci dispiace ma al momento non abbiamo disponibilità per la tua richiesta del ${dateStr} alle ${timeStr}. Speriamo di averti presto nostro ospite in un'altra occasione!`;
        }

        if (message) {
            if (reservation.phone) {
                const cleanPhone = reservation.phone.replace(/\s/g, '').replace(/[^0-9+]/g, '');
                window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
            } else {
                alert('Attenzione: Nessun telefono salvato per questo cliente. Impossibile inviare il messaggio WhatsApp.');
            }
        }

        // 2. Background DB Update
        try {
            const res = await fetch('/api/reservations', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });

            if (res.ok) {
                fetchReservations();
            } else {
                alert('Attenzione: Stato non aggiornato nel DB (ricarica la pagina), ma messaggio inviato.');
            }
        } catch (error) {
            console.error('Update failed', error);
            alert('Errore di connessione.');
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

    const [filterStatus, setFilterStatus] = useState<string>('ALL'); // ALL, PENDING, CONFIRMED, HISTORY

    const filteredReservations = reservations.filter(res => {
        if (filterStatus === 'ALL') return true;
        if (filterStatus === 'HISTORY') return res.status === 'REJECTED' || res.status === 'CANCELLED';
        return res.status === filterStatus;
    });

    const counts = {
        ALL: reservations.length,
        PENDING: reservations.filter(r => r.status === 'PENDING').length,
        CONFIRMED: reservations.filter(r => r.status === 'CONFIRMED').length,
        HISTORY: reservations.filter(r => r.status === 'REJECTED' || r.status === 'CANCELLED').length
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    // New Reservation Form State
    const [newRes, setNewRes] = useState({
        name: '',
        guests: 2,
        date: new Date().toISOString().split('T')[0],
        time: '19:30',
        phone: '',
        notes: ''
    });

    const handleCreateReservation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isDemo) return alert('Modalità Demo: modifiche non consentite');
        setLoading(true);

        try {
            const res = await fetch('/api/reservations/manual', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    restaurantId: restaurant.id,
                    ...newRes,
                    status: 'CONFIRMED'
                })
            });

            if (res.ok) {
                alert('Prenotazione aggiunta con successo! ✅');
                setIsModalOpen(false);
                setNewRes({
                    name: '',
                    guests: 2,
                    date: new Date().toISOString().split('T')[0],
                    time: '19:30',
                    phone: '',
                    notes: ''
                });
                fetchReservations();
            } else {
                alert('Errore durante la creazione della prenotazione');
            }
        } catch (error) {
            console.error(error);
            alert('Errore di connessione');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isDemo) return alert('Modalità Demo: modifiche non consentite');
        setLoading(true);

        try {
            const res = await fetch('/api/restaurant', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingMaxGuestsPerSlot: bookingSettings.bookingMaxGuestsPerSlot,
                    bookingAutoConfirm: bookingSettings.bookingAutoConfirm
                })
            });

            if (res.ok) {
                alert('Impostazioni salvate con successo! ✅');
                setIsSettingsOpen(false);
                fetchRestaurant();
            } else {
                alert('Errore durante il salvataggio');
            }
        } catch (error) {
            console.error(error);
            alert('Errore di connessione');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (isDemo) return alert('Modalità Demo: modifiche non consentite');
        if (!confirm('Sei sicuro di voler eliminare questa prenotazione? Questa azione è irreversibile.')) return;

        try {
            const res = await fetch(`/api/reservations?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchReservations();
            } else {
                alert('Errore durante l\'eliminazione');
            }
        } catch (error) {
            console.error(error);
            alert('Errore di connessione');
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Agenda Prenotazioni</h1>
                    <p className={styles.subtitle}>Gestisci le richieste dei tuoi clienti in modo professionale.</p>
                </div>

                {restaurant && (
                    <div className={styles.linkBanner}>
                        <div className={styles.linkIcon}>
                            🔗
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, color: '#111' }}>Link Pubblico Booking</div>
                            <div style={{ color: '#666', fontSize: '0.8rem' }}>Mettilo su Google My Business</div>
                        </div>
                        <input
                            readOnly
                            value={`https://www.gardigital.it/book/${restaurant.slug}`}
                            className={styles.linkInput}
                        />
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(`https://www.gardigital.it/book/${restaurant.slug}`);
                                alert('Link copiato!');
                            }}
                            className={styles.btnPrimary}
                        >
                            Copia
                        </button>
                    </div>
                )}

                <div className={styles.controls}>
                    <button
                        className={styles.btnSettings}
                        onClick={() => setIsSettingsOpen(true)}
                    >
                        Impostazioni
                    </button>
                    <button
                        className={styles.btnPrimary}
                        style={{ backgroundColor: isDemo ? '#ccc' : '#10b981' }}
                        onClick={() => !isDemo && setIsModalOpen(true)}
                        disabled={isDemo}
                    >
                        + Nuova
                    </button>
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className={styles.dateInput}
                    />
                </div>
            </header>

            {/* TABS */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${filterStatus === 'ALL' ? styles.activeTab : ''}`}
                    onClick={() => setFilterStatus('ALL')}
                >
                    Tutte ({counts.ALL})
                </button>
                <button
                    className={`${styles.tab} ${filterStatus === 'PENDING' ? styles.activeTab : ''}`}
                    onClick={() => setFilterStatus('PENDING')}
                >
                    In Attesa ({counts.PENDING})
                </button>
                <button
                    className={`${styles.tab} ${filterStatus === 'CONFIRMED' ? styles.activeTab : ''}`}
                    onClick={() => setFilterStatus('CONFIRMED')}
                >
                    Confermate ({counts.CONFIRMED})
                </button>
                <button
                    className={`${styles.tab} ${filterStatus === 'HISTORY' ? styles.activeTab : ''}`}
                    onClick={() => setFilterStatus('HISTORY')}
                >
                    Storico ({counts.HISTORY})
                </button>
            </div>

            {loading ? (
                <div className={styles.loading}>Caricamento...</div>
            ) : filteredReservations.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}></div>
                    <h3>Nessuna prenotazione in questa sezione</h3>
                    <p>Prova a cambiare filtro o data.</p>
                </div>
            ) : (
                <div className={styles.list}>
                    {filteredReservations.map(res => (
                        <div key={res.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.timeInfo}>
                                    <span className={styles.time}>
                                        {/* Show Date if it's not the filtered date (e.g. Pending from another day) */}
                                        {new Date(res.date).toISOString().split('T')[0] !== filterDate && (
                                            <span style={{ marginRight: '8px', color: '#eab308', fontWeight: 'bold' }}>
                                                {new Date(res.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}
                                            </span>
                                        )}
                                        {new Date(res.date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', hour12: false })}
                                    </span>
                                    {getStatusBadge(res.status)}
                                </div>
                                <div className={styles.guestInfo}>
                                    <strong>{res.guests}</strong> Persone
                                </div>
                            </div>
                            <div className={styles.cardBody}>
                                <h3 className={styles.customerName}>{res.name}</h3>
                                {res.phone && <a href={`tel:${res.phone}`} className={styles.contactLink}>Tel: {res.phone}</a>}
                                {res.notes && <p className={styles.notes}>Note: "{res.notes}"</p>}
                            </div>
                            <div className={styles.cardActions}>
                                {res.status === 'PENDING' && (
                                    <>
                                        <button
                                            className={styles.btnActionSuccess}
                                            onClick={() => handleStatusUpdate(res.id, 'CONFIRMED')}
                                        >
                                            Accetta
                                        </button>
                                        <button
                                            className={styles.btnActionDanger}
                                            onClick={() => handleStatusUpdate(res.id, 'REJECTED')}
                                        >
                                            Rifiuta
                                        </button>
                                    </>
                                )}
                                {res.phone && (
                                    <a
                                        href={`https://wa.me/${res.phone.replace(/\s/g, '')}?text=Ciao ${res.name}, confermiamo la tua prenotazione da noi per ${res.guests} persone alle ${new Date(res.date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', hour12: false })}!`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={styles.btnWhatsapp}
                                    >
                                        WhatsApp
                                    </a>
                                )}
                                <button
                                    className={styles.btnActionDanger}
                                    style={{
                                        gridColumn: '1 / -1',
                                        background: 'transparent',
                                        border: '1px solid #ef4444',
                                        color: '#ef4444',
                                        borderRadius: '12px',
                                        padding: '0.75rem',
                                        fontSize: '0.95rem',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: '8px',
                                        width: '100%',
                                        marginTop: '0.25rem'
                                    }}
                                    onClick={() => handleDelete(res.id)}
                                    title="Elimina definitivamente"
                                >
                                    ✕ Elimina Prenotazione
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )
            }

            {/* SETTINGS MODAL */}
            {isSettingsOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2 className={styles.modalTitle}>Impostazioni Booking</h2>

                        <form onSubmit={handleUpdateSettings}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Persone Massime per Slot</label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    className={styles.modalInput}
                                    value={bookingSettings.bookingMaxGuestsPerSlot}
                                    onChange={e => setBookingSettings({ ...bookingSettings, bookingMaxGuestsPerSlot: parseInt(e.target.value) })}
                                />
                                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
                                    Limite massimo di persone che possono prenotare dallo stesso form.
                                </p>
                            </div>

                            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="checkbox"
                                    id="autoConfirm"
                                    checked={bookingSettings.bookingAutoConfirm}
                                    onChange={e => setBookingSettings({ ...bookingSettings, bookingAutoConfirm: e.target.checked })}
                                    style={{ width: '20px', height: '20px' }}
                                />
                                <label htmlFor="autoConfirm" style={{ fontWeight: 600, cursor: 'pointer' }}>Conferma Automatica</label>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '-10px', marginBottom: '1.5rem' }}>
                                Se attivo, le prenotazioni caricate dal form saranno segnate subito come "Confermate".
                            </p>

                            <div className={styles.modalActions}>
                                <button
                                    type="button"
                                    onClick={() => setIsSettingsOpen(false)}
                                    className={styles.btnCancel}
                                >
                                    Annulla
                                </button>
                                <button
                                    type="submit"
                                    className={styles.btnPrimary}
                                    style={{ backgroundColor: '#1e3a8a', border: 'none' }}
                                >
                                    Salva Impostazioni
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* NEW RESERVATION MODAL */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2 className={styles.modalTitle}>Nuova Prenotazione</h2>

                        <form onSubmit={handleCreateReservation}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Nome Cliente</label>
                                <input
                                    type="text"
                                    required
                                    className={styles.modalInput}
                                    value={newRes.name}
                                    onChange={e => setNewRes({ ...newRes, name: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Data</label>
                                    <input
                                        type="date"
                                        required
                                        className={styles.modalInput}
                                        value={newRes.date}
                                        onChange={e => setNewRes({ ...newRes, date: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Ora</label>
                                    <input
                                        type="time"
                                        required
                                        className={styles.modalInput}
                                        value={newRes.time}
                                        onChange={e => setNewRes({ ...newRes, time: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Persone</label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        className={styles.modalInput}
                                        value={newRes.guests}
                                        onChange={e => setNewRes({ ...newRes, guests: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Telefono</label>
                                    <input
                                        type="tel"
                                        className={styles.modalInput}
                                        value={newRes.phone}
                                        onChange={e => setNewRes({ ...newRes, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Note</label>
                                <textarea
                                    className={`${styles.modalInput} ${styles.modalTextarea}`}
                                    value={newRes.notes}
                                    onChange={e => setNewRes({ ...newRes, notes: e.target.value })}
                                />
                            </div>

                            <div className={styles.modalActions}>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className={styles.btnCancel}
                                >
                                    Annulla
                                </button>
                                <button
                                    type="submit"
                                    className={styles.btnPrimary}
                                    style={{ backgroundColor: '#10b981', border: 'none' }}
                                >
                                    Crea Prenotazione (Admin)
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div >
    );
}
