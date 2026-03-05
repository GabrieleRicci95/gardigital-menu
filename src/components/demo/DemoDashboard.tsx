'use client';

import Link from 'next/link';
import { useState } from 'react';
import dashStyles from '../app/dashboard/dashboard.module.css';
import pageStyles from '../app/dashboard/restaurant-dashboard.module.css';

const DEMO_DATA = {
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

const navItems = [
    { label: 'Panoramica', active: true },
    { label: 'Agenda', badge: 3 },
    { label: 'Il mio Ristorante' },
    { label: 'Menu' },
    { label: 'Menu Fissi' },
    { label: 'Aspetto & Design' },
    { label: 'QR Code' },
    { label: 'Abbonamenti' },
];

export default function DemoDashboard() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            {/* Demo Banner */}
            <div style={{
                background: 'linear-gradient(135deg, #1a237e, #283593)',
                color: 'white', textAlign: 'center', padding: '12px 24px',
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px',
                flexWrap: 'wrap', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', height: '50px'
            }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>👀 Modalità Demo</span>
                <span style={{ fontSize: '0.8rem', opacity: 0.75 }}>— Dati simulati. Clicca i bottoni per scoprire il potenziale!</span>
                <Link href="/" style={{
                    background: '#ffd700', color: '#1a237e', padding: '6px 16px',
                    borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '0.82rem',
                }}>
                    ← Torna al Sito
                </Link>
            </div>

            {/* Real Dashboard Layout — offset by banner height */}
            <div style={{ paddingTop: '50px', minHeight: '100vh', background: '#f4f6fb' }}>
                <div className={dashStyles.layout}>

                    {/* Real Sidebar Structure */}
                    <aside className={`${dashStyles.sidebar} ${isMobileMenuOpen ? dashStyles.open : ''}`}
                        style={{ top: '50px', height: 'calc(100vh - 50px)' }}>

                        <div className={dashStyles.logo}>
                            <img src="/logo_dashboard.png" alt="Logo" className={dashStyles.logoImage} />
                        </div>

                        <div className={dashStyles.statusContainer}>
                            <div className={`${dashStyles.statusBadge} ${dashStyles.statusActive}`}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                                Abbonamento Attivo
                            </div>
                        </div>

                        <nav className={dashStyles.nav}>
                            {navItems.map((item, i) => (
                                <span key={i}
                                    className={`${dashStyles.navItem} ${item.active ? dashStyles.active : ''}`}
                                    style={{ cursor: 'not-allowed', opacity: item.active ? 1 : 0.7, textDecoration: 'none' }}
                                >
                                    <span>{item.label}</span>
                                    {item.badge && (
                                        <span className={dashStyles.badge}>{item.badge}</span>
                                    )}
                                </span>
                            ))}
                            <span className={`${dashStyles.navItem} ${dashStyles.logout}`}
                                style={{ cursor: 'not-allowed', opacity: 0.5, marginTop: 'auto' }}>
                                <span>Esci</span>
                            </span>
                        </nav>
                    </aside>

                    {/* Mobile overlay */}
                    <div
                        className={`${dashStyles.overlay} ${isMobileMenuOpen ? dashStyles.open : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Main content */}
                    <main className={dashStyles.main}>
                        {/* Top Header */}
                        <header className={dashStyles.header}>
                            <button className={dashStyles.mobileToggle} onClick={() => setIsMobileMenuOpen(true)}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
                                <span>Menu</span>
                            </button>
                            <div className={dashStyles.userMenu}>
                                <span style={{ fontWeight: 'bold', fontSize: '1.2rem', marginRight: '20px' }}>
                                    Ristorante La Terrazza
                                </span>
                            </div>
                        </header>

                        {/* Page Content */}
                        <div className={dashStyles.content}>
                            <header className={pageStyles.header}>
                                <h1 className={pageStyles.title}>Bentornato! 👋</h1>
                                <p className={pageStyles.subtitle}>Ecco una panoramica del tuo ristorante digitale.</p>
                            </header>

                            {/* Stats Row */}
                            <div className={pageStyles.statsRow}>
                                {[
                                    { icon: '📅', value: DEMO_DATA.todayReservations, label: 'Prenotazioni Oggi', cls: pageStyles.statToday },
                                    { icon: '👥', value: DEMO_DATA.todayGuests, label: 'Coperti Oggi', cls: pageStyles.statToday },
                                    { icon: '⏳', value: DEMO_DATA.pending, label: 'Da Confermare', cls: pageStyles.statPending },
                                    { icon: '📈', value: DEMO_DATA.monthReservations, label: 'Prenotazioni Mese', cls: pageStyles.statMonth },
                                ].map((stat, i) => (
                                    <div key={i} className={pageStyles.statCard}>
                                        <div className={`${pageStyles.statIcon} ${stat.cls}`}>{stat.icon}</div>
                                        <div className={pageStyles.statInfo}>
                                            <div className={pageStyles.statValue}>{stat.value}</div>
                                            <div className={pageStyles.statLabel}>{stat.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Cards Grid */}
                            <div className={pageStyles.grid} style={{ marginBottom: '2.5rem' }}>
                                {/* Subscription Card */}
                                <div className={`${pageStyles.card} ${pageStyles.cardPremium}`}>
                                    <div className={pageStyles.cardTitle}>Stato Abbonamento</div>
                                    <div className={pageStyles.statusText} style={{ fontSize: '1.4rem', color: '#fbc02d', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                        Menu + Traduzioni + Prenotazioni
                                    </div>
                                    <p className={pageStyles.cardDesc}>Hai il pacchetto completo con tutti i moduli attivi.</p>
                                    <div style={{ background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', padding: 12, marginBottom: '1.5rem' }}>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 4 }}>Scadenza Servizio</div>
                                        <div style={{ fontWeight: 700, color: '#334155' }}>📅 31/12/2026</div>
                                    </div>
                                    <span className={`${pageStyles.button} ${pageStyles.btnPrimary}`}
                                        style={{ opacity: 0.45, cursor: 'not-allowed' }}>
                                        🔒 Gestisci / Rinnova
                                    </span>
                                </div>

                                {/* Menu Card */}
                                <div className={`${pageStyles.card} ${pageStyles.cardMenu}`}>
                                    <div className={pageStyles.cardTitle}>I Tuoi Menu</div>
                                    <p className={pageStyles.cardDesc}>Gestisci i piatti, i prezzi e organizza le categorie del tuo menu digitale.</p>
                                    <span className={`${pageStyles.button} ${pageStyles.btnPrimary}`}
                                        style={{ opacity: 0.45, cursor: 'not-allowed', marginTop: 'auto' }}>
                                        🔒 Gestisci Menu
                                    </span>
                                </div>

                                {/* QR Code Card */}
                                <div className={`${pageStyles.card} ${pageStyles.cardQr}`}>
                                    <div className={pageStyles.cardTitle}>Il Tuo QR Code</div>
                                    <p className={pageStyles.cardDesc}>Scarica e stampa il codice QR da posizionare sui tavoli per i tuoi clienti.</p>
                                    <span className={`${pageStyles.button} ${pageStyles.btnPrimary}`}
                                        style={{ opacity: 0.45, cursor: 'not-allowed', justifyContent: 'center', marginTop: 'auto' }}>
                                        🔒 Vedi QR Code
                                    </span>
                                </div>
                            </div>

                            {/* Menu Editor Preview */}
                            <div className={pageStyles.card} style={{ minHeight: 'auto' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div className={pageStyles.cardTitle}>📋 Il tuo Menu — Ristorante La Terrazza</div>
                                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                                        <Link href="/menu/demo" target="_blank" className={pageStyles.btnPreview}>
                                            👁️ Anteprima cliente
                                        </Link>
                                        <span className={pageStyles.button}
                                            style={{ width: 'auto', opacity: 0.4, cursor: 'not-allowed', background: '#1a237e', color: 'white', padding: '0.6rem 1.2rem', borderRadius: 10, fontSize: '0.9rem' }}>
                                            🔒 + Aggiungi Categoria
                                        </span>
                                    </div>
                                </div>

                                {/* Menu list - replicates the real structure */}
                                <div className={pageStyles.menuList} style={{ marginBottom: '1.5rem' }}>
                                    <div className={`${pageStyles.menuCard} ${pageStyles.menuCardActive}`}>
                                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Menu Principale</div>
                                        <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>Attivo ✓</div>
                                    </div>
                                </div>

                                <div className={pageStyles.categoryList}>
                                    {DEMO_DATA.categories.map((cat, ci) => (
                                        <div key={ci} className={pageStyles.categoryCard}>
                                            <div className={pageStyles.categoryHeader}>
                                                <h3 className={pageStyles.categoryTitle}>{cat.name}</h3>
                                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                    <span style={{ opacity: 0.35, cursor: 'not-allowed', fontSize: '0.8rem', background: '#e3f2fd', color: '#1565c0', padding: '4px 10px', borderRadius: 6, fontWeight: 600 }}>✏️ Rinomina</span>
                                                    <span className={pageStyles.addItemBtn} style={{ opacity: 0.35, cursor: 'not-allowed' }}>🔒 + Piatto</span>
                                                </div>
                                            </div>
                                            <div className={pageStyles.itemsList}>
                                                {cat.items.map((item, ii) => (
                                                    <div key={ii} className={pageStyles.itemRow}>
                                                        <div className={pageStyles.itemImageContainer}>
                                                            <img src={item.img} alt={item.name} className={pageStyles.itemImage} />
                                                        </div>
                                                        <div className={pageStyles.itemInfo}>
                                                            <div className={pageStyles.itemName}>{item.name}</div>
                                                            <div className={pageStyles.itemDesc}>{item.desc}</div>
                                                            <div className={pageStyles.itemBadges}>
                                                                {item.isVeg && <span className={`${pageStyles.badge} ${pageStyles.badgeVeg}`}>Vegetariano</span>}
                                                            </div>
                                                        </div>
                                                        <div className={pageStyles.itemPrice}>{item.price}</div>
                                                        <div style={{ display: 'flex', gap: '6px', opacity: 0.35, cursor: 'not-allowed', flexShrink: 0 }}>
                                                            <span className={pageStyles.btnActionEdit}>✏️ Modifica</span>
                                                            <span className={pageStyles.btnSmDanger}>🗑️</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
