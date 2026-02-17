import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, isDemoSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const menuId = searchParams.get('menuId');

    if (!menuId) {
        return NextResponse.json({ error: 'Menu ID richiesto' }, { status: 400 });
    }

    try {
        const categories = await prisma.category.findMany({
            where: { menuId: menuId },
            include: {
                items: {
                    orderBy: { createdAt: 'asc' }
                },
            },
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        });

        return NextResponse.json({ categories });
    } catch (error) {
        return NextResponse.json({ error: 'Errore nel recupero categorie' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (isDemoSession(session)) return NextResponse.json({ error: 'Modalità Demo: modifiche non consentite' }, { status: 403 });

    try {
        const { name, menuId, translations } = await request.json();

        if (!name || !menuId) {
            return NextResponse.json({ error: 'Nome e Menu ID richiesti' }, { status: 400 });
        }

        // Find the current maximum sortOrder
        const maxSortOrderCategory = await prisma.category.findFirst({
            where: { menuId },
            orderBy: { sortOrder: 'desc' },
            select: { sortOrder: true }
        });

        const newSortOrder = (maxSortOrderCategory?.sortOrder ?? 0) + 1;

        const category = await prisma.category.create({
            data: {
                name,
                menuId: menuId,
                sortOrder: newSortOrder
            }
        });

        return NextResponse.json({ category });
    } catch (error) {
        console.error("Error creating category:", error);
        return NextResponse.json({ error: 'Errore nella creazione categoria' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (isDemoSession(session)) return NextResponse.json({ error: 'Modalità Demo: modifiche non consentite' }, { status: 403 });

    try {
        const { id, name, translations } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Category ID richiesto' }, { status: 400 });
        }

        const category = await prisma.category.update({
            where: { id },
            data: { name }
        });

        return NextResponse.json({ category });
    } catch (error) {
        console.error("Error updating category:", error);
        return NextResponse.json({ error: 'Errore durante l\'aggiornamento della categoria' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (isDemoSession(session)) return NextResponse.json({ error: 'Modalità Demo: modifiche non consentite' }, { status: 403 });

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'Category ID richiesto' }, { status: 400 });

        await prisma.category.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting category:", error);
        return NextResponse.json({ error: 'Errore durante l\'eliminazione della categoria' }, { status: 500 });
    }
}
