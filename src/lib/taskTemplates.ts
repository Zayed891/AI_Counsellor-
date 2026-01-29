import type { Profile } from './supabase'
import type { Task } from './supabase'

export interface TaskTemplate {
    id: string
    title: string
    category: Task['category']
    description?: string
    condition: (profile: Profile) => boolean
}

// Define task templates based on profile gaps
export const taskTemplates: TaskTemplate[] = [
    // Exam-related tasks
    {
        id: 'ielts-toefl',
        title: 'Schedule IELTS or TOEFL exam',
        category: 'exams',
        description: 'English proficiency is required for most universities',
        condition: (profile) => !profile.ielts && !profile.toefl
    },
    {
        id: 'gre-prep',
        title: 'Prepare for GRE exam',
        category: 'exams',
        description: 'GRE is required for many graduate programs',
        condition: (profile) =>
            profile.study_level === 'Masters' && !profile.gre && !profile.gmat
    },
    {
        id: 'gmat-prep',
        title: 'Prepare for GMAT exam',
        category: 'exams',
        description: 'GMAT is preferred for MBA programs',
        condition: (profile) =>
            Boolean(profile.major?.toLowerCase().includes('business')) && !profile.gmat
    },

    // Document-related tasks
    {
        id: 'sop-draft',
        title: 'Draft Statement of Purpose (SOP)',
        category: 'documents',
        description: 'Start working on your personal statement',
        condition: (profile) => profile.onboarding_complete === true
    },
    {
        id: 'lor-request',
        title: 'Request Letters of Recommendation',
        category: 'documents',
        description: 'Contact professors or employers for recommendation letters',
        condition: (profile) => profile.onboarding_complete === true
    },
    {
        id: 'transcript-collect',
        title: 'Collect official transcripts',
        category: 'documents',
        description: 'Get sealed transcripts from your university',
        condition: (profile) => profile.onboarding_complete === true
    },

    // Application-related tasks
    {
        id: 'research-scholarships',
        title: 'Research scholarship opportunities',
        category: 'applications',
        description: 'Look for merit-based and need-based scholarships',
        condition: (profile) =>
            profile.funding_source === 'Scholarship' || profile.funding_source === 'Partial Scholarship'
    },
    {
        id: 'budget-planning',
        title: 'Create detailed budget plan',
        category: 'general',
        description: 'Plan your finances for tuition, living expenses, and travel',
        condition: (profile) => profile.onboarding_complete === true
    },
    {
        id: 'improve-gpa',
        title: 'Focus on improving current GPA',
        category: 'general',
        description: 'Your GPA could be stronger for competitive programs',
        condition: (profile) =>
            profile.gpa !== undefined && profile.gpa < 3.0 &&
            profile.current_degree !== 'Completed'
    }
]

// Generate tasks based on profile gaps
export function generateProfileBasedTasks(
    profile: Profile,
    existingTasks: Task[]
): { title: string; category: Task['category']; description?: string }[] {
    const existingTaskTitles = new Set(
        existingTasks.map(t => t.title.toLowerCase())
    )

    return taskTemplates
        .filter(template => {
            // Check if condition is met and task doesn't already exist
            const conditionMet = template.condition(profile)
            const alreadyExists = existingTaskTitles.has(template.title.toLowerCase())
            return conditionMet && !alreadyExists
        })
        .map(template => ({
            title: template.title,
            category: template.category,
            description: template.description
        }))
}
