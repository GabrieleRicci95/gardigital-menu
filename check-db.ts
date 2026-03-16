import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userCount = await prisma.user.count();
  const restaurantCount = await prisma.restaurant.count();
  
  console.log(`Users found: ${userCount}`);
  console.log(`Restaurants found: ${restaurantCount}`);
  
  if (restaurantCount > 0) {
    const restaurants = await prisma.restaurant.findMany({
      take: 5,
      select: { name: true, slug: true }
    });
    console.log('Sample restaurants:', JSON.stringify(restaurants, null, 2));
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
