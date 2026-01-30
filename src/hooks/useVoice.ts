import { useState, useEffect, useRef, useCallback } from 'react'

interface UseVoiceReturn {
    isListening: boolean
    transcript: string
    startListening: () => void
    stopListening: () => void
    resetTranscript: () => void
    speak: (text: string) => void
    stopSpeaking: () => void
    isSpeaking: boolean
    hasSupport: boolean
}

export function useVoice(): UseVoiceReturn {
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [hasSupport, setHasSupport] = useState(true)

    const recognitionRef = useRef<any>(null)

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            setHasSupport(false)
            return
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'en-US'

        recognitionRef.current.onresult = (event: any) => {
            let currentTranscript = ''
            for (let i = event.resultIndex; i < event.results.length; i++) {
                currentTranscript += event.results[i][0].transcript
            }
            setTranscript(currentTranscript)
        }

        recognitionRef.current.onerror = (event: any) => {
            console.error('Speech recognition error', event.error)
            setIsListening(false)
        }

        recognitionRef.current.onend = () => {
            setIsListening(false)
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop()
            }
        }
    }, [])

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start()
                setIsListening(true)
                setTranscript('')
            } catch (error) {
                console.error('Error starting speech recognition:', error)
            }
        }
    }, [isListening])

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop()
            setIsListening(false)
        }
    }, [isListening])

    const resetTranscript = useCallback(() => {
        setTranscript('')
    }, [])

    const speak = useCallback((text: string) => {
        if (!('speechSynthesis' in window)) return

        // Cancel existing speech
        window.speechSynthesis.cancel()

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)

        window.speechSynthesis.speak(utterance)
    }, [])

    const stopSpeaking = useCallback(() => {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
    }, [])

    return {
        isListening,
        transcript,
        startListening,
        stopListening,
        resetTranscript,
        speak,
        stopSpeaking,
        isSpeaking,
        hasSupport
    }
}
