
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET: Fetch the champagne list for the current restaurant
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

        let champagneList = await prisma.champagneList.findUnique({
            where: { restaurantId: restaurant.id },
            include: {
                sections: {
                    include: { items: true },
                    orderBy: { sortOrder: 'asc' }
                }
            }
        });

        return NextResponse.json(champagneList || { sections: [] });

    } catch (error) {
        console.error("Error fetching champagne list:", error);
        return NextResponse.json({ error: 'Error fetching champagne list' }, { status: 500 });
    }
}

// POST: Create or Update the entire champagne list structure
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
        const { isActive, sections } = data;

        const result = await prisma.$transaction(async (tx) => {
            // 1. Ensure ChampagneList exists
            let champagneList = await tx.champagneList.findUnique({
                where: { restaurantId: restaurant.id }
            });

            if (!champagneList) {
                champagneList = await tx.champagneList.create({
                    data: {
                        restaurantId: restaurant.id,
                        isActive: isActive ?? true
                    }
                });
            } else {
                await tx.champagneList.update({
                    where: { id: champagneList.id },
                    data: { isActive: isActive ?? true }
                });
            }

            // 2. Handle sections.
            if (sections) {
                // Delete existing sections (cascade deletes items)
                await tx.champagneSection.deleteMany({
                    where: { champagneListId: champagneList.id }
                });

                // Create new structure
                for (const section of sections) {
                    await tx.champagneSection.create({
                        data: {
                            champagneListId: champagneList.id,
                            name: section.name,
                            sortOrder: section.sortOrder || 0,
                            items: {
                                create: section.items?.map((item: any) => ({
                                    name: item.name,
                                    description: item.description,
                                    price: isNaN(parseFloat(item.price)) ? 0 : parseFloat(item.price)
                                }))
                            }
                        }
                    });
                }
            }

            return champagneList;
        });

        return NextResponse.json({ success: true, id: result.id });

    } catch (error) {
        console.error("Error updating champagne list:", error);
        return NextResponse.json({ error: 'Error updating champagne list' }, { status: 500 });
    }
}
