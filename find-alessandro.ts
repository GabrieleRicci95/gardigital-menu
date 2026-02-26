
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Searching for restaurants related to "Alessandro"...');
    const restaurants = await prisma.restaurant.findMany({
        where: {
            OR: [
                { name: { contains: 'Alessandro', mode: 'insensitive' } },
                { slug: { contains: 'alessandro', mode: 'insensitive' } },
                { owner: { name: { contains: 'Alessandro', mode: 'insensitive' } } }
            ]
        },
        include: {
            owner: true,
            menus: {
                include: {
                    categories: {
                        orderBy: { sortOrder: 'asc' }
                    }
                }
            }
        }
    });

    console.log(JSON.stringify(restaurants, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
