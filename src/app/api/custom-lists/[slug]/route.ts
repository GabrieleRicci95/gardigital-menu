import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession, isDemoSession } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const restaurant = await prisma.restaurant.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!restaurant) return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });

        const customList = await prisma.customList.findUnique({
            where: {
                restaurantId_slug: {
                    restaurantId: restaurant.id,
                    slug: params.slug
                }
            },
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
        });

        if (!customList) return NextResponse.json({ error: 'Modulo non trovato' }, { status: 404 });

        return NextResponse.json({
            ...customList,
            isDemo: isDemoSession(session)
        });
    } catch (error) {
        return NextResponse.json({ error: 'Errore nel recupero del modulo' }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (isDemoSession(session)) return NextResponse.json({ error: 'Modalità Demo: modifiche non consentite' }, { status: 403 });

    try {
        const restaurant = await prisma.restaurant.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!restaurant) return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });

        const data = await request.json();
        const { sections } = data;

        const customList = await prisma.customList.findUnique({
            where: {
                restaurantId_slug: {
                    restaurantId: restaurant.id,
                    slug: params.slug
                }
            }
        });

        if (!customList) return NextResponse.json({ error: 'Modulo non trovato' }, { status: 404 });

        await prisma.$transaction(async (tx) => {
            // Delete existing sections (cascade deletes items)
            await tx.customListSection.deleteMany({
                where: { customListId: customList.id }
            });

            // Create new structure
            if (sections) {
                for (const section of sections) {
                    await tx.customListSection.create({
                        data: {
                            customListId: customList.id,
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
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Errore nel salvataggio del modulo' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (isDemoSession(session)) return NextResponse.json({ error: 'Modalità Demo: modifiche non consentite' }, { status: 403 });

    try {
        const { name, isActive } = await request.json();

        const restaurant = await prisma.restaurant.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!restaurant) return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });

        const customList = await prisma.customList.update({
            where: {
                restaurantId_slug: {
                    restaurantId: restaurant.id,
                    slug: params.slug
                }
            },
            data: {
                name,
                isActive
            }
        });

        return NextResponse.json(customList);
    } catch (error) {
        return NextResponse.json({ error: 'Errore nell\'aggiornamento del modulo' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (isDemoSession(session)) return NextResponse.json({ error: 'Modalità Demo: modifiche non consentite' }, { status: 403 });

    try {
        const restaurant = await prisma.restaurant.findFirst({
            where: { ownerId: session.user.id }
        });

        if (!restaurant) return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });

        await prisma.customList.delete({
            where: {
                restaurantId_slug: {
                    restaurantId: restaurant.id,
                    slug: params.slug
                }
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Errore nell\'eliminazione del modulo' }, { status: 500 });
    }
}
