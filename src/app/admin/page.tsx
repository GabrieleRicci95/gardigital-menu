import { prisma } from '@/lib/prisma';
import styles from './admin.module.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getStats() {
    // Verified IDs from db_info.txt
    const MASTRO_ID = 'cmlqf9ez300023gn2a547whlk';
    const XL_ID = 'cmkr7204r00023abok44svdus';

    // Find target restaurants by exact IDs OR name/slug as fallback
    const targetRestaurants = await prisma.restaurant.findMany({
        where: {
            OR: [
                { id: MASTRO_ID },
                { id: XL_ID },
                { name: { contains: 'Mastro', mode: 'insensitive' } },
                { name: { contains: 'XL', mode: 'insensitive' } },
                { slug: { contains: 'mastro', mode: 'insensitive' } },
                { slug: { contains: 'xl', mode: 'insensitive' } }
            ]
        },
        select: { id: true, name: true, slug: true }
    });

    const targetRestaurantIds = targetRestaurants.map(r => r.id);

    const totalRestaurants = await prisma.restaurant.count({
        where: { id: { in: targetRestaurantIds } }
    });

    const subscriptions = await prisma.subscription.findMany({
        where: {
            status: 'ACTIVE',
            restaurantId: { in: targetRestaurantIds }
        },
        include: {
            restaurant: {
                select: {
                    id: true,
                    name: true,
                    slug: true
                }
            }
        }
    });

    let totalRevenue = 0;

    subscriptions.forEach(sub => {
        const isXL = sub.restaurantId === XL_ID || sub.restaurant.name.toUpperCase().includes('XL') || sub.restaurant.slug.toLowerCase().includes('xl');
        const isMastro = sub.restaurantId === MASTRO_ID || sub.restaurant.name.toLowerCase().includes('mastro') || sub.restaurant.slug.toLowerCase().includes('mastro');

        // XL is free as per user request
        if (isXL) {
            return;
        }

        let subRevenue = 15.00; // Base Plan
        if (sub.plan === 'FULL') {
            // Mastroarrosticino special price
            if (isMastro) {
                subRevenue = 14.99;
            } else {
                subRevenue = 29.99;
            }
        } else {
            if (sub.hasTranslations) subRevenue += 10.00;
            if (sub.hasReservations) subRevenue += 10.00;

            // Cap at 29.99
            if (subRevenue > 29.99) subRevenue = 29.99;
        }

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
                    <p className={styles.subtitle}>Benvenuto nel pannello di controllo di Gardigital. Ecco l'andamento della piattaforma.</p>
                </header>

                <div className={styles.statsGrid}>
                    {/* Ristoranti */}
                    <div className={`${styles.statCard} ${styles.cardBlue}`}>
                        <div className={`${styles.statIcon} ${styles.iconBlue}`}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V7l8-4 8 4v14M8 21v-4h8v4" /></svg>
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>Ristoranti Iscritti</span>
                            <p className={styles.statValue}>{stats.totalRestaurants}</p>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Totale Piattaforma</span>
                        </div>
                    </div>

                    {/* Abbonamenti */}
                    <div className={`${styles.statCard} ${styles.cardPurple}`}>
                        <div className={`${styles.statIcon} ${styles.iconPurple}`}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>Abbonamenti Attivi</span>
                            <p className={styles.statValue}>{stats.activeSubscriptions}</p>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Piano Base + Moduli</span>
                        </div>
                    </div>

                    {/* Ricavi */}
                    <div className={`${styles.statCard} ${styles.cardGold}`}>
                        <div className={`${styles.statIcon} ${styles.iconGold}`}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>Ricavi Mensili (Stimati)</span>
                            <p className={styles.statValue}>€ {stats.estimatedRevenue}</p>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Base 15€ + Extra (Cap 29,99€)</span>
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
