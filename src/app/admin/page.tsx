import { PrismaClient } from '@prisma/client';
import styles from './admin.module.css';

const prisma = new PrismaClient();

async function getStats() {
    const totalRestaurants = await prisma.restaurant.count({
        where: { owner: { email: { not: 'gabrielericci234@gmail.com' } } }
    });
    const totalVisits = await prisma.visit.count(); // Visits usually don't need filtering but maybe better be consistent if linked to rest

    const activeSubscriptions = await prisma.subscription.count({
        where: {
            status: 'ACTIVE',
            restaurant: { owner: { email: { not: 'gabrielericci234@gmail.com' } } }
        }
    });

    const premiumSubscriptions = await prisma.subscription.count({
        where: {
            status: 'ACTIVE',
            plan: 'PREMIUM',
            restaurant: { owner: { email: { not: 'gabrielericci234@gmail.com' } } }
        }
    });

    const baseSubscriptions = await prisma.subscription.count({
        where: {
            status: 'ACTIVE',
            plan: 'BASE',
            restaurant: { owner: { email: { not: 'gabrielericci234@gmail.com' } } }
        }
    });

    // Revenue: Base (15€) + Premium (29€)
    const estimatedRevenue = (baseSubscriptions * 15) + (premiumSubscriptions * 29);

    return {
        totalRestaurants,
        totalVisits,
        activeSubscriptions,
        estimatedRevenue
    };
}

export default async function AdminDashboardPage() {
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
                        <span className={styles.subtext}>Utenti Premium</span>
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
                        <span className={styles.subtext}>Base €15 + Premium €29</span>
                    </div>
                </div>

                {/* Visite */}
                <div className={`${styles.card} ${styles.cardGreen}`}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>Visite Totali</span>
                        <div className={`${styles.icon} ${styles.iconGreen}`}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                        </div>
                    </div>
                    <div>
                        <p className={styles.stat}>{stats.totalVisits}</p>
                        <span className={styles.subtext}>Views aggregate</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
