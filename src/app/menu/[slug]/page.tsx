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
    const restaurant = await prisma.restaurant.findUnique({
        where: { slug: slug },
        include: {
            menus: {
                where: { isActive: true },
                take: 1, // Only one active menu allowed
                include: {
                    categories: {
                        orderBy: { sortOrder: 'asc' },
                        include: {
                            items: {
                                where: { isVisible: true },
                                orderBy: { createdAt: 'desc' },
                            }
                        }
                    }
                }
            },
            wineList: {
                select: { isActive: true }
            },
            champagneList: {
                select: { isActive: true }
            },
            drinkList: {
                select: { isActive: true }
            },
            subscription: {
                select: { plan: true }
            }
        }
    });

    if (!restaurant) return null;

    // Flatten structure: Restaurant -> Categories (from the active menu)
    // If no active menu is found, we return an empty category list or a fallback
    const activeMenu = restaurant.menus[0];
    const categories = activeMenu ? activeMenu.categories.map(cat => ({
        ...cat,
        items: cat.items.map(item => ({
            ...item,
            price: Number(item.price)
        }))
    })) : [];

    return {
        ...restaurant,
        wineList: restaurant.wineList,
        champagneList: restaurant.champagneList,
        drinkList: restaurant.drinkList,
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
