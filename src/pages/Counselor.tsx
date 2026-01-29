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
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { sendChatMessage } from '@/lib/openrouter'
import type { ChatMessage, AIAction } from '@/lib/openrouter'

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
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const isOnboardingComplete = profile?.onboarding_complete

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    // Execute AI actions
    const executeAction = async (action: AIAction) => {
        try {
            switch (action.type) {
                case 'add_to_shortlist':
                    if (action.params?.university_name) {
                        // Create a minimal university object for shortlisting
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
                    // Add to Dashboard AI To-Do List
                    if (action.params?.title) {
                        const taskCategory = action.params?.category as 'exams' | 'documents' | 'general' || 'general'
                        await addTask(action.params?.title, taskCategory)
                        console.log(`✅ Added to To-Do List: ${action.params?.title}`)
                    }
                    break
                case 'add_app_task':
                    // Add to Guidance page Application Tasks (uses 'applications' category)
                    if (action.params?.title) {
                        await addTask(action.params?.title, 'applications')
                        console.log(`✅ Added to Application Tasks: ${action.params?.title}`)
                    }
                    break
                case 'analyze_profile':
                    // Profile analysis is informational - no action needed
                    console.log('📊 Profile analysis completed')
                    break
                case 'lock_university':
                    if (action.params?.university_name) {
                        // Find the university in shortlist by name
                        const uniToLock = shortlist.find(s =>
                            s.university?.name?.toLowerCase().includes(action.params?.university_name?.toLowerCase())
                        )
                        if (uniToLock) {
                            await lockUniversity(uniToLock.university_id)
                            console.log(`🔒 Locked ${uniToLock.university?.name} for application`)
                        } else {
                            console.log(`⚠️ University "${action.params?.university_name}" not found in shortlist`)
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
        const newMessages = [...messages, userMessage]
        setMessages(newMessages)
        setInput('')
        setLoading(true)

        try {
            // Save user message
            await supabase.from('chat_messages').insert({
                user_id: profile.user_id,
                role: 'user',
                content: messageText
            })

            const response = await sendChatMessage(newMessages, profile, shortlist)

            // Execute AI action if present
            if (response.action && response.action.type !== 'none') {
                await executeAction(response.action)
            }

            const assistantMessage: ChatMessage = { role: 'assistant', content: response.message }
            const updatedMessages = [...newMessages, assistantMessage]
            setMessages(updatedMessages)

            // Save assistant message
            await supabase.from('chat_messages').insert({
                user_id: profile.user_id,
                role: 'assistant',
                content: response.message
            })
        } catch (error) {
            console.error('Error:', error)
            setMessages([
                ...newMessages,
                { role: 'assistant', content: "I'm sorry, I encountered an error. Please try again." },
            ])
        } finally {
            setLoading(false)
        }
    }

    // Load initial messages
    useEffect(() => {
        if (profile?.user_id) {
            const fetchMessages = async () => {
                const { data, error } = await supabase
                    .from('chat_messages')
                    .select('*')
                    .eq('user_id', profile.user_id)
                    .order('created_at', { ascending: true })

                if (data) {
                    setMessages(data.map(msg => ({ role: msg.role as 'user' | 'assistant', content: msg.content })))
                }
            }
            fetchMessages()
        }
    }, [profile?.user_id])

    const handleQuickPrompt = (prompt: string) => {
        handleSend(prompt)
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="flex-1 flex flex-col max-w-[1400px] mx-auto w-full px-6 sm:px-8 lg:px-12 pt-24 pb-10 h-[calc(100dvh-2rem)]">
                {/* Header */}
                <div className="mb-6 border-b border-white/10 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-neutral-900 border border-white/10 flex items-center justify-center">
                            <Brain size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Counselor</h1>
                            <p className="text-neutral-400 font-mono text-sm uppercase tracking-wider">
                                Your personalized study abroad assistant
                            </p>
                        </div>
                    </div>
                </div>

                {/* Onboarding Incomplete Message */}
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
                    <>
                        {/* Chat Area */}
                        <Card className="flex-1 flex flex-col overflow-hidden bg-[#0A0A0A] border-white/10">
                            <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
                                {messages.length === 0 ? (
                                    <div className="min-h-full flex flex-col items-center justify-center text-center py-10 md:py-0">
                                        <div className="w-16 h-16 md:w-20 md:h-20 bg-neutral-900 border border-white/10 flex items-center justify-center mb-6 md:mb-8">
                                            <Sparkles size={28} className="text-white" />
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white">How can I help you today?</h2>
                                        <p className="text-neutral-400 mb-8 md:mb-10 max-w-md text-base md:text-lg leading-relaxed px-2">
                                            I'm your AI study abroad counselor. Ask me anything about universities,
                                            applications, scholarships, or visa processes.
                                        </p>
                                        <div className="grid md:grid-cols-2 gap-4 w-full max-w-2xl">
                                            {QUICK_PROMPTS.map((prompt, index) => (
                                                <Button
                                                    key={index}
                                                    variant="outline"
                                                    className="h-auto py-6 px-6 text-left justify-start gap-4 border-white/10 bg-neutral-900 hover:bg-neutral-800 hover:border-white/30 text-white group whitespace-normal"
                                                    onClick={() => handleQuickPrompt(prompt.text)}
                                                >
                                                    <div className="w-8 h-8 rounded bg-black border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors shrink-0">
                                                        <prompt.icon size={16} className="text-neutral-400 group-hover:text-white" />
                                                    </div>
                                                    <span className="text-sm font-medium">{prompt.text}</span>
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {messages.map((message, index) => (
                                            <div
                                                key={index}
                                                className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                                    }`}
                                            >
                                                {message.role === 'assistant' && (
                                                    <div className="w-8 h-8 bg-neutral-900 border border-white/10 flex items-center justify-center shrink-0">
                                                        <Brain size={14} className="text-white" />
                                                    </div>
                                                )}
                                                <div
                                                    className={`max-w-[80%] px-6 py-4 border ${message.role === 'user'
                                                        ? 'bg-white text-black border-white'
                                                        : 'bg-neutral-900 text-neutral-200 border-white/10'
                                                        }`}
                                                >
                                                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                                                </div>
                                                {message.role === 'user' && (
                                                    <div className="w-8 h-8 bg-white flex items-center justify-center shrink-0 text-black">
                                                        <User size={14} />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {loading && (
                                            <div className="flex gap-4 justify-start">
                                                <div className="w-8 h-8 bg-neutral-900 border border-white/10 flex items-center justify-center shrink-0">
                                                    <Brain size={14} className="text-white" />
                                                </div>
                                                <div className="bg-neutral-900 border border-white/10 px-6 py-4">
                                                    <Loader2 size={20} className="animate-spin text-neutral-500" />
                                                </div>
                                            </div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </>
                                )}
                            </CardContent>

                            {/* Profile Context Badge */}
                            {profile && (
                                <div className="px-6 py-3 border-t border-white/10 bg-neutral-900/50">
                                    <div className="flex flex-wrap gap-2 text-xs">
                                        <Badge variant="outline" className="border-white/10 text-neutral-400 bg-black">
                                            {profile.study_level || 'Study Level not set'}
                                        </Badge>
                                        {profile.gpa && <Badge variant="outline" className="border-white/10 text-neutral-400 bg-black">GPA: {profile.gpa}</Badge>}
                                        {profile.target_countries?.map((country) => (
                                            <Badge key={country} variant="outline" className="border-white/10 text-neutral-400 bg-black">
                                                {country}
                                            </Badge>
                                        ))}
                                        {shortlist.length > 0 && (
                                            <Badge variant="outline" className="border-white/10 text-neutral-400 bg-black">{shortlist.length} shortlisted</Badge>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Input */}
                            <div className="p-4 border-t border-white/10 bg-[#0A0A0A]">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault()
                                        handleSend()
                                    }}
                                    className="flex gap-4 max-w-4xl mx-auto"
                                >
                                    <Input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Ask me anything about studying abroad..."
                                        className="flex-1 bg-neutral-900 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/30 h-12"
                                        disabled={loading}
                                    />
                                    <Button
                                        type="submit"
                                        variant="sharp"
                                        disabled={!input.trim() || loading}
                                        className="h-12 w-12 p-0 flex items-center justify-center bg-white text-black hover:bg-neutral-200"
                                    >
                                        {loading ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <Send size={18} />
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </Card>
                    </>
                )}
            </main>
        </div>
    )
}
