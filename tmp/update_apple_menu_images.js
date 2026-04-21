const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Updating MenuItem images for Apple Review Restaurant...');

    const restaurant = await prisma.restaurant.findUnique({
        where: { slug: 'apple-review-restaurant' },
        include: {
            menus: {
                include: {
                    categories: {
                        include: {
                            items: true
                        }
                    }
                }
            }
        }
    });

    if (!restaurant) {
        console.error('Restaurant not found!');
        return;
    }

    const itemsToUpdate = [
        { name: 'Bruschette Miste', url: '/uploads/apple-test/bruschette.png' },
        { name: 'Spaghetti alla Chitarra con Pallottine', url: '/uploads/apple-test/spaghetti_pallottine.png' },
        { name: 'Arrosticini Regionali', url: '/uploads/apple-test/arrosticini.png' },
        { name: 'Patate al Forno', url: '/uploads/apple-test/patate_forno.png' },
        { name: 'Tiramisù della Casa', url: '/uploads/apple-test/tiramisu.png' }
    ];

    for (const menu of restaurant.menus) {
        for (const category of menu.categories) {
            for (const item of category.items) {
                const updateInfo = itemsToUpdate.find(u => u.name === item.name);
                if (updateInfo) {
                    await prisma.menuItem.update({
                        where: { id: item.id },
                        data: { imageUrl: updateInfo.url }
                    });
                    console.log(`Updated image for: ${item.name}`);
                }
            }
        }
    }

    console.log('All MenuItem images updated successfully!');
}

main()
    .catch(e => {
        console.error('Error updating images:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
