
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const restaurant = await prisma.restaurant.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!restaurant) {
            return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
        }

        const menus = await prisma.fixedMenu.findMany({
            where: { restaurantId: restaurant.id },
            include: { sections: true }, // Include sections for count/display
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(menus);
    } catch (error) {
        console.error("Error fetching fixed menus:", error);
        return NextResponse.json({ error: 'Error fetching menus' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const restaurant = await prisma.restaurant.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!restaurant) {
            return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
        }

        const data = await request.json();
        const { name, subtitle, price, description, isActive, sections } = data;

        if (!name || price === undefined) {
            return NextResponse.json({ error: 'Name and Price are required' }, { status: 400 });
        }

        const newMenu = await prisma.fixedMenu.create({
            data: {
                name,
                subtitle,
                price: parseFloat(price),
                description,
                isActive: isActive ?? true,
                restaurantId: restaurant.id,
                sections: sections && Array.isArray(sections) ? {
                    create: sections.map((s: any) => ({
                        name: s.name,
                        description: s.description,
                        sortOrder: s.sortOrder || 0,
                        items: {
                            create: s.items?.map((i: any) => ({
                                name: i.name,
                                description: i.description,
                                allergens: i.allergens ? JSON.stringify(i.allergens) : null
                            })) || []
                        }
                    }))
                } : undefined
            }
        });

        return NextResponse.json(newMenu);
    } catch (error) {
        console.error("Error creating fixed menu:", error);
        return NextResponse.json({ error: 'Error creating menu' }, { status: 500 });
    }
}
