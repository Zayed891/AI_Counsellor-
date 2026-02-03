import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useUser } from '@/context/UserContext'
import {
    ArrowRight,
    CheckCircle2,
    Circle,
    Clock,
    GraduationCap,
    FileText,
    Sparkles,
    Lock,
} from 'lucide-react'

const STAGES = [
    { id: 1, title: 'Building Profile', description: 'Complete your information' },
    { id: 2, title: 'Discovering Universities', description: 'Explore your options' },
    { id: 3, title: 'Finalizing Universities', description: 'Lock your choices' },
    { id: 4, title: 'Preparing Applications', description: 'Submit your applications' },
]

export default function Dashboard() {
    const { profile } = useAuth()
    const { shortlist, tasks, toggleTask, currentStage, isProfileComplete, getLockedUniversities } = useUser()

    const profileComplete = isProfileComplete()
    const lockedUniversities = getLockedUniversities()

    // Profile Strength Calculations
    const getAcademicStrength = () => {
        if (!profile) return { status: 'Not Started', color: 'bg-gray-100 text-gray-500' }
        let score = 0
        if (profile.gpa && profile.gpa >= 3.0) score += 40
        else if (profile.gpa && profile.gpa >= 2.5) score += 25
        if (profile.current_degree) score += 30
        if (profile.major) score += 30

        if (score >= 80) return { status: 'Strong', color: 'bg-green-100 text-green-600' }
        if (score >= 40) return { status: 'Average', color: 'bg-yellow-100 text-yellow-600' }
        return { status: 'Weak', color: 'bg-red-100 text-red-600' }
    }

    const getExamsStatus = () => {
        if (!profile) return { status: 'Not Started', color: 'bg-gray-100 text-gray-500' }
        const hasIELTS = profile.ielts && profile.ielts >= 6.0
        const hasTOEFL = profile.toefl && profile.toefl >= 80

        if (hasIELTS || hasTOEFL) return { status: 'Completed', color: 'bg-green-100 text-green-600' }
        return { status: 'Not Started', color: 'bg-gray-100 text-gray-500' }
    }

    const getSOPStatus = () => {
        if (!profile) return { status: 'Not Started', color: 'bg-gray-100 text-gray-500' }
        if (profile.has_sop) return { status: 'Ready', color: 'bg-green-100 text-green-600' }
        return { status: 'Not Started', color: 'bg-gray-100 text-gray-500' }
    }

    const academicStrength = getAcademicStrength()
    const examsStatus = getExamsStatus()
    const sopStatus = getSOPStatus()

    // Sample tasks matching the design
    const displayTasks = [
        { id: '1', title: 'Complete IELTS registration', priority: null },
        { id: '2', title: 'Start SOP first draft', priority: 'HIGH PRIORITY' },
        { id: '3', title: 'Research scholarship options', priority: 'MEDIUM PRIORITY' },
    ]

    const pendingTasks = tasks.filter(t => !t.is_completed && t.category !== 'applications').slice(0, 3)
    const tasksToShow = pendingTasks.length > 0 ? pendingTasks : displayTasks
    const totalTasks = Math.max(tasks.filter(t => t.category !== 'applications').length, 3)
    const completedTasks = tasks.filter(t => t.is_completed && t.category !== 'applications').length

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                        Welcome back, {profile?.name?.split(' ')[0] || 'Student'}
                    </h1>
                    <p className="text-gray-500 text-sm">Here's your study abroad journey overview</p>
                </div>
                <Link
                    to="/counselor"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
                >
                    <Sparkles size={16} />
                    Talk to AI Counsellor
                </Link>
            </div>

            {/* Your Journey Section */}
            <div className="mb-8">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Your Journey</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {STAGES.map((stage) => {
                        const isComplete = stage.id < currentStage
                        const isCurrent = stage.id === currentStage
                        const isLocked = stage.id > currentStage

                        return (
                            <div key={stage.id} className="relative">
                                {/* Progress Line */}
                                <div className={`h-1 rounded-full mb-3 ${isComplete || isCurrent ? 'bg-gray-900' : 'bg-gray-200'
                                    }`} />

                                {/* Stage Card */}
                                <div className={`p-4 rounded-2xl border transition-all ${isCurrent
                                    ? 'bg-gray-900 text-white border-gray-900 shadow-lg'
                                    : 'bg-white border-gray-200 hover:border-gray-300'
                                    }`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        {isComplete ? (
                                            <CheckCircle2 size={14} className="text-green-500" />
                                        ) : isCurrent ? (
                                            <div className="w-2 h-2 rounded-full bg-white" />
                                        ) : (
                                            <Circle size={14} className="text-gray-300" />
                                        )}
                                        <span className={`text-[10px] font-medium uppercase tracking-wider ${isCurrent ? 'text-gray-400' : 'text-gray-400'
                                            }`}>
                                            Stage {stage.id}
                                        </span>
                                    </div>
                                    <h3 className={`font-semibold text-sm leading-tight mb-1 ${isCurrent ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        {stage.title}
                                    </h3>
                                    <p className={`text-xs leading-relaxed ${isCurrent ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                        {stage.description}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Three Cards Row */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
                {/* Profile Strength Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-5">Profile Strength</h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                                    <GraduationCap size={16} className="text-gray-500" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Academics</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${academicStrength.color}`}>
                                {academicStrength.status}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                                    <FileText size={16} className="text-gray-500" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Exams</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${examsStatus.color}`}>
                                {examsStatus.status}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                                    <FileText size={16} className="text-gray-500" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">SOP</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${sopStatus.color}`}>
                                {sopStatus.status}
                            </span>
                        </div>
                    </div>

                    <Link
                        to="/onboarding"
                        className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        View Full Profile <ArrowRight size={14} />
                    </Link>
                </div>

                {/* Universities Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-5">Universities</h3>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                            <p className="text-2xl font-bold text-gray-900">{shortlist.length}</p>
                            <p className="text-xs text-gray-500 mt-0.5">Shortlisted</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                            <p className="text-2xl font-bold text-gray-900">{lockedUniversities.length}</p>
                            <p className="text-xs text-gray-500 mt-0.5">Locked</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 mb-4">
                        <Lock size={14} className="text-gray-400 mt-0.5 shrink-0" />
                        <p className="text-xs text-gray-500 leading-relaxed">Lock at least 1 university to proceed to the next stage</p>
                    </div>

                    <Link
                        to="/discover"
                        className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Explore Universities <ArrowRight size={14} />
                    </Link>
                </div>

                {/* Your Tasks Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-semibold text-gray-900">Your Tasks</h3>
                        <span className="text-sm text-gray-400">{completedTasks}/{totalTasks}</span>
                    </div>

                    <div className="space-y-3 mb-4">
                        {tasksToShow.map((task, index) => {
                            const taskAny = task as any
                            const priority = taskAny.priority as string | undefined
                            const category = taskAny.category as string | undefined

                            return (
                                <div key={task.id || index} className="flex items-start gap-3">
                                    <Clock size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-700 leading-snug">{task.title}</p>
                                        {(priority || category === 'exams') && (
                                            <span className={`text-[10px] font-semibold uppercase tracking-wide ${priority === 'HIGH PRIORITY' || category === 'exams'
                                                ? 'text-red-500'
                                                : 'text-yellow-600'
                                                }`}>
                                                {priority || 'HIGH PRIORITY'}
                                            </span>
                                        )}
                                        {category === 'documents' && (
                                            <span className="text-[10px] font-semibold uppercase tracking-wide text-yellow-600">
                                                MEDIUM PRIORITY
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <Link
                        to="/guidance"
                        className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        View All Tasks <ArrowRight size={14} />
                    </Link>
                </div>
            </div>

            {/* AI Recommendation Banner */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm overflow-hidden">
                <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center shrink-0">
                            <Sparkles size={18} className="text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">AI Recommendation</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Based on your profile, I recommend focusing on completing your {!profileComplete ? 'profile information,' : ''} lock more university options and strengthen your applications.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <Link
                            to="/counselor"
                            className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors text-center whitespace-nowrap"
                        >
                            Get Personalized Guidance
                        </Link>
                        <Link
                            to="/discover"
                            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            <GraduationCap size={16} className="shrink-0" />
                            <span>View Universities</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
