import { prisma } from '@/lib/prisma';
import styles from './menu-public.module.css';
import { notFound } from 'next/navigation';
import MenuClient, { MenuPageRestaurant } from './MenuClient';
import SuspendedService from '@/components/menu/SuspendedService';

// Prevent caching to ensure menu is always fresh
export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{
        slug: string;
    }>
}


async function getRestaurant(inputSlug: string): Promise<MenuPageRestaurant | null> {
    const slug = inputSlug.endsWith('-solo') ? inputSlug.replace(/-solo$/, '') : inputSlug;
    console.log(`[MENU_PAGE] Fetching menu for slug: ${slug}`);
    
    try {
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
                subscription: { select: { plan: true, hasTranslations: true, hasReservations: true, endDate: true, status: true } }
            }
        });

        if (!restaurant) {
            console.log(`[MENU_PAGE] Restaurant not found for slug: ${slug}`);
            return null;
        }

        const activeMenu = (restaurant as any).menus?.[0];
        
        if (!activeMenu) {
            console.log(`[MENU_PAGE] WARNING: No active menu found for restaurant: ${slug}. Returning empty categories.`);
        }

        const categories = activeMenu ? activeMenu.categories.map((cat: any) => ({
            ...cat,
            items: (cat.items || []).map((item: any) => ({
                ...item,
                price: item.price ? Number(item.price) : null
            }))
        })) : [];

        return {
            ...(restaurant as any),
            wineList: (restaurant as any).wineList || null,
            champagneList: (restaurant as any).champagneList || null,
            drinkList: (restaurant as any).drinkList || null,
            categories
        } as any as MenuPageRestaurant;
    } catch (error) {
        console.error(`[MENU_PAGE] Critical error for slug ${slug}:`, error);
        throw error;
    }
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

    // Expiration Check
    const subscription = restaurant.subscription;
    const expiryDate = subscription?.endDate ? new Date(subscription.endDate) : null;
    const isExpired = expiryDate ? expiryDate < new Date() : false;

    if (isExpired) {
        return (
            <SuspendedService
                restaurantName={restaurant.name}
                themeColor={restaurant.themeColor}
            />
        );
    }

    return (
        <MenuClient restaurant={serializedRestaurant} />
    );
}
