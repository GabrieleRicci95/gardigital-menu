
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, isDemoSession } from '@/lib/auth';

// GET: Fetch the wine list for the current restaurant
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

        let wineList = await prisma.wineList.findUnique({
            where: { restaurantId: restaurant.id },
            include: {
                sections: {
                    include: { items: true },
                    orderBy: { sortOrder: 'asc' }
                }
            }
        });

        return NextResponse.json({
            ...(wineList || { sections: [] }),
            isDemo: isDemoSession(session)
        });

    } catch (error) {
        console.error("Error fetching wine list:", error);
        return NextResponse.json({ error: 'Error fetching wine list' }, { status: 500 });
    }
}

// POST: Create or Update the entire wine list structure
export async function POST(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (isDemoSession(session)) return NextResponse.json({ error: 'Modalità Demo: modifiche non consentite' }, { status: 403 });

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
            // 1. Ensure WineList exists
            let wineList = await tx.wineList.findUnique({
                where: { restaurantId: restaurant.id }
            });

            if (!wineList) {
                wineList = await tx.wineList.create({
                    data: {
                        restaurantId: restaurant.id,
                        isActive: isActive ?? true
                    }
                });
            } else {
                await tx.wineList.update({
                    where: { id: wineList.id },
                    data: { isActive: isActive ?? true }
                });
            }

            // 2. Handle sections.
            if (sections) {
                // Delete existing sections (cascade deletes items)
                await tx.wineListSection.deleteMany({
                    where: { wineListId: wineList.id }
                });

                // Create new structure
                for (const section of sections) {
                    await tx.wineListSection.create({
                        data: {
                            wineListId: wineList.id,
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

            return wineList;
        });

        return NextResponse.json({ success: true, id: result.id });

    } catch (error) {
        console.error("Error updating wine list:", error);
        return NextResponse.json({ error: 'Error updating wine list' }, { status: 500 });
    }
}
