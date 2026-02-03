import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession, isDemoSession } from '@/lib/auth';

const prisma = new PrismaClient();

// Helper to generate slug from name
function generateSlug(name: string) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const restaurant = await prisma.restaurant.findFirst({
            where: { ownerId: session.user.id },
            include: {
                subscription: true,
                owner: {
                    select: { email: true }
                },
                wineList: { select: { isActive: true } },
                champagneList: { select: { isActive: true } },
                drinkList: { select: { isActive: true } }
            }
        });

        return NextResponse.json({
            restaurant,
            isDemo: isDemoSession(session)
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
            name, description, themeColor, coverImageUrl, backgroundColor,
            textColor, fontFamily, cardStyle, whatsappNumber, wineListUrl,
            googleReviewsUrl,
            isWineActive, isChampagneActive, isDrinkActive // New flags
        } = data;

        if (!name) return NextResponse.json({ error: 'Il nome è obbligatorio' }, { status: 400 });

        const slug = generateSlug(name);

        // Check if user already has a restaurant
        const existingRestaurant = await prisma.restaurant.findFirst({
            where: { ownerId: session.user.id },
            include: {
                wineList: true,
                champagneList: true,
                drinkList: true
            }
        });

        let restaurant;

        if (existingRestaurant) {
            // Update
            restaurant = await prisma.restaurant.update({
                where: { id: existingRestaurant.id },
                data: {
                    name,
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
                    slug: existingRestaurant.name !== name ? slug + '-' + Math.floor(Math.random() * 1000) : existingRestaurant.slug,
                    // Handle related lists
                    wineList: {
                        upsert: {
                            create: { isActive: isWineActive ?? true },
                            update: { isActive: isWineActive ?? true }
                        }
                    },
                    champagneList: {
                        upsert: {
                            create: { isActive: isChampagneActive ?? false },
                            update: { isActive: isChampagneActive ?? false }
                        }
                    },
                    drinkList: {
                        upsert: {
                            create: { isActive: isDrinkActive ?? false },
                            update: { isActive: isDrinkActive ?? false }
                        }
                    }
                },
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
