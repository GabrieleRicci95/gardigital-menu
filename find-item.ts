import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('--- START ---')
    const items = await prisma.menuItem.findMany({
        where: {
            name: {
                contains: 'Gran Crudo',
                mode: 'insensitive'
            }
        }
    })

    items.forEach(item => {
        console.log(`FOUND: ${item.id} | ${item.name}`)
    })
    console.log('--- END ---')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
