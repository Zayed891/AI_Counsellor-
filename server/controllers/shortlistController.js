import { createAuthenticatedClient } from '../config/supabaseClient.js'

const getAuth = (req) => {
    const token = req.headers.authorization?.split(' ')[1]
    const userId = req.headers['x-user-id']

    if (!token) throw new Error('Missing Authorization token')
    if (!userId) throw new Error('Missing User ID')

    return {
        supabase: createAuthenticatedClient(token),
        userId
    }
}

export const getShortlist = async (req, res) => {
    try {
        const { supabase, userId } = getAuth(req)

        const { data, error } = await supabase
            .from('shortlist')
            .select('*, university:universities(*)')
            .eq('user_id', userId)

        if (error) throw error
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const addToShortlist = async (req, res) => {
    try {
        const { supabase, userId } = getAuth(req)
        const { university, category } = req.body

        // 1. Upsert University (Universities table relies on service role usually? 
        // Or if public can read/write? Assuming public write or RLS allows authenticated users to upsert universities)
        // If RLS blocks this, we might need a separate service role client for this specific table.
        // For now, let's assume authenticated user can insert universities.

        const { error: uniError } = await supabase
            .from('universities')
            .upsert({
                id: university.id,
                name: university.name,
                country: university.country,
                city: university.city,
                ranking: university.ranking,
                tuition_min: university.tuition_min,
                tuition_max: university.tuition_max,
                website: university.website
            })

        if (uniError) throw uniError

        // 2. Add to Shortlist
        const { error } = await supabase
            .from('shortlist')
            .insert({
                user_id: userId,
                university_id: university.id,
                category
            })

        if (error) throw error
        res.status(201).json({ message: 'Added to shortlist' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const removeFromShortlist = async (req, res) => {
    try {
        const { supabase, userId } = getAuth(req)
        const { id } = req.params

        const { error } = await supabase
            .from('shortlist')
            .delete()
            .eq('user_id', userId)
            .eq('university_id', id)

        if (error) throw error
        res.json({ message: 'Removed from shortlist' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const updateCategory = async (req, res) => {
    try {
        const { supabase, userId } = getAuth(req)
        const { id } = req.params
        const { category } = req.body

        const { error } = await supabase
            .from('shortlist')
            .update({ category })
            .eq('user_id', userId)
            .eq('university_id', id)

        if (error) throw error
        res.json({ message: 'Category updated' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const lockUniversity = async (req, res) => {
    try {
        const { supabase, userId } = getAuth(req)
        const { id } = req.params

        const { error } = await supabase
            .from('shortlist')
            .update({ is_locked: true, locked_at: new Date().toISOString() })
            .eq('user_id', userId)
            .eq('university_id', id)

        if (error) throw error
        res.json({ message: 'University locked' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const unlockUniversity = async (req, res) => {
    try {
        const { supabase, userId } = getAuth(req)
        const { id } = req.params

        const { error } = await supabase
            .from('shortlist')
            .update({ is_locked: false, locked_at: null })
            .eq('user_id', userId)
            .eq('university_id', id)

        if (error) throw error
        res.json({ message: 'University unlocked' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
