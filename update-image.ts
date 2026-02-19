import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const result = await prisma.menuItem.updateMany({
        where: {
            name: {
                equals: 'Gran Crudo Imperiale',
                mode: 'insensitive'
            }
        },
        data: {
            imageUrl: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=800'
        }
    })

    console.log('UPDATE_RESULT:', JSON.stringify(result))
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
