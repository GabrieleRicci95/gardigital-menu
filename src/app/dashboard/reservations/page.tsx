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

    const handleStatusUpdate = async (id: string, newStatus: string) => {
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
            const cleanPhone = reservation.phone.replace(/\s/g, '').replace(/[^0-9+]/g, '');
            window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
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
        setLoading(true);

        try {
            // Get restaurant ID first (should be optimized in a real app)
            const restaurantRes = await fetch('/api/restaurant');
            const restaurantData = await restaurantRes.json();

            if (!restaurantData.restaurant) throw new Error('Ristorante non trovato');

            const res = await fetch('/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    restaurantId: restaurantData.restaurant.id,
                    name: newRes.name,
                    guests: newRes.guests,
                    date: newRes.date,
                    time: newRes.time,
                    phone: newRes.phone || 'Manuale',
                    notes: newRes.notes,
                    status: 'CONFIRMED' // Auto-confirm manual entries
                })
            });

            if (res.ok) {
                alert('Prenotazione inserita con successo! ✅');
                setIsModalOpen(false);
                setNewRes({ ...newRes, name: '', phone: '', notes: '' }); // Reset fields
                fetchReservations();
            } else {
                const err = await res.json();
                alert('Errore: ' + (err.error || 'Impossibile creare'));
            }
        } catch (error) {
            console.error(error);
            alert('Errore di connessione');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
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
                    <h1 className={styles.title}>Agenda</h1>
                    <p className={styles.subtitle}>Gestisci le richieste per il tuo locale.</p>
                </div>
                <div className={styles.controls}>
                    <button
                        className={styles.btnPrimary}
                        style={{ backgroundColor: '#2e7d32', marginRight: '1rem' }}
                        onClick={() => setIsModalOpen(true)}
                    >
                        + Nuova Prenotazione
                    </button>
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className={styles.dateInput}
                    />
                    <button className={styles.btnPrimary} onClick={() => fetchReservations()}>
                        ↻
                    </button>
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
                                        {/* Force 24h format explicitly */}
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
                                <a
                                    href={`https://wa.me/${res.phone.replace(/\s/g, '')}?text=Ciao ${res.name}, confermiamo la tua prenotazione da noi per ${res.guests} persone alle ${new Date(res.date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', hour12: false })}!`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={styles.btnWhatsapp}
                                >
                                    WhatsApp
                                </a>
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

            {/* MANUAL RESERVATION MODAL */}
            {
                isModalOpen && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                    }}>
                        <div style={{
                            backgroundColor: 'white', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                        }}>
                            <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Nuova Prenotazione Manuale</h2>

                            <form onSubmit={handleCreateReservation}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nome Cliente</label>
                                    <input
                                        type="text"
                                        required
                                        className={styles.dateInput} // Reuse existing input style
                                        style={{ width: '100%' }}
                                        value={newRes.name}
                                        onChange={e => setNewRes({ ...newRes, name: e.target.value })}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Persone</label>
                                        <input
                                            type="number"
                                            min="1"
                                            required
                                            className={styles.dateInput}
                                            style={{ width: '100%' }}
                                            value={newRes.guests}
                                            onChange={e => setNewRes({ ...newRes, guests: parseInt(e.target.value) })}
                                            onWheel={(e) => (e.target as HTMLInputElement).blur()}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Ora</label>
                                        <input
                                            type="time"
                                            required
                                            className={styles.dateInput}
                                            style={{ width: '100%' }}
                                            value={newRes.time}
                                            onChange={e => setNewRes({ ...newRes, time: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Data</label>
                                    <input
                                        type="date"
                                        required
                                        className={styles.dateInput}
                                        style={{ width: '100%' }}
                                        value={newRes.date}
                                        onChange={e => setNewRes({ ...newRes, date: e.target.value })}
                                    />
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Telefono (Opzionale)</label>
                                    <input
                                        type="tel"
                                        className={styles.dateInput}
                                        style={{ width: '100%' }}
                                        placeholder="Es. 333 1234567"
                                        value={newRes.phone}
                                        onChange={e => setNewRes({ ...newRes, phone: e.target.value })}
                                    />
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Note</label>
                                    <textarea
                                        rows={3}
                                        className={styles.dateInput}
                                        style={{ width: '100%', fontFamily: 'inherit' }}
                                        placeholder="Es. Seggiolone, Tavolo esterno..."
                                        value={newRes.notes}
                                        onChange={e => setNewRes({ ...newRes, notes: e.target.value })}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        style={{
                                            padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid #ddd',
                                            background: '#f5f5f5', cursor: 'pointer', fontWeight: 500
                                        }}
                                    >
                                        Annulla
                                    </button>
                                    <button
                                        type="submit"
                                        className={styles.btnPrimary}
                                        style={{ backgroundColor: '#2e7d32', border: 'none' }}
                                    >
                                        Inserisci in Agenda
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
