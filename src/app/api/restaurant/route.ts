import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';

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
            include: { subscription: true }
        });

        return NextResponse.json({ restaurant });
    } catch (error) {
        return NextResponse.json({ error: 'Errore nel recupero del ristorante' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const data = await request.json();
        const { name, description, themeColor, coverImageUrl, backgroundColor, textColor, fontFamily, cardStyle, whatsappNumber, wineListUrl } = data;

        if (!name) return NextResponse.json({ error: 'Il nome è obbligatorio' }, { status: 400 });

        const slug = generateSlug(name);

        // Check if user already has a restaurant
        const existingRestaurant = await prisma.restaurant.findFirst({
            where: { ownerId: session.user.id },
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
                    wineListUrl, // Add this
                    slug: existingRestaurant.name !== name ? slug + '-' + Math.floor(Math.random() * 1000) : existingRestaurant.slug
                },
            });
        } else {
            // Create
            // Ensure slug uniqueness simply
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
                    wineListUrl, // Add this
                    ownerId: session.user.id,
                },
            });
        }

        return NextResponse.json({ restaurant });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Errore nel salvataggio' }, { status: 500 });
    }
}
