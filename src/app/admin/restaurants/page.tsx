'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    Search,
    Calendar,
    Globe,
    ShieldCheck,
    Trash2,
    Lock,
    PlusCircle,
    BarChart3,
    Users,
    Clock,
    CheckCircle2,
    XCircle,
    MoreVertical,
    ChevronDown,
    Zap,
    Crown,
    Repeat,
    CreditCard
} from 'lucide-react';
import styles from '../admin.module.css';

interface Restaurant {
    id: string;
    name: string;
    owner: {
        name: string | null;
        email: string;
    };
    subscription?: {
        plan: string;
        status: string;
        endDate?: string | null;
        hasTranslations?: boolean;
        hasReservations?: boolean;
        isRecurring?: boolean;
        stripeSubscriptionId?: string | null;
    } | null;
    createdAt: string;
}

export default function AdminRestaurantsPage() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDuration, setSelectedDuration] = useState(1);

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            const res = await fetch('/api/admin/restaurants');
            if (res.ok) {
                const data = await res.json();
                setRestaurants(data.restaurants || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const stats = useMemo(() => {
        const total = restaurants.length;
        const active = restaurants.filter(r => r.subscription?.status === 'ACTIVE').length;
        const expired = total - active;
        return { total, active, expired };
    }, [restaurants]);

    const handleToggleFeature = async (restaurantId: string, feature: 'hasTranslations' | 'hasReservations', currentValue: boolean) => {
        setRestaurants(prev => prev.map(r => {
            if (r.id === restaurantId && r.subscription) {
                return {
                    ...r,
                    subscription: { ...r.subscription, [feature]: !currentValue }
                };
            }
            return r;
        }));

        try {
            const res = await fetch('/api/admin/restaurants/update-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ restaurantId, [feature]: !currentValue }),
            });
            if (!res.ok) fetchRestaurants();
        } catch (e) {
            alert('Errore di connessione');
            fetchRestaurants();
        }
    };

    const handlePlanChange = async (restaurantId: string, newPlan: string, durationMonths: number = 0) => {
        setRestaurants(prev => {
            if (newPlan === 'DELETED') return prev.filter(r => r.id !== restaurantId);
            return prev.map(r => {
                if (r.id === restaurantId) {
                    const isFull = newPlan === 'FULL';
                    return {
                        ...r,
                        subscription: newPlan === 'BLOCKED' ? null : {
                            ...r.subscription,
                            plan: newPlan,
                            status: 'ACTIVE',
                            hasTranslations: isFull || newPlan === 'PILOT',
                            hasReservations: isFull || newPlan === 'PILOT',
                            endDate: newPlan === 'PILOT' ? null : (durationMonths > 0 ? new Date(Date.now() + durationMonths * 30 * 24 * 60 * 60 * 1000).toISOString() : null)
                        } as any
                    };
                }
                return r;
            });
        });

        const res = await fetch('/api/admin/restaurants/update-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ restaurantId, newPlan, durationMonths })
        });
        if (!res.ok) fetchRestaurants();
    };

    const filteredRestaurants = restaurants.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.owner.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.owner.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className={styles.container}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem' }}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-900"></div>
            </div>
        </div>
    );

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Gestione Ristoranti</h1>
                <p className={styles.subtitle}>Gestisci i tuoi partner e monitora gli abbonamenti</p>
            </header>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}><Users size={24} /></div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{stats.total}</span>
                        <span className={styles.statLabel}>Partner Totali</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}><CheckCircle2 size={24} /></div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{stats.active}</span>
                        <span className={styles.statLabel}>Abbonamenti Attivi</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}><Clock size={24} /></div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{stats.expired}</span>
                        <span className={styles.statLabel}>Scaduti / In attesa</span>
                    </div>
                </div>
            </div>

            <div className={styles.filtersWrapper}>
                <div className={styles.searchContainer}>
                    <div className={styles.searchIcon}><Search size={20} /></div>
                    <input
                        type="text"
                        placeholder="Cerca ristorante, email o proprietario..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.durationControl}>
                    <span className={styles.durationLabel}>Durata Rinnovo:</span>
                    <select
                        value={selectedDuration}
                        onChange={(e) => setSelectedDuration(parseInt(e.target.value))}
                        className={styles.durationSelect}
                    >
                        <option value={1}>1 Mese</option>
                        <option value={3}>3 Mesi</option>
                        <option value={6}>6 Mesi</option>
                        <option value={12}>12 Mesi</option>
                    </select>
                    <ChevronDown size={16} />
                </div>
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Ristorante</th>
                                <th>Proprietario</th>
                                <th>Stato</th>
                                <th>Iscrizione</th>
                                <th>Scadenza</th>
                                <th style={{ textAlign: 'right' }}>Azioni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRestaurants.map(r => {
                                const isActive = r.subscription?.status === 'ACTIVE';
                                const isExpired = r.subscription?.endDate && new Date(r.subscription.endDate) < new Date();

                                return (
                                    <tr key={r.id}>
                                        <td className={styles.restaurantCell}>
                                            <span className={styles.restaurantName}>{r.name}</span>
                                            <span className={styles.restaurantId}>{r.id.substring(0, 8)}...</span>
                                        </td>
                                        <td className={styles.ownerCell}>
                                            <span className={styles.ownerName}>{r.owner.name || 'N/D'}</span>
                                            <span className={styles.ownerEmail}>{r.owner.email}</span>
                                        </td>
                                        <td>
                                            {!isActive || isExpired ? (
                                                <span className={`${styles.badge} ${styles.badgeExpired}`}>
                                                    <XCircle size={14} /> Scaduto
                                                </span>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    {r.subscription?.plan === 'PILOT' ? (
                                                        <span className={`${styles.badge} ${styles.badgeActive}`} style={{ background: 'rgba(162, 28, 175, 0.1)', color: '#a21caf', border: '1px solid rgba(162, 28, 175, 0.2)' }}>
                                                            <Crown size={14} /> Socio Pilota
                                                        </span>
                                                    ) : (
                                                        <span className={`${styles.badge} ${styles.badgeActive}`}>
                                                            <CheckCircle2 size={14} /> Attivo
                                                        </span>
                                                    )}
                                                    <div style={{ display: 'flex', gap: '8px', fontSize: '1rem', marginTop: '4px' }}>
                                                        {r.subscription?.hasTranslations && <span title="Traduzioni Attive"><Globe size={16} color="#3b82f6" /></span>}
                                                        {r.subscription?.hasReservations && <span title="Prenotazioni Attive"><Calendar size={16} color="#a855f7" /></span>}
                                                        {r.subscription?.isRecurring && (
                                                            <span title={`Rinnovo Automatico Attivo: ${r.subscription.stripeSubscriptionId}`}>
                                                                <Repeat size={16} color="#10b981" />
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ opacity: 0.6 }}>
                                            {new Date(r.createdAt).toLocaleDateString('it-IT')}
                                        </td>
                                        <td>
                                            {r.subscription?.endDate ? (
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{
                                                        fontWeight: 700,
                                                        color: isExpired ? '#ef4444' : '#fff'
                                                    }}>
                                                        {new Date(r.subscription.endDate).toLocaleDateString('it-IT')}
                                                    </span>
                                                    {!isExpired && <span style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.4)' }}>Scade presto</span>}
                                                </div>
                                            ) : r.subscription?.plan === 'PILOT' ? (
                                                <span style={{ color: '#a21caf', fontWeight: 600 }}>Illimitato</span>
                                            ) : (
                                                <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>Mancante</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className={styles.actionGroup} style={{ justifyContent: 'flex-end' }}>
                                                <div className={styles.btnGroup}>
                                                    <button
                                                        onClick={() => handlePlanChange(r.id, 'PREMIUM', selectedDuration)}
                                                        className={`${styles.btnAction} ${styles.btnGreen}`}
                                                        title="Attiva Piano Base"
                                                    >
                                                        <PlusCircle size={14} /> Base (+{selectedDuration}m)
                                                    </button>
                                                    <button
                                                        onClick={() => handlePlanChange(r.id, 'FULL', selectedDuration)}
                                                        className={`${styles.btnAction} ${styles.btnGold}`}
                                                        title="Attiva Tutto"
                                                    >
                                                        <Zap size={14} /> Full (+{selectedDuration}m)
                                                    </button>
                                                    <button
                                                        onClick={() => handlePlanChange(r.id, 'PILOT')}
                                                        className={`${styles.btnAction}`}
                                                        style={{ background: 'rgba(162, 28, 175, 0.1)', color: '#a21caf', border: '1px solid rgba(162, 28, 175, 0.2)' }}
                                                        title="Socio Pilota (Free Forever)"
                                                    >
                                                        <Crown size={14} /> Pilot
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => handleToggleFeature(r.id, 'hasTranslations', !!r.subscription?.hasTranslations)}
                                                    disabled={!r.subscription}
                                                    className={`${styles.btnAction} ${styles.btnIcon} ${r.subscription?.hasTranslations ? styles.btnIconActive : ''}`}
                                                    title="Toggle Traduzioni"
                                                >
                                                    <Globe size={18} />
                                                </button>

                                                <button
                                                    onClick={() => handleToggleFeature(r.id, 'hasReservations', !!r.subscription?.hasReservations)}
                                                    disabled={!r.subscription}
                                                    className={`${styles.btnAction} ${styles.btnIcon} ${r.subscription?.hasReservations ? styles.btnIconPurple : ''}`}
                                                    title="Toggle Prenotazioni"
                                                >
                                                    <Calendar size={18} />
                                                </button>

                                                <div style={{ width: '1px', height: '24px', background: 'rgba(212, 175, 55, 0.1)', margin: '0 4px' }} />

                                                <button
                                                    onClick={() => handlePlanChange(r.id, 'BLOCKED')}
                                                    className={`${styles.btnAction} ${styles.btnDanger} ${styles.btnIcon}`}
                                                    title="Blocca Abbonamento"
                                                >
                                                    <Lock size={18} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Eliminare definitivamente questo ristorante?')) handlePlanChange(r.id, 'DELETED');
                                                    }}
                                                    className={`${styles.btnAction} ${styles.btnBlack} ${styles.btnIcon}`}
                                                    title="Elimina Ristorante"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
