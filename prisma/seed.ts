import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const adminPassword = await bcrypt.hash('admin', 10)
    const pizzeriaPassword = await bcrypt.hash('pizzeria', 10)

    // Admin User
    const admin = await prisma.user.upsert({
        where: { email: 'admin@admin.com' },
        update: { password: adminPassword, role: 'ADMIN' },
        create: {
            email: 'admin@admin.com',
            password: adminPassword,
            name: 'Admin User',
            role: 'ADMIN',
        },
    })

    // Pizzeria User
    const pizzeria = await prisma.user.upsert({
        where: { email: 'pizzeria@test.com' },
        update: { password: pizzeriaPassword, role: 'OWNER' },
        create: {
            email: 'pizzeria@test.com',
            password: pizzeriaPassword,
            name: 'Pizzeria Test',
            role: 'OWNER',
        },
    })

    // Restaurant
    const restaurant = await prisma.restaurant.findFirst({
        where: { ownerId: pizzeria.id }
    })

    if (!restaurant) {
        await prisma.restaurant.create({
            data: {
                name: 'Bella Napoli',
                slug: 'bella-napoli',
                ownerId: pizzeria.id,
                themeColor: '#FF0000',
                menus: {
                    create: {
                        name: 'Menu Principale',
                        isActive: true,
                        categories: {
                            create: {
                                name: 'Pizze',
                                items: {
                                    create: {
                                        name: 'Margherita',
                                        price: 8.5,
                                        description: 'Pomodoro, mozzarella, basilico',
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
    }

    console.log({ admin, pizzeria })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
