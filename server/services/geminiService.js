import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

const config = {
    apiKey: process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY
}

let genAI = null

if (config.apiKey) {
    genAI = new GoogleGenerativeAI(config.apiKey)
} else {
    console.error('Missing GEMINI_API_KEY')
}

// Single-turn generation (Legacy/Simple use cases)
// Helper for exponential backoff
const retryRequest = async (fn, retries = 3, delay = 2000) => {
    try {
        return await fn()
    } catch (error) {
        if (retries > 0 && (error.message.includes('429') || error.message.includes('Too Many Requests') || error.status === 429)) {
            console.warn(`[Gemini] Rate limit hit. Retrying in ${delay / 1000}s... (${retries} attempts left)`)
            await new Promise(resolve => setTimeout(resolve, delay))
            return retryRequest(fn, retries - 1, delay * 2)
        }
        throw error
    }
}

// Single-turn generation (Legacy/Simple use cases)
export const generateContent = async (systemPrompt, userPrompt, modelName = 'gemini-flash-latest') => {
    if (!genAI) throw new Error('Gemini API not initialized')

    return retryRequest(async () => {
        try {
            const model = genAI.getGenerativeModel({
                model: modelName,
                systemInstruction: systemPrompt
            })

            const result = await model.generateContent(userPrompt)
            const response = await result.response
            return response.text()
        } catch (error) {
            console.error('Gemini Service Error:', error)
            throw error // Re-throw to be caught by retryRequest
        }
    })
}

// Multi-turn chat generation
export const generateChatResponse = async (systemPrompt, history, lastUserMsg, modelName = 'gemini-flash-latest') => {
    if (!genAI) throw new Error('Gemini API not initialized')

    return retryRequest(async () => {
        try {
            const model = genAI.getGenerativeModel({
                model: modelName,
                systemInstruction: systemPrompt
            })

            const chat = model.startChat({
                history: history,
                generationConfig: {
                    maxOutputTokens: 2000,
                },
            })

            const result = await chat.sendMessage(lastUserMsg)
            const response = await result.response
            return response.text()
        } catch (error) {
            console.error('Gemini Chat Service Error:', error)
            throw error // Re-throw to be caught by retryRequest
        }
    })
}

