'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    restaurants: { name: string }[];
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'OWNER'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Utente creato con successo!' });
                setFormData({ name: '', email: '', password: '', role: 'OWNER' });
                setTimeout(() => {
                    setShowCreateModal(false);
                    setMessage(null);
                    fetchUsers();
                }, 1500);
            } else {
                setMessage({ type: 'error', text: data.error || 'Errore durante la creazione' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Errore di connessione' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Sei sicuro di voler eliminare questo utente? Questa azione eliminerà anche il suo ristorante.')) return;

        try {
            const res = await fetch(`/api/admin/users?userId=${userId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Utente eliminato correttamente' });
                fetchUsers();
                setTimeout(() => setMessage(null), 3000);
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: data.error || 'Errore durante l\'eliminazione' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Errore di connessione' });
        }
    };

    if (loading) return <div className={styles.container}>Caricamento utenti...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className={styles.title}>Gestione Utenti</h1>
                <button
                    className={`${styles.btnAction} ${styles.btnGold}`}
                    style={{ padding: '12px 24px' }}
                    onClick={() => setShowCreateModal(true)}
                >
                    + Aggiungi Utente
                </button>
            </header>

            <div className={styles.tableCard}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Ruolo</th>
                                <th>Ristoranti</th>
                                <th>Data Creazione</th>
                                <th>Azioni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td style={{ fontWeight: '700', color: '#fff' }}>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`${styles.badge} ${user.role === 'ADMIN' ? styles.badgeActive : styles.badgeActive}`} style={user.role === 'ADMIN' ? { background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', border: '1px solid rgba(168, 85, 247, 0.2)' } : {}}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                        {user.restaurants.map(r => r.name).join(', ') || '-'}
                                    </td>
                                    <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', opacity: 0.6 }}>
                                        {new Date(user.createdAt).toLocaleDateString('it-IT')}
                                    </td>
                                    <td>
                                        {user.role !== 'ADMIN' && (
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className={`${styles.btnAction} ${styles.btnDanger}`}
                                            >
                                                Elimina
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showCreateModal && (
                <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2 className={styles.modalTitle}>Crea Nuovo Utente</h2>

                        {message && (
                            <div style={{
                                padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem',
                                background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                color: message.type === 'success' ? '#10b981' : '#ef4444',
                                fontSize: '0.9rem',
                                border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                            }}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleCreateUser}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Nome Completo</label>
                                <input
                                    type="text" required className={styles.input}
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Email</label>
                                <input
                                    type="email" required className={styles.input}
                                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Password</label>
                                <input
                                    type="password" required className={styles.input}
                                    value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Ruolo</label>
                                <select
                                    className={styles.select}
                                    value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="OWNER">OWNER (Ristorante)</option>
                                    <option value="ADMIN">ADMIN (Piattaforma)</option>
                                </select>
                            </div>

                            <div className={styles.modalActions}>
                                <button
                                    type="submit" disabled={isSubmitting}
                                    className={styles.btnSubmit}
                                >
                                    {isSubmitting ? 'Creazione...' : 'Crea Utente'}
                                </button>
                                <button
                                    type="button" onClick={() => setShowCreateModal(false)}
                                    className={styles.btnCancel}
                                >
                                    Annulla
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
