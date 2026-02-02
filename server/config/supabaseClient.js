import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase URL or Key')
}

// Default anon client
export const supabase = createClient(supabaseUrl, supabaseKey)

// Helper to create an authenticated client for a specific user token
export const createAuthenticatedClient = (token) => {
    return createClient(supabaseUrl, supabaseKey, {
        global: {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    })
}
