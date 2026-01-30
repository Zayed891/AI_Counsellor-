import { Link } from 'react-router-dom'
import { useUser } from '@/context/UserContext'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    GraduationCap,
    FileText,
    Calendar,
    CheckCircle2,
    Circle,
    Lock,
    ArrowRight,
    AlertTriangle,
    MapPin,
    Trash2,
} from 'lucide-react'

// Document checklist for applications
const REQUIRED_DOCUMENTS = [
    { id: 'passport', title: 'Valid Passport', description: 'Ensure at least 6 months validity' },
    { id: 'transcript', title: 'Academic Transcripts', description: 'Official sealed transcripts from institution' },
    { id: 'sop', title: 'Statement of Purpose', description: 'Personalized for each university' },
    { id: 'lor', title: 'Letters of Recommendation', description: '2-3 academic or professional references' },
    { id: 'resume', title: 'CV / Resume', description: 'Updated with relevant experience' },
    { id: 'scores', title: 'Test Score Reports', description: 'IELTS/TOEFL, GRE/GMAT (if applicable)' },
    { id: 'financial', title: 'Financial Documents', description: 'Bank statements, sponsorship letters' },
]

// Timeline milestones
const TIMELINE = [
    { month: 'Month 1-2', action: 'Finalize university list & prepare documents' },
    { month: 'Month 3', action: 'Submit applications & pay fees' },
    { month: 'Month 4-5', action: 'Track applications & respond to queries' },
    { month: 'Month 6', action: 'Receive decisions & accept offer' },
    { month: 'Month 7-8', action: 'Visa application & travel prep' },
]

export default function Guidance() {
    const { profile } = useAuth()
    const { getLockedUniversities, tasks, toggleTask, deleteTask } = useUser()

    const lockedUniversities = getLockedUniversities()
    const hasLockedUniversities = lockedUniversities.length > 0

    // Check document readiness from profile
    const getDocStatus = (docId: string) => {
        switch (docId) {
            case 'passport': return profile?.has_passport
            case 'transcript': return profile?.has_transcript
            case 'sop': return profile?.has_sop
            case 'lor': return profile?.has_lor
            default: return false
        }
    }

    if (!hasLockedUniversities) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <main className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 pt-20 sm:pt-24 pb-12 sm:pb-20">
                    <Card className="bg-[#0A0A0A] border-white/10 py-20">
                        <CardContent className="text-center max-w-lg mx-auto">
                            <div className="w-20 h-20 mx-auto mb-8 bg-neutral-900 border border-white/10 flex items-center justify-center">
                                <Lock size={36} className="text-neutral-400" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-4">Application Guidance Locked</h1>
                            <p className="text-neutral-400 mb-8 leading-relaxed">
                                You need to lock at least one university to access personalized application guidance.
                                Locking universities signals your intent to apply and unlocks tailored strategies.
                            </p>
                            <Button variant="sharp" size="lg" asChild>
                                <Link to="/shortlist">
                                    Go to Shortlist <ArrowRight size={18} />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 pt-20 sm:pt-24 pb-12 sm:pb-20">
                {/* Header */}
                <div className="mb-8 sm:mb-10 border-b border-white/10 pb-6 sm:pb-8">
                    <Badge variant="secondary" className="mb-4 border-white/20">APPLICATION GUIDANCE</Badge>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2 sm:mb-4 text-white tracking-tight">
                        Your Application Strategy
                    </h1>
                    <p className="text-neutral-400 text-sm sm:text-lg">
                        Personalized guidance for your {lockedUniversities.length} locked {lockedUniversities.length === 1 ? 'university' : 'universities'}.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Locked Universities */}
                        <Card className="bg-[#0A0A0A] border-white/10">
                            <CardHeader className="border-b border-white/5 pb-6">
                                <CardTitle className="text-xl flex items-center gap-3">
                                    <Lock size={20} className="text-green-500" /> Locked Universities
                                </CardTitle>
                                <CardDescription className="text-neutral-500">
                                    Your confirmed application targets
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    {lockedUniversities.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between p-4 border border-green-500/20 bg-green-500/5"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-neutral-900 border border-white/10 flex items-center justify-center">
                                                    <GraduationCap size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{item.university?.name}</p>
                                                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                                                        <MapPin size={12} />
                                                        {item.university?.country}
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                                {item.category?.toUpperCase()}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Document Checklist */}
                        <Card className="bg-[#0A0A0A] border-white/10">
                            <CardHeader className="border-b border-white/5 pb-6">
                                <CardTitle className="text-xl flex items-center gap-3">
                                    <FileText size={20} /> Document Checklist
                                </CardTitle>
                                <CardDescription className="text-neutral-500">
                                    Required documents for your applications
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-3">
                                    {REQUIRED_DOCUMENTS.map((doc) => {
                                        const isReady = getDocStatus(doc.id)
                                        return (
                                            <div
                                                key={doc.id}
                                                className={`flex items-start gap-4 p-4 border ${isReady
                                                    ? 'border-green-500/20 bg-green-500/5'
                                                    : 'border-white/10 bg-neutral-900/30'
                                                    }`}
                                            >
                                                {isReady ? (
                                                    <CheckCircle2 size={20} className="text-green-500 shrink-0 mt-0.5" />
                                                ) : (
                                                    <Circle size={20} className="text-neutral-500 shrink-0 mt-0.5" />
                                                )}
                                                <div>
                                                    <p className={`font-medium ${isReady ? 'text-white' : 'text-neutral-300'}`}>
                                                        {doc.title}
                                                    </p>
                                                    <p className="text-sm text-neutral-500">{doc.description}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Timeline */}
                        <Card className="bg-[#0A0A0A] border-white/10">
                            <CardHeader className="border-b border-white/5 pb-6">
                                <CardTitle className="text-lg flex items-center gap-3">
                                    <Calendar size={18} /> Application Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    {TIMELINE.map((item, index) => (
                                        <div key={index} className="flex gap-4">
                                            <div className="w-2 h-2 bg-white mt-2 shrink-0" />
                                            <div>
                                                <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-1">
                                                    {item.month}
                                                </p>
                                                <p className="text-sm text-white">{item.action}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* AI Tasks */}
                        <Card className="bg-[#0A0A0A] border-white/10">
                            <CardHeader className="border-b border-white/5 pb-6">
                                <CardTitle className="text-lg">Application Tasks</CardTitle>
                                <CardDescription className="text-neutral-500">
                                    {tasks.filter(t => t.category === 'applications' && !t.is_completed).length} pending
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {tasks.filter(t => t.category === 'applications').length === 0 ? (
                                    <div className="text-center py-6">
                                        <p className="text-neutral-500 text-sm">
                                            No application tasks yet. Use AI Counselor to generate tasks.
                                        </p>
                                        <Button variant="sharp" size="sm" className="mt-4" asChild>
                                            <Link to="/counselor">Open AI Counselor</Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {tasks.filter(t => t.category === 'applications').slice(0, 5).map((task) => (
                                            <div
                                                key={task.id}
                                                className={`flex items-start gap-3 p-3 border ${task.is_completed
                                                    ? 'border-white/5 opacity-60'
                                                    : 'border-white/10'
                                                    }`}
                                            >
                                                <button
                                                    onClick={() => toggleTask(task.id)}
                                                    className="shrink-0 mt-0.5 cursor-pointer"
                                                >
                                                    {task.is_completed ? (
                                                        <CheckCircle2 size={16} className="text-green-500" />
                                                    ) : (
                                                        <Circle size={16} className="text-neutral-500 hover:text-white" />
                                                    )}
                                                </button>
                                                <p className={`flex-1 text-sm ${task.is_completed ? 'line-through text-neutral-500' : 'text-white'}`}>
                                                    {task.title}
                                                </p>
                                                <button
                                                    onClick={() => deleteTask(task.id)}
                                                    className="shrink-0 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                                                    title="Delete task"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* CTA */}
                        <Card className="bg-gradient-to-br from-neutral-900 to-black border-white/10">
                            <CardContent className="py-8 text-center">
                                <AlertTriangle size={24} className="mx-auto mb-4 text-yellow-500" />
                                <p className="text-white font-medium mb-2">Need help?</p>
                                <p className="text-neutral-400 text-sm mb-4">
                                    Ask your AI Counselor for personalized application strategies.
                                </p>
                                <Button variant="sharp" size="sm" className="w-full" asChild>
                                    <Link to="/counselor">
                                        Talk to AI Counselor <ArrowRight size={16} />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
