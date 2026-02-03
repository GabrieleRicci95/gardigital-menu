
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, isDemoSession } from '@/lib/auth';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await context.params;

    try {
        const restaurant = await prisma.restaurant.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!restaurant) return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });

        const menu = await prisma.fixedMenu.findFirst({
            where: {
                id,
                restaurantId: restaurant.id
            },
            include: {
                sections: {
                    include: {
                        items: true
                    },
                    orderBy: {
                        sortOrder: 'asc'
                    }
                }
            }
        });

        if (!menu) return NextResponse.json({ error: 'Menu not found' }, { status: 404 });

        return NextResponse.json(menu);
    } catch (error) {
        console.error("Error fetching fixed menu:", error);
        return NextResponse.json({ error: 'Error fetching menu' }, { status: 500 });
    }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (isDemoSession(session)) return NextResponse.json({ error: 'Modalità Demo: modifiche non consentite' }, { status: 403 });

    const { id } = await context.params;

    try {
        const restaurant = await prisma.restaurant.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!restaurant) return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });

        // Ensure menu belongs to restaurant
        const existingMenu = await prisma.fixedMenu.findFirst({
            where: { id, restaurantId: restaurant.id }
        });

        if (!existingMenu) return NextResponse.json({ error: 'Menu not found' }, { status: 404 });

        const data = await request.json();
        const { name, subtitle, price, description, isActive, sections } = data;

        // 1. Update basic fields
        await prisma.fixedMenu.update({
            where: { id },
            data: {
                name,
                subtitle,
                price: price !== undefined ? parseFloat(price) : undefined,
                description,
                isActive
            }
        });

        // 2. Handle Sections if provided
        if (sections && Array.isArray(sections)) {
            // Get existing sections
            const existingSections = await prisma.fixedMenuSection.findMany({
                where: { fixedMenuId: id },
                select: { id: true }
            });
            const existingSectionIds = existingSections.map(s => s.id);

            const incomingSectionIds = sections.filter((s: any) => s.id && !s.id.startsWith('temp_')).map((s: any) => s.id);

            // Delete removed sections
            const sectionsToDelete = existingSectionIds.filter(sid => !incomingSectionIds.includes(sid));
            if (sectionsToDelete.length > 0) {
                await prisma.fixedMenuSection.deleteMany({
                    where: { id: { in: sectionsToDelete } }
                });
            }

            // Upsert sections
            for (const section of sections) {
                let sectionId = section.id;

                if (!sectionId || sectionId.startsWith('temp_')) {
                    // Create new section
                    const newSection = await prisma.fixedMenuSection.create({
                        data: {
                            fixedMenuId: id,
                            name: section.name,
                            description: section.description,
                            sortOrder: section.sortOrder || 0
                        }
                    });
                    sectionId = newSection.id;
                } else {
                    // Update existing
                    await prisma.fixedMenuSection.update({
                        where: { id: sectionId },
                        data: {
                            name: section.name,
                            description: section.description,
                            sortOrder: section.sortOrder
                        }
                    });
                }

                // Handle Items for this section
                if (section.items && Array.isArray(section.items)) {
                    const existingItems = await prisma.fixedMenuItem.findMany({
                        where: { fixedMenuSectionId: sectionId },
                        select: { id: true }
                    });
                    const existingItemIds = existingItems.map(i => i.id);
                    const incomingItemIds = section.items.filter((i: any) => i.id && !i.id.startsWith('temp_')).map((i: any) => i.id);

                    const itemsToDelete = existingItemIds.filter(iid => !incomingItemIds.includes(iid));
                    if (itemsToDelete.length > 0) {
                        await prisma.fixedMenuItem.deleteMany({
                            where: { id: { in: itemsToDelete } }
                        });
                    }

                    for (const item of section.items) {
                        if (!item.id || item.id.startsWith('temp_')) {
                            // Create
                            await prisma.fixedMenuItem.create({
                                data: {
                                    fixedMenuSectionId: sectionId,
                                    name: item.name,
                                    description: item.description,
                                    allergens: item.allergens ? JSON.stringify(item.allergens) : null
                                }
                            });
                        } else {
                            // Update
                            await prisma.fixedMenuItem.update({
                                where: { id: item.id },
                                data: {
                                    name: item.name,
                                    description: item.description,
                                    allergens: item.allergens ? JSON.stringify(item.allergens) : null
                                }
                            });
                        }
                    }
                }
            }
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error updating fixed menu:", error);
        return NextResponse.json({ error: 'Error updating menu' }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (isDemoSession(session)) return NextResponse.json({ error: 'Modalità Demo: modifiche non consentite' }, { status: 403 });

    const { id } = await context.params;

    try {
        const restaurant = await prisma.restaurant.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!restaurant) return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });

        // Ensure menu belongs to restaurant
        const existingMenu = await prisma.fixedMenu.findFirst({
            where: { id, restaurantId: restaurant.id }
        });

        if (!existingMenu) return NextResponse.json({ error: 'Menu not found' }, { status: 404 });

        await prisma.fixedMenu.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting fixed menu:", error);
        return NextResponse.json({ error: 'Error deleting menu' }, { status: 500 });
    }
}
