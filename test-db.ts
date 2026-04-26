import 'dotenv/config'
import { Client } from 'pg'

async function testConnection() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('DATABASE_URL not set')
    process.exit(1)
  }

  console.log('Testing database connection...')
  console.log('Connection string:', connectionString.substring(0, 50) + '***')

  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } })

  try {
    await client.connect()
    console.log('✅ Successfully connected to database')

    const result = await client.query('SELECT 1 as result')
    console.log('✅ Query successful:', result.rows)

  } catch (error: any) {
    console.error('❌ Database connection failed:', error.code || error.message)
    process.exit(1)
  } finally {
    await client.end()
    console.log('🔌 Disconnected from database')
  }
}

testConnection()