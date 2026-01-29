import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
    id: string
    user_id: string
    name: string
    email: string
    phone?: string
    current_degree?: string
    major?: string
    gpa?: number
    education_board?: string
    ielts?: number
    toefl?: number
    gre?: number
    gmat?: number
    sat?: number
    budget_min?: number
    budget_max?: number
    funding_source?: string
    target_countries?: string[]
    intake_year?: string
    intake_season?: string
    study_level?: string
    has_passport?: boolean
    has_transcript?: boolean
    has_sop?: boolean
    has_lor?: boolean
    onboarding_complete?: boolean
    created_at?: string
    updated_at?: string
}

export interface University {
    id: string
    name: string
    country: string
    city?: string
    ranking?: number
    tuition_min?: number
    tuition_max?: number
    acceptance_rate?: number
    programs?: string[]
    requirements?: {
        min_gpa?: number
        min_ielts?: number
        min_toefl?: number
        min_gre?: number
    }
    website?: string
    logo_url?: string
}

export interface Shortlist {
    id: string
    user_id: string
    university_id: string
    category: 'reach' | 'target' | 'safety'
    is_locked?: boolean
    locked_at?: string
    university?: University
    created_at?: string
}

export interface Task {
    id: string
    user_id: string
    title: string
    description?: string
    category: 'exams' | 'documents' | 'applications' | 'general'
    is_completed: boolean
    created_at: string
    completed_at?: string
}
