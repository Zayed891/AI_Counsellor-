const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface ElevenLabsConfig {
    voiceId: string
}

export const ELEVENLABS_DEFAULT_VOICE = '21m00Tcm4TlvDq8ikWAM' // Rachel

// Track current audio for stopping
let currentAudio: HTMLAudioElement | null = null

export function stopElevenLabsSpeech(): void {
    if (currentAudio) {
        currentAudio.pause()
        currentAudio.currentTime = 0
        currentAudio = null
    }
}

export async function speakWithElevenLabs(text: string, config: ElevenLabsConfig): Promise<HTMLAudioElement> {
    // Stop any existing audio first
    stopElevenLabsSpeech()

    try {
        const response = await fetch(`${API_URL}/api/ai/speak`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text,
                voiceId: config.voiceId
            })
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'ElevenLabs Service Error')
        }

        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        audio.volume = 1.0
        currentAudio = audio

        return new Promise((resolve, reject) => {
            audio.onended = () => {
                currentAudio = null
                resolve(audio)
            }
            audio.onerror = () => {
                currentAudio = null
                reject(new Error('Audio playback failed'))
            }
            audio.play()
        })

    } catch (error) {
        console.error('ElevenLabs Error:', error)
        throw error
    }
}
