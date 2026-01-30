
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useVoice } from '@/hooks/useVoice'
import { speakWithElevenLabs, ELEVENLABS_DEFAULT_VOICE } from '@/lib/elevenlabs'
import { DEFAULT_MODEL, sendChatMessage } from '@/lib/openrouter' // Import DEFAULT_MODEL


import {
    GraduationCap,
    ArrowRight,
    ArrowLeft,
    Mic,
    MicOff,
    Check,
    User,
    BookOpen,
    FileText,
    DollarSign,
    Globe,
    FileCheck,
    Sparkles,
    Volume2,
    StopCircle
} from 'lucide-react'

// ... Keep Interfaces same ...
interface OnboardingData {
    name: string
    email: string
    phone: string
    currentDegree: string
    major: string
    gpa: string
    educationBoard: string
    ielts: string
    toefl: string
    gre: string
    gmat: string
    sat: string
    budgetMin: string
    budgetMax: string
    fundingSource: string
    targetCountries: string[]
    intakeYear: string
    intakeSeason: string
    studyLevel: string
    hasPassport: boolean
    hasTranscript: boolean
    hasSop: boolean
    hasLor: boolean
}

const STEPS = [
    { id: 1, title: 'Personal', icon: User, question: "Let's start! What is your full name, email address, and phone number?" },
    { id: 2, title: 'Academic', icon: BookOpen, question: "Great! What is your current degree and major? (e.g., Bachelors in CS)" },
    { id: 3, title: 'Test Scores', icon: FileText, question: "Have you taken any exams like IELTS, TOEFL, or GRE? If so, what were your scores?" },
    { id: 4, title: 'Financial', icon: DollarSign, question: "What is your estimated annual budget range in USD?" },
    { id: 5, title: 'Preferences', icon: Globe, question: "Which countries are you targeting for your studies?" },
    { id: 6, title: 'Documents', icon: FileCheck, question: "Finally, do you have your Passport or Transcripts ready?" },
]

const COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Netherlands', 'Ireland', 'New Zealand', 'Singapore']
const STUDY_LEVELS = ['Bachelors', 'Masters', 'PhD', 'Diploma']
const FUNDING_SOURCES = ['Self-funded', 'Education Loan', 'Scholarship', 'Sponsorship', 'Mixed']
const INTAKE_SEASONS = ['Fall', 'Spring', 'Summer', 'Winter']

export default function Onboarding() {
    const { profile, updateProfile } = useAuth()
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(1)
    const [isInterviewMode, setIsInterviewMode] = useState(false)
    const [aiProcessing, setAiProcessing] = useState(false)

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

    const [lastError, setLastError] = useState<string | null>(null)
    const [elevenLabsKey, setElevenLabsKey] = useState<string>(import.meta.env.VITE_ELEVENLABS_API_KEY || 'sk_cb3c82746aa4dd1aaa4f584a6100926bbab680b6a8f75a31')

    const speak = async (text: string) => {
        if (elevenLabsKey) {
            try {
                // User requested ONLY ElevenLabs
                await speakWithElevenLabs(text, { apiKey: elevenLabsKey, voiceId: ELEVENLABS_DEFAULT_VOICE })
            } catch (e: any) {
                console.error("ElevenLabs TTS failed", e)
                setLastError(`Voice Error: ${e.message || 'Check API Key'}`)
            }
        } else {
            // If no key provided, do we still use WebSpeech? User said "use only Elevenlabs".
            // Assuming if NO key, we might need to fallback or silent. 
            // But we have a key now. So mostly this path won't be hit.
            webSpeak(text)
        }
    }




    const [data, setData] = useState<OnboardingData>({
        name: profile?.name || '',
        email: profile?.email || '',
        phone: profile?.phone || '',
        currentDegree: profile?.current_degree || '',
        major: profile?.major || '',
        gpa: profile?.gpa?.toString() || '',
        educationBoard: profile?.education_board || '',
        ielts: profile?.ielts?.toString() || '',
        toefl: profile?.toefl?.toString() || '',
        gre: profile?.gre?.toString() || '',
        gmat: profile?.gmat?.toString() || '',
        sat: profile?.sat?.toString() || '',
        budgetMin: profile?.budget_min?.toString() || '',
        budgetMax: profile?.budget_max?.toString() || '',
        fundingSource: profile?.funding_source || '',
        targetCountries: profile?.target_countries || [],
        intakeYear: profile?.intake_year || '',
        intakeSeason: profile?.intake_season || '',
        studyLevel: profile?.study_level || '',
        hasPassport: profile?.has_passport || false,
        hasTranscript: profile?.has_transcript || false,
        hasSop: profile?.has_sop || false,
        hasLor: profile?.has_lor || false,
    })

    // Start Interview Mode logic
    useEffect(() => {
        if (isInterviewMode && !isSpeaking && !isListening && !aiProcessing) {
            // Speak current question with slight delay
            const timer = setTimeout(() => {
                const step = STEPS.find(s => s.id === currentStep)
                if (step) {
                    speak(step.question)
                }
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [isInterviewMode, currentStep])

    // Auto-listen after speaking? (Optional, maybe manual click is safer for now)

    // Process transcript when full? We need a manual "Done" or wait for silence.
    // For now, let's use a "Process Answer" button in interview mode or manual toggle.

    const processAnswer = async () => {
        if (!transcript) return
        stopListening()
        setAiProcessing(true)
        const fieldsMap: Record<number, string[]> = {
            1: ['name', 'phone', 'email'],
            2: ['currentDegree', 'major', 'gpa', 'educationBoard'],
            3: ['ielts', 'toefl', 'gre', 'gmat', 'sat'],
            4: ['budgetMin', 'budgetMax', 'fundingSource'],
            5: ['targetCountries', 'intakeYear', 'intakeSeason', 'studyLevel'],
            6: ['hasPassport', 'hasTranscript', 'hasSop', 'hasLor']
        }
        const targetFields = fieldsMap[currentStep] || []

        // Construct a prompt for the AI to extract data
        const extractionPrompt = `
        You are an intelligent data extractor. 
        Current Step: ${currentStep} (${STEPS[currentStep - 1].title}).
        User Input: "${transcript}"
        
        Extract relevant fields for this step into JSON format.
        
        FIELDS TO SEARCH FOR BY STEP:
        Step 1 (Personal): name, phone, email.
        Step 2 (Academic): currentDegree, major, gpa (number), educationBoard.
        Step 3 (Tests): ielts, toefl, gre, gmat, sat (all numbers).
        Step 4 (Financial): budgetMin, budgetMax, fundingSource.
        Step 5 (Preferences): targetCountries (array), intakeYear, intakeSeason, studyLevel.
        Step 6 (Documents): hasPassport, hasTranscript, hasSop, hasLor (booleans).

        Return ONLY a legitimate JSON object. Do not wrap in markdown.
        Example: {"name": "John", "phone": "1234567890"}
        `

        try {
            const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY
            if (!API_KEY) {
                console.error("Missing VITE_OPENROUTER_API_KEY")
                throw new Error("No API Key configured")
            }

            console.log("Processing transcript with model:", DEFAULT_MODEL)

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'AI Study Counselor',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'openai/gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'user',
                            content: `TASK: Extract data from user input into JSON.
                            CONTEXT: Step ${currentStep} (${STEPS[currentStep - 1].title}).
                            INPUT: "${transcript}"
                            TARGET FIELDS: ${targetFields.join(', ')}
                            
                            Return ONLY valid JSON. No markdown.`
                        }
                    ],
                    temperature: 0.1
                })
            })

            if (!response.ok) {
                const errText = await response.text()
                console.error("OpenRouter API Error:", response.status, errText)
                throw new Error(`API Error: ${response.status}`)
            }

            const json = await response.json()
            const content = json.choices?.[0]?.message?.content || ""

            console.log("AI Raw Response:", content)

            // Robust JSON extraction: Find { ... }
            const jsonMatch = content.match(/\{[\s\S]*\}/)
            if (!jsonMatch) {
                throw new Error("No JSON found in response")
            }

            const cleanJson = jsonMatch[0]
            const extractedData = JSON.parse(cleanJson)

            console.log("Extracted Data:", extractedData)

            // Merge data
            setData(prev => ({ ...prev, ...extractedData }))

            // Give feedback
            speak("Got it!")

            // Wait then Move next
            setTimeout(() => {
                handleNext()
                resetTranscript()
            }, 1000)

        } catch (e: any) {
            console.error("Extraction failed", e)
            setLastError(e.message || "Unknown error")
            speak("I'm sorry, I had trouble connecting. Please check the error on screen.")
        } finally {
            setAiProcessing(false)
        }
    }


    const updateField = (field: keyof OnboardingData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }))
    }

    const toggleCountry = (country: string) => {
        setData(prev => ({
            ...prev,
            targetCountries: prev.targetCountries.includes(country)
                ? prev.targetCountries.filter(c => c !== country)
                : [...prev.targetCountries, country]
        }))
    }
    const handleNext = async () => {
        if (currentStep < 6) {
            setCurrentStep(prev => prev + 1)
        } else {
            finishOnboarding()
        }
    }

    const finishOnboarding = async () => {
        try {
            const { error } = await updateProfile({
                name: data.name,
                email: data.email,
                phone: data.phone,
                current_degree: data.currentDegree,
                major: data.major,
                gpa: data.gpa ? parseFloat(data.gpa) : undefined,
                education_board: data.educationBoard,
                ielts: data.ielts ? parseFloat(data.ielts) : undefined,
                toefl: data.toefl ? parseInt(data.toefl) : undefined,
                gre: data.gre ? parseInt(data.gre) : undefined,
                gmat: data.gmat ? parseInt(data.gmat) : undefined,
                sat: data.sat ? parseInt(data.sat) : undefined,
                budget_min: data.budgetMin ? parseInt(data.budgetMin) : undefined,
                budget_max: data.budgetMax ? parseInt(data.budgetMax) : undefined,
                funding_source: data.fundingSource,
                target_countries: data.targetCountries,
                intake_year: data.intakeYear,
                intake_season: data.intakeSeason,
                study_level: data.studyLevel,
                has_passport: data.hasPassport,
                has_transcript: data.hasTranscript,
                has_sop: data.hasSop,
                has_lor: data.hasLor,
                onboarding_complete: true,
            })

            if (error) throw error
            navigate('/dashboard')
        } catch (error) {
            console.error('Error saving profile:', error)
            alert('Failed to save profile. Please try again.')
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1)
        }
    }

    const progress = (currentStep / 6) * 100

    return (
        <div className="min-h-screen bg-transparent relative">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
                <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-white">
                        <GraduationCap size={24} />
                        <span className="font-bold text-lg tracking-tight">AI Counsellor</span>
                    </div>
                    <Button
                        variant={isInterviewMode ? 'accent' : 'sharp-outline'}
                        size="sm"
                        onClick={() => {
                            const newState = !isInterviewMode
                            setIsInterviewMode(newState)
                            if (newState) {
                                resetTranscript()
                                // speak() is handled by useEffect
                            } else {
                                stopSpeaking()
                                stopListening()
                            }
                        }}
                        className="gap-2"
                    >
                        {isInterviewMode ? <Sparkles size={16} /> : <Mic size={16} />}
                        {isInterviewMode ? 'INTERVIEW MODE ON' : 'AI INTERVIEW MODE'}
                    </Button>
                </div>
            </header>

            {/* INTERVIEW MODE OVERLAY */}
            {isInterviewMode ? (
                <div className="fixed inset-0 pt-32 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center">
                    <div className="max-w-2xl w-full space-y-12 animate-in fade-in zoom-in duration-300">
                        {/* Status Icon */}
                        <div className="mx-auto w-32 h-32 rounded-full border border-white/10 flex items-center justify-center relative">
                            <div className={`absolute inset-0 rounded-full bg-[#CCFF00]/10 ${isSpeaking ? 'animate-ping' : ''}`} />
                            <div className="relative z-10 p-6 bg-[#0A0A0A] rounded-full border border-white/20">
                                {isListening ? (
                                    <Mic className="text-red-500 animate-pulse" size={40} />
                                ) : isSpeaking ? (
                                    <Volume2 className="text-[#CCFF00] animate-pulse" size={40} />
                                ) : (
                                    <Sparkles className="text-white" size={40} />
                                )}
                            </div>
                        </div>

                        {/* Question / Transcript */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-light text-white leading-relaxed">
                                {isListening && transcript ? `"${transcript}"` : STEPS[currentStep - 1].question}
                            </h2>
                            {lastError && (
                                <div className="text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20 mb-4 animate-in fade-in slide-in-from-bottom-2">
                                    <p className="font-mono text-xs mb-1">ERROR</p>
                                    {lastError}
                                </div>
                            )}
                            {aiProcessing && (
                                <p className="text-[#CCFF00] font-mono animate-pulse">Processing answer...</p>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="flex justify-center gap-6">
                            {isListening ? (
                                <Button
                                    onClick={processAnswer}
                                    className="h-16 px-8 rounded-full text-lg bg-red-500 hover:bg-red-600 text-white border-none"
                                >
                                    <StopCircle className="mr-2" /> Stop & Process
                                </Button>
                            ) : (
                                <Button
                                    onClick={startListening}
                                    disabled={aiProcessing || isSpeaking}
                                    className="h-16 px-8 rounded-full text-lg bg-white text-black hover:bg-neutral-200 border-none"
                                >
                                    <Mic className="mr-2" /> Tap to Speak
                                </Button>
                            )}

                            <Button
                                variant="outline"
                                className="h-16 w-16 rounded-full"
                                onClick={handleNext}
                            >
                                <ArrowRight />
                            </Button>
                        </div>

                        <p className="text-neutral-500 text-sm">
                            Step {currentStep} of 6 • Manual overrides available by closing Interview Mode
                        </p>
                    </div>
                </div>
            ) : (
                <main className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 pt-32 pb-20">
                    <div className="max-w-4xl mx-auto">
                        {/* Progress */}
                        <div className="mb-12">
                            <div className="flex justify-between mb-6 overflow-x-auto pb-2 md:pb-0">
                                {STEPS.map((step) => (
                                    <div
                                        key={step.id}
                                        className={`flex flex-col items-center gap-3 min-w-[80px] ${step.id <= currentStep ? 'text-white' : 'text-neutral-600'
                                            }`}
                                    >
                                        <div
                                            className={`w-12 h-12 flex items-center justify-center border transition-all duration-300 ${step.id < currentStep
                                                ? 'bg-neutral-900 border-white/20 text-white'
                                                : step.id === currentStep
                                                    ? 'bg-white text-black border-white'
                                                    : 'bg-transparent border-white/5 text-neutral-600'
                                                }`}
                                        >
                                            {step.id < currentStep ? (
                                                <Check size={20} />
                                            ) : (
                                                <step.icon size={20} />
                                            )}
                                        </div>
                                        <span className="text-[10px] font-mono uppercase tracking-widest hidden sm:block">
                                            {step.title}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <Progress value={progress} className="h-1 bg-neutral-800" />
                        </div>

                        {/* Step Content */}
                        <Card className="bg-[#0A0A0A] border-white/10">
                            <CardHeader className="border-b border-white/5 pb-6">
                                <CardTitle className="text-2xl font-bold text-white">
                                    {STEPS[currentStep - 1].title}
                                </CardTitle>
                                <CardDescription className="text-neutral-400 mt-2">
                                    {currentStep === 1 && 'Tell us about yourself'}
                                    {currentStep === 2 && 'Share your educational background'}
                                    {currentStep === 3 && 'Enter your standardized test scores (optional)'}
                                    {currentStep === 4 && 'Set your budget and funding preferences'}
                                    {currentStep === 5 && 'Choose your target countries and intake'}
                                    {currentStep === 6 && 'Check your document readiness'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8 pt-8">
                                {/* Step 1: Personal */}
                                {currentStep === 1 && (
                                    <>
                                        <div className="space-y-3">
                                            <Label className="text-xs font-mono uppercase tracking-wider text-neutral-500">Full Name</Label>
                                            <Input
                                                value={data.name}
                                                onChange={(e) => updateField('name', e.target.value)}
                                                placeholder="John Doe"
                                                className="bg-neutral-900 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/30 h-12"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-xs font-mono uppercase tracking-wider text-neutral-500">Email Address</Label>
                                            <Input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => updateField('email', e.target.value)}
                                                placeholder="you@example.com"
                                                className="bg-neutral-900 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/30 h-12"

                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-xs font-mono uppercase tracking-wider text-neutral-500">Phone Number</Label>
                                            <Input
                                                type="tel"
                                                value={data.phone}
                                                onChange={(e) => updateField('phone', e.target.value)}
                                                placeholder="+1 234 567 8900"
                                                className="bg-neutral-900 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/30 h-12"
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Step 2: Academic */}
                                {currentStep === 2 && (
                                    <>
                                        <div className="space-y-3">
                                            <Label className="text-xs font-mono uppercase tracking-wider text-neutral-500">Current/Highest Degree</Label>
                                            <Input
                                                value={data.currentDegree}
                                                onChange={(e) => updateField('currentDegree', e.target.value)}
                                                placeholder="Bachelor's in Computer Science"
                                                className="bg-neutral-900 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/30 h-12"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-xs font-mono uppercase tracking-wider text-neutral-500">Major/Field of Study</Label>
                                            <Input
                                                value={data.major}
                                                onChange={(e) => updateField('major', e.target.value)}
                                                placeholder="Computer Science"
                                                className="bg-neutral-900 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/30 h-12"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <Label className="text-xs font-mono uppercase tracking-wider text-neutral-500">GPA/CGPA</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.gpa}
                                                    onChange={(e) => updateField('gpa', e.target.value)}
                                                    placeholder="3.5 or 85%"
                                                    className="bg-neutral-900 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/30 h-12"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-xs font-mono uppercase tracking-wider text-neutral-500">Education Board</Label>
                                                <Input
                                                    value={data.educationBoard}
                                                    onChange={(e) => updateField('educationBoard', e.target.value)}
                                                    placeholder="CBSE, ICSE, etc."
                                                    className="bg-neutral-900 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/30 h-12"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Step 3: Test Scores */}
                                {currentStep === 3 && (
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <Label className="text-xs font-mono uppercase tracking-wider text-neutral-500">IELTS Score</Label>
                                            <Input
                                                type="number"
                                                step="0.5"
                                                max="9"
                                                value={data.ielts}
                                                onChange={(e) => updateField('ielts', e.target.value)}
                                                placeholder="7.5"
                                                className="bg-neutral-900 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/30 h-12"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-xs font-mono uppercase tracking-wider text-neutral-500">TOEFL Score</Label>
                                            <Input
                                                type="number"
                                                max="120"
                                                value={data.toefl}
                                                onChange={(e) => updateField('toefl', e.target.value)}
                                                placeholder="100"
                                                className="bg-neutral-900 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/30 h-12"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-xs font-mono uppercase tracking-wider text-neutral-500">GRE Score</Label>
                                            <Input
                                                type="number"
                                                max="340"
                                                value={data.gre}
                                                onChange={(e) => updateField('gre', e.target.value)}
                                                placeholder="320"
                                                className="bg-neutral-900 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/30 h-12"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-xs font-mono uppercase tracking-wider text-neutral-500">GMAT Score</Label>
                                            <Input
                                                type="number"
                                                max="800"
                                                value={data.gmat}
                                                onChange={(e) => updateField('gmat', e.target.value)}
                                                placeholder="700"
                                                className="bg-neutral-900 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/30 h-12"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-xs font-mono uppercase tracking-wider text-neutral-500">SAT Score</Label>
                                            <Input
                                                type="number"
                                                max="1600"
                                                value={data.sat}
                                                onChange={(e) => updateField('sat', e.target.value)}
                                                placeholder="1400"
                                                className="bg-neutral-900 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/30 h-12"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Financial */}
                                {currentStep === 4 && (
                                    <>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <Label className="text-xs font-mono uppercase tracking-wider text-neutral-500">Min Budget (USD)</Label>
                                                <Input
                                                    type="number"
                                                    value={data.budgetMin}
                                                    onChange={(e) => updateField('budgetMin', e.target.value)}
                                                    placeholder="20000"
                                                    className="bg-neutral-900 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/30 h-12"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-xs font-mono uppercase tracking-wider text-neutral-500">Max Budget (USD)</Label>
                                                <Input
                                                    type="number"
                                                    value={data.budgetMax}
                                                    onChange={(e) => updateField('budgetMax', e.target.value)}
                                                    placeholder="50000"
                                                    className="bg-neutral-900 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/30 h-12"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-xs font-mono uppercase tracking-wider text-neutral-500">Funding Source</Label>
                                            <div className="flex flex-wrap gap-3">
                                                {FUNDING_SOURCES.map((source) => (
                                                    <Badge
                                                        key={source}
                                                        variant={data.fundingSource === source ? 'secondary' : 'outline'}
                                                        className={`cursor-pointer px-4 py-2 border-white/10 ${data.fundingSource === source
                                                            ? 'bg-neutral-800 text-white'
                                                            : 'text-neutral-400 hover:text-white hover:border-white/30'
                                                            }`}
                                                        onClick={() => updateField('fundingSource', source)}
                                                    >
                                                        {source}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Step 5: Preferences */}
                                {currentStep === 5 && (
                                    <>
                                        <div className="space-y-3">
                                            <Label className="text-xs font-mono uppercase tracking-wider text-neutral-500">Target Countries</Label>
                                            <div className="flex flex-wrap gap-3">
                                                {COUNTRIES.map((country) => (
                                                    <Badge
                                                        key={country}
                                                        variant={data.targetCountries.includes(country) ? 'secondary' : 'outline'}
                                                        className={`cursor-pointer px-4 py-2 border-white/10 ${data.targetCountries.includes(country)
                                                            ? 'bg-neutral-800 text-white'
                                                            : 'text-neutral-400 hover:text-white hover:border-white/30'
                                                            }`}
                                                        onClick={() => toggleCountry(country)}
                                                    >
                                                        {country}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-3">
                                                <Label className="text-xs font-mono uppercase tracking-wider text-neutral-500">Intake Year</Label>
                                                <Input
                                                    value={data.intakeYear}
                                                    onChange={(e) => updateField('intakeYear', e.target.value)}
                                                    placeholder="2025"
                                                    className="bg-neutral-900 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/30 h-12"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-xs font-mono uppercase tracking-wider text-neutral-500">Intake Season</Label>
                                                <div className="flex flex-wrap gap-2">
                                                    {INTAKE_SEASONS.map((season) => (
                                                        <Badge
                                                            key={season}
                                                            variant={data.intakeSeason === season ? 'secondary' : 'outline'}
                                                            className={`cursor-pointer px-3 py-1 text-xs border-white/10 ${data.intakeSeason === season
                                                                ? 'bg-neutral-800 text-white'
                                                                : 'text-neutral-400 hover:text-white hover:border-white/30'
                                                                }`}
                                                            onClick={() => updateField('intakeSeason', season)}
                                                        >
                                                            {season}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-xs font-mono uppercase tracking-wider text-neutral-500">Study Level</Label>
                                                <div className="flex flex-wrap gap-2">
                                                    {STUDY_LEVELS.map((level) => (
                                                        <Badge
                                                            key={level}
                                                            variant={data.studyLevel === level ? 'secondary' : 'outline'}
                                                            className={`cursor-pointer px-3 py-1 text-xs border-white/10 ${data.studyLevel === level
                                                                ? 'bg-neutral-800 text-white'
                                                                : 'text-neutral-400 hover:text-white hover:border-white/30'
                                                                }`}
                                                            onClick={() => updateField('studyLevel', level)}
                                                        >
                                                            {level}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Step 6: Documents */}
                                {currentStep === 6 && (
                                    <div className="space-y-4">
                                        <p className="text-sm text-neutral-400">
                                            Check the documents you already have ready:
                                        </p>
                                        {[
                                            { key: 'hasPassport', label: 'Valid Passport' },
                                            { key: 'hasTranscript', label: 'Academic Transcripts' },
                                            { key: 'hasSop', label: 'Statement of Purpose (SOP)' },
                                            { key: 'hasLor', label: 'Letters of Recommendation (LOR)' },
                                        ].map((doc) => (
                                            <div
                                                key={doc.key}
                                                className={`p-5 rounded-none border cursor-pointer transition-all duration-200 flex items-center gap-4 ${data[doc.key as keyof OnboardingData]
                                                    ? 'bg-neutral-900 border-white/30'
                                                    : 'bg-[#0A0A0A] border-white/10 hover:border-white/20'
                                                    }`}
                                                onClick={() => updateField(doc.key as keyof OnboardingData, !data[doc.key as keyof OnboardingData])}
                                            >
                                                <div
                                                    className={`w-6 h-6 flex items-center justify-center border ${data[doc.key as keyof OnboardingData]
                                                        ? 'bg-white border-white text-black'
                                                        : 'bg-transparent border-neutral-600'
                                                        }`}
                                                >
                                                    {data[doc.key as keyof OnboardingData] && <Check size={14} />}
                                                </div>
                                                <span className={`font-medium ${data[doc.key as keyof OnboardingData] ? 'text-white' : 'text-neutral-400'}`}>
                                                    {doc.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Navigation */}
                        <div className="flex justify-between mt-10">
                            <Button
                                variant="sharp-outline"
                                onClick={handleBack}
                                disabled={currentStep === 1}
                                className="gap-2 w-32 cursor-pointer"
                            >
                                <ArrowLeft size={18} /> BACK
                            </Button>
                            <Button variant="sharp" onClick={handleNext} className="gap-2 px-8 cursor-pointer">
                                {currentStep === 6 ? 'COMPLETE SETUP' : 'NEXT'} <ArrowRight size={18} />
                            </Button>
                        </div>
                    </div>
                </main>
            )}
        </div>
    )
}
