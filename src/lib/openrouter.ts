import type { Profile } from './supabase'

const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:5173'
const SITE_NAME = 'AI Study Counselor'

// Default model - Claude follows instructions better
export const DEFAULT_MODEL = 'openai/gpt-3.5-turbo' // Standard, reliable model

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

const buildSystemPrompt = (profile: Profile | null, shortlist: any[]) => {
    const profileInfo = profile ? `
User Profile:
- Name: ${profile.name}
- Study Level: ${profile.study_level || 'Not specified'}
- Major: ${profile.major || 'Not specified'}
- GPA: ${profile.gpa || 'Not specified'}
- Target Countries: ${profile.target_countries?.join(', ') || 'Not specified'}
- Budget: $${profile.budget_min || '?'} - $${profile.budget_max || '?'} per year
- Intake: ${profile.intake_season || ''} ${profile.intake_year || ''}
- Funding: ${profile.funding_source || 'Not specified'}
- Test Scores:
  - IELTS: ${profile.ielts || 'Not taken'}
  - TOEFL: ${profile.toefl || 'Not taken'}
  - GRE: ${profile.gre || 'Not taken'}
  - GMAT: ${profile.gmat || 'Not taken'}
` : 'User profile not available.'

    const shortlistInfo = shortlist.length > 0 ? `
User's Shortlisted Universities:
${shortlist.map(s => `- ${s.university?.name} (${s.university?.country}) - Category: ${s.category}`).join('\n')}
` : 'No universities shortlisted yet.'

    return `You are a Study Abroad AI assistant.

${profileInfo}
${shortlistInfo}

You can take actions by including an action tag at the end of your response or after a list item.

IMPORTANT: When recommending universities or listing items, you MUST write the item name in the text description FIRST, and then append the action tag on a new line or at the end. Do NOT hide the information inside the tag.

CORRECT FORMAT:
1. **University of Oxford** - A top-tier university suitable for your profile.
[ACTION:ADD_UNIVERSITY|name=University of Oxford|category=reach]

INCORRECT FORMAT (Do NOT do this):
1. [ACTION:ADD_UNIVERSITY|name=University of Oxford] (This leaves the text blank!)

AVAILABLE ACTIONS:

1. ADD TO-DO (appears in Dashboard):
   [ACTION:ADD_TODO|title=Task title|category=exams]
   Categories: exams, documents, general

2. ADD APPLICATION TASK (appears in Guidance page):
   [ACTION:ADD_APP_TASK|title=Task title]
   Use this for application-related tasks like submitting forms, paying fees, tracking deadlines.

3. ADD UNIVERSITY TO SHORTLIST:
   [ACTION:ADD_UNIVERSITY|name=University Name|category=reach]
   Categories: reach, target, safety

4. LOCK UNIVERSITY:
   [ACTION:LOCK_UNIVERSITY|name=University Name]

EXAMPLES:

User: "Add a task to prepare for IELTS"
Response: Done! I've added it to your to-do list.
[ACTION:ADD_TODO|title=Prepare for IELTS|category=exams]

User: "Add an application task to submit MIT application"
Response: Added to your application tasks!
[ACTION:ADD_APP_TASK|title=Submit MIT application]

User: "Create a task to pay Stanford fee"
Response: I've added that to your application tasks!
[ACTION:ADD_APP_TASK|title=Pay Stanford application fee]

User: "Add a task to write my SOP"
Response: Added to your to-do list!
[ACTION:ADD_TODO|title=Write Statement of Purpose|category=documents]

User: "Recommend 2 universities"
Response: Here are two options:

1. **Stanford University** - Great for CS.
[ACTION:ADD_UNIVERSITY|name=Stanford University|category=reach]

2. **Arizona State University** - Good safety option.
[ACTION:ADD_UNIVERSITY|name=Arizona State University|category=safety]
`
}

// Parse actions from AI response - returns Array
function parseActions(text: string): AIAction[] {
    const actions: AIAction[] = []

    // Find all explicit action tags including multi-line
    const actionRegex = /\[ACTION:([\s\S]*?)\]/gi
    let match

    while ((match = actionRegex.exec(text)) !== null) {
        const innerContent = match[1].trim()
        const splitterIndex = innerContent.indexOf('|')

        let type = ''
        let paramsStr = ''

        if (splitterIndex !== -1) {
            type = innerContent.substring(0, splitterIndex).trim()
            paramsStr = innerContent.substring(splitterIndex + 1).trim()
        } else {
            type = innerContent.trim()
        }

        const parsed = parseActionTagInternal(type, paramsStr)
        if (parsed) actions.push(parsed)
    }

    if (actions.length > 0) {
        return actions
    }

    // Fallback: Try to detect intent from natural language (only if no explicit tags)
    console.log('[OpenRouter] No action tags found, trying intent detection...')
    const intent = detectIntentFromText(text)
    return intent ? [intent] : []
}

// Internal helper to parse type and params
function parseActionTagInternal(type: string, paramsStr: string): AIAction | undefined {
    const actionType = type.toUpperCase()
    const params: Record<string, any> = {}

    if (paramsStr) {
        const paramPairs = paramsStr.split('|')
        for (const pair of paramPairs) {
            const [key, value] = pair.split('=')
            if (key && value) {
                params[key.trim()] = value.trim()
            }
        }
    }

    console.log('[OpenRouter] Parsed action type:', actionType)
    console.log('[OpenRouter] Parsed params:', params)

    switch (actionType) {
        case 'ADD_UNIVERSITY':
            return {
                type: 'add_to_shortlist',
                params: { university_name: params.name, category: params.category }
            }
        case 'ADD_TODO':
            return {
                type: 'add_todo',
                params: { title: params.title, category: params.category || 'general' }
            }
        case 'ADD_APP_TASK':
            return {
                type: 'add_app_task',
                params: { title: params.title }
            }
        case 'ANALYZE_PROFILE':
            return { type: 'analyze_profile' }
        case 'LOCK_UNIVERSITY':
            return {
                type: 'lock_university',
                params: { university_name: params.name }
            }
        default:
            return undefined
    }
}

// Detect intent from natural language when no action tag is present
function detectIntentFromText(text: string): AIAction | undefined {
    const lowerText = text.toLowerCase()

    // Check if this is about APPLICATION tasks (for Guidance page)
    const isApplicationRelated = /application task|submit.*application|pay.*fee|track.*application|application.*deadline/i.test(text)

    if (isApplicationRelated) {
        // Known university names/acronyms
        const universities = [
            'MIT', 'Stanford', 'Harvard', 'Yale', 'Princeton', 'Columbia', 'Cornell',
            'UCLA', 'USC', 'NYU', 'UBC', 'Berkeley', 'Caltech', 'Oxford', 'Cambridge',
            'Massachusetts Institute of Technology', 'Stanford University', 'Harvard University',
            'University of California', 'University of British Columbia', 'University of Toronto'
        ]

        // Try to find a university name in the text
        for (const uni of universities) {
            if (text.includes(uni) || lowerText.includes(uni.toLowerCase())) {
                const title = `Submit application to ${uni}`
                console.log('[OpenRouter] Intent detected: add_app_task, title:', title)
                return { type: 'add_app_task', params: { title } }
            }
        }

        // Try regex for "University of X" or "X University" patterns
        const uniPatternMatch = text.match(/(?:the\s+)?(University of [A-Z][a-z]+(?:\s[A-Z][a-z]+)?|[A-Z][a-z]+(?:\s[A-Z][a-z]+)?\s+University)/i)
        if (uniPatternMatch) {
            const title = `Submit application to ${uniPatternMatch[1].trim()}`
            console.log('[OpenRouter] Intent detected: add_app_task, title:', title)
            return { type: 'add_app_task', params: { title } }
        }

        // Generic application task
        if (/submit|pay|track|complete/i.test(lowerText)) {
            let action = 'Submit application'
            if (/pay.*fee/i.test(lowerText)) action = 'Pay application fee'
            if (/track/i.test(lowerText)) action = 'Track application status'
            console.log('[OpenRouter] Intent detected: add_app_task, title:', action)
            return { type: 'add_app_task', params: { title: action } }
        }
    }

    // Check for general TODO tasks (for Dashboard)
    // Look for specific test prep
    if (/prepare.*(?:for\s+)?(IELTS|TOEFL|GRE|GMAT|SAT)/i.test(text) ||
        /(?:IELTS|TOEFL|GRE|GMAT|SAT).*(?:prep|preparation|study)/i.test(text)) {
        const testMatch = text.match(/(IELTS|TOEFL|GRE|GMAT|SAT)/i)
        if (testMatch) {
            const title = `Prepare for ${testMatch[1].toUpperCase()}`
            console.log('[OpenRouter] Intent detected: add_todo, title:', title, 'category: exams')
            return { type: 'add_todo', params: { title, category: 'exams' } }
        }
    }

    // Look for document-related tasks
    if (/(?:write|draft|prepare).*(?:SOP|statement of purpose)/i.test(text)) {
        console.log('[OpenRouter] Intent detected: add_todo, title: Write Statement of Purpose, category: documents')
        return { type: 'add_todo', params: { title: 'Write Statement of Purpose', category: 'documents' } }
    }

    if (/(?:get|request|obtain).*(?:LOR|letter of recommendation|recommendation letter)/i.test(text)) {
        console.log('[OpenRouter] Intent detected: add_todo, title: Get Letters of Recommendation, category: documents')
        return { type: 'add_todo', params: { title: 'Get Letters of Recommendation', category: 'documents' } }
    }

    if (/(?:get|request|obtain).*transcript/i.test(text)) {
        console.log('[OpenRouter] Intent detected: add_todo, title: Get Academic Transcripts, category: documents')
        return { type: 'add_todo', params: { title: 'Get Academic Transcripts', category: 'documents' } }
    }

    // Generic task creation - try to extract a reasonable title
    if (/(?:add|create|adding|creating).*(?:task|todo)/i.test(lowerText)) {
        // Try to find quoted text
        const quotedMatch = text.match(/["""']([^"""']+)["""']/i)
        if (quotedMatch) {
            const title = quotedMatch[1].trim().substring(0, 80)
            console.log('[OpenRouter] Intent detected: add_todo, title:', title, 'category: general')
            return { type: 'add_todo', params: { title, category: 'general' } }
        }
    }

    return undefined
}

// Remove action tag from message for display
function cleanMessage(text: string): string {
    // Replace valid and potentially partial ACTION tags if they look like system instructions
    return text.replace(/\[ACTION:[\s\S]*?\]/gi, '').trim()
}

export async function sendChatMessage(
    messages: ChatMessage[],
    profile: Profile | null,
    shortlist: any[]
): Promise<AIResponse> {
    // Read key at runtime
    const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || ''

    console.log('[OpenRouter] Runtime Key Check:', API_KEY ? 'Has Key' : 'No Key')

    if (!API_KEY) {
        return {
            message: `I'm your AI Counselor! To enable full functionality, please configure your OpenRouter API key.

To get personalized AI recommendations and ACTIONS, add your OpenRouter API key to the environment variables.`
        }
    }

    try {
        const systemPrompt = buildSystemPrompt(profile, shortlist)

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'HTTP-Referer': SITE_URL,
                'X-Title': SITE_NAME,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: DEFAULT_MODEL,
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages.map(msg => ({
                        role: msg.role,
                        content: msg.content
                    }))
                ],
                temperature: 0.7
            })
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error('OpenRouter API Error:', errorData)
            throw new Error(`OpenRouter API Error: ${response.status} ${JSON.stringify(errorData)}`)
        }

        const data = await response.json()
        const fullText = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response."

        // Parse action
        const actions = parseActions(fullText)
        const cleanedMessage = cleanMessage(fullText)

        return {
            message: cleanedMessage,
            actions
        }

    } catch (error) {
        console.error('Error sending chat message:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return {
            message: `I'm sorry, I encountered an error: ${errorMessage}. Please check the console for more details.`
        }
    }
}
