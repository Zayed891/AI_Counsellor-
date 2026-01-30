
export interface ElevenLabsConfig {
    apiKey: string
    voiceId: string
}

export const ELEVENLABS_DEFAULT_VOICE = '21m00Tcm4TlvDq8ikWAM' // Rachel

export async function speakWithElevenLabs(text: string, config: ElevenLabsConfig): Promise<HTMLAudioElement> {
    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${config.voiceId}/stream`, {
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

        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        audio.volume = 1.0 // Ensure max volume

        return new Promise((resolve, reject) => {
            audio.onended = () => resolve(audio)
            audio.onerror = reject
            audio.play()
        })

    } catch (error) {
        console.error('ElevenLabs Error:', error)
        throw error
    }
}
