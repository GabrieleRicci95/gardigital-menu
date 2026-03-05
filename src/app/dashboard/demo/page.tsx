'use client';

import Link from 'next/link';
import styles from '../restaurant-dashboard.module.css';

const DEMO_DATA = {
    plan: 'Full Pack',
    expiryDate: '31/12/2026',
    todayReservations: 7,
    todayGuests: 18,
    pending: 3,
    monthReservations: 124,
    categories: [
        {
            name: 'Antipasti',
            items: [
                { name: 'Burrata con Pomodorini e Pesto', price: '€ 14.00', desc: 'Burrata cremosa, pomodorini datterini, pesto di basilico.', img: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=64&h=64&fit=crop', isVeg: true },
                { name: 'Carpaccio di Manzo', price: '€ 16.00', desc: 'Manzo marinato, scaglie di Grana Padano, rucola selvatica.', img: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=64&h=64&fit=crop', isVeg: false },
            ]
        },
        {
            name: 'Primi Piatti',
            items: [
                { name: 'Risotto allo Zafferano', price: '€ 22.00', desc: 'Risotto mantecato con zafferano DOP e ossobuco di vitello.', img: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=64&h=64&fit=crop', isVeg: false },
                { name: 'Tagliolini al Tartufo Nero', price: '€ 26.00', desc: 'Pasta fresca, crema di tartufo nero, scaglie di parmigiano.', img: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=64&h=64&fit=crop', isVeg: true },
            ]
        },
        {
            name: 'Secondi Piatti',
            items: [
                { name: 'Filetto di Branzino', price: '€ 28.00', desc: 'Branzino selvaggio, crosta di erbe, salsa al vino bianco.', img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=64&h=64&fit=crop', isVeg: false },
            ]
        },
        {
            name: 'Dolci',
            items: [
                { name: 'Tiramisù della Casa', price: '€ 9.00', desc: 'Savoiardi, crema al mascarpone, cacao amaro di Modica.', img: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=64&h=64&fit=crop', isVeg: true },
            ]
        },
    ]
};

const DisabledBtn = ({ children, color = '#1a237e' }: { children: React.ReactNode, color?: string }) => (
    <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: 600,
        fontSize: '1rem', width: '100%', background: color, color: 'white',
        opacity: 0.45, cursor: 'not-allowed', userSelect: 'none',
    }}>
        🔒 {children}
    </span>
);

export default function DashboardDemoPage() {
    return (
        <div style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: 'Inter, system-ui, sans-serif' }}>

            {/* Demo Banner */}
            <div style={{
                background: 'linear-gradient(135deg, #1a237e, #283593)',
                color: 'white', textAlign: 'center', padding: '14px 24px',
                position: 'sticky', top: 0, zIndex: 200,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px',
                flexWrap: 'wrap', boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
                <div>
                    <span style={{ fontSize: '1rem', fontWeight: 700 }}>👀 Modalità Demo</span>
                    <span style={{ fontSize: '0.85rem', opacity: 0.8, marginLeft: 8 }}>Questa è una preview della tua futura dashboard. I dati sono simulati.</span>
                </div>
                <Link href="/" style={{
                    background: '#ffd700', color: '#1a237e', padding: '8px 20px',
                    borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '0.88rem',
                    whiteSpace: 'nowrap'
                }}>
                    ← Torna al Sito
                </Link>
            </div>

            {/* Simulated Sidebar + Main */}
            <div style={{ display: 'flex', minHeight: 'calc(100vh - 53px)' }}>

                {/* Fake Sidebar */}
                <aside style={{
                    width: '260px', background: '#0d1b2a', color: 'white', padding: '2rem 1.5rem',
                    display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0,
                }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffd700', marginBottom: '1.5rem', letterSpacing: '-0.5px' }}>
                        🍽️ Gardigital
                    </div>
                    {['🏠 Dashboard', '🗓️ Prenotazioni', '📋 Il Menu', '🎨 Design', '📲 QR Code', '⚙️ Impostazioni', '📦 Abbonamento'].map((item, i) => (
                        <div key={i} style={{
                            padding: '12px 16px', borderRadius: '10px', cursor: 'not-allowed',
                            background: i === 0 ? 'rgba(255,215,0,0.15)' : 'transparent',
                            color: i === 0 ? '#ffd700' : 'rgba(255,255,255,0.6)',
                            fontWeight: i === 0 ? 700 : 400, fontSize: '0.95rem',
                            opacity: 0.8, userSelect: 'none',
                        }}>
                            {item}
                        </div>
                    ))}
                </aside>

                {/* Main Content */}
                <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px' }}>
                    <header style={{ marginBottom: '2.5rem' }}>
                        <h1 style={{ fontSize: '2.5rem', color: '#1a237e', fontWeight: 700, marginBottom: '0.3rem' }}>
                            Bentornato! 👋
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Ecco una panoramica della tua attività oggi.</p>
                    </header>

                    {/* Stats Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                        {[
                            { icon: '📅', value: DEMO_DATA.todayReservations, label: 'Prenotazioni Oggi', bg: '#f0fdf4', color: '#16a34a' },
                            { icon: '👥', value: DEMO_DATA.todayGuests, label: 'Coperti Oggi', bg: '#f0fdf4', color: '#16a34a' },
                            { icon: '⏳', value: DEMO_DATA.pending, label: 'Da Confermare', bg: '#fffbeb', color: '#d97706' },
                            { icon: '📈', value: DEMO_DATA.monthReservations, label: 'Prenotazioni Mese', bg: '#eff6ff', color: '#2563eb' },
                        ].map((stat, i) => (
                            <div key={i} style={{
                                background: 'white', padding: '1.5rem', borderRadius: '20px',
                                border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '1.2rem',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                            }}>
                                <div style={{ width: 60, height: 60, borderRadius: 16, background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111', lineHeight: 1.2 }}>{stat.value}</div>
                                    <div style={{ fontSize: '0.9rem', color: '#666', fontWeight: 500 }}>{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cards Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>

                        {/* Subscription Card */}
                        <div style={{ background: 'white', borderRadius: 24, padding: '2rem', boxShadow: '0 10px 30px rgba(255,179,0,0.12)', border: '1px solid rgba(255,179,0,0.1)', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f57f17', marginBottom: '1rem' }}>Stato Abbonamento</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbc02d', marginBottom: '0.5rem' }}>{DEMO_DATA.plan}</div>
                            <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>Hai il pacchetto completo con tutti i moduli attivi.</p>
                            <div style={{ background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', padding: 12, marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 4 }}>Scadenza Servizio</div>
                                <div style={{ fontWeight: 700, color: '#334155' }}>📅 {DEMO_DATA.expiryDate}</div>
                            </div>
                            <DisabledBtn color="#f57f17">Gestisci / Rinnova</DisabledBtn>
                        </div>

                        {/* Menu Card */}
                        <div style={{ background: 'white', borderRadius: 24, padding: '2rem', boxShadow: '0 10px 30px rgba(33,150,243,0.12)', border: '1px solid rgba(33,150,243,0.1)', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1976d2', marginBottom: '1rem' }}>I Tuoi Menu</div>
                            <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.6, flex: 1 }}>Gestisci i piatti, i prezzi e organizza le categorie del tuo menu digitale.</p>
                            <DisabledBtn>Gestisci Menu</DisabledBtn>
                        </div>

                        {/* QR Code Card */}
                        <div style={{ background: 'white', borderRadius: 24, padding: '2rem', boxShadow: '0 10px 30px rgba(156,39,176,0.12)', border: '1px solid rgba(156,39,176,0.1)', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#7b1fa2', marginBottom: '1rem' }}>Il Tuo QR Code</div>
                            <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.6, flex: 1 }}>Scarica e stampa il codice QR da posizionare sui tavoli per i tuoi clienti.</p>
                            <DisabledBtn color="#7b1fa2">Vedi QR Code</DisabledBtn>
                        </div>

                    </div>

                    {/* Menu Preview */}
                    <div style={{ background: 'white', borderRadius: 24, padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.04)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1a237e' }}>📋 Anteprima Menu — Ristorante La Terrazza</div>
                            <div style={{ display: 'flex', gap: '0.8rem' }}>
                                <Link href="/menu/demo" target="_blank" style={{
                                    padding: '8px 18px', borderRadius: 100, fontWeight: 600, fontSize: '0.9rem',
                                    border: '1px solid rgba(26,35,126,0.15)', color: '#1a237e', textDecoration: 'none', background: 'white'
                                }}>👁️ Visualizza Menu</Link>
                                <DisabledBtn color="#1a237e">+ Aggiungi Piatto</DisabledBtn>
                            </div>
                        </div>

                        {DEMO_DATA.categories.map((cat, ci) => (
                            <div key={ci} style={{ marginBottom: '1.5rem' }}>
                                <div style={{
                                    padding: '12px 16px', background: '#f8f9fa', borderRadius: '10px 10px 0 0',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    borderBottom: '1px solid rgba(0,0,0,0.05)'
                                }}>
                                    <span style={{ fontWeight: 700, color: '#1a237e', fontSize: '1rem' }}>{cat.name}</span>
                                    <span style={{ fontSize: '0.8rem', color: '#999', cursor: 'not-allowed', opacity: 0.5 }}>🔒 + Aggiungi Piatto</span>
                                </div>
                                {cat.items.map((item, ii) => (
                                    <div key={ii} style={{
                                        padding: '14px 16px', borderBottom: '1px solid rgba(0,0,0,0.04)',
                                        display: 'flex', alignItems: 'center', gap: '1rem', background: 'white'
                                    }}>
                                        <img src={item.img} alt={item.name} style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.name}</span>
                                                {item.isVeg && <span style={{ fontSize: '0.65rem', background: '#f3e5f5', color: '#7b1fa2', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>Veg</span>}
                                            </div>
                                            <div style={{ fontSize: '0.82rem', color: '#666', marginTop: 2 }}>{item.desc}</div>
                                        </div>
                                        <div style={{ fontWeight: 700, color: '#1a237e', fontSize: '1rem', minWidth: 70, textAlign: 'right' }}>{item.price}</div>
                                        <div style={{ display: 'flex', gap: '6px', opacity: 0.35, cursor: 'not-allowed' }}>
                                            <span style={{ fontSize: '0.8rem', background: '#e3f2fd', color: '#1565c0', padding: '4px 10px', borderRadius: 6, fontWeight: 600 }}>✏️ Modifica</span>
                                            <span style={{ fontSize: '0.8rem', background: '#ffebee', color: '#c62828', padding: '4px 10px', borderRadius: 6, fontWeight: 600 }}>🗑️ Elimina</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
