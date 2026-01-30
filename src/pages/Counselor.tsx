import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useUser } from '@/context/UserContext'
import Navbar from '@/components/Navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
    MoreHorizontal,
    Mic,
    Volume2,
    VolumeX,
    StopCircle,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { sendChatMessage } from '@/lib/ai_service'
import type { ChatMessage, AIAction } from '@/lib/ai_service'
import { useVoice } from '@/hooks/useVoice'
import { speakWithElevenLabs, ELEVENLABS_DEFAULT_VOICE } from '@/lib/elevenlabs'

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
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null) // Session ID to delete
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Voice Hook
    const {
        isListening,
        transcript,
        startListening,
        stopListening,
        speak: webSpeak, // Rename original speak to webSpeak
        stopSpeaking,
        isSpeaking,
        resetTranscript,
        hasSupport
    } = useVoice()

    const [voiceMode, setVoiceMode] = useState(false)
    const [autoSpeak, setAutoSpeak] = useState(false)
    const [elevenLabsKey] = useState(import.meta.env.VITE_ELEVENLABS_API_KEY)

    // ElevenLabs Wrapper
    const speak = async (text: string) => {
        if (elevenLabsKey) {
            try {
                await speakWithElevenLabs(text, { apiKey: elevenLabsKey, voiceId: ELEVENLABS_DEFAULT_VOICE })
            } catch (e) {
                console.error("ElevenLabs TTS failed", e)
                // Fallback: silent fail or notify (User requested ElevenLabs ONLY)
            }
        } else {
            // No key? Fallback or silence. 
            // webSpeak(text) 
        }
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Sync voice transcript to input
    useEffect(() => {
        if (transcript) {
            setInput(transcript)
        }
    }, [transcript])

    // Verify profile completeness
    const isOnboardingComplete = profile?.onboarding_complete === true &&
        !!profile?.study_level &&
        (profile?.target_countries?.length ?? 0) > 0

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    // Load Sessions
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

    // Load Messages for Current Session
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

    // Actions
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
        stopListening() // Stop listening if user sends message manually

        try {
            let sessionId = currentSessionId

            // Create new session if none exists
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

            // Save user message
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

            // Auto-speak if enabled
            if (autoSpeak) {
                speak(response.message)
            }

            await supabase.from('chat_messages').insert({
                user_id: profile.user_id,
                role: 'assistant',
                content: response.message,
                session_id: sessionId
            })

            // Refresh sessions to update order if we were doing server-side sorting on updated_at
            // For now, simpler to just re-fetch or assume client order is fine until reload
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
        <div className="min-h-screen relative flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-[#0A0A0A] border-r border-white/10 flex flex-col transition-transform duration-300 pt-28
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <Button
                        type="button"
                        onClick={handleNewChat}
                        variant="outline"
                        className="flex-1 bg-white text-black hover:bg-neutral-200 border-0 font-medium"
                    >
                        <Plus size={18} className="mr-2" /> New Chat
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden ml-2 text-neutral-400"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={20} />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                    {sessions.length === 0 && (
                        <p className="text-neutral-500 text-xs text-center py-4">No recent chats</p>
                    )}
                    {sessions.map(session => (
                        <div
                            key={session.id}
                            className={`group flex items-center gap-3 p-3 rounded-lg text-sm transition-colors cursor-pointer ${currentSessionId === session.id
                                ? 'bg-neutral-900 text-white border border-white/10'
                                : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200'
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
                                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center border border-white/10">
                            <User size={14} className="text-neutral-400" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{profile?.name || 'User'}</p>
                            <p className="text-xs text-neutral-500 truncate">{profile?.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen w-full min-w-0 overflow-hidden">
                <Navbar />

                <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 pt-20 sm:pt-24 pb-4 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden text-white"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-white">AI Counselor</h1>
                        </div>
                    </div>

                    {/* Delete Confirmation */}
                    {showDeleteConfirm && (
                        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                            <div className="bg-neutral-900 border border-white/10 p-6 max-w-sm w-full shadow-2xl rounded-lg">
                                <h3 className="text-lg font-bold text-white mb-2">Delete Chat?</h3>
                                <p className="text-neutral-400 mb-6 text-sm">
                                    This will permanently delete this conversation.
                                </p>
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1 border-white/10 text-white hover:bg-white/5"
                                        onClick={() => setShowDeleteConfirm(null)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="sharp"
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white border-0"
                                        onClick={handleDeleteSession}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Onboarding Check */}
                    {!isOnboardingComplete ? (
                        <Card className="flex-1 flex flex-col items-center justify-center bg-[#0A0A0A] border-white/10">
                            <CardContent className="text-center py-16 max-w-md">
                                <div className="w-20 h-20 bg-neutral-900 border border-white/10 flex items-center justify-center mx-auto mb-8">
                                    <Brain size={36} className="text-neutral-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-4">Complete Your Profile First</h2>
                                <p className="text-neutral-400 mb-8 leading-relaxed">
                                    To get personalized AI counseling, we need to know more about you.
                                    Please complete your onboarding details so we can provide tailored recommendations.
                                </p>
                                <Button variant="sharp" size="lg" asChild className="cursor-pointer">
                                    <Link to="/onboarding">
                                        Complete Onboarding <ArrowRight size={18} />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        /* Chat Area */
                        <Card className="flex-1 flex flex-col overflow-hidden bg-[#0A0A0A] border-white/10 relative">
                            <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                                {messages.length === 0 ? (
                                    <div className="min-h-full flex flex-col items-center justify-center text-center py-10">
                                        <div className="w-16 h-16 bg-neutral-900 border border-white/10 flex items-center justify-center mb-6 rounded-2xl">
                                            <Sparkles size={28} className="text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold mb-3 text-white">
                                            {profile?.name ? `Hi, ${profile.name.split(' ')[0]}!` : 'Hello!'}
                                        </h2>
                                        <p className="text-neutral-400 mb-8 max-w-md text-sm leading-relaxed">
                                            I can help you shortlist universities, track applications, or find scholarships.
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
                                            {QUICK_PROMPTS.map((prompt, index) => (
                                                <Button
                                                    key={index}
                                                    variant="outline"
                                                    className="h-auto py-4 px-4 text-left justify-start gap-3 border-white/10 bg-neutral-900 hover:bg-neutral-800 hover:border-white/30 text-white whitespace-normal"
                                                    onClick={() => handleQuickPrompt(prompt.text)}
                                                >
                                                    <prompt.icon size={16} className="text-neutral-500 shrink-0" />
                                                    <span className="text-xs font-medium">{prompt.text}</span>
                                                </Button>
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
                                                    <div className="w-8 h-8 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center shrink-0">
                                                        <Brain size={14} className="text-white" />
                                                    </div>
                                                )}
                                                <div
                                                    className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${message.role === 'user'
                                                        ? 'bg-white text-black rounded-tr-none'
                                                        : 'bg-neutral-900 text-neutral-200 border border-white/10 rounded-tl-none'
                                                        }`}
                                                >
                                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {loading && (
                                            <div className="flex gap-3 justify-start">
                                                <div className="w-8 h-8 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center shrink-0">
                                                    <Brain size={14} className="text-white" />
                                                </div>
                                                <div className="bg-neutral-900 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-none">
                                                    <Loader2 size={16} className="animate-spin text-neutral-500" />
                                                </div>
                                            </div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </>
                                )}
                            </CardContent>

                            {/* Input Area */}
                            <div className="p-4 bg-[#0A0A0A] border-t border-white/10">
                                <div className="max-w-3xl mx-auto">
                                    <div className="flex gap-2 relative">
                                        {/* Mic Button */}
                                        {hasSupport && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className={`
                                                    h-11 w-11 shrink-0 rounded-xl transition-all duration-300
                                                    ${isListening
                                                        ? 'bg-red-500/20 text-red-500 animate-pulse hover:bg-red-500/30'
                                                        : 'bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white hover:bg-neutral-800'
                                                    }
                                                `}
                                                onClick={() => {
                                                    if (isListening) {
                                                        stopListening()
                                                    } else {
                                                        startListening()
                                                        setAutoSpeak(true)
                                                        setVoiceMode(true)
                                                    }
                                                }}
                                            >
                                                {isListening ? <StopCircle size={20} /> : <Mic size={20} />}
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
                                                className="w-full bg-neutral-900 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/30 h-11 pr-12 rounded-xl"
                                                disabled={loading}
                                            />
                                            <Button
                                                onClick={() => handleSend()}
                                                disabled={!input.trim() || loading}
                                                className="absolute right-1 top-1 h-9 w-9 p-0 flex items-center justify-center bg-transparent hover:bg-white/10 text-white rounded-lg"
                                            >
                                                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Voice Status Indicator */}
                                    {(isSpeaking || autoSpeak) && hasSupport && (
                                        <div className="flex items-center justify-end mt-2 gap-3 text-xs font-mono">
                                            {isSpeaking && (
                                                <span className="flex items-center gap-1.5 text-[#CCFF00] animate-pulse">
                                                    <Volume2 size={12} /> Speaking...
                                                </span>
                                            )}
                                            {isListening && (
                                                <span className="flex items-center gap-1.5 text-red-500 animate-pulse">
                                                    <Mic size={12} /> Listening...
                                                </span>
                                            )}
                                            {isSpeaking && (
                                                <button
                                                    onClick={stopSpeaking}
                                                    className="flex items-center gap-1.5 text-neutral-400 hover:text-red-400 transition-colors"
                                                >
                                                    <StopCircle size={12} /> Stop
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    )
}
