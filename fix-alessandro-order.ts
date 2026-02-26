
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const slug = 'aperifish-xl-drink-e-wine-733';
    const restaurant = await prisma.restaurant.findUnique({
        where: { slug },
        include: {
            menus: {
                where: { isActive: true },
                include: {
                    categories: true
                }
            }
        }
    });

    if (!restaurant || restaurant.menus.length === 0) {
        console.log('Active menu not found');
        return;
    }

    const menu = restaurant.menus[0];
    const categories = await prisma.category.findMany({
        where: { menuId: menu.id },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }]
    });

    console.log('Original Order:');
    categories.forEach((c, i) => console.log(`${i}. ${c.name} (${c.sortOrder})`));

    // Desired Order:
    // 0: ANTIPASTI
    // 1: CRUDERIA
    // 2: PRIMI
    // 3: SECONDI
    // 4: CONTORNI

    const nameToOrder: Record<string, number> = {
        'ANTIPASTI': 0,
        'CRUDERIA': 1,
        'PRIMI': 2,
        'SECONDI': 3,
        'CONTORNI': 4
    };

    console.log('\nUpdating sortOrder...');
    for (const cat of categories) {
        const newOrder = nameToOrder[cat.name] ?? 99;
        await prisma.category.update({
            where: { id: cat.id },
            data: { sortOrder: newOrder }
        });
        console.log(`Updated ${cat.name} to ${newOrder}`);
    }

    console.log('\nVerification:');
    const updatedCategories = await prisma.category.findMany({
        where: { menuId: menu.id },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }]
    });
    updatedCategories.forEach((c, i) => console.log(`${i}. ${c.name} (${c.sortOrder})`));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
