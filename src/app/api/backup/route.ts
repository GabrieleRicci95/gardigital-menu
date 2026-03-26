import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Vercel Cron Job - CRON_SECRET protegge la route
export async function GET(req: Request) {
    // Verifica il secret per sicurezza
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Esporta tutti i ristoranti con dati completi
        const restaurants = await prisma.restaurant.findMany({
            include: {
                owner: { select: { email: true, name: true } },
                subscription: true,
                menus: {
                    include: {
                        categories: {
                            include: { items: true }
                        }
                    }
                },
                wineList: { include: { sections: { include: { items: true } } } },
                champagneList: { include: { sections: { include: { items: true } } } },
                drinkList: { include: { sections: { include: { items: true } } } },
                customLists: { include: { sections: { include: { items: true } } } },
                fixedMenus: { include: { sections: { include: { items: true } } } },
            }
        });

        const stats = {
            restaurantCount: restaurants.length,
            totalMenus: restaurants.reduce((a, r) => a + r.menus.length, 0),
            totalCategories: restaurants.reduce((a, r) => a + r.menus.reduce((b, m) => b + m.categories.length, 0), 0),
            totalItems: restaurants.reduce((a, r) => a + r.menus.reduce((b, m) => b + m.categories.reduce((c, cat) => c + cat.items.length, 0), 0), 0),
        };

        const backupData = {
            timestamp: new Date().toISOString(),
            version: '1.0',
            stats,
            restaurants
        };

        // 1. Salva il backup nel database
        await prisma.backup.create({
            data: {
                data: restaurants as any,
                stats: stats as any
            }
        });

        // 2. Gestione rotazione (mantieni solo i 10 più recenti)
        const backups = await prisma.backup.findMany({
            orderBy: { createdAt: 'desc' },
            select: { id: true }
        });

        if (backups.length > 10) {
            const idsToDelete = backups.slice(10).map((b: any) => b.id);
            await prisma.backup.deleteMany({
                where: { id: { in: idsToDelete } }
            });
            console.log(`[BACKUP] Rotazione completata. Eliminati ${idsToDelete.length} vecchi backup.`);
        }

        // Log del backup nei Vercel Logs (visibili su vercel.com)
        console.log(`[BACKUP] ${new Date().toISOString()} - ${stats.restaurantCount} ristoranti, ${stats.totalMenus} menu, ${stats.totalCategories} categorie, ${stats.totalItems} piatti`);

        return NextResponse.json({
            success: true,
            timestamp: backupData.timestamp,
            stats,
            rotation: backups.length > 10 ? 'deleted_old' : 'kept_all'
        });

    } catch (error) {
        console.error('[BACKUP ERROR]', error);
        return NextResponse.json({ error: 'Backup failed', details: String(error) }, { status: 500 });
    }
}
