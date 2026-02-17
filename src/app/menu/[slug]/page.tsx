import { prisma } from '@/lib/prisma';
import styles from './menu-public.module.css';
import { notFound } from 'next/navigation';
import MenuClient, { MenuPageRestaurant } from './MenuClient';

// Prevent caching to ensure menu is always fresh
export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{
        slug: string;
    }>
}


async function getRestaurant(slug: string): Promise<MenuPageRestaurant | null> {
    const restaurant = await (prisma.restaurant.findUnique as any)({
        where: { slug: slug },
        include: {
            menus: {
                where: { isActive: true },
                take: 1,
                include: {
                    categories: {
                        orderBy: { sortOrder: 'asc' },
                        include: {
                            translations: true,
                            items: {
                                where: { isVisible: true },
                                orderBy: { createdAt: 'asc' },
                                include: { translations: true }
                            }
                        }
                    }
                }
            },
            wineList: { select: { isActive: true } },
            champagneList: { select: { isActive: true } },
            drinkList: { select: { isActive: true } },
            customLists: {
                where: { isActive: true },
                include: {
                    sections: {
                        orderBy: { sortOrder: 'asc' },
                        include: {
                            items: {
                                orderBy: { createdAt: 'asc' }
                            }
                        }
                    }
                }
            },
            subscription: { select: { plan: true } }
        }
    });

    if (!restaurant) return null;

    const activeMenu = (restaurant as any).menus[0];
    const categories = activeMenu ? activeMenu.categories.map((cat: any) => ({
        ...cat,
        items: cat.items.map((item: any) => ({
            ...item,
            price: Number(item.price)
        }))
    })) : [];

    return {
        ...(restaurant as any),
        wineList: (restaurant as any).wineList,
        champagneList: (restaurant as any).champagneList,
        drinkList: (restaurant as any).drinkList,
        categories
    } as any as MenuPageRestaurant;
}

export default async function PublicMenuPage({ params }: PageProps) {
    const { slug } = await params;
    const restaurant = await getRestaurant(slug);

    if (!restaurant) {
        notFound();
    }

    // Convert keys that might be missing or null (though strict mode might complain, but for now we cast)
    // Actually getRestaurant already returns MenuPageRestaurant with number prices now.

    // Fix for "Only plain objects can be passed to Client Components"
    // This handles Prisma Decimals, Dates, etc.
    const serializedRestaurant = JSON.parse(JSON.stringify(restaurant));

    return (
        <MenuClient restaurant={serializedRestaurant} />
    );
}
