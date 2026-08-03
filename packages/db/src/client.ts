import { Pool, PoolConfig } from "pg"

const poolConfig: PoolConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
}

const pool = new Pool(poolConfig)

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result.rows as T[]
  } finally {
    client.release()
  }
}

export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(text, params)
  return rows[0] || null
}

export async function execute(text: string, params?: any[]): Promise<void> {
  const client = await pool.connect()
  try {
    await client.query(text, params)
  } finally {
    client.release()
  }
}

export { pool }
