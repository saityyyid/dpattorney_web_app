import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Create client
  const client1 = await prisma.client.create({
    data: {
      name: 'PT Maju Jaya',
      email: 'contact@majujaya.com',
      companyName: 'PT Maju Jaya',
    },
  })

  console.log('Seed completed successfully')
  console.log({ client1 })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })