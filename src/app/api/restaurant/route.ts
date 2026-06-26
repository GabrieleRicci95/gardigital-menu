import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, isDemoSession } from '@/lib/auth';

// Helper to generate slug from name
function generateSlug(name: string) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

export async function GET(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const impersonateId = searchParams.get('restaurantId');
    const isAdmin = session.user.role === 'ADMIN';

    try {
        const whereClause: any = {
            NOT: { slug: { endsWith: '-solo' } }
        };

        if (isAdmin && impersonateId) {
            whereClause.id = impersonateId;
        } else {
            whereClause.ownerId = session.user.id;
        }

        const restaurant = await prisma.restaurant.findFirst({
            where: whereClause,
            orderBy: { createdAt: 'asc' },
            include: {
                subscription: true,
                owner: {
                    select: { email: true }
                },
                wineList: { select: { isActive: true } },
                champagneList: { select: { isActive: true } },
                drinkList: { select: { isActive: true } },
                customLists: {
                    where: { isActive: true },
                    select: { id: true, name: true, slug: true, isActive: true }
                }
            }
        });

        return NextResponse.json({
            restaurant,
            isDemo: isDemoSession(session),
            isAdmin
        });
    } catch (error) {
        return NextResponse.json({ error: 'Errore nel recupero del ristorante' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (isDemoSession(session)) return NextResponse.json({ error: 'Modalità Demo: modifiche non consentite' }, { status: 403 });

    try {
        const data = await request.json();
        const {
            restaurantId, // New: optional for admins
            name, description, themeColor, coverImageUrl, backgroundColor,
            textColor, fontFamily, cardStyle, whatsappNumber, wineListUrl,
            googleReviewsUrl,
            isWineActive, isChampagneActive, isDrinkActive,
            bookingMaxGuestsPerSlot, bookingAutoConfirm,
            showNameInPublicMenu
        } = data;

        const isAdmin = session.user.role === 'ADMIN';
        const ownerId = (isAdmin && restaurantId) ? undefined : session.user.id;
        const targetRestaurantId = (isAdmin && restaurantId) ? restaurantId : undefined;

        const slug = name ? generateSlug(name) : '';

        // Check if user already has a restaurant
        const existingRestaurant = await prisma.restaurant.findFirst({
            where: { 
                id: targetRestaurantId,
                ownerId: ownerId,
                NOT: { slug: { endsWith: '-solo' } }
            },
            orderBy: { createdAt: 'asc' },
            include: {
                wineList: true,
                champagneList: true,
                drinkList: true
            }
        });

        let restaurant;

        if (existingRestaurant) {
            // Build dynamic update data to handle partial updates correctly
            const updateData: any = {
                description,
                themeColor,
                coverImageUrl,
                backgroundColor,
                textColor,
                fontFamily,
                cardStyle,
                whatsappNumber,
                wineListUrl,
                googleReviewsUrl,
                bookingMaxGuestsPerSlot,
                bookingAutoConfirm,
                showNameInPublicMenu,
                name: name || existingRestaurant.name,
                slug: (name && existingRestaurant.name !== name) ? slug + '-' + Math.floor(Math.random() * 1000) : existingRestaurant.slug,
            };

            // Only update special modules if explicitly provided in the request
            if (isWineActive !== undefined) {
                updateData.wineList = {
                    upsert: {
                        create: { isActive: isWineActive },
                        update: { isActive: isWineActive }
                    }
                };
            }
            if (isChampagneActive !== undefined) {
                updateData.champagneList = {
                    upsert: {
                        create: { isActive: isChampagneActive },
                        update: { isActive: isChampagneActive }
                    }
                };
            }
            if (isDrinkActive !== undefined) {
                updateData.drinkList = {
                    upsert: {
                        create: { isActive: isDrinkActive },
                        update: { isActive: isDrinkActive }
                    }
                };
            }

            // Update
            restaurant = await prisma.restaurant.update({
                where: { id: existingRestaurant.id },
                data: updateData,
                include: {
                    wineList: { select: { isActive: true } },
                    champagneList: { select: { isActive: true } },
                    drinkList: { select: { isActive: true } }
                }
            });
        } else {
            // Create
            const uniqueSlug = slug + '-' + Math.floor(Math.random() * 10000);

            restaurant = await prisma.restaurant.create({
                data: {
                    name,
                    slug: uniqueSlug,
                    description,
                    themeColor,
                    coverImageUrl,
                    backgroundColor,
                    textColor,
                    fontFamily,
                    cardStyle,
                    whatsappNumber,
                    wineListUrl,
                    googleReviewsUrl,
                    bookingMaxGuestsPerSlot: bookingMaxGuestsPerSlot ?? 10,
                    bookingAutoConfirm: bookingAutoConfirm ?? false,
                    showNameInPublicMenu: showNameInPublicMenu ?? false,
                    ownerId: session.user.id,
                    wineList: { create: { isActive: isWineActive ?? true } },
                    champagneList: { create: { isActive: isChampagneActive ?? false } },
                    drinkList: { create: { isActive: isDrinkActive ?? false } }
                },
                include: {
                    wineList: { select: { isActive: true } },
                    champagneList: { select: { isActive: true } },
                    drinkList: { select: { isActive: true } }
                }
            });
        }

        return NextResponse.json({ restaurant });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Errore nel salvataggio' }, { status: 500 });
    }
}
