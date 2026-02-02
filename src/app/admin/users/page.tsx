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

            <div className={styles.card} style={{ marginTop: '20px', padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                            <th style={{ padding: '15px' }}>Nome</th>
                            <th style={{ padding: '15px' }}>Email</th>
                            <th style={{ padding: '15px' }}>Ruolo</th>
                            <th style={{ padding: '15px' }}>Ristoranti</th>
                            <th style={{ padding: '15px' }}>Data Creazione</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '15px' }}>{user.name}</td>
                                <td style={{ padding: '15px' }}>{user.email}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        background: user.role === 'ADMIN' ? '#e8f5e9' : '#e3f2fd',
                                        color: user.role === 'ADMIN' ? '#2e7d32' : '#1565c0'
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    {user.restaurants.map(r => r.name).join(', ') || '-'}
                                </td>
                                <td style={{ padding: '15px' }}>
                                    {new Date(user.createdAt).toLocaleDateString('it-IT')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
