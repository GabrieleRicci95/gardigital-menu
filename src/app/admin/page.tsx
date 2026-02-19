import { prisma } from '@/lib/prisma';
import styles from './admin.module.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getStats() {
    const excludedEmails = ['gardigital16@gmail.com', 'demo@gardigital.it', 'gabriele123@gmail.com'];

    const totalRestaurants = await prisma.restaurant.count({
        where: { owner: { email: { notIn: excludedEmails } } }
    });
    // Removed totalVisits query

    // Revenue Calculation (Micro-services)
    // Base: €14.99
    // Translations: +€9.99
    // Reservations: +€9.99
    // Full Package Cap: €29.99

    const subscriptions = await prisma.subscription.findMany({
        where: {
            status: 'ACTIVE',
            restaurant: { owner: { email: { notIn: excludedEmails } } }
        },
        select: {
            plan: true,
            hasTranslations: true,
            hasReservations: true
        }
    });

    let totalRevenue = 0;

    subscriptions.forEach(sub => {
        let subRevenue = 14.99; // Base Plan
        if (sub.hasTranslations) subRevenue += 9.99;
        if (sub.hasReservations) subRevenue += 9.99;

        // Cap at €29.99 (Full Package Discount)
        if (subRevenue > 29.99) subRevenue = 29.99;

        totalRevenue += subRevenue;
    });

    const activeSubscriptions = subscriptions.length;

    return {
        totalRestaurants,
        activeSubscriptions,
        estimatedRevenue: totalRevenue.toFixed(2)
    };
}

export default async function AdminDashboardPage() {
    try {
        const stats = await getStats();

        return (
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Panoramica Admin</h1>
                </header>

                <div className={styles.grid}>
                    {/* Ristoranti */}
                    <div className={`${styles.card} ${styles.cardBlue}`}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Ristoranti Iscritti</span>
                            <div className={`${styles.icon} ${styles.iconBlue}`}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V7l8-4 8 4v14M8 21v-4h8v4" /></svg>
                            </div>
                        </div>
                        <div>
                            <p className={styles.stat}>{stats.totalRestaurants}</p>
                            <span className={styles.subtext}>Totale Piattaforma</span>
                        </div>
                    </div>

                    {/* Abbonamenti */}
                    <div className={`${styles.card} ${styles.cardPurple}`}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Abbonamenti Attivi</span>
                            <div className={`${styles.icon} ${styles.iconPurple}`}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                            </div>
                        </div>
                        <div>
                            <p className={styles.stat}>{stats.activeSubscriptions}</p>
                            <span className={styles.subtext}>Piano Base + Moduli</span>
                        </div>
                    </div>

                    {/* Ricavi - Most Important */}
                    <div className={`${styles.card} ${styles.cardGold}`} style={{ gridColumn: 'span 1' }}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Ricavi Mensili (Stimati)</span>
                            <div className={`${styles.icon} ${styles.iconGold}`}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                            </div>
                        </div>
                        <div>
                            <p className={styles.stat}>€ {stats.estimatedRevenue}</p>
                            <span className={styles.subtext}>Base 14,99€ + Extra (Cap 29,99€)</span>
                        </div>
                    </div>

                </div>
            </div>
        );
    } catch (error: any) {
        return (
            <div style={{ padding: '20px', color: 'red' }}>
                <h1>Errore di Caricamento Dashboard</h1>
                <pre>{error.message}</pre>
                <p>Verificare la connessione al database e la configurazione dei modelli Prisma.</p>
            </div>
        );
    }
}
