import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useUser } from '@/context/UserContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Brain,
    Send,
    Loader2,
    User,
    Sparkles,
    GraduationCap,
    Target,
    FileText,
    DollarSign,
    ArrowRight,
    MessageSquare,
    Plus,
    Menu,
    X,
    Trash2,
    Mic,
    Volume2,
    StopCircle,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { sendChatMessage } from '@/lib/ai_service'
import type { ChatMessage, AIAction } from '@/lib/ai_service'
import { useVoice } from '@/hooks/useVoice'
import { speakWithElevenLabs, stopElevenLabsSpeech, ELEVENLABS_DEFAULT_VOICE } from '@/lib/elevenlabs'

// Session Type
interface ChatSession {
    id: string
    title: string
    created_at: string
}

const QUICK_PROMPTS = [
    { icon: GraduationCap, text: 'Recommend universities for my profile' },
    { icon: Brain, text: 'Analyze my profile strength' },
    { icon: Target, text: 'Suggest safety vs reach schools' },
    { icon: DollarSign, text: 'Find scholarships I can apply to' },
]

export default function Counselor() {
    const { profile } = useAuth()
    const { shortlist, addToShortlist, addTask, lockUniversity } = useUser()
    const navigate = useNavigate()

    // State
    const [sessions, setSessions] = useState<ChatSession[]>([])
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Voice Hook
    const {
        isListening,
        transcript,
        startListening,
        stopListening,
        speak: webSpeak,
        stopSpeaking,
        isSpeaking,
        resetTranscript,
        hasSupport
    } = useVoice()

    const [voiceMode, setVoiceMode] = useState(false)
    const [autoSpeak, setAutoSpeak] = useState(true) // Auto-speak AI responses with ElevenLabs
    const [voiceWarning, setVoiceWarning] = useState<string | null>(null)

    // Auto-dismiss voice warning after 5 seconds
    useEffect(() => {
        if (voiceWarning) {
            const timer = setTimeout(() => {
                setVoiceWarning(null)
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [voiceWarning])

    // ElevenLabs Wrapper with fallback
    const speak = async (text: string) => {
        try {
            await speakWithElevenLabs(text, { voiceId: ELEVENLABS_DEFAULT_VOICE })
            setVoiceWarning(null) // Clear warning on success
        } catch (e) {
            console.error("ElevenLabs TTS failed", e)
            setVoiceWarning('Using basic voice (ElevenLabs credits exhausted)')
            // Fallback to web speech
            webSpeak(text)
        }
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        if (transcript) {
            setInput(transcript)
        }
    }, [transcript])

    const isOnboardingComplete = profile?.onboarding_complete === true

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        if (profile?.user_id) {
            fetchSessions()
        }
    }, [profile?.user_id])

    const fetchSessions = async () => {
        if (!profile?.user_id) return
        const { data } = await supabase
            .from('chat_sessions')
            .select('*')
            .eq('user_id', profile.user_id)
            .order('updated_at', { ascending: false })

        if (data) setSessions(data)
    }

    useEffect(() => {
        if (currentSessionId) {
            fetchMessages(currentSessionId)
        } else {
            setMessages([])
        }
    }, [currentSessionId])

    const fetchMessages = async (sessionId: string) => {
        const { data } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: true })

        if (data) {
            setMessages(data.map(msg => ({ role: msg.role as 'user' | 'assistant', content: msg.content })))
        }
    }

    const handleNewChat = () => {
        setCurrentSessionId(null)
        setMessages([])
        setSidebarOpen(false)
    }

    const handleDeleteSession = async () => {
        if (!showDeleteConfirm || !profile?.user_id) return

        try {
            const { error } = await supabase
                .from('chat_sessions')
                .delete()
                .eq('id', showDeleteConfirm)
                .eq('user_id', profile.user_id)

            if (error) throw error

            setSessions(sessions.filter(s => s.id !== showDeleteConfirm))
            if (currentSessionId === showDeleteConfirm) {
                handleNewChat()
            }
            setShowDeleteConfirm(null)
        } catch (error) {
            console.error('Error deleting session:', error)
        }
    }

    const handleQuickPrompt = (prompt: string) => {
        handleSend(prompt)
    }

    const executeAction = async (action: AIAction) => {
        try {
            switch (action.type) {
                case 'add_to_shortlist':
                    if (action.params?.university_name) {
                        const university = {
                            id: `ai-${Date.now()}`,
                            name: action.params?.university_name,
                            country: action.params?.country || 'Unknown',
                            ranking: action.params?.ranking
                        }
                        const category = action.params?.category as 'reach' | 'target' | 'safety'
                        await addToShortlist(university, category)
                        console.log(`✅ Added ${university.name} to shortlist as ${category}`)
                    }
                    break
                case 'add_todo':
                    if (action.params?.title) {
                        const taskCategory = action.params?.category as 'exams' | 'documents' | 'general' || 'general'
                        await addTask(action.params?.title, taskCategory)
                        console.log(`✅ Added to To-Do List: ${action.params?.title}`)
                    }
                    break
                case 'add_app_task':
                    if (action.params?.title) {
                        await addTask(action.params?.title, 'applications')
                        console.log(`✅ Added to Application Tasks: ${action.params?.title}`)
                    }
                    break
                case 'analyze_profile':
                    console.log('📊 Profile analysis completed')
                    break
                case 'lock_university':
                    if (action.params?.university_name) {
                        const uniToLock = shortlist.find(s =>
                            s.university?.name?.toLowerCase().includes(action.params?.university_name?.toLowerCase())
                        )
                        if (uniToLock) {
                            await lockUniversity(uniToLock.university_id)
                            console.log(`🔒 Locked ${uniToLock.university?.name} for application`)
                        }
                    }
                    break
            }
        } catch (error) {
            console.error('Error executing AI action:', error)
        }
    }

    const handleSend = async (text?: string) => {
        const messageText = text || input.trim()
        if (!messageText || loading || !profile) return

        const userMessage: ChatMessage = { role: 'user', content: messageText }
        const optimisticMessages = [...messages, userMessage]
        setMessages(optimisticMessages)
        setInput('')
        setLoading(true)
        stopListening()

        try {
            let sessionId = currentSessionId

            if (!sessionId) {
                const title = messageText.slice(0, 30) + (messageText.length > 30 ? '...' : '')
                const { data: sessionData, error: sessionError } = await supabase
                    .from('chat_sessions')
                    .insert({
                        user_id: profile.user_id,
                        title: title
                    })
                    .select()
                    .single()

                if (sessionError || !sessionData) throw sessionError || new Error('Failed to create session')

                sessionId = sessionData.id
                setCurrentSessionId(sessionId)
                setSessions([sessionData, ...sessions])
            }

            await supabase.from('chat_messages').insert({
                user_id: profile.user_id,
                role: 'user',
                content: messageText,
                session_id: sessionId
            })

            const response = await sendChatMessage(optimisticMessages, profile, shortlist)

            if (response.actions && response.actions.length > 0) {
                for (const action of response.actions) {
                    if (action.type !== 'none') {
                        await executeAction(action)
                    }
                }
            }

            const assistantMessage: ChatMessage = { role: 'assistant', content: response.message }
            const finalMessages = [...optimisticMessages, assistantMessage]
            setMessages(finalMessages)

            if (autoSpeak) {
                speak(response.message)
            }

            await supabase.from('chat_messages').insert({
                user_id: profile.user_id,
                role: 'assistant',
                content: response.message,
                session_id: sessionId
            })

            fetchSessions()

        } catch (error) {
            console.error('Error:', error)
            setMessages([
                ...optimisticMessages,
                { role: 'assistant', content: "I'm sorry, I encountered an error. Please try again." },
            ])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden text-gray-700"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </Button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">AI Counsellor</h1>
                        <p className="text-gray-500 text-sm">Your personalized study abroad assistant</p>
                    </div>
                </div>
                <Button
                    onClick={handleNewChat}
                    className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-5"
                >
                    <Plus size={16} className="mr-2" />
                    New Chat
                </Button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-y-0 left-0 w-72 bg-white z-50 flex flex-col lg:hidden shadow-2xl">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="font-semibold text-gray-900">Chat History</h2>
                        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                            <X size={20} />
                        </Button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-1">
                        {sessions.length === 0 && (
                            <p className="text-gray-400 text-sm text-center py-4">No recent chats</p>
                        )}
                        {sessions.map(session => (
                            <div
                                key={session.id}
                                className={`group flex items-center gap-3 p-3 rounded-xl text-sm transition-colors cursor-pointer ${currentSessionId === session.id
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                onClick={() => {
                                    setCurrentSessionId(session.id)
                                    setSidebarOpen(false)
                                }}
                            >
                                <MessageSquare size={16} className="shrink-0" />
                                <span className="truncate flex-1">{session.title}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setShowDeleteConfirm(session.id)
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white border border-gray-200 p-6 max-w-sm w-full shadow-xl rounded-2xl">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Chat?</h3>
                        <p className="text-gray-500 mb-6 text-sm">
                            This will permanently delete this conversation.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
                                onClick={() => setShowDeleteConfirm(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white border-0"
                                onClick={handleDeleteSession}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid lg:grid-cols-4 gap-4">
                {/* Desktop Sidebar - Chat History */}
                <div className="hidden lg:block">
                    <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                        <h3 className="font-semibold text-gray-900 mb-4">Chat History</h3>
                        <div className="space-y-1 max-h-[500px] overflow-y-auto">
                            {sessions.length === 0 && (
                                <p className="text-gray-400 text-sm text-center py-4">No recent chats</p>
                            )}
                            {sessions.map(session => (
                                <div
                                    key={session.id}
                                    className={`group flex items-center gap-3 p-3 rounded-xl text-sm transition-colors cursor-pointer ${currentSessionId === session.id
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    onClick={() => setCurrentSessionId(session.id)}
                                >
                                    <MessageSquare size={14} className="shrink-0" />
                                    <span className="truncate flex-1 text-xs">{session.title}</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setShowDeleteConfirm(session.id)
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="lg:col-span-3">
                    {!isOnboardingComplete ? (
                        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Brain size={28} className="text-gray-500" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">Complete Your Profile First</h2>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm leading-relaxed">
                                To get personalized AI counseling, we need to know more about you.
                                Please complete your onboarding details.
                            </p>
                            <Link
                                to="/onboarding"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                            >
                                Complete Onboarding <ArrowRight size={16} />
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-[600px]">
                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-4">
                                {messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center">
                                        <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mb-5">
                                            <Sparkles size={24} className="text-white" />
                                        </div>
                                        <h2 className="text-lg font-bold text-gray-900 mb-2">
                                            {profile?.name ? `Hi, ${profile.name.split(' ')[0]}!` : 'Hello!'}
                                        </h2>
                                        <p className="text-gray-500 mb-6 max-w-md text-sm">
                                            I can help you shortlist universities, track applications, or find scholarships.
                                        </p>
                                        <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
                                            {QUICK_PROMPTS.map((prompt, index) => (
                                                <button
                                                    key={index}
                                                    className="flex items-start gap-3 p-4 text-left rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                                                    onClick={() => handleQuickPrompt(prompt.text)}
                                                >
                                                    <prompt.icon size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                                    <span className="text-xs text-gray-700 font-medium">{prompt.text}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {messages.map((message, index) => (
                                            <div
                                                key={index}
                                                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                {message.role === 'assistant' && (
                                                    <div className="w-8 h-8 rounded-xl bg-gray-900 flex items-center justify-center shrink-0">
                                                        <Brain size={14} className="text-white" />
                                                    </div>
                                                )}
                                                <div
                                                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${message.role === 'user'
                                                        ? 'bg-gray-900 text-white rounded-tr-sm'
                                                        : 'bg-gray-100 text-gray-700 rounded-tl-sm'
                                                        }`}
                                                >
                                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {loading && (
                                            <div className="flex gap-3 justify-start">
                                                <div className="w-8 h-8 rounded-xl bg-gray-900 flex items-center justify-center shrink-0">
                                                    <Brain size={14} className="text-white" />
                                                </div>
                                                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm">
                                                    <Loader2 size={16} className="animate-spin text-gray-500" />
                                                </div>
                                            </div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </>
                                )}
                            </div>

                            {/* Input Area */}
                            <div className="p-4 border-t border-gray-100">
                                <div className="flex gap-2">
                                    {hasSupport && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className={`h-11 w-11 shrink-0 rounded-xl transition-all ${isListening
                                                ? 'bg-red-50 border-red-200 text-red-500'
                                                : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                                                }`}
                                            onClick={() => {
                                                if (isListening) {
                                                    stopListening()
                                                } else {
                                                    // Stop any ongoing TTS before recording
                                                    stopElevenLabsSpeech()
                                                    startListening()
                                                    setAutoSpeak(true)
                                                    setVoiceMode(true)
                                                }
                                            }}
                                        >
                                            {isListening ? <StopCircle size={18} /> : <Mic size={18} />}
                                        </Button>
                                    )}

                                    <div className="flex-1 relative">
                                        <Input
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault()
                                                    handleSend()
                                                }
                                            }}
                                            placeholder={isListening ? "Listening..." : "Type your message..."}
                                            className="w-full bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-300 h-11 pr-12 rounded-xl"
                                            disabled={loading}
                                        />
                                        <Button
                                            onClick={() => handleSend()}
                                            disabled={!input.trim() || loading}
                                            className="absolute right-1 top-1 h-9 w-9 p-0 flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white rounded-lg"
                                        >
                                            {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                        </Button>
                                    </div>
                                </div>

                                {/* Voice Status */}
                                {(isSpeaking || isListening) && hasSupport && (
                                    <div className="flex items-center justify-between mt-2 text-xs">
                                        <div className="flex items-center gap-3">
                                            {isSpeaking && (
                                                <span className="flex items-center gap-1.5 text-green-600">
                                                    <Volume2 size={12} /> Speaking...
                                                </span>
                                            )}
                                            {isListening && (
                                                <span className="flex items-center gap-1.5 text-red-500 animate-pulse">
                                                    <Mic size={12} /> Listening...
                                                </span>
                                            )}
                                        </div>
                                        {isSpeaking && (
                                            <button
                                                onClick={stopSpeaking}
                                                className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <StopCircle size={12} /> Stop
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Voice Warning Notification */}
                                {voiceWarning && (
                                    <div className="mt-3 flex items-center justify-between bg-amber-50 border border-amber-200 text-amber-700 px-3 py-2 rounded-lg text-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <span className="flex items-center gap-2">
                                            ⚠️ {voiceWarning}
                                        </span>
                                        <button
                                            onClick={() => setVoiceWarning(null)}
                                            className="p-1 hover:bg-amber-100 rounded-full transition-colors"
                                            aria-label="Dismiss warning"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
