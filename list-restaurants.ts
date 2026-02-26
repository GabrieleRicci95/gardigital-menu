
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Listing all restaurants...');
    const restaurants = await prisma.restaurant.findMany({
        select: {
            name: true,
            slug: true,
            owner: {
                select: {
                    name: true,
                    email: true
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
