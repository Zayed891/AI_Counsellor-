import type { Profile } from './supabase'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const DEFAULT_MODEL = 'google/gemini-flash-latest'

export interface ChatMessage {
    role: 'user' | 'assistant'
    content: string
}

export interface AIAction {
    type: 'add_to_shortlist' | 'add_todo' | 'add_app_task' | 'analyze_profile' | 'lock_university' | 'none'
    params?: Record<string, any>
}

export interface AIResponse {
    message: string
    actions?: AIAction[]
}

export async function sendChatMessage(
    messages: ChatMessage[],
    profile: Profile | null,
    shortlist: any[]
): Promise<AIResponse> {
    try {
        console.log('[AI Service] Sending message to Backend API')

        // Fetch valid session for auth header if needed (though AI chat might be open or protected?)
        // Assuming protected as per previous migration pattern
        // But here we are in a pure function without hook access. 
        // We might need to pass the token or rely on the backend checking UserContext passed token which is complicated here.
        // Wait, UserContext passed token in `fetch`. 
        // Here we are using `fetch` directly.
        // For simplicity, let's try to get the session from localStorage or just rely on the API allowing it?
        // Actually the backend `aiRoutes` are public in `index.js` (no `getUserId` middleware enforced globally, but good to add).
        // The `aiController` doesn't check for user ID currently which is fine for key protection.

        const response = await fetch(`${API_URL}/api/ai/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages,
                profile,
                shortlist
            })
        })

        if (!response.ok) {
            const errorData = await response.json()

            // Handle Rate Limits Gracefully
            if (response.status === 429) {
                return {
                    message: "I am currently overloaded with requests (Rate Limit Reached). Please wait a minute before sending another message.",
                    actions: []
                }
            }

            throw new Error(errorData.error || 'Failed to get AI response')
        }

        const data = await response.json()
        return data

    } catch (error) {
        console.error('Error sending chat message:', error)
        return {
            message: `System Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
    }
}
