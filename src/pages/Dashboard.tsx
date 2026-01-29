import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useUser } from '@/context/UserContext'
import Navbar from '@/components/Navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
    User,
    Search,
    Target,
    FileCheck,
    ArrowRight,
    DollarSign,
    Globe,
    Calendar,
    GraduationCap,
    Brain,
    Lock,
    CheckCircle2,
    Circle,
    ListTodo,
    BarChart3,
    Trash2,
} from 'lucide-react'

const STAGES = [
    { id: 1, title: 'Build Profile', icon: User, path: '/onboarding' },
    { id: 2, title: 'Discover', icon: Search, path: '/discover' },
    { id: 3, title: 'Shortlist', icon: Target, path: '/shortlist' },
    { id: 4, title: 'Apply', icon: FileCheck, path: '#' },
]

export default function Dashboard() {
    const { profile } = useAuth()
    const { shortlist, tasks, toggleTask, deleteTask, currentStage, getProfileCompleteness, isProfileComplete, getLockedUniversities } = useUser()

    const completeness = getProfileCompleteness()
    const profileComplete = isProfileComplete()
    const lockedUniversities = getLockedUniversities()

    // Profile Strength Calculations with percentages
    const getAcademicStrength = () => {
        if (!profile) return { status: 'Weak', percent: 0, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' }
        let score = 0
        if (profile.gpa && profile.gpa >= 3.0) score += 40
        else if (profile.gpa && profile.gpa >= 2.5) score += 25
        if (profile.current_degree) score += 30
        if (profile.major) score += 30

        if (score >= 80) return { status: 'Strong', percent: score, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' }
        if (score >= 40) return { status: 'Average', percent: score, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' }
        return { status: 'Weak', percent: score, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' }
    }

    const getExamsStatus = () => {
        if (!profile) return { status: 'Not Started', percent: 0, color: 'text-neutral-400', bg: 'bg-neutral-800 border-white/10' }
        let score = 0
        const hasIELTS = profile.ielts && profile.ielts >= 6.0
        const hasTOEFL = profile.toefl && profile.toefl >= 80
        const hasGRE = profile.gre && profile.gre >= 300
        const hasGMAT = profile.gmat && profile.gmat >= 500

        if (hasIELTS || hasTOEFL) score += 50
        if (hasGRE || hasGMAT) score += 50

        if (score >= 100) return { status: 'Completed', percent: 100, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' }
        if (score >= 50) return { status: 'In Progress', percent: score, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' }
        return { status: 'Not Started', percent: 0, color: 'text-neutral-400', bg: 'bg-neutral-800 border-white/10' }
    }

    const getSOPStatus = () => {
        if (!profile) return { status: 'Not Started', percent: 0, color: 'text-neutral-400', bg: 'bg-neutral-800 border-white/10' }
        if (profile.has_sop) return { status: 'Ready', percent: 100, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' }
        return { status: 'Not Started', percent: 0, color: 'text-neutral-400', bg: 'bg-neutral-800 border-white/10' }
    }

    const academicStrength = getAcademicStrength()
    const examsStatus = getExamsStatus()
    const sopStatus = getSOPStatus()

    // Overall profile strength percentage
    const overallStrength = Math.round((academicStrength.percent + examsStatus.percent + sopStatus.percent) / 3)

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 pt-24 pb-12">
                {/* Welcome Section */}
                <div className="mb-12 border-b border-white/10 pb-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight">
                                Welcome back, <span className="text-neutral-400">{profile?.name?.split(' ')[0] || 'Student'}</span>
                            </h1>
                            <p className="text-neutral-400 text-lg max-w-2xl">
                                Track your progress, manage your shortlist, and get AI guidance for your study abroad journey.
                            </p>
                        </div>
                        <Button variant="outline" className="border-white/10 hover:bg-neutral-900 gap-2 shrink-0" asChild>
                            <Link to="/onboarding">
                                <User size={16} /> Edit Profile
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Stage Navigation */}
                <Card className="mb-12 bg-[#0A0A0A] border-white/10">
                    <CardContent className="py-10">
                        <div className="flex justify-between items-center px-4 overflow-x-auto">
                            {STAGES.map((stage, index) => {
                                const isComplete = stage.id < (profileComplete ? 2 : 1) ||
                                    (stage.id === 2 && profileComplete) ||
                                    (stage.id === 3 && shortlist.length > 0)
                                const isCurrent = stage.id === currentStage
                                const isLocked = !profileComplete && stage.id > 1

                                return (
                                    <div key={stage.id} className="flex items-center min-w-fit">
                                        <div className="flex flex-col items-center gap-4 group">
                                            <div
                                                className={`w-16 h-16 border flex items-center justify-center transition-all duration-300 ${isComplete
                                                    ? 'bg-neutral-900 border-white/20 text-white'
                                                    : isCurrent
                                                        ? 'bg-white text-black border-white'
                                                        : isLocked
                                                            ? 'bg-transparent border-white/5 text-neutral-600'
                                                            : 'bg-transparent border-white/20 text-neutral-400'
                                                    }`}
                                            >
                                                {isLocked ? (
                                                    <Lock size={24} />
                                                ) : (
                                                    <stage.icon size={24} />
                                                )}
                                            </div>
                                            <div className="text-center">
                                                <p className={`text-sm font-mono uppercase tracking-widest ${isCurrent ? 'text-white' : 'text-neutral-500'}`}>
                                                    {stage.title}
                                                </p>
                                            </div>
                                        </div>
                                        {index < STAGES.length - 1 && (
                                            <div
                                                className={`w-24 h-px mx-6 hidden md:block ${isComplete ? 'bg-white/30' : 'bg-white/5'
                                                    }`}
                                            />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Profile Incomplete Warning */}
                {!profileComplete && (
                    <Card className="mb-12 border-white/10 bg-[#0A0A0A] relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500" />
                        <CardContent className="py-8">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-neutral-900 border border-white/10 flex items-center justify-center">
                                        <User size={28} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1">Complete Your Profile</h3>
                                        <p className="text-neutral-400">
                                            Your profile is {completeness}% complete. Complete it to unlock university discovery.
                                        </p>
                                    </div>
                                </div>
                                <Button variant="sharp" size="lg" asChild className="min-w-[200px]">
                                    <Link to="/onboarding">
                                        Continue <ArrowRight size={18} />
                                    </Link>
                                </Button>
                            </div>
                            <Progress value={completeness} className="mt-6 h-1 bg-neutral-800" />
                        </CardContent>
                    </Card>
                )}

                {/* Main Grid */}
                <div className="space-y-8">
                    {/* Top Row: Quick Stats (Full Width) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            {
                                icon: DollarSign,
                                label: 'BUDGET/YEAR',
                                value: profile?.budget_min ? `$${Math.round(profile.budget_min / 1000)}k${profile.budget_max ? ` - $${Math.round(profile.budget_max / 1000)}k` : ''}` : '-'
                            },
                            {
                                icon: Globe,
                                label: 'COUNTRIES',
                                value: profile?.target_countries?.length || 0
                            },
                            {
                                icon: Calendar,
                                label: 'TARGET INTAKE',
                                value: `${profile?.intake_season || '-'} ${profile?.intake_year || ''}`
                            },
                            {
                                icon: Target,
                                label: 'SHORTLISTED',
                                value: shortlist.length
                            }
                        ].map((stat, i) => (
                            <Card key={i} className="bg-[#0A0A0A] border-white/10 hover:border-white/20 transition-colors">
                                <CardContent className="py-6 text-center">
                                    <div className="w-10 h-10 mx-auto mb-3 bg-neutral-900 flex items-center justify-center border border-white/10">
                                        <stat.icon size={18} className="text-white" />
                                    </div>
                                    <p className="text-lg font-bold text-white mb-1 truncate px-2">
                                        {stat.value}
                                    </p>
                                    <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{stat.label}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Second Row: AI Counselor + Profile Strength */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* AI Counselor CTA */}
                        <Card className="bg-[#0A0A0A] border-white/10 overflow-hidden relative group">
                            <div className="absolute -inset-[100px] bg-white/5 opacity-0 group-hover:opacity-100 blur-[60px] transition-opacity duration-500 pointer-events-none" />
                            <CardHeader className="border-b border-white/5">
                                <CardTitle className="flex items-center gap-3">
                                    <Brain size={20} /> AI Counselor
                                </CardTitle>
                                <CardDescription className="text-neutral-500 mt-1">
                                    Get personalized study abroad guidance
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 relative z-10">
                                <ul className="space-y-3 text-sm mb-6">
                                    {['University recommendations', 'Profile analysis', 'Application guidance', 'Visa tips'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-neutral-300">
                                            <div className="w-1.5 h-1.5 bg-white" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <Button variant="sharp" size="lg" className="w-full" asChild>
                                    <Link to="/counselor">
                                        Start Chat <ArrowRight size={18} />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Profile Strength Indicator */}
                        <Card className="bg-[#0A0A0A] border-white/10">
                            <CardHeader className="border-b border-white/5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg flex items-center gap-3">
                                            <BarChart3 size={18} /> Profile Strength
                                        </CardTitle>
                                        <CardDescription className="text-neutral-500 mt-1">
                                            AI-analyzed readiness assessment
                                        </CardDescription>
                                    </div>
                                    {/* Overall Strength Circle */}
                                    <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-lg ${overallStrength >= 70 ? 'border-green-500 text-green-400' :
                                        overallStrength >= 40 ? 'border-yellow-500 text-yellow-400' :
                                            'border-red-500 text-red-400'
                                        }`}>
                                        {overallStrength}%
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-3">
                                <div className={`flex items-center justify-between p-3 border ${academicStrength.bg}`}>
                                    <div>
                                        <p className="text-sm font-medium text-white">Academics</p>
                                        <p className="text-xs text-neutral-500">GPA, Degree, Major</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm font-mono ${academicStrength.color}`}>{academicStrength.percent}%</span>
                                        <Badge className={`${academicStrength.color} bg-transparent border-current`}>
                                            {academicStrength.status}
                                        </Badge>
                                    </div>
                                </div>
                                <div className={`flex items-center justify-between p-3 border ${examsStatus.bg}`}>
                                    <div>
                                        <p className="text-sm font-medium text-white">Exams</p>
                                        <p className="text-xs text-neutral-500">IELTS/TOEFL, GRE/GMAT</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm font-mono ${examsStatus.color}`}>{examsStatus.percent}%</span>
                                        <Badge className={`${examsStatus.color} bg-transparent border-current`}>
                                            {examsStatus.status}
                                        </Badge>
                                    </div>
                                </div>
                                <div className={`flex items-center justify-between p-3 border ${sopStatus.bg}`}>
                                    <div>
                                        <p className="text-sm font-medium text-white">Statement of Purpose</p>
                                        <p className="text-xs text-neutral-500">Application essay</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm font-mono ${sopStatus.color}`}>{sopStatus.percent}%</span>
                                        <Badge className={`${sopStatus.color} bg-transparent border-current`}>
                                            {sopStatus.status}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Third Row: Shortlist + To-Do List */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Shortlisted Universities */}
                        <Card className="bg-[#0A0A0A] border-white/10">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5">
                                <div>
                                    <CardTitle className="text-lg">Your Shortlist</CardTitle>
                                    <CardDescription className="text-neutral-500 mt-1">
                                        {shortlist.length > 0
                                            ? `${shortlist.length} universities shortlisted`
                                            : 'No universities shortlisted yet'}
                                    </CardDescription>
                                </div>
                                {shortlist.length > 0 && (
                                    <Button variant="sharp-outline" size="sm" asChild>
                                        <Link to="/shortlist">View All</Link>
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent className="pt-6">
                                {shortlist.length === 0 ? (
                                    <div className="text-center py-8">
                                        <div className="w-14 h-14 mx-auto mb-4 bg-neutral-900 border border-white/10 flex items-center justify-center">
                                            <Target size={28} className="text-neutral-400" />
                                        </div>
                                        <p className="text-neutral-400 mb-4 text-sm">
                                            Start discovering universities
                                        </p>
                                        <Button variant="sharp" asChild disabled={!profileComplete}>
                                            <Link to="/discover">
                                                Discover <ArrowRight size={16} />
                                            </Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {shortlist.slice(0, 3).map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between p-4 border border-white/5 bg-neutral-900/30 hover:bg-neutral-900/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-[#0A0A0A] border border-white/10 flex items-center justify-center">
                                                        <GraduationCap size={18} className="text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white text-sm">{item.university?.name}</p>
                                                        <p className="text-xs text-neutral-500">
                                                            {item.university?.country}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge
                                                    variant={
                                                        item.category === 'reach'
                                                            ? 'warning'
                                                            : item.category === 'safety'
                                                                ? 'success'
                                                                : 'default'
                                                    }
                                                    className="text-[10px]"
                                                >
                                                    {item.category}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* AI To-Do List */}
                        <Card className="bg-[#0A0A0A] border-white/10">
                            <CardHeader className="border-b border-white/5">
                                <CardTitle className="text-lg flex items-center gap-3">
                                    <ListTodo size={18} /> AI To-Do List
                                </CardTitle>
                                <CardDescription className="text-neutral-500 mt-1">
                                    {tasks.filter(t => !t.is_completed && t.category !== 'applications').length} pending tasks
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {/* Filter out application tasks - they show in Guidance page */}
                                {tasks.filter(t => t.category !== 'applications').length === 0 ? (
                                    <div className="text-center py-8">
                                        <div className="w-14 h-14 mx-auto mb-4 bg-neutral-900 border border-white/10 flex items-center justify-center">
                                            <CheckCircle2 size={28} className="text-neutral-600" />
                                        </div>
                                        <p className="text-neutral-500 text-sm">
                                            No tasks yet. Use AI Counselor to generate tasks.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                        {tasks.filter(t => t.category !== 'applications').slice(0, 5).map((task) => (
                                            <div
                                                key={task.id}
                                                className={`flex items-start gap-3 p-3 border transition-all ${task.is_completed
                                                    ? 'border-white/5 bg-neutral-900/30 opacity-60'
                                                    : 'border-white/10 hover:border-white/20 bg-neutral-900/50'
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
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm ${task.is_completed ? 'line-through text-neutral-500' : 'text-white'}`}>
                                                        {task.title}
                                                    </p>
                                                    <Badge variant="outline" className="text-[9px] mt-1 border-white/10 text-neutral-500">
                                                        {task.category.toUpperCase()}
                                                    </Badge>
                                                </div>
                                                <button
                                                    onClick={() => deleteTask(task.id)}
                                                    className="shrink-0 p-1 text-neutral-500 hover:text-red-500 transition-colors cursor-pointer"
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
                    </div>

                    {/* Bottom Row: Profile Details */}
                    <Card className="bg-[#0A0A0A] border-white/10">
                        <CardHeader className="border-b border-white/5">
                            <CardTitle className="text-lg flex items-center justify-between">
                                Your Profile Details
                                <Button variant="sharp-outline" size="sm" asChild>
                                    <Link to="/onboarding">Edit Profile</Link>
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1">Study Level</p>
                                    <p className="font-medium text-white">{profile?.study_level || 'Not specified'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1">Major</p>
                                    <p className="font-medium text-white">{profile?.major || 'Not specified'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1">GPA</p>
                                    <p className="font-medium text-white">{profile?.gpa || 'Not specified'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2">Target Countries</p>
                                    <div className="flex flex-wrap gap-1">
                                        {profile?.target_countries?.slice(0, 3).map((country) => (
                                            <Badge key={country} variant="secondary" className="bg-neutral-900 border-white/10 text-neutral-300 font-normal text-[10px]">
                                                {country}
                                            </Badge>
                                        )) || <span className="text-neutral-500 text-sm">Not specified</span>}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
