import { Link } from 'react-router-dom'
import { useUser } from '@/context/UserContext'
import { useAuth } from '@/context/AuthContext'
import {
    GraduationCap,
    FileText,
    Calendar,
    CheckCircle2,
    Circle,
    Lock,
    ArrowRight,
    MessageSquare,
    MapPin,
    Trash2,
} from 'lucide-react'

const REQUIRED_DOCUMENTS = [
    { id: 'passport', title: 'Valid Passport', description: 'Ensure at least 6 months validity' },
    { id: 'transcript', title: 'Academic Transcripts', description: 'Official sealed transcripts from institution' },
    { id: 'sop', title: 'Statement of Purpose', description: 'Personalized for each university' },
    { id: 'lor', title: 'Letters of Recommendation', description: '2-3 academic or professional references' },
    { id: 'resume', title: 'CV / Resume', description: 'Updated with relevant experience' },
    { id: 'scores', title: 'Test Score Reports', description: 'IELTS/TOEFL, GRE/GMAT (if applicable)' },
    { id: 'financial', title: 'Financial Documents', description: 'Bank statements, sponsorship letters' },
]

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
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-2xl border border-gray-200 p-10 shadow-sm text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Lock size={28} className="text-gray-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">Application Guidance Locked</h1>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        You need to lock at least one university to access personalized application guidance.
                    </p>
                    <Link
                        to="/shortlist"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                    >
                        Go to Shortlist <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full mb-3">
                    APPLICATION GUIDANCE
                </span>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Your Application Strategy</h1>
                <p className="text-gray-500 text-sm">
                    Personalized guidance for your {lockedUniversities.length} locked {lockedUniversities.length === 1 ? 'university' : 'universities'}.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Locked Universities */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <Lock size={18} className="text-green-500" />
                                <h2 className="font-semibold text-gray-900">Locked Universities</h2>
                            </div>
                            <p className="text-gray-500 text-sm mt-1">Your confirmed application targets</p>
                        </div>
                        <div className="p-5 space-y-3">
                            {lockedUniversities.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-4 rounded-xl border border-green-200 bg-green-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-xl border border-gray-200 flex items-center justify-center">
                                            <GraduationCap size={18} className="text-gray-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{item.university?.name}</p>
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <MapPin size={12} />
                                                {item.university?.country}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-lg">
                                        {item.category?.toUpperCase()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Document Checklist */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <FileText size={18} className="text-gray-500" />
                                <h2 className="font-semibold text-gray-900">Document Checklist</h2>
                            </div>
                            <p className="text-gray-500 text-sm mt-1">Required documents for your applications</p>
                        </div>
                        <div className="p-5 space-y-2">
                            {REQUIRED_DOCUMENTS.map((doc) => {
                                const isReady = getDocStatus(doc.id)
                                return (
                                    <div
                                        key={doc.id}
                                        className={`flex items-start gap-3 p-4 rounded-xl ${isReady
                                                ? 'bg-green-50 border border-green-200'
                                                : 'bg-gray-50 border border-gray-200'
                                            }`}
                                    >
                                        {isReady ? (
                                            <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                                        ) : (
                                            <Circle size={18} className="text-gray-400 shrink-0 mt-0.5" />
                                        )}
                                        <div>
                                            <p className={`font-medium ${isReady ? 'text-gray-900' : 'text-gray-700'}`}>
                                                {doc.title}
                                            </p>
                                            <p className="text-sm text-gray-500">{doc.description}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Timeline */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <Calendar size={18} className="text-gray-500" />
                                <h2 className="font-semibold text-gray-900">Application Timeline</h2>
                            </div>
                        </div>
                        <div className="p-5 space-y-4">
                            {TIMELINE.map((item, index) => (
                                <div key={index} className="flex gap-3">
                                    <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 shrink-0" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-400 uppercase mb-1">
                                            {item.month}
                                        </p>
                                        <p className="text-sm text-gray-700">{item.action}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Application Tasks */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-gray-100">
                            <h2 className="font-semibold text-gray-900">Application Tasks</h2>
                            <p className="text-gray-500 text-sm mt-1">
                                {tasks.filter(t => t.category === 'applications' && !t.is_completed).length} pending
                            </p>
                        </div>
                        <div className="p-5">
                            {tasks.filter(t => t.category === 'applications').length === 0 ? (
                                <div className="text-center py-4">
                                    <p className="text-gray-500 text-sm mb-3">
                                        No application tasks yet.
                                    </p>
                                    <Link
                                        to="/counselor"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                                    >
                                        Open AI Counsellor
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {tasks.filter(t => t.category === 'applications').slice(0, 5).map((task) => (
                                        <div
                                            key={task.id}
                                            className={`flex items-start gap-3 p-3 rounded-xl ${task.is_completed
                                                    ? 'bg-gray-50 opacity-60'
                                                    : 'bg-gray-50'
                                                }`}
                                        >
                                            <button
                                                onClick={() => toggleTask(task.id)}
                                                className="shrink-0 mt-0.5"
                                            >
                                                {task.is_completed ? (
                                                    <CheckCircle2 size={16} className="text-green-500" />
                                                ) : (
                                                    <Circle size={16} className="text-gray-400 hover:text-gray-600" />
                                                )}
                                            </button>
                                            <p className={`flex-1 text-sm ${task.is_completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                                {task.title}
                                            </p>
                                            <button
                                                onClick={() => deleteTask(task.id)}
                                                className="shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="bg-gray-900 rounded-2xl p-6 text-center">
                        <MessageSquare size={24} className="mx-auto mb-3 text-white" />
                        <p className="text-white font-medium mb-1">Need help?</p>
                        <p className="text-gray-400 text-sm mb-4">
                            Ask your AI Counsellor for personalized strategies.
                        </p>
                        <Link
                            to="/counselor"
                            className="inline-flex items-center gap-2 w-full justify-center px-4 py-2.5 bg-white text-gray-900 text-sm font-medium rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            Talk to AI Counsellor <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
