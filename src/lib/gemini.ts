
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the API with the key from environment variables
const getGeminiClient = () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) return null
    return new GoogleGenerativeAI(apiKey)
}

// Function to generate content (chat/text)
export async function generateGeminiContent(
    systemPrompt: string,
    userPrompt: string,
    modelName: string = 'gemini-flash-latest' // Fallback to stable Flash model
): Promise<string> {
    const client = getGeminiClient()
    if (!client) throw new Error('Gemini API Key missing')

    try {
        const model = client.getGenerativeModel({
            model: modelName,
            systemInstruction: systemPrompt
        })

        const result = await model.generateContent(userPrompt)
        const response = await result.response
        return response.text()
    } catch (error: any) {
        console.error('Gemini API Error:', error)
        // Extract useful error info
        const status = error.status || 'Unknown'
        const text = error.statusText || error.message || 'Connection failed'
        throw new Error(`Gemini Error (${status}): ${text}`)
    }
}

// Function specifically for JSON extraction (using generationConfig)
export async function extractDetailsWithGemini(
    systemPrompt: string,
    userInteraction: string
): Promise<string> {
    const client = getGeminiClient()
    if (!client) throw new Error('Gemini API Key missing')

    try {
        const model = client.getGenerativeModel({
            model: 'gemini-flash-latest',
            systemInstruction: systemPrompt,
            generationConfig: {
                // Ensure output is strictly JSON
                responseMimeType: "application/json"
            }
        })

        const result = await model.generateContent(userInteraction)
        const response = await result.response
        return response.text()
    } catch (error) {
        console.error('Gemini Extraction Error:', error)
        throw error
    }
}
