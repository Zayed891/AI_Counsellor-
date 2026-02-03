import pg from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const { Pool } = pg

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const runMigrations = async () => {
    console.log('[Migration Runner] Starting database migrations...')

    if (!process.env.DATABASE_URL) {
        console.error('[Migration Runner] ❌ DATABASE_URL is missing in .env file. Skipping migrations.')
        console.error('[Migration Runner] Please add your Supabase Transaction Pooler Connection String to .env')
        return
    }

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    })

    try {
        const schemaPath = path.resolve(__dirname, '../db/schema.sql')
        const schemaSql = fs.readFileSync(schemaPath, 'utf8')

        console.log('[Migration Runner] Connected to database. Executing schema.sql...')

        await pool.query(schemaSql)

        console.log('[Migration Runner] ✅ Migrations executed successfully!')
    } catch (error) {
        console.error('[Migration Runner] ❌ Migration failed:', error)
    } finally {
        await pool.end()
    }
}

export { runMigrations }
