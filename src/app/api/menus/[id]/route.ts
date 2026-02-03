
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, isDemoSession } from '@/lib/auth';

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized: No Session' }, { status: 401 });
    }

    if (isDemoSession(session)) return NextResponse.json({ error: 'Modalità Demo: modifiche non consentite' }, { status: 403 });

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
            return NextResponse.json({
                error: `Non autorizzato: Questo menu non appartiene al tuo ristorante.`
            }, { status: 403 });
        }

        // Optimized Transactional Delete
        try {
            await prisma.$transaction([
                prisma.menuItemTranslation.deleteMany({ where: { menuItem: { category: { menuId: id } } } }),
                prisma.menuItem.deleteMany({ where: { category: { menuId: id } } }),
                prisma.categoryTranslation.deleteMany({ where: { category: { menuId: id } } }),
                prisma.category.deleteMany({ where: { menuId: id } }),
                prisma.menu.delete({ where: { id } })
            ]);
        } catch (error) {
            console.error("Delete Transaction Error:", error);
            return NextResponse.json({
                error: 'Errore durante eliminazione: ' + (error instanceof Error ? error.message : String(error))
            }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting menu:", error);
        return NextResponse.json({
            error: 'Errore durante eliminazione: ' + (error instanceof Error ? error.message : String(error))
        }, { status: 500 });
    }
}
