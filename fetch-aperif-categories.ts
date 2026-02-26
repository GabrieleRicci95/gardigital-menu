
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Fetching all categories for restaurant "Aperifish" (aperifish-xl-drink-e-wine-733)...');
    const restaurant = await prisma.restaurant.findUnique({
        where: { slug: 'aperifish-xl-drink-e-wine-733' },
        include: {
            menus: {
                include: {
                    categories: {
                        orderBy: { sortOrder: 'asc' }
                    }
                }
            }
        }
    });

    if (!restaurant) {
        console.log('Restaurant not found!');
        return;
    }

    const categories = restaurant.menus.flatMap(m => m.categories.map(c => ({
        menuName: m.name,
        categoryId: c.id,
        categoryName: c.name,
        sortOrder: c.sortOrder
    })));

    console.log(JSON.stringify(categories, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
