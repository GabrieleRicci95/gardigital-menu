import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session || !session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const restaurant = await prisma.restaurant.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!restaurant) return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });

        let drinkList = await prisma.drinkList.findUnique({
            where: { restaurantId: restaurant.id },
            include: {
                sections: {
                    include: { items: true },
                    orderBy: { sortOrder: 'asc' }
                }
            }
        });

        if (!drinkList) {
            drinkList = await prisma.drinkList.create({
                data: {
                    restaurantId: restaurant.id,
                    isActive: true
                },
                include: {
                    sections: {
                        include: { items: true }
                    }
                }
            });
        }

        return NextResponse.json(drinkList);

    } catch (error) {
        console.error("Get Drink List Error:", error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getSession();
    if (!session || !session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        const { isActive, sections } = body;

        const restaurant = await prisma.restaurant.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!restaurant) return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });

        // Update Drink List status
        const drinkList = await prisma.drinkList.upsert({
            where: { restaurantId: restaurant.id },
            update: { isActive },
            create: {
                restaurantId: restaurant.id,
                isActive
            }
        });

        // Handle Sections and Items Transaction
        await prisma.$transaction(async (tx) => {
            // 1. Delete existing sections (cascade deletes items) to full sync
            // A more optimized approach would be diffing, but full replace is safer for complex nested forms 
            // and data volume is low.
            await tx.drinkSection.deleteMany({
                where: { drinkListId: drinkList.id }
            });

            // 2. Re-create structure
            if (sections && sections.length > 0) {
                for (let i = 0; i < sections.length; i++) {
                    const section = sections[i];
                    await tx.drinkSection.create({
                        data: {
                            name: section.name,
                            sortOrder: i,
                            drinkListId: drinkList.id,
                            items: {
                                create: section.items.map((item: any) => ({
                                    name: item.name,
                                    description: item.description,
                                    price: item.price
                                }))
                            }
                        }
                    });
                }
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Save Drink List Error:", error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
