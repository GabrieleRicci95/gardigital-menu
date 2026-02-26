
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Searching for categories named "Antipasti"...');
    const categories = await prisma.category.findMany({
        where: {
            name: { contains: 'Antipasti', mode: 'insensitive' }
        },
        include: {
            menu: {
                include: {
                    restaurant: {
                        include: {
                            owner: true
                        }
                    }
                }
            }
        },
        take: 20
    });

    const results = categories.map(c => ({
        restaurantName: c.menu.restaurant.name,
        restaurantSlug: c.menu.restaurant.slug,
        ownerName: c.menu.restaurant.owner.name,
        ownerEmail: c.menu.restaurant.owner.email,
        menuName: c.menu.name,
        sortOrder: c.sortOrder
    }));

    console.log(JSON.stringify(results, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
