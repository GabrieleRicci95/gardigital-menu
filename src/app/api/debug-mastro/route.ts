import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    const r = await prisma.restaurant.findFirst({
        where: { slug: 'aperifish-xl-drink-e-wine-733' },
        include: {
            wineList: { include: { sections: true } },
            drinkList: { include: { sections: true } },
            champagneList: { include: { sections: true } },
            customLists: { include: { sections: true } }
        }
    });

    if (r?.champagneList && !r.champagneList.isActive) {
        await prisma.champagneList.update({
            where: { id: r.champagneList.id },
            data: { isActive: true }
        });
    }

    return NextResponse.json({
        name: r?.name,
        slug: r?.slug,
        wineActive: r?.wineList?.isActive,
        drinkActive: r?.drinkList?.isActive,
        champagneActive: true, // Just updated
        wineSections: r?.wineList?.sections?.length || 0,
        drinkSections: r?.drinkList?.sections?.length || 0,
        champagneSections: r?.champagneList?.sections?.length || 0,
        customLists: r?.customLists?.map((l: any) => ({ name: l.name, active: l.isActive, sections: l.sections?.length }))
    });
}
