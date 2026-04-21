const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Populating Apple Review Restaurant with sample menu...');

    const restaurant = await prisma.restaurant.findUnique({
        where: { slug: 'apple-review-restaurant' }
    });

    if (!restaurant) {
        console.error('Restaurant not found! Run fix_apple_test.js first.');
        return;
    }

    // Create a Menu
    const menu = await prisma.menu.create({
        data: {
            name: 'Menu Principale',
            isActive: true,
            restaurantId: restaurant.id,
            categories: {
                create: [
                    {
                        name: 'Antipasti',
                        sortOrder: 1,
                        items: {
                            create: [
                                {
                                    name: 'Bruschette Miste',
                                    description: 'Selezione di bruschette al pomodoro, paté di olive e peperoni arrosto.',
                                    price: 8.00,
                                    isVisible: true
                                }
                            ]
                        }
                    },
                    {
                        name: 'Primi Piatti',
                        sortOrder: 2,
                        items: {
                            create: [
                                {
                                    name: 'Spaghetti alla Chitarra con Pallottine',
                                    description: 'Pasta fresca all\'uovo con sugo di pomodoro e polpettine di carne.',
                                    price: 12.00,
                                    isVisible: true
                                }
                            ]
                        }
                    },
                    {
                        name: 'Secondi Piatti',
                        sortOrder: 3,
                        items: {
                            create: [
                                {
                                    name: 'Arrosticini Regionali',
                                    description: '10 classici arrosticini abruzzesi cotti alla brace.',
                                    price: 10.00,
                                    isVisible: true
                                }
                            ]
                        }
                    },
                    {
                        name: 'Contorni',
                        sortOrder: 4,
                        items: {
                            create: [
                                {
                                    name: 'Patate al Forno',
                                    description: 'Patate arrosto con rosmarino e aglio.',
                                    price: 5.00,
                                    isVisible: true
                                }
                            ]
                        }
                    },
                    {
                        name: 'Dolci',
                        sortOrder: 5,
                        items: {
                            create: [
                                {
                                    name: 'Tiramisù della Casa',
                                    description: 'Classico tiramisù fatto in casa con savoiardi e mascarpone.',
                                    price: 6.00,
                                    isVisible: true
                                }
                            ]
                        }
                    }
                ]
            }
        }
    });

    console.log(`Menu "${menu.name}" created successfully with categories and items!`);
}

main()
    .catch(e => {
        console.error('Error populating menu:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
