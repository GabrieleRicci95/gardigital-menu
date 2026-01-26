import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();

    // Security check: Must be ADMIN
    // TEMPORARY: Allow everyone to see this for testing purposes
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const restaurants = await prisma.restaurant.findMany({
            where: {
                owner: {
                    email: {
                        not: 'gabrielericci234@gmail.com'
                    }
                }
            },
            include: {
                owner: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                subscription: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ restaurants });
    } catch (error) {
        console.error("Admin fetch error:", error);
        return NextResponse.json({ error: 'Failed to fetch restaurants' }, { status: 500 });
    }
}
