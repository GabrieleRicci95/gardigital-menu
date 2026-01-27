import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { name, description, price, categoryId, isVegan, isGlutenFree, isVegetarian, spiciness, translations, allergens } = await request.json();

        if (!name || !categoryId) {
            return NextResponse.json({ error: 'Dati incompleti' }, { status: 400 });
        }

        const restaurant = await prisma.restaurant.findFirst({
            where: { ownerId: session.user.id },
            include: {
                subscription: true,
                menus: {
                    include: {
                        categories: { include: { items: true } }
                    }
                }
            }
        });

        if (!restaurant) return NextResponse.json({ error: 'Ristorante non trovato' }, { status: 404 });

        const isPremium = restaurant.subscription?.status === 'ACTIVE' && restaurant.subscription?.plan === 'PREMIUM';

        if (!isPremium) {
            // Count total items across all menus
            let totalItems = 0;
            restaurant.menus.forEach(menu => {
                menu.categories.forEach(cat => {
                    totalItems += cat.items.length;
                });
            });

            if (totalItems >= 15) {
                return NextResponse.json({ error: 'Limite di 15 piatti raggiunto. Passa a Premium per piatti illimitati!' }, { status: 403 });
            }
        }

        const item = await prisma.menuItem.create({
            data: {
                name,
                description: description || '',
                price: price ? parseFloat(price) : null,
                categoryId,
                isVegan: isVegan || false,
                isGlutenFree: isGlutenFree || false,
                isVegetarian: isVegetarian || false,
                spiciness: spiciness || 0,
                allergens: allergens || null, // JSON string expected from frontend
                translations: {
                    create: translations || [] // Expects array of { language, name, description }
                }
            },
        });

        return NextResponse.json({ item });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Errore creazione piatto' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id, name, description, price, isVegan, isGlutenFree, isVegetarian, spiciness, imageUrl, translations, allergens } = await request.json();

        if (!id || !name) {
            return NextResponse.json({ error: 'Dati incompleti' }, { status: 400 });
        }

        const dataToUpdate: any = {
            name,
            description: description || '',
            price: price ? parseFloat(price) : null,
            isVegan: isVegan || false,
            isGlutenFree: isGlutenFree || false,
            isVegetarian: isVegetarian || false,
            spiciness: spiciness || 0,
            allergens: allergens || null,
        };

        // Only update imageUrl if it's explicitly passed (null means delete, undefined means ignore)
        if (imageUrl !== undefined) {
            dataToUpdate.imageUrl = imageUrl;
        }

        const item = await prisma.menuItem.update({
            where: { id },
            data: dataToUpdate
        });

        if (translations && Array.isArray(translations)) {
            // Wipe and replace translations (simplest strategy)
            await prisma.menuItemTranslation.deleteMany({ where: { menuItemId: id } });
            if (translations.length > 0) {
                await prisma.menuItemTranslation.createMany({
                    data: translations.map((t: any) => ({
                        menuItemId: id,
                        language: t.language,
                        name: t.name,
                        description: t.description
                    }))
                });
            }
        }

        return NextResponse.json({ item });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Errore modifica piatto' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID richiesto' }, { status: 400 });

        await prisma.menuItem.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Errore eliminazione piatto' }, { status: 500 });
    }
}
