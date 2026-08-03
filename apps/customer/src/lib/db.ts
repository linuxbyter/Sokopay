import { Pool, PoolClient } from 'pg'

let pool: Pool | null = null

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  }
  return pool
}

export const query = async (text: string, params?: unknown[]) => {
  const client = getPool()
  const start = Date.now()
  const res = await client.query(text, params)
  const duration = Date.now() - start
  console.log('Executed query', { text, duration, rows: res.rowCount })
  return res
}

export const getClient = (): Promise<PoolClient> => getPool().connect()

export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await getClient()
    const result = await client.query('SELECT NOW()')
    client.release()
    console.log('Database connected at:', result.rows[0].now)
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

export default { query, getClient, testConnection }
