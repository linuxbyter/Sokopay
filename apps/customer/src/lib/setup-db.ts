import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '../../.env.local') })

import { testConnection } from './db'

async function setup() {
  console.log('Testing Neon Postgres connection...\n')

  const connected = await testConnection()

  if (connected) {
    console.log('\n✓ Database connected successfully!')
    console.log('✓ You can now run your SQL commands in Neon dashboard.')
  } else {
    console.log('\n✗ Connection failed. Check your DATABASE_URL in .env.local')
  }

  process.exit(connected ? 0 : 1)
}

setup()
