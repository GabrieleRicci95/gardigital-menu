import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');

        if (!slug) {
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
        }

        const restaurant = await prisma.restaurant.findUnique({
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
                                    orderBy: { createdAt: 'desc' },
                                    include: { translations: true }
                                }
                            }
                        }
                    }
                },
                wineList: { select: { isActive: true } },
                champagneList: { select: { isActive: true } },
                drinkList: { select: { isActive: true } },
                subscription: { select: { plan: true } },
                translations: true
            }
        });

        if (!restaurant) {
            return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
        }

        const activeMenu = (restaurant as any).menus?.[0];
        const categories = activeMenu ? activeMenu.categories.map((cat: any) => ({
            ...cat,
            items: cat.items.map((item: any) => ({
                ...item,
                price: Number(item.price)
            }))
        })) : [];

        const serializedRestaurant = JSON.parse(JSON.stringify({
            ...restaurant,
            categories
        }));

        return NextResponse.json({ restaurant: serializedRestaurant });

    } catch (error: any) {
        console.error('Error fetching public menu:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
