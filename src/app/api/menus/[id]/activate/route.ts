import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    // Transaction to switch active menu
    await prisma.$transaction([
        // Deactivate all
        prisma.menu.updateMany({
            where: { restaurantId: session.restaurantId },
            data: { isActive: false }
        }),
        // Activate target
        prisma.menu.update({
            where: { id: id, restaurantId: session.restaurantId },
            data: { isActive: true }
        })
    ]);

    return NextResponse.json({ success: true });
}
