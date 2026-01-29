import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
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
} from 'lucide-react'

interface OnboardingData {
    // Personal
    name: string
    email: string
    phone: string
    // Academic
    currentDegree: string
    major: string
    gpa: string
    educationBoard: string
    // Test Scores
    ielts: string
    toefl: string
    gre: string
    gmat: string
    sat: string
    // Financial
    budgetMin: string
    budgetMax: string
    fundingSource: string
    // Preferences
    targetCountries: string[]
    intakeYear: string
    intakeSeason: string
    studyLevel: string
    // Documents
    hasPassport: boolean
    hasTranscript: boolean
    hasSop: boolean
    hasLor: boolean
}

const STEPS = [
    { id: 1, title: 'Personal', icon: User },
    { id: 2, title: 'Academic', icon: BookOpen },
    { id: 3, title: 'Test Scores', icon: FileText },
    { id: 4, title: 'Financial', icon: DollarSign },
    { id: 5, title: 'Preferences', icon: Globe },
    { id: 6, title: 'Documents', icon: FileCheck },
]

const COUNTRIES = [
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'Germany',
    'France',
    'Netherlands',
    'Ireland',
    'New Zealand',
    'Singapore',
]

const STUDY_LEVELS = ['Bachelors', 'Masters', 'PhD', 'Diploma']
const FUNDING_SOURCES = ['Self-funded', 'Education Loan', 'Scholarship', 'Sponsorship', 'Mixed']
const INTAKE_SEASONS = ['Fall', 'Spring', 'Summer', 'Winter']

export default function Onboarding() {
    const { profile, updateProfile } = useAuth()
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(1)
    const [isVoiceMode, setIsVoiceMode] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const [voiceTranscript, setVoiceTranscript] = useState('')
    const recognitionRef = useRef<SpeechRecognition | null>(null)

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

    // Initialize Speech Recognition
    useEffect(() => {
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            recognitionRef.current = new SpeechRecognition()
            recognitionRef.current.continuous = true
            recognitionRef.current.interimResults = true

            recognitionRef.current.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map((result) => result[0].transcript)
                    .join('')
                setVoiceTranscript(transcript)
            }

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error)
                setIsListening(false)
            }

            recognitionRef.current.onend = () => {
                setIsListening(false)
            }
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop()
            }
        }
    }, [])

    const toggleVoice = () => {
        if (isListening) {
            recognitionRef.current?.stop()
            setIsListening(false)
            // Process voice transcript
            processVoiceInput(voiceTranscript)
        } else {
            setVoiceTranscript('')
            recognitionRef.current?.start()
            setIsListening(true)
        }
    }

    const processVoiceInput = (transcript: string) => {
        const lower = transcript.toLowerCase()

        // Parse voice input based on current step
        if (currentStep === 1) {
            // Try to extract phone number
            const phoneMatch = lower.match(/\d{10}/)
            if (phoneMatch) {
                setData(prev => ({ ...prev, phone: phoneMatch[0] }))
            }
        } else if (currentStep === 2) {
            // Extract GPA
            const gpaMatch = lower.match(/(\d+\.?\d*)\s*(gpa|cgpa|percentage)/i)
            if (gpaMatch) {
                setData(prev => ({ ...prev, gpa: gpaMatch[1] }))
            }
            // Extract major
            if (lower.includes('computer science')) {
                setData(prev => ({ ...prev, major: 'Computer Science' }))
            } else if (lower.includes('engineering')) {
                setData(prev => ({ ...prev, major: 'Engineering' }))
            }
        } else if (currentStep === 3) {
            // Extract test scores
            const ieltsMatch = lower.match(/ielts\s*(\d+\.?\d*)/i)
            if (ieltsMatch) setData(prev => ({ ...prev, ielts: ieltsMatch[1] }))

            const toeflMatch = lower.match(/toefl\s*(\d+)/i)
            if (toeflMatch) setData(prev => ({ ...prev, toefl: toeflMatch[1] }))

            const greMatch = lower.match(/gre\s*(\d+)/i)
            if (greMatch) setData(prev => ({ ...prev, gre: greMatch[1] }))
        } else if (currentStep === 4) {
            // Extract budget
            const budgetMatch = lower.match(/(\d+)\s*(thousand|k|lakh|lakhs)?/gi)
            if (budgetMatch && budgetMatch.length >= 1) {
                setData(prev => ({ ...prev, budgetMin: budgetMatch[0].replace(/\D/g, '') }))
                if (budgetMatch.length >= 2) {
                    setData(prev => ({ ...prev, budgetMax: budgetMatch[1].replace(/\D/g, '') }))
                }
            }
        } else if (currentStep === 5) {
            // Extract countries
            const countries: string[] = []
            COUNTRIES.forEach(country => {
                if (lower.includes(country.toLowerCase())) {
                    countries.push(country)
                }
            })
            if (countries.length > 0) {
                setData(prev => ({ ...prev, targetCountries: [...prev.targetCountries, ...countries] }))
            }
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
            try {
                // Save profile and navigate to dashboard
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

                if (error) {
                    throw error
                }

                navigate('/dashboard')
            } catch (error) {
                console.error('Error saving profile:', error)
                alert('Failed to save profile. Please try again.')
            }
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1)
        }
    }

    const progress = (currentStep / 6) * 100

    return (
        <div className="min-h-screen bg-transparent">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
                <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-white">
                        <GraduationCap size={24} />
                        <span className="font-bold text-lg tracking-tight">AI Counsellor</span>
                    </div>
                    <Button
                        variant={isVoiceMode ? 'accent' : 'sharp-outline'}
                        size="sm"
                        onClick={() => setIsVoiceMode(!isVoiceMode)}
                        className="gap-2"
                    >
                        {isVoiceMode ? <Mic size={16} /> : <MicOff size={16} />}
                        {isVoiceMode ? 'VOICE ON' : 'ENABLE VOICE'}
                    </Button>
                </div>
            </header>

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

                    {/* Voice Input Indicator */}
                    {isVoiceMode && isListening && (
                        <Card className="mb-8 bg-accent/5 border-accent/20">
                            <CardContent className="py-6">
                                <div className="flex items-center gap-6">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div
                                                key={i}
                                                className="w-1 bg-accent rounded-sm voice-bar"
                                                style={{ height: '24px' }}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-accent font-mono uppercase tracking-wider mb-1">Listening...</p>
                                        <p className="text-lg text-white">
                                            {voiceTranscript || 'Speak now...'}
                                        </p>
                                    </div>
                                    <Button variant="sharp-outline" size="sm" onClick={toggleVoice}>
                                        STOP
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

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

                    {/* Voice Mode Toggle Button (Mobile/Alt) */}
                    {isVoiceMode && !isListening && (
                        <div className="mt-8 text-center">
                            <Button
                                variant="sharp"
                                size="lg"
                                onClick={toggleVoice}
                                className="gap-2 px-8"
                            >
                                <Mic size={20} /> TAP TO SPEAK
                            </Button>
                        </div>
                    )}

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
        </div>
    )
}
