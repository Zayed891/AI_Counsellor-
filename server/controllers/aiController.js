import { generateContent, generateChatResponse } from '../services/geminiService.js'
import { textToSpeech } from '../services/elevenLabsService.js'

// --- Prompt Building Logic (Moved from Frontend) ---

const buildSystemPrompt = (profile, shortlist) => {
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

    const shortlistInfo = shortlist && shortlist.length > 0 ? `
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

// --- Action Parsing Logic (Moved from Frontend) ---

function parseActionTagInternal(type, paramsStr) {
    const actionType = type.toUpperCase()
    const params = {}

    if (paramsStr) {
        const paramPairs = paramsStr.split('|')
        for (const pair of paramPairs) {
            const [key, value] = pair.split('=')
            if (key && value) {
                params[key.trim()] = value.trim()
            }
        }
    }

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

function parseActions(text) {
    const actions = []
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

    // Fallback: Try to detect intent from natural language (only if no explicit actions)
    if (actions.length === 0) {
        // console.log('[AI Controller] No action tags found, trying intent detection...')
        const intent = detectIntentFromText(text)
        if (intent) actions.push(intent)
    }

    return actions
}

// --- Intent Detection Logic (Moved from Frontend) ---

function detectIntentFromText(text) {
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
                return { type: 'add_app_task', params: { title } }
            }
        }

        // Try regex for "University of X" or "X University" patterns
        const uniPatternMatch = text.match(/(?:the\s+)?(University of [A-Z][a-z]+(?:\s[A-Z][a-z]+)?|[A-Z][a-z]+(?:\s[A-Z][a-z]+)?\s+University)/i)
        if (uniPatternMatch) {
            const title = `Submit application to ${uniPatternMatch[1].trim()}`
            return { type: 'add_app_task', params: { title } }
        }

        // Generic application task
        if (/submit|pay|track|complete/i.test(lowerText)) {
            let action = 'Submit application'
            if (/pay.*fee/i.test(lowerText)) action = 'Pay application fee'
            if (/track/i.test(lowerText)) action = 'Track application status'
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
            return { type: 'add_todo', params: { title, category: 'exams' } }
        }
    }

    // Look for document-related tasks
    if (/(?:write|draft|prepare).*(?:SOP|statement of purpose)/i.test(text)) {
        return { type: 'add_todo', params: { title: 'Write Statement of Purpose', category: 'documents' } }
    }

    if (/(?:get|request|obtain).*(?:LOR|letter of recommendation|recommendation letter)/i.test(text)) {
        return { type: 'add_todo', params: { title: 'Get Letters of Recommendation', category: 'documents' } }
    }

    if (/(?:get|request|obtain).*transcript/i.test(text)) {
        return { type: 'add_todo', params: { title: 'Get Academic Transcripts', category: 'documents' } }
    }

    // Generic task creation - try to extract a reasonable title
    if (/(?:add|create|adding|creating).*(?:task|todo)/i.test(lowerText)) {
        // Try to find quoted text
        const quotedMatch = text.match(/["""']([^"""']+)["""']/i)
        if (quotedMatch) {
            const title = quotedMatch[1].trim().substring(0, 80)
            return { type: 'add_todo', params: { title, category: 'general' } }
        }
    }

    return undefined
}

function cleanMessage(text) {
    return text.replace(/\[ACTION:[\s\S]*?\]/gi, '').trim()
}


// --- Controller Methods ---

export const handleChat = async (req, res) => {
    try {
        const { messages, profile, shortlist } = req.body

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid messages format' })
        }

        const lastUserMsg = messages[messages.length - 1].content
        const systemPrompt = buildSystemPrompt(profile, shortlist)

        // Format history for Gemini
        // Gemini expects: { role: 'user' | 'model', parts: [{ text: string }] }
        // Frontend sends: { role: 'user' | 'assistant', content: string }
        const history = messages.slice(0, -1).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }))

        // const responseText = await generateContent(systemPrompt, lastUserMsg) // Old single-turn
        const responseText = await generateChatResponse(systemPrompt, history, lastUserMsg)

        const actions = parseActions(responseText)
        const cleanedMessage = cleanMessage(responseText)

        res.json({ message: cleanedMessage, actions })

    } catch (error) {
        console.error('Chat Controller Error:', error)
        if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
            return res.status(429).json({ error: 'AI Rate limit exceeded. Please wait a minute and try again.' })
        }
        res.status(500).json({ error: 'Failed to generate AI response' })
    }
}

export const handleSpeak = async (req, res) => {
    try {
        const { text, voiceId } = req.body

        if (!text) return res.status(400).json({ error: 'Missing text' })

        const audioBuffer = await textToSpeech(text, voiceId)

        res.set('Content-Type', 'audio/mpeg')
        res.send(audioBuffer)

    } catch (error) {
        console.error('Speak Controller Error:', error)
        res.status(500).json({ error: 'Failed to generate speech' })
    }
}

export const handleExtract = async (req, res) => {
    try {
        console.log('[Extract Controller] Request received') // Debug Log
        const { systemPrompt, userInput } = req.body

        if (!systemPrompt || !userInput) {
            return res.status(400).json({ error: 'Missing systemPrompt or userInput' })
        }

        // Use the generic generation service
        const responseText = await generateContent(systemPrompt, userInput)

        res.json({ text: responseText })

    } catch (error) {
        console.error('Extract Controller Error:', error)
        res.status(500).json({ error: 'Failed to extract data' })
    }
}
