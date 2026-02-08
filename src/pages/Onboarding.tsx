
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
import { speakWithElevenLabs, stopElevenLabsSpeech, ELEVENLABS_DEFAULT_VOICE } from '@/lib/elevenlabs'
import {
    GraduationCap,
    ArrowRight,
    Mic,
    Check,
    User,
    BookOpen,
    FileText,
    DollarSign,
    Globe,
    FileCheck,
    Sparkles,
    Volume2,
    StopCircle,
    X
} from 'lucide-react'

// ... Keep Interfaces same ...
interface OnboardingData {
    name: string
    email: string
    phone: string
    previousDegree: string
    graduationYear: string
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
    { id: 1, title: 'Personal', icon: User, question: "Let's start! What is your full name?" },
    { id: 2, title: 'Academic', icon: BookOpen, question: "What is your highest completed degree? For example, Bachelor's, Master's, or BTech." },
    { id: 3, title: 'Test Scores', icon: FileText, question: "Have you taken IELTS, TOEFL, GRE, or any other exam? Just say the name and score." },
    { id: 4, title: 'Financial', icon: DollarSign, question: "What's your approximate annual budget in USD for studying abroad?" },
    { id: 5, title: 'Preferences', icon: Globe, question: "Which countries would you like to study in? You can mention multiple countries." },
    { id: 6, title: 'Documents', icon: FileCheck, question: "Do you have your passport ready? Say yes or no." },
]

const COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Netherlands', 'Ireland', 'New Zealand', 'Singapore']
const STUDY_LEVELS = ['Bachelors', 'Masters', 'PhD', 'Diploma']
const FUNDING_SOURCES = ['Self-funded', 'Education Loan', 'Scholarship', 'Sponsorship', 'Mixed']
const INTAKE_SEASONS = ['Fall', 'Spring', 'Summer', 'Winter']

export default function Onboarding() {
    const { profile, updateProfile } = useAuth()
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(0) // Start at Step 0 for Selection
    const [subStep, setSubStep] = useState(0)
    const [isInterviewMode, setIsInterviewMode] = useState(false)
    const [aiProcessing, setAiProcessing] = useState(false)
    const [selectedMode, setSelectedMode] = useState<'manual' | 'ai' | null>(null)
    const [showAiIntro, setShowAiIntro] = useState(false) // Step 0.5: AI Intro Screen

    // Voice Hook
    const {
        isListening,
        transcript,
        startListening,
        stopListening,
        speak: webSpeak,
        stopSpeaking,
        isSpeaking,
        resetTranscript
    } = useVoice()

    const [lastError, setLastError] = useState<string | null>(null)
    const [isSpeakingElevenLabs, setIsSpeakingElevenLabs] = useState(false)
    const hasSpokenRef = useRef(false)

    // Auto-dismiss error notification after 5 seconds
    useEffect(() => {
        if (lastError) {
            const timer = setTimeout(() => {
                setLastError(null)
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [lastError])

    const speak = async (text: string) => {
        setIsSpeakingElevenLabs(true)
        try {
            await speakWithElevenLabs(text, { voiceId: ELEVENLABS_DEFAULT_VOICE })
        } catch (e: any) {
            console.error("ElevenLabs TTS failed", e)
            setLastError('Using basic voice (ElevenLabs credits exhausted)')
            // Fallback to web speech
            webSpeak(text)
        } finally {
            setIsSpeakingElevenLabs(false)
        }
    }

    const [data, setData] = useState<OnboardingData>({
        name: profile?.name || '',
        email: profile?.email || '',
        phone: profile?.phone || '',
        previousDegree: profile?.previous_degree || '',
        graduationYear: profile?.graduation_year || '',
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
        // Reset hasSpoken when step changes
        hasSpokenRef.current = false
    }, [currentStep, subStep])

    useEffect(() => {
        if (isInterviewMode && !isSpeakingElevenLabs && !isSpeaking && !isListening && !aiProcessing && !hasSpokenRef.current) {
            const timer = setTimeout(() => {
                const step = STEPS.find(s => s.id === currentStep)
                if (step) {
                    hasSpokenRef.current = true
                    let questionToAsk = step.question
                    
                    // Personal info substeps
                    if (currentStep === 1) {
                        if (subStep === 0) questionToAsk = "Let's start! What is your full name?"
                        else if (subStep === 1) questionToAsk = "Great! And what is your email address?"
                        else if (subStep === 2) questionToAsk = "Finally for this section, what is your phone number?"
                    }
                    
                    // Academic substeps
                    if (currentStep === 2) {
                        if (subStep === 0) questionToAsk = "What is your highest completed degree? For example, Bachelor's, Master's, or BTech."
                        else if (subStep === 1) questionToAsk = "What degree do you want to pursue next, and in which field? For example, Master's in Computer Science."
                    }
                    
                    // Documents substeps
                    if (currentStep === 6) {
                        if (subStep === 0) questionToAsk = "Do you have your passport ready? Say yes or no."
                        else if (subStep === 1) questionToAsk = "Do you have your academic transcripts? Say yes or no."
                        else if (subStep === 2) questionToAsk = "Do you have your Statement of Purpose? Say yes or no."
                        else if (subStep === 3) questionToAsk = "Do you have your Letters of Recommendation? Say yes or no."
                    }
                    
                    console.log(`🎤 ASKING QUESTION - Step ${currentStep}, SubStep ${subStep}:`, questionToAsk)
                    speak(questionToAsk)
                }
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [isInterviewMode, currentStep, subStep, isSpeakingElevenLabs, isSpeaking, isListening, aiProcessing])

    const processAnswer = async () => {
        if (!transcript) return
        stopListening()
        setAiProcessing(true)
        const fieldsMap: Record<number, string[]> = {
            1: ['name', 'email', 'phone'],
            2: ['previousDegree', 'graduationYear', 'currentDegree', 'major', 'gpa', 'educationBoard'],
            3: ['ielts', 'toefl', 'gre', 'gmat', 'sat'],
            4: ['budgetMin', 'budgetMax', 'fundingSource'],
            5: ['targetCountries', 'intakeYear', 'intakeSeason', 'studyLevel'],
            6: ['hasPassport', 'hasTranscript', 'hasSop', 'hasLor']
        }
        let targetFields = fieldsMap[currentStep] || []

        if (currentStep === 1) {
            if (subStep === 0) targetFields = ['name']
            else if (subStep === 1) targetFields = ['email']
            else if (subStep === 2) targetFields = ['phone']
        }
        
        if (currentStep === 2) {
            if (subStep === 0) targetFields = ['previousDegree']
            else if (subStep === 1) targetFields = ['currentDegree', 'major']
        }
        
        if (currentStep === 6) {
            if (subStep === 0) targetFields = ['hasPassport']
            else if (subStep === 1) targetFields = ['hasTranscript']
            else if (subStep === 2) targetFields = ['hasSop']
            else if (subStep === 3) targetFields = ['hasLor']
        }

        // For boolean fields (documents), try direct inference first to avoid API calls
        if (targetFields.length === 1 && targetFields[0].startsWith('has')) {
            const field = targetFields[0]
            const lowerTranscript = transcript.toLowerCase().trim()
            
            console.log(`🎯 Direct boolean inference for ${field}`)
            
            // Check for positive words
            const positiveWords = ['yes', 'yeah', 'yep', 'yup', 'ready', 'have', 'got', 'sure']
            const hasPositive = positiveWords.some(word => lowerTranscript === word || lowerTranscript.includes(word))
            
            // Check for negative words
            const negativeWords = ['no', 'nope', 'nah', 'not']
            const hasNegative = negativeWords.some(word => lowerTranscript === word || lowerTranscript.includes(word))
            
            if (hasPositive && !hasNegative) {
                console.log(`✅ Direct inference: ${field} = true`)
                updateField(field as keyof OnboardingData, true)
                speak("Got it!")
                
                if (isInterviewMode) {
                    setTimeout(() => {
                        if (currentStep === 6) {
                            subStep < 3 ? setSubStep(prev => prev + 1) : handleNext()
                        } else {
                            handleNext()
                        }
                    }, 1000)
                }
                
                setAiProcessing(false)
                resetTranscript()
                return
            } else if (hasNegative) {
                console.log(`✅ Direct inference: ${field} = false`)
                updateField(field as keyof OnboardingData, false)
                speak("Got it!")
                
                if (isInterviewMode) {
                    setTimeout(() => {
                        if (currentStep === 6) {
                            subStep < 3 ? setSubStep(prev => prev + 1) : handleNext()
                        } else {
                            handleNext()
                        }
                    }, 1000)
                }
                
                setAiProcessing(false)
                resetTranscript()
                return
            }
        }

        try {
            // Build detailed instructions for boolean fields
            const booleanFieldsInstructions = targetFields.filter(f => f.startsWith('has')).length > 0
                ? `\n\nIMPORTANT FOR BOOLEAN FIELDS (hasPassport, hasTranscript, hasSop, hasLor):
CRITICAL: Listen for ANY positive or negative response and convert appropriately.

POSITIVE responses (set to true):
- "yes", "yeah", "yep", "yup", "sure", "correct"
- "ready", "have it", "got it", "I have", "I have it"
- "done", "prepared", "available", "complete"
- "already have", "already got"

NEGATIVE responses (set to false):
- "no", "nope", "nah", "not yet", "not really"
- "not ready", "don't have", "haven't", "haven't got"
- "need to get", "working on it", "in progress"
- "don't have it", "not available", "not prepared"

THESE MUST BE ACTUAL BOOLEAN VALUES (true/false), NOT STRINGS.

EXAMPLES:
User says: "yes" → {"hasPassport": true}
User says: "ready" → {"hasPassport": true}
User says: "I have it" → {"hasPassport": true}
User says: "no" → {"hasPassport": false}
User says: "not yet" → {"hasPassport": false}
User says: "not ready" → {"hasPassport": false}`
                : '';

            // Special instructions for array fields
            const arrayFieldsInstructions = targetFields.includes('targetCountries')
                ? `\n\nIMPORTANT FOR targetCountries (ARRAY FIELD):
- Extract ALL countries mentioned by the user
- Return as an array of strings: ["United States", "United Kingdom", "Canada"]
- Common variations: "US" or "USA" → "United States", "UK" → "United Kingdom"
- If user lists multiple countries, include ALL of them in the array`
                : '';

            // Field name clarifications
            let fieldClarifications = '';
            if (currentStep === 2) {
                if (subStep === 0) {
                    fieldClarifications = `\n\nFIELD CLARIFICATIONS FOR STEP 2 - SUBSTEP 0:
- previousDegree: The degree the user ALREADY COMPLETED (normalize to standard form)
  Examples: "BTech"/"B.Tech"/"Bachelor of Technology" → "Bachelor's"
            "BE"/"B.E." → "Bachelor's"
            "B.Sc"/"BSc" → "Bachelor's"
            "BA"/"B.A." → "Bachelor's"
            "M.Sc"/"MSc" → "Master's"
            "MBA" → "MBA"

EXAMPLE:
User says: "I have a BTech degree"
Response: {"previousDegree": "Bachelor's"}

User says: "Bachelor's"
Response: {"previousDegree": "Bachelor's"}`;
                } else if (subStep === 1) {
                    fieldClarifications = `\n\nFIELD CLARIFICATIONS FOR STEP 2 - SUBSTEP 1:
- currentDegree: The degree the user WANTS TO PURSUE (normalize to standard form)
  Examples: "MS"/"M.S."/"MSc"/"Masters" → "Master's"
            "MBA" → "MBA" (keep as is)
            "PhD"/"Ph.D"/"Doctorate" → "PhD"
            "Bachelors" → "Bachelor's"
- major: The field of study for the degree they want to pursue (FULL NAME)
  Examples: "CS" → "Computer Science"
            "ECE" → "Electronics and Communication Engineering"
            "EE" → "Electrical Engineering"
            "IT" → "Information Technology"

EXAMPLES:
User says: "I want to do MS in Computer Science"
Response: {"currentDegree": "Master's", "major": "Computer Science"}

User says: "Masters in CS"
Response: {"currentDegree": "Master's", "major": "Computer Science"}

User says: "MBA in Finance"
Response: {"currentDegree": "MBA", "major": "Finance"}`;
                }
            }

            const prompt = `You are a strict data extraction assistant.
TASK: Extract specific data fields from the user's spoken input into a JSON object.

CONTEXT: Step ${currentStep} - ${STEPS[currentStep - 1].title}
USER INPUT: "${transcript}"
TARGET FIELDS TO EXTRACT: ${targetFields.join(', ')}${booleanFieldsInstructions}${arrayFieldsInstructions}${fieldClarifications}

INSTRUCTIONS:
1. Extract ONLY the fields listed in TARGET FIELDS
2. For boolean fields (starting with 'has'), return true or false (not strings)
3. For array fields (like targetCountries), return an array of all mentioned values
4. For numeric fields (scores, years, budgets), extract numbers only
5. For text fields, extract the actual value mentioned
6. If a field is not mentioned, omit it from the response
7. Return ONLY valid JSON, no explanations

EXAMPLES:

Boolean example:
User says: "yes I have my passport ready"
Response: {"hasPassport": true}

User says: "no not yet"
Response: {"hasPassport": false}

Array example:
User says: "I want to study in US, UK and Canada"
Response: {"targetCountries": ["United States", "United Kingdom", "Canada"]}

Degree examples:
User says: "BTech"
Response: {"previousDegree": "Bachelor's"}

User says: "I want to do Master's in Computer Science"
Response: {"currentDegree": "Master's", "major": "Computer Science"}

User says: "MS in CS"
Response: {"currentDegree": "Master's", "major": "Computer Science"}`

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/ai/extract`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ systemPrompt: prompt, userInput: transcript })
            })

            if (!response.ok) throw new Error('Failed to extract data')
            const responseData = await response.json()
            const content = responseData.text
            
            console.log('AI Response:', content)
            
            const jsonMatch = content.match(/\{[\s\S]*\}/)
            if (!jsonMatch) {
                console.error('No JSON found in AI response')
                throw new Error("No JSON found in response")
            }

            const extractedData = JSON.parse(jsonMatch[0])
            
            // Debug logging
            console.log('========== VOICE EXTRACTION DEBUG ==========')
            console.log('Step:', currentStep, '-', STEPS[currentStep - 1].title)
            console.log('Target fields:', targetFields)
            console.log('Voice transcript:', transcript)
            console.log('AI extracted:', extractedData)
            console.log('============================================')

            let fieldsUpdated = 0
            Object.keys(extractedData).forEach(key => {
                if (targetFields.includes(key)) {
                    let value = extractedData[key]
                    
                    // Skip empty or undefined values
                    if (value === undefined || value === null || value === '') {
                        console.log(`Skipping ${key}: empty value`)
                        return
                    }
                    
                    // Special handling for boolean fields to ensure proper type
                    if (key.startsWith('has')) {
                        // Convert string responses to actual boolean if needed
                        if (typeof value === 'string') {
                            const lowerValue = value.toLowerCase().trim()
                            
                            // Positive responses
                            const positiveWords = ['true', 'yes', 'yeah', 'yep', 'yup', 'ready', 'have', 'got', 'done', 'prepared', 'available', 'complete', 'sure', 'correct']
                            const isPositive = positiveWords.some(word => lowerValue.includes(word))
                            
                            // Negative responses
                            const negativeWords = ['false', 'no', 'nope', 'nah', 'not', "don't", "haven't", 'need to get']
                            const isNegative = negativeWords.some(word => lowerValue.includes(word))
                            
                            if (isPositive && !isNegative) {
                                value = true
                            } else if (isNegative) {
                                value = false
                            } else {
                                // Default to true if the AI extracted something for this field
                                value = true
                            }
                            
                            console.log(`Converted ${key} from "${extractedData[key]}" to boolean:`, value)
                        } else {
                            // Ensure it's a boolean
                            value = Boolean(value)
                            console.log(`Converted ${key} to boolean:`, value)
                        }
                    }
                    
                    // Special handling for degree fields - normalize variations
                    if (key === 'previousDegree' || key === 'currentDegree') {
                        if (typeof value === 'string') {
                            const degreeNormalization: Record<string, string> = {
                                'btech': "Bachelor's",
                                'b.tech': "Bachelor's",
                                'bachelor of technology': "Bachelor's",
                                'be': "Bachelor's",
                                'b.e.': "Bachelor's",
                                'bsc': "Bachelor's",
                                'b.sc': "Bachelor's",
                                'ba': "Bachelor's",
                                'b.a.': "Bachelor's",
                                'bachelors': "Bachelor's",
                                'bachelor': "Bachelor's",
                                'msc': "Master's",
                                'm.sc': "Master's",
                                'ms': "Master's",
                                'm.s.': "Master's",
                                'masters': "Master's",
                                'master': "Master's",
                                'mba': 'MBA',
                                'phd': 'PhD',
                                'ph.d': 'PhD',
                                'ph.d.': 'PhD',
                                'doctorate': 'PhD',
                            }
                            
                            const normalized = degreeNormalization[value.toLowerCase().trim()]
                            if (normalized) {
                                value = normalized
                                console.log(`Normalized ${key} from "${extractedData[key]}" to "${value}"`)
                            }
                        }
                    }
                    
                    // Special handling for major field - expand abbreviations
                    if (key === 'major') {
                        if (typeof value === 'string') {
                            const majorExpansion: Record<string, string> = {
                                'cs': 'Computer Science',
                                'ece': 'Electronics and Communication Engineering',
                                'ee': 'Electrical Engineering',
                                'me': 'Mechanical Engineering',
                                'ce': 'Civil Engineering',
                                'it': 'Information Technology',
                                'eee': 'Electrical and Electronics Engineering',
                            }
                            
                            const expanded = majorExpansion[value.toLowerCase().trim()]
                            if (expanded) {
                                value = expanded
                                console.log(`Expanded ${key} from "${extractedData[key]}" to "${value}"`)
                            }
                        }
                    }
                    
                    // Special handling for array fields
                    if (key === 'targetCountries') {
                        // Ensure it's an array
                        if (typeof value === 'string') {
                            // If AI returned a string, split by comma
                            value = value.split(',').map((s: string) => s.trim())
                        } else if (!Array.isArray(value)) {
                            // If it's a single value, wrap in array
                            value = [value]
                        }
                        
                        // Normalize country names
                        const countryMap: Record<string, string> = {
                            'US': 'United States',
                            'USA': 'United States',
                            'UK': 'United Kingdom',
                            'UAE': 'United Arab Emirates',
                            'NZ': 'New Zealand',
                        }
                        
                        value = (value as string[]).map((country: string) => {
                            const normalized = countryMap[country.toUpperCase()] || country
                            // Match against COUNTRIES list for exact match
                            const exactMatch = COUNTRIES.find(c => 
                                c.toLowerCase() === normalized.toLowerCase()
                            )
                            return exactMatch || normalized
                        })
                        
                        console.log(`Converted ${key} to array:`, value)
                    }
                    
                    updateField(key as keyof OnboardingData, value)
                    fieldsUpdated++
                }
            })

            console.log(`Updated ${fieldsUpdated} field(s)`)

            if (fieldsUpdated > 0) {
                speak("Got it!")
            } else {
                console.warn(`⚠️ No fields were extracted by AI`)
                console.warn(`Transcript: "${transcript}"`)
                console.warn(`Expected fields:`, targetFields)
                console.warn(`AI extracted:`, extractedData)
                
                speak("I didn't catch that completely. Could you please repeat?")
                resetTranscript()
                setAiProcessing(false)
                return
            }

            if (isInterviewMode) {
                setTimeout(() => {
                    if (currentStep === 1) {
                        subStep < 2 ? setSubStep(prev => prev + 1) : handleNext()
                    } else if (currentStep === 2) {
                        subStep < 1 ? setSubStep(prev => prev + 1) : handleNext()
                    } else if (currentStep === 6) {
                        subStep < 3 ? setSubStep(prev => prev + 1) : handleNext()
                    } else {
                        handleNext()
                    }
                }, 1000)
            }

        } catch (error: any) {
            console.error('❌ Voice processing error:', error)
            console.error('Transcript was:', transcript)
            console.error('Target fields were:', targetFields)
            
            // If API fails for boolean fields, use direct inference as fallback
            if (targetFields.length === 1 && targetFields[0].startsWith('has')) {
                const field = targetFields[0]
                const lowerTranscript = transcript.toLowerCase().trim()
                
                console.log(`⚠️ API failed, trying direct inference for ${field}`)
                
                // Check for positive/negative words
                const positiveWords = ['yes', 'yeah', 'yep', 'yup', 'ready', 'have', 'got', 'sure']
                const hasPositive = positiveWords.some(word => lowerTranscript === word || lowerTranscript.includes(word))
                
                const negativeWords = ['no', 'nope', 'nah', 'not']
                const hasNegative = negativeWords.some(word => lowerTranscript === word || lowerTranscript.includes(word))
                
                if (hasPositive && !hasNegative) {
                    console.log(`✅ Fallback success: ${field} = true`)
                    updateField(field as keyof OnboardingData, true)
                    try {
                        speak("Got it!")
                    } catch {
                        console.log('Speech failed, continuing anyway')
                    }
                    
                    if (isInterviewMode) {
                        setTimeout(() => {
                            if (currentStep === 6) {
                                subStep < 3 ? setSubStep(prev => prev + 1) : handleNext()
                            } else {
                                handleNext()
                            }
                        }, 1000)
                    }
                    
                    setAiProcessing(false)
                    resetTranscript()
                    return
                } else if (hasNegative) {
                    console.log(`✅ Fallback success: ${field} = false`)
                    updateField(field as keyof OnboardingData, false)
                    try {
                        speak("Got it!")
                    } catch {
                        console.log('Speech failed, continuing anyway')
                    }
                    
                    if (isInterviewMode) {
                        setTimeout(() => {
                            if (currentStep === 6) {
                                subStep < 3 ? setSubStep(prev => prev + 1) : handleNext()
                            } else {
                                handleNext()
                            }
                        }, 1000)
                    }
                    
                    setAiProcessing(false)
                    resetTranscript()
                    return
                }
            }
            
            setLastError(`API Error: ${error.message || 'Server unavailable'}`)
            try {
                speak("Sorry, there's an issue with the server. Please say it again.")
            } catch {
                console.log('Speech synthesis also failed')
            }
            
            setAiProcessing(false)
            resetTranscript()
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
        if (currentStep === 1 && isInterviewMode && subStep < 2) {
            setSubStep(prev => prev + 1)
            return
        }
        
        if (currentStep === 2 && isInterviewMode && subStep < 1) {
            setSubStep(prev => prev + 1)
            return
        }
        
        if (currentStep === 6 && isInterviewMode && subStep < 3) {
            setSubStep(prev => prev + 1)
            return
        }

        if (currentStep < 6) {
            setCurrentStep(prev => prev + 1)
            if (currentStep + 1 === 1 || currentStep + 1 === 2 || currentStep + 1 === 6) setSubStep(0)
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
                previous_degree: data.previousDegree,
                graduation_year: data.graduationYear,
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

    // Logic for Step 0 Next
    const handleSelectionNext = () => {
        if (!selectedMode) return
        if (selectedMode === 'ai') {
            setShowAiIntro(true) // Go to AI Intro instead of starting immediately
        } else {
            setIsInterviewMode(false)
            setCurrentStep(1)
            setSubStep(0)
        }
    }

    const handleAiIntroStart = () => {
        setShowAiIntro(false)
        setIsInterviewMode(true)
        setCurrentStep(1)
        setSubStep(0)
    }

    // Step 0.5: AI Intro Screen
    if (showAiIntro) {
        return (
            <div className="min-h-screen w-full relative flex items-center justify-center bg-zinc-50 font-sans overflow-hidden">
                {/* Background Image with Overlay (Same as Auth) */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920&auto=format&fit=crop"
                        alt="University Campus"
                        className="w-full h-full object-cover"
                    />
                    <div
                        className="absolute inset-0 mix-blend-multiply"
                        style={{
                            background: 'linear-gradient(180deg, #D6E4FF 0%, #9AE3F8 100%)',
                            opacity: 0.2
                        }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-blue-900/50 to-transparent" />
                </div>

                {/* AI Intro Card */}
                <div className="relative z-10 w-full max-w-4xl mx-4 bg-white rounded-[20px] shadow-2xl flex flex-col lg:flex-row overflow-hidden border border-white/20">

                    {/* Left Panel - Avatar Profile */}
                    <div className="w-full lg:w-5/12 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col items-center justify-center p-8 relative overflow-hidden">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                            <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-blue-200 rounded-full blur-3xl" />
                            <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-purple-200 rounded-full blur-3xl" />
                        </div>

                        <div className="relative z-10 flex flex-col items-center">
                            {/* Avatar Circle with Glow */}
                            <div className="relative w-40 h-40 mb-6">
                                <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-pulse" />
                                <div className="absolute -inset-2 bg-linear-to-tr from-blue-500 to-purple-500 rounded-full opacity-20 blur-lg" />
                                <div className="relative w-full h-full rounded-full border-4 border-white shadow-xl overflow-hidden bg-white flex items-center justify-center">
                                    {/* Using a placeholder eye/lens conceptual image */}
                                    <img
                                        src="https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=1000&auto=format&fit=crop"
                                        alt="AI Assistant"
                                        className="w-full h-full object-cover opacity-90 hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                                <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full z-20" />
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 mb-2">AI Counsellor</h3>

                            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">Online • AI Powered</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Content */}
                    <div className="w-full lg:w-7/12 p-8 lg:p-12 flex flex-col relative z-10">
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-6 text-blue-600">
                                <Sparkles size={16} />
                                <span className="text-xs font-bold uppercase tracking-[0.2em]">Personalization</span>
                            </div>

                            <h2 className="text-3xl font-bold text-slate-900 leading-tight mb-2">
                                Let's calibrate your profile for <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">AI Counsellor</span>
                            </h2>

                            <div className="mt-8 relative">
                                <div className="relative z-10 bg-slate-50 p-6 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                                    <p className="text-slate-600 leading-relaxed text-lg">
                                        "I'll ask you a few quick questions about your interests and goals. This helps me formulate accurate insights about your future prospects."
                                    </p>
                                </div>
                                {/* Speech bubble triangle */}
                                <div className="absolute -top-3 left-0 w-4 h-4 bg-slate-50 border-t border-l border-slate-100 transform rotate-45 z-0" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-8">
                            <Button
                                variant="ghost"
                                onClick={() => setShowAiIntro(false)}
                                className="text-slate-500 hover:text-slate-800 px-8 py-6 text-base"
                            >
                                <ArrowRight className="mr-2 h-5 w-5 rotate-180" /> Back
                            </Button>

                            <Button
                                onClick={handleAiIntroStart}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base rounded-lg shadow-lg shadow-blue-600/20 transition-all hover:scale-105"
                            >
                                Let's Start <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const progress = (currentStep / 6) * 100

    // Step 0: Selection Screen
    if (currentStep === 0) {
        return (
            <div className="min-h-screen w-full relative flex items-center justify-center bg-zinc-50 font-sans overflow-hidden">
                {/* Background Image with Overlay (Same as Auth) */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920&auto=format&fit=crop"
                        alt="University Campus"
                        className="w-full h-full object-cover"
                    />
                    <div
                        className="absolute inset-0 mix-blend-multiply"
                        style={{
                            background: 'linear-gradient(180deg, #D6E4FF 0%, #9AE3F8 100%)',
                            opacity: 0.2
                        }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-blue-900/50 to-transparent" />
                </div>

                {/* Selection Card */}
                <div className="relative z-10 w-full max-w-4xl mx-4 bg-white rounded-[20px] shadow-2xl p-8 lg:p-12 border border-white/20">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">How would you like to start?</h1>
                        <p className="text-slate-500">Choose the method that works best for you. We can guide you manually or let AI handle the heavy lifting.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        {/* Manual Setup Option */}
                        <div
                            className={`relative p-6 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${selectedMode === 'manual'
                                ? 'border-blue-600 bg-blue-50/50'
                                : 'border-slate-200 bg-white hover:border-blue-200'
                                }`}
                            onClick={() => setSelectedMode('manual')}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedMode === 'manual' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
                                    <FileText size={24} />
                                </div>
                                {selectedMode === 'manual' && (
                                    <div className="text-blue-600">
                                        <Check size={24} className="bg-blue-100 rounded-full p-1" />
                                    </div>
                                )}
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Manual Setup</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Follow a detailed step-by-step guide to configure everything exactly how you want it.
                            </p>
                        </div>

                        {/* AI Voice Input Option */}
                        <div
                            className={`relative p-6 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${selectedMode === 'ai'
                                ? 'border-blue-600 bg-blue-50/50'
                                : 'border-slate-200 bg-white hover:border-blue-200'
                                }`}
                            onClick={() => setSelectedMode('ai')}
                        >
                            {/* Recommended Badge */}
                            <div className="absolute -top-3 right-6 bg-blue-600 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full shadow-sm">
                                Recommended
                            </div>

                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedMode === 'ai' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                    <Mic size={24} />
                                </div>
                                {selectedMode === 'ai' ? (
                                    <div className="text-blue-600">
                                        <Check size={24} className="bg-blue-100 rounded-full p-1" />
                                    </div>
                                ) : (
                                    <div className="w-6 h-6 rounded-full border-2 border-slate-200" />
                                )}
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">AI Voice Input</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Simply speak your preferences and let our advanced AI configure the settings for you.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-4">
                        <Button
                            variant="ghost"
                            className="text-slate-500 hover:text-slate-800 px-8 py-6 text-base"
                            onClick={() => navigate('/signup')}
                        >
                            <ArrowRight className="mr-2 h-5 w-5 rotate-180" /> Back
                        </Button>
                        <Button
                            onClick={handleSelectionNext}
                            disabled={!selectedMode}
                            className={`px-8 py-6 text-base rounded-lg transition-all ${selectedMode
                                ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            Next <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background relative flex flex-col">
            {/* Header */}
            {/* Header - Only show in Interview Mode or if needed, for manual we have custom header */}
            {isInterviewMode && (
                <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
                    <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                <GraduationCap size={20} />
                            </div>
                            <span className="font-bold text-lg tracking-tight">AI Counsellor</span>
                        </div>
                        <Button
                            variant={isInterviewMode ? 'secondary' : 'outline'}
                            size="sm"
                            onClick={() => {
                                const newState = !isInterviewMode
                                setIsInterviewMode(newState)
                                if (newState) {
                                    if (currentStep === 1) setSubStep(0)
                                    resetTranscript()
                                } else {
                                    stopSpeaking()
                                    stopListening()
                                }
                            }}
                            className="gap-2"
                        >
                            {isInterviewMode ? <Sparkles size={16} /> : <Mic size={16} />}
                            {isInterviewMode ? 'Interview Mode Active' : 'Start Voice Interview'}
                        </Button>
                    </div>
                </header>
            )}

            {/* INTERVIEW MODE OVERLAY */}
            {isInterviewMode ? (
                <div className="fixed inset-0 pt-20 z-40 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
                    <div className="max-w-2xl w-full space-y-12">
                        {/* Status Icon */}
                        <div className="mx-auto w-32 h-32 rounded-full border border-border flex items-center justify-center relative bg-card shadow-xl">
                            <div className={`absolute inset-0 rounded-full bg-primary/10 ${isSpeaking ? 'animate-ping' : ''}`} />
                            <div className="relative z-10">
                                {isListening ? (
                                    <Mic className="text-primary animate-pulse" size={40} />
                                ) : isSpeaking ? (
                                    <Volume2 className="text-primary animate-pulse" size={40} />
                                ) : (
                                    <Sparkles className="text-muted-foreground" size={40} />
                                )}
                            </div>
                        </div>

                        {/* Question / Transcript */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-semibold tracking-tight leading-relaxed">
                                {isListening && transcript
                                    ? `"${transcript}"`
                                    : currentStep === 1
                                        ? (subStep === 0 ? "Let's start! What is your full name?" 
                                           : subStep === 1 ? "Great! And what is your email address?" 
                                           : "Finally for this section, what is your phone number?")
                                        : currentStep === 2
                                        ? (subStep === 0 ? "What is your highest completed degree? For example, Bachelor's, Master's, or BTech."
                                           : "What degree do you want to pursue next, and in which field? For example, Master's in Computer Science.")
                                        : currentStep === 6
                                        ? (subStep === 0 ? "Do you have your passport ready? Say yes or no." 
                                           : subStep === 1 ? "Do you have your academic transcripts? Say yes or no."
                                           : subStep === 2 ? "Do you have your Statement of Purpose? Say yes or no."
                                           : "Do you have your Letters of Recommendation? Say yes or no.")
                                        : STEPS[currentStep - 1].question
                                }
                            </h2>
                            {lastError && (
                                <div className="flex items-center justify-between bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl text-sm animate-in fade-in slide-in-from-bottom-2 duration-300 mb-4">
                                    <span className="flex items-center gap-2">
                                        ⚠️ {lastError}
                                    </span>
                                    <button
                                        onClick={() => setLastError(null)}
                                        className="p-1 hover:bg-amber-100 rounded-full transition-colors"
                                        aria-label="Dismiss warning"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                            {aiProcessing && (
                                <p className="text-primary font-mono animate-pulse">Processing answer...</p>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="flex justify-center gap-6">
                            {isListening ? (
                                <Button onClick={processAnswer} size="lg" variant="destructive" className="h-14 px-8 rounded-full">
                                    <StopCircle className="mr-2" /> Stop & Process
                                </Button>
                            ) : (
                                <Button onClick={() => { stopElevenLabsSpeech(); startListening(); }} disabled={aiProcessing || isSpeakingElevenLabs} size="lg" className="h-14 px-8 rounded-full">
                                    <Mic className="mr-2" /> Tap to Speak
                                </Button>
                            )}
                            <Button variant="outline" size="icon" className="h-14 w-14 rounded-full" onClick={handleNext}>
                                <ArrowRight />
                            </Button>
                        </div>
                        <p className="text-muted-foreground text-sm">Step {currentStep} of 6 • Manual overrides available</p>
                    </div>
                </div>
            ) : (
                <div className="min-h-screen w-full relative flex flex-col font-sans bg-zinc-50 overflow-hidden">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <img
                            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920&auto=format&fit=crop"
                            alt="University Campus"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply" />
                    </div>

                    {/* Custom Header */}
                    <div className="relative z-20 mx-auto w-full max-w-full bg-white border-b border-slate-200 px-8 flex justify-between items-center h-14">
                        <div className="flex items-center gap-2 text-slate-900">
                            <span className="font-bold text-lg">Setup Profile</span>
                            <span className="text-slate-300 mx-2">/</span>
                            <span className="text-slate-500 text-sm font-medium">Step {currentStep} of {STEPS.length}</span>
                        </div>
                        <Button variant="ghost" className="text-slate-500 hover:text-slate-800 text-sm font-medium">Skip for now</Button>
                        {/* Progress Bar */}
                        <div className="absolute top-0 left-0 h-[3px] bg-blue-100 w-full">
                            <div className="h-full bg-blue-600 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
                        </div>
                    </div>

                    {/* Centered Card Container - Modified for fixed height/vertical gap aspect */}
                    <div className="relative z-10 flex-1 flex items-center justify-center overflow-hidden p-1">
                        <div
                            className="w-full max-w-[672px] bg-white shadow-xl relative animate-in fade-in zoom-in-95 duration-300 flex flex-col justify-between rounded-[16px] border border-slate-200"
                            style={{
                                minHeight: 'auto',
                                maxHeight: '716px',
                            }}
                        >

                            {/* Scrollable Content Area */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                                {/* Mic Icon Helper */}
                                <div className="absolute top-6 right-6 w-9 h-9 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer" title="Voice Assist Available">
                                    <Mic size={18} />
                                </div>

                                <div className="mb-2 max-w-2xl">
                                    <h2 className="font-bold text-slate-900 tracking-tight text-2xl mb-1">
                                        {currentStep === 1 && "Personal"}
                                        {currentStep === 2 && "Study Intent"}
                                        {currentStep === 3 && "Exams"}
                                        {currentStep === 4 && "Budget & Finance"}
                                        {currentStep === 5 && "Preferences"}
                                        {currentStep === 6 && "Documents"}
                                    </h2>
                                    <p className="text-slate-500 text-xs">
                                        {currentStep === 1 && "Tell us a bit about yourself so our AI can guide you better."}
                                        {currentStep === 2 && "Tell us a bit about yourself so our AI can guide you better."}
                                        {currentStep === 3 && "Tell us a bit about yourself so our AI can guide you better."}
                                        {currentStep === 4 && "Tell us a bit about yourself so our AI can guide you better."}
                                        {currentStep === 5 && "Tell us a bit about yourself so our AI can guide you better."}
                                        {currentStep === 6 && "Tell us a bit about yourself so our AI can guide you better."}
                                    </p>
                                </div>

                                <div className="space-y-5">
                                    {/* Step 1: Personal */}
                                    {currentStep === 1 && (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <Label className="text-slate-700 font-medium">Full Name</Label>
                                                    <Input className="h-10 border-slate-200 rounded-lg text-sm" value={data.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Enter your name" />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-slate-700 font-medium">Email Address</Label>
                                                    <Input className="h-10 border-slate-200 rounded-lg text-sm" type="email" value={data.email} onChange={(e) => updateField('email', e.target.value)} placeholder="you@example.com" />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-slate-700 font-medium">Phone Number</Label>
                                                <Input className="h-10 border-slate-200 rounded-lg text-sm w-full md:w-1/2" type="tel" value={data.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="+1 234 567 8900" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 2: Academic / Study Intent */}
                                    {currentStep === 2 && (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <Label className="text-slate-700 font-medium">Latest Qualification</Label>
                                                    <Input
                                                        className="h-10 border-slate-200 rounded-lg text-sm"
                                                        value={data.previousDegree}
                                                        onChange={(e) => updateField('previousDegree', e.target.value)}
                                                        placeholder="e.g. Bachelor's"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-slate-700 font-medium">Graduation Year</Label>
                                                    <Input
                                                        className="h-10 border-slate-200 rounded-lg text-sm"
                                                        value={data.graduationYear}
                                                        onChange={(e) => updateField('graduationYear', e.target.value)}
                                                        placeholder="e.g. 2024"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-slate-700 font-medium">Degree to pursue</Label>
                                                <div className="flex flex-wrap gap-3">
                                                    {['Bachelor\'s', 'Master\'s', 'MBA', 'PhD'].map((degree) => (
                                                        <div
                                                            key={degree}
                                                            onClick={() => updateField('currentDegree', degree)}
                                                            className={`px-5 py-2 text-sm rounded-full border cursor-pointer transition-all ${data.currentDegree === degree
                                                                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                                                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                                                                }`}
                                                        >
                                                            {degree}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-slate-700 font-medium">Intended Major</Label>
                                                <Input className="h-10 border-slate-200 rounded-lg text-sm" value={data.major} onChange={(e) => updateField('major', e.target.value)} placeholder="e.g. Computer Science" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-slate-700 font-medium">Target Start Year</Label>
                                                <Input className="h-10 border-slate-200 rounded-lg w-full md:w-1/2 text-sm" value={data.intakeYear} onChange={(e) => updateField('intakeYear', e.target.value)} placeholder="2025" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 3: Exams */}
                                    {currentStep === 3 && (
                                        <div className="space-y-2">
                                            <Label className="text-slate-700 font-medium block mb-3">Have you taken any of these exams?</Label>
                                            {['SAT', 'ACT', 'GRE', 'GMAT', 'IELTS', 'TOEFL'].map((test) => (
                                                <div key={test} className="flex items-center justify-between p-2 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors bg-white">
                                                    <span className="font-semibold text-slate-700 text-sm ml-2">{test}</span>
                                                    <Input
                                                        className="w-28 h-8 border-slate-200 text-sm bg-slate-50"
                                                        value={data[test.toLowerCase() as keyof OnboardingData] as string}
                                                        onChange={(e) => updateField(test.toLowerCase() as any, e.target.value)}
                                                        placeholder="Score"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Step 4: Budget & Finance */}
                                    {currentStep === 4 && (
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label className="text-slate-700 font-medium">Annual Budget (USD)</Label>

                                                <div className="pt-2 px-1">
                                                    <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                                                        <span>$10k</span>
                                                        <span>$100k+</span>
                                                    </div>
                                                    {/* Keeping it simple for now as Slider requires Shadcn component which might need config */}
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <Input
                                                            type="number"
                                                            value={data.budgetMin}
                                                            onChange={(e) => updateField('budgetMin', e.target.value)}
                                                            placeholder="Min"
                                                            className="h-10 text-sm"
                                                        />
                                                        <Input
                                                            type="number"
                                                            value={data.budgetMax}
                                                            onChange={(e) => updateField('budgetMax', e.target.value)}
                                                            placeholder="Max"
                                                            className="h-10 text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${data.fundingSource === 'scholarship'
                                                    ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/10'
                                                    : 'border-slate-200 hover:border-slate-300'
                                                    }`}
                                                onClick={() => updateField('fundingSource', data.fundingSource === 'scholarship' ? '' : 'scholarship')}
                                            >
                                                <div className={`mt-1 w-4 h-4 rounded-full border flex items-center justify-center ${data.fundingSource === 'scholarship' ? 'border-blue-600' : 'border-slate-400'
                                                    }`}>
                                                    {data.fundingSource === 'scholarship' && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-slate-900 text-sm">I need financial aid / scholarships</h4>
                                                    <p className="text-slate-500 text-xs mt-0.5">We'll prioritize universities with good aid packages.</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 5: Preferences/Target */}
                                    {currentStep === 5 && (
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <Label className="text-slate-700 font-medium block">Target Countries</Label>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {COUNTRIES.map((country) => (
                                                        <div
                                                            key={country}
                                                            onClick={() => toggleCountry(country)}
                                                            className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${data.targetCountries.includes(country)
                                                                ? 'border-blue-500 bg-blue-50/10 ring-1 ring-blue-500'
                                                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                                }`}
                                                        >
                                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${data.targetCountries.includes(country)
                                                                ? 'border-blue-600'
                                                                : 'border-slate-300'
                                                                }`}>
                                                                {data.targetCountries.includes(country) && (
                                                                    <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                                                                )}
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-700">{country}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 6: Documents */}
                                    {currentStep === 6 && (
                                        <div className="space-y-4">
                                            {[
                                                { key: 'hasPassport', label: 'Valid Passport' },
                                                { key: 'hasTranscript', label: 'Academic Transcripts' },
                                                { key: 'hasSop', label: 'Statement of Purpose (SOP)' },
                                                { key: 'hasLor', label: 'Letters of Recommendation (LORs)' },
                                            ].map((doc) => (
                                                <div key={doc.key} className="space-y-2">
                                                    <Label className="text-slate-700 font-medium">{doc.label}</Label>
                                                    <div className="flex gap-3">
                                                        <div
                                                            onClick={() => updateField(doc.key as keyof OnboardingData, true)}
                                                            className={`flex-1 px-5 py-3 text-sm rounded-xl border cursor-pointer transition-all text-center font-medium ${data[doc.key as keyof OnboardingData] === true
                                                                ? 'bg-green-50 border-green-500 text-green-700 ring-1 ring-green-500'
                                                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                                                }`}
                                                        >
                                                            ✓ Ready
                                                        </div>
                                                        <div
                                                            onClick={() => updateField(doc.key as keyof OnboardingData, false)}
                                                            className={`flex-1 px-5 py-3 text-sm rounded-xl border cursor-pointer transition-all text-center font-medium ${data[doc.key as keyof OnboardingData] === false
                                                                ? 'bg-red-50 border-red-400 text-red-600 ring-1 ring-red-400'
                                                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                                                }`}
                                                        >
                                                            ✗ Not Ready
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer Buttons */}
                            <div className={`flex ${currentStep === 1 ? 'flex-col' : 'items-center justify-between'} bg-white rounded-b-[20px] px-6 pb-4 pt-0`}>
                                {currentStep > 1 && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentStep(c => c - 1)}
                                        className="h-9 px-4 text-xs rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 w-24"
                                    >
                                        Back
                                    </Button>
                                )}

                                <Button
                                    onClick={handleNext}
                                    className={`h-9 px-6 text-xs rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] ${currentStep === 1 ? 'w-full' : 'min-w-[100px]'}`}
                                >
                                    {currentStep === 6 ? 'Complete' : 'Next Step'} <ArrowRight className="ml-2 h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
