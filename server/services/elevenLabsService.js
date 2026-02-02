import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const config = {
    apiKey: process.env.VITE_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY
}

export const textToSpeech = async (text, voiceId) => {
    if (!config.apiKey) throw new Error('ElevenLabs API Key missing')

    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'xi-api-key': config.apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text,
                model_id: "eleven_multilingual_v2",
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.5
                }
            })
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.detail?.message || 'ElevenLabs API Error')
        }

        // Return the buffer directly
        const buffer = await response.arrayBuffer()
        return Buffer.from(buffer)

    } catch (error) {
        console.error('ElevenLabs Service Error:', error)
        throw error
    }
}
