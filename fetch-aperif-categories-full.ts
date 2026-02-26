
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
        console.log('Active menu not found for Aperifish');
        return;
    }

    const menu = restaurant.menus[0];
    console.log(`Menu: ${menu.name} (ID: ${menu.id})`);

    const categories = await prisma.category.findMany({
        where: { menuId: menu.id },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }]
    });

    console.log('Categories:');
    categories.forEach((c, i) => {
        console.log(`${i}. ${c.name} (sortOrder: ${c.sortOrder}, createdAt: ${c.createdAt.toISOString()}) ID: ${c.id}`);
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
