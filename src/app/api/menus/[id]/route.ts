
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) {
        console.error("DELETE Menu: No session found");
        return NextResponse.json({ error: 'Unauthorized: No Session' }, { status: 401 });
    }

    const { id } = await params;

    try {
        // 1. Resolve Restaurant from User Session
        const restaurant = await prisma.restaurant.findFirst({
            where: { ownerId: session.user.id },
            select: { id: true }
        });

        if (!restaurant) {
            return NextResponse.json({ error: 'Ristorante non trovato per questo utente' }, { status: 404 });
        }

        // 2. Verify Menu Ownership using restaurant.id
        const menu = await prisma.menu.findUnique({
            where: { id },
            select: { restaurantId: true, isActive: true }
        });

        if (!menu) {
            return NextResponse.json({ error: 'Menu not found' }, { status: 404 });
        }

        if (menu.restaurantId !== restaurant.id) {
            console.error(`Unauthorized Delete: Menu owner ${menu.restaurantId} vs User Restaurant ${restaurant.id}`);
            return NextResponse.json({
                error: `Non autorizzato: Questo menu non appartiene al tuo ristorante.`
            }, { status: 403 });
        }

        // Optional: Block deleting active menu? Or allow and let them have no active menu?
        // User didn't specify. Safe bet: allow, but if active, maybe warn? 
        // For API, just allow. Frontend can warn.

        // Robust Manual Cascade Delete
        try {
            // Find all categories first
            const categories = await prisma.category.findMany({
                where: { menuId: id },
                select: { id: true }
            });
            const categoryIds = categories.map(c => c.id);

            if (categoryIds.length > 0) {
                // Find all items in these categories
                const items = await prisma.menuItem.findMany({
                    where: { categoryId: { in: categoryIds } },
                    select: { id: true }
                });
                const itemIds = items.map(i => i.id);

                if (itemIds.length > 0) {
                    // 1. Delete Item Translations
                    await prisma.menuItemTranslation.deleteMany({
                        where: { menuItemId: { in: itemIds } }
                    });

                    // 2. Delete Items
                    await prisma.menuItem.deleteMany({
                        where: { id: { in: itemIds } }
                    });
                }

                // 3. Delete Category Translations
                await prisma.categoryTranslation.deleteMany({
                    where: { categoryId: { in: categoryIds } }
                });

                // 4. Delete Categories
                await prisma.category.deleteMany({
                    where: { id: { in: categoryIds } }
                });
            }

        } catch (cascadeError) {
            console.error("Error in robust cascade:", cascadeError);
            // We continue to try main delete, or return error?
            // If this fails, main delete will likely fail too.
        }

        await prisma.menu.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting menu:", error);
        return NextResponse.json({
            error: 'Errore durante eliminazione: ' + (error instanceof Error ? error.message : String(error))
        }, { status: 500 });
    }
}
