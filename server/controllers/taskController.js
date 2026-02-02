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

export const getTasks = async (req, res) => {
    try {
        const { supabase, userId } = getAuth(req)

        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            // RLS will enforce user_id match, but we can still filter explicitly
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) throw error
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const addTask = async (req, res) => {
    try {
        const { supabase, userId } = getAuth(req)
        const { title, category, description } = req.body

        const { data, error } = await supabase
            .from('tasks')
            .insert({ user_id: userId, title, category, description })
            .select()

        if (error) throw error
        res.status(201).json(data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const toggleTask = async (req, res) => {
    try {
        const { supabase } = getAuth(req)
        const { id } = req.params

        const { data: task, error: fetchError } = await supabase
            .from('tasks')
            .select('is_completed')
            .eq('id', id)
            .single()

        if (fetchError) throw fetchError

        const isCompleted = !task.is_completed

        const { error } = await supabase
            .from('tasks')
            .update({
                is_completed: isCompleted,
                completed_at: isCompleted ? new Date().toISOString() : null
            })
            .eq('id', id)

        if (error) throw error
        res.json({ message: 'Task toggled', is_completed: isCompleted })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const deleteTask = async (req, res) => {
    try {
        const { supabase } = getAuth(req)
        const { id } = req.params

        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id)

        if (error) throw error
        res.json({ message: 'Task deleted' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
