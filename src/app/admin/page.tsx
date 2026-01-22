import { PrismaClient } from '@prisma/client';
import styles from '../dashboard/dashboard.module.css';

const prisma = new PrismaClient();

async function getStats() {
    const totalRestaurants = await prisma.restaurant.count();
    const totalVisits = await prisma.visit.count();
    const activeSubscriptions = await prisma.subscription.count({
        where: { status: 'ACTIVE' }
    });

    const premiumSubscriptions = await prisma.subscription.count({
        where: { status: 'ACTIVE', plan: 'PREMIUM' }
    });

    const baseSubscriptions = await prisma.subscription.count({
        where: { status: 'ACTIVE', plan: 'BASE' }
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
        <div>
            <h1 className="h2 mb-4">Panoramica Admin</h1>

            <div className={styles.grid}>
                <div className="card">
                    <h3>Ristoranti Iscritti</h3>
                    <p className={styles.stat}>{stats.totalRestaurants}</p>
                    <span className={styles.subtext}>Totale Piattaforma</span>
                </div>

                <div className="card">
                    <h3>Abbonamenti Attivi</h3>
                    <p className={styles.stat}>{stats.activeSubscriptions}</p>
                    <span className={styles.subtext}>Utenti Premium</span>
                </div>

                <div className="card">
                    <h3>Ricavi Mensili (Stimati)</h3>
                    <p className={styles.stat}>€ {stats.estimatedRevenue}</p>
                    <span className={styles.subtext}>Base €15 + Premium €29</span>
                </div>

                <div className="card">
                    <h3>Visite Totali</h3>
                    <p className={styles.stat}>{stats.totalVisits}</p>
                </div>
            </div>
        </div>
    );
}
