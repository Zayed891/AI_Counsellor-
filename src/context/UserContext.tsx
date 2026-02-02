import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
import { useAuth } from './AuthContext'
import { supabase, type University, type Shortlist, type Task, type Profile } from '@/lib/supabase'
import { generateProfileBasedTasks } from '@/lib/taskTemplates'

interface UserContextType {
    shortlist: Shortlist[]
    tasks: Task[]
    currentStage: number
    addToShortlist: (university: University, category: 'reach' | 'target' | 'safety') => Promise<void>
    removeFromShortlist: (universityId: string) => Promise<void>
    updateCategory: (universityId: string, category: 'reach' | 'target' | 'safety') => Promise<void>
    lockUniversity: (universityId: string) => Promise<void>
    unlockUniversity: (universityId: string) => Promise<void>
    getLockedUniversities: () => Shortlist[]
    addTask: (title: string, category: Task['category'], description?: string) => Promise<void>
    toggleTask: (taskId: string) => Promise<void>
    deleteTask: (taskId: string) => Promise<void>
    advanceStage: (stage: number) => void
    getProfileCompleteness: () => number
    isProfileComplete: () => boolean
    checkAndGenerateTasks: () => Promise<void>
    loading: boolean
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
    const { user, profile, session } = useAuth()
    const [shortlist, setShortlist] = useState<Shortlist[]>([])
    const [tasks, setTasks] = useState<Task[]>([])
    const [currentStage, setCurrentStage] = useState(1)
    const [loading, setLoading] = useState(true)
    const prevProfileRef = useRef<Profile | null>(null)
    const hasGeneratedInitialTasks = useRef(false)

    useEffect(() => {
        if (user) {
            fetchShortlist()
            fetchTasks()
            // Calculate stage based on profile completeness and locked universities
            if (profile?.onboarding_complete) {
                const lockedCount = shortlist.filter(s => s.is_locked).length
                if (lockedCount > 0) {
                    setCurrentStage(4)
                } else if (shortlist.length > 0) {
                    setCurrentStage(3)
                } else {
                    setCurrentStage(2)
                }
            }
        }
    }, [user, profile])

    const fetchShortlist = async () => {
        if (!user) return

        try {
            const response = await fetch(`${API_URL}/api/shortlist`, {
                headers: {
                    'X-User-ID': user.id,
                    'Authorization': `Bearer ${session?.access_token}`
                }
            })
            if (!response.ok) throw new Error('Failed to fetch shortlist')
            const data = await response.json()
            setShortlist(data || [])
        } catch (error) {
            console.error('Error fetching shortlist:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchTasks = async () => {
        if (!user) return
        try {
            const response = await fetch(`${API_URL}/api/tasks`, {
                headers: {
                    'X-User-ID': user.id,
                    'Authorization': `Bearer ${session?.access_token}`
                }
            })
            if (!response.ok) throw new Error('Failed to fetch tasks')
            const data = await response.json()
            setTasks(data || [])
            return data || []
        } catch (error) {
            console.error('Error fetching tasks:', error)
            return []
        }
    }

    // Auto-generate tasks based on profile gaps
    const checkAndGenerateTasks = async () => {
        if (!user || !profile || !profile.onboarding_complete) return

        try {
            // Fetch latest tasks to ensure we have current data
            const currentTasks = await fetchTasks()
            const newTasks = generateProfileBasedTasks(profile, currentTasks || [])

            // Add each new task via API
            for (const task of newTasks) {
                await addTask(task.title, task.category, task.description)
            }

            // Refresh tasks if any were added
            if (newTasks.length > 0) {
                console.log(`✅ Auto-generated ${newTasks.length} tasks based on profile`)
                await fetchTasks()
            }
        } catch (error) {
            console.error('Error auto-generating tasks:', error)
        }
    }

    // Effect to auto-generate tasks when profile is completed (only once per user)
    useEffect(() => {
        if (!user || !profile?.onboarding_complete) return

        const storageKey = `tasks_generated_${user.id}`
        const alreadyGenerated = localStorage.getItem(storageKey)

        if (!alreadyGenerated && !hasGeneratedInitialTasks.current) {
            hasGeneratedInitialTasks.current = true
            localStorage.setItem(storageKey, 'true')
            checkAndGenerateTasks()
        }
    }, [user, profile?.onboarding_complete])

    const addToShortlist = async (university: University, category: 'reach' | 'target' | 'safety') => {
        if (!user) return

        try {
            const response = await fetch(`${API_URL}/api/shortlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': user.id,
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({ university, category })
            })

            if (!response.ok) throw new Error('Failed to add to shortlist')

            await fetchShortlist()
        } catch (error) {
            console.error('Error adding to shortlist:', error)
        }
    }

    const removeFromShortlist = async (universityId: string) => {
        if (!user) return

        try {
            const response = await fetch(`${API_URL}/api/shortlist/${universityId}`, {
                method: 'DELETE',
                headers: {
                    'X-User-ID': user.id,
                    'Authorization': `Bearer ${session?.access_token}`
                }
            })

            if (!response.ok) throw new Error('Failed to remove from shortlist')

            setShortlist(prev => prev.filter(s => s.university_id !== universityId))
        } catch (error) {
            console.error('Error removing from shortlist:', error)
        }
    }

    const updateCategory = async (universityId: string, category: 'reach' | 'target' | 'safety') => {
        if (!user) return

        try {
            const response = await fetch(`${API_URL}/api/shortlist/${universityId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': user.id,
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({ category })
            })

            if (!response.ok) throw new Error('Failed to update category')

            setShortlist(prev =>
                prev.map(s =>
                    s.university_id === universityId ? { ...s, category } : s
                )
            )
        } catch (error) {
            console.error('Error updating category:', error)
        }
    }

    const advanceStage = (stage: number) => {
        setCurrentStage(stage)
    }

    // University Locking
    const lockUniversity = async (universityId: string) => {
        if (!user) return
        try {
            const response = await fetch(`${API_URL}/api/shortlist/${universityId}/lock`, {
                method: 'PATCH',
                headers: {
                    'X-User-ID': user.id,
                    'Authorization': `Bearer ${session?.access_token}`
                }
            })

            if (!response.ok) throw new Error('Failed to lock university')

            setShortlist(prev =>
                prev.map(s =>
                    s.university_id === universityId
                        ? { ...s, is_locked: true, locked_at: new Date().toISOString() }
                        : s
                )
            )
        } catch (error) {
            console.error('Error locking university:', error)
        }
    }

    const unlockUniversity = async (universityId: string) => {
        if (!user) return
        try {
            const response = await fetch(`${API_URL}/api/shortlist/${universityId}/unlock`, {
                method: 'PATCH',
                headers: {
                    'X-User-ID': user.id,
                    'Authorization': `Bearer ${session?.access_token}`
                }
            })

            if (!response.ok) throw new Error('Failed to unlock university')

            setShortlist(prev =>
                prev.map(s =>
                    s.university_id === universityId
                        ? { ...s, is_locked: false, locked_at: undefined }
                        : s
                )
            )
        } catch (error) {
            console.error('Error unlocking university:', error)
        }
    }

    const getLockedUniversities = () => {
        return shortlist.filter(s => s.is_locked)
    }

    // Task Management
    const addTask = async (title: string, category: Task['category'], description?: string) => {
        console.log('[UserContext] addTask called with:', { title, category, description })
        if (!user) {
            console.log('[UserContext] No user - cannot add task')
            return
        }
        try {
            console.log('[UserContext] Sending task to API...')
            const response = await fetch(`${API_URL}/api/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': user.id,
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({ title, category, description })
            })

            if (!response.ok) throw new Error('Failed to add task')

            const data = await response.json()
            console.log('[UserContext] Task inserted successfully:', data)
            await fetchTasks()
            console.log('[UserContext] Tasks refreshed')
        } catch (error) {
            console.error('[UserContext] Error adding task:', error)
        }
    }

    const toggleTask = async (taskId: string) => {
        if (!user) return
        try {
            const response = await fetch(`${API_URL}/api/tasks/${taskId}/toggle`, {
                method: 'PATCH',
                headers: {
                    'X-User-ID': user.id,
                    'Authorization': `Bearer ${session?.access_token}`
                }
            })

            if (!response.ok) throw new Error('Failed to toggle task')

            const { is_completed } = await response.json()

            setTasks(prev =>
                prev.map(t =>
                    t.id === taskId
                        ? { ...t, is_completed, completed_at: is_completed ? new Date().toISOString() : undefined }
                        : t
                )
            )
        } catch (error) {
            console.error('Error toggling task:', error)
        }
    }

    const deleteTask = async (taskId: string) => {
        if (!user) return
        try {
            const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'X-User-ID': user.id,
                    'Authorization': `Bearer ${session?.access_token}`
                }
            })

            if (!response.ok) throw new Error('Failed to delete task')

            setTasks(prev => prev.filter(t => t.id !== taskId))
        } catch (error) {
            console.error('Error deleting task:', error)
        }
    }

    const getProfileCompleteness = () => {
        if (!profile) return 0

        let filled = 0
        let total = 14

        if (profile.name) filled++
        if (profile.email) filled++
        if (profile.phone) filled++
        if (profile.current_degree) filled++
        if (profile.major) filled++
        if (profile.gpa) filled++
        if (profile.education_board) filled++
        if (profile.budget_min) filled++
        if (profile.budget_max) filled++
        if (profile.funding_source) filled++
        if (profile.target_countries?.length) filled++
        if (profile.intake_year) filled++
        if (profile.intake_season) filled++
        if (profile.study_level) filled++

        return Math.round((filled / total) * 100)
    }

    const isProfileComplete = () => {
        return getProfileCompleteness() >= 80
    }

    return (
        <UserContext.Provider
            value={{
                shortlist,
                tasks,
                currentStage,
                addToShortlist,
                removeFromShortlist,
                updateCategory,
                lockUniversity,
                unlockUniversity,
                getLockedUniversities,
                addTask,
                toggleTask,
                deleteTask,
                advanceStage,
                getProfileCompleteness,
                isProfileComplete,
                checkAndGenerateTasks,
                loading
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}
