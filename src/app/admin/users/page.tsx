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
                    className={styles.button}
                    style={{ background: '#1a237e', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
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
                                    <td style={{ fontWeight: '600' }}>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold',
                                            background: user.role === 'ADMIN' ? '#e8f5e9' : '#e3f2fd',
                                            color: user.role === 'ADMIN' ? '#2e7d32' : '#1565c0',
                                            border: user.role === 'ADMIN' ? '1px solid #c8e6c9' : '1px solid #bbdefb'
                                        }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                        {user.restaurants.map(r => r.name).join(', ') || '-'}
                                    </td>
                                    <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                        {new Date(user.createdAt).toLocaleDateString('it-IT')}
                                    </td>
                                    <td>
                                        {user.role !== 'ADMIN' && (
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className={`${styles.btnAction} ${styles.btnRed}`}
                                                style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', fontSize: '0.75rem', padding: '4px 8px' }}
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
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }} onClick={() => setShowCreateModal(false)}>
                    <div style={{
                        background: 'white', padding: '30px', borderRadius: '12px',
                        width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                    }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ marginBottom: '20px', color: '#1a237e' }}>Crea Nuovo Utente</h2>

                        {message && (
                            <div style={{
                                padding: '10px', borderRadius: '4px', marginBottom: '15px',
                                background: message.type === 'success' ? '#e8f5e9' : '#ffebee',
                                color: message.type === 'success' ? '#2e7d32' : '#c62828',
                                fontSize: '0.9rem'
                            }}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleCreateUser}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Nome Completo</label>
                                <input
                                    type="text" required className={styles.input}
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Email</label>
                                <input
                                    type="email" required className={styles.input}
                                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Password</label>
                                <input
                                    type="password" required className={styles.input}
                                    value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Ruolo</label>
                                <select
                                    className={styles.input} style={{ width: '100%' }}
                                    value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="OWNER">OWNER (Ristorante)</option>
                                    <option value="ADMIN">ADMIN (Piattaforma)</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    type="submit" disabled={isSubmitting}
                                    className={styles.button}
                                    style={{ flex: 1, background: '#1a237e', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}
                                >
                                    {isSubmitting ? 'Creazione...' : 'Crea Utente'}
                                </button>
                                <button
                                    type="button" onClick={() => setShowCreateModal(false)}
                                    className={styles.button}
                                    style={{ background: '#f5f5f5', color: '#333', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}
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
