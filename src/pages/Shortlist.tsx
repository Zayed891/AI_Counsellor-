import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useUser } from '@/context/UserContext'
import Navbar from '@/components/Navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    GraduationCap,
    MapPin,
    DollarSign,
    Trophy,
    Trash2,
    ExternalLink,
    ArrowRight,
    Target,
    Lock,
    Unlock,
    AlertTriangle,
} from 'lucide-react'

export default function Shortlist() {
    const { profile } = useAuth()
    const { shortlist, removeFromShortlist, updateCategory, lockUniversity, unlockUniversity, getLockedUniversities } = useUser()
    const [unlockConfirm, setUnlockConfirm] = useState<string | null>(null)

    // Cost affordability tier based on user's budget
    const getCostTier = (tuitionMin?: number, tuitionMax?: number): { tier: 'low' | 'medium' | 'high', label: string, color: string } => {
        const userBudget = profile?.budget_max || 100000
        const tuition = tuitionMin || tuitionMax || 30000
        const ratio = tuition / userBudget

        if (ratio <= 0.6) {
            return { tier: 'low', label: 'Affordable', color: 'bg-green-500/20 border-green-500/40 text-green-400' }
        } else if (ratio <= 1.0) {
            return { tier: 'medium', label: 'Within Budget', color: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400' }
        } else {
            return { tier: 'high', label: 'Above Budget', color: 'bg-red-500/20 border-red-500/40 text-red-400' }
        }
    }

    // Acceptance probability tier based on profile strength
    const getAcceptanceTier = (ranking?: number): { tier: 'low' | 'medium' | 'high', label: string, color: string } => {
        const userGPA = profile?.gpa || 0
        const hasEnglishTest = !!(profile?.ielts || profile?.toefl)
        const hasGradTest = !!(profile?.gre || profile?.gmat)
        const uniRanking = ranking || 500

        let score = 0
        if (userGPA >= 3.8) score += 40
        else if (userGPA >= 3.5) score += 30
        else if (userGPA >= 3.0) score += 20
        else score += 10

        if (hasEnglishTest) score += 15
        if (hasGradTest) score += 15

        if (uniRanking > 200) score += 30
        else if (uniRanking > 100) score += 20
        else if (uniRanking > 50) score += 10

        if (score >= 70) {
            return { tier: 'high', label: 'High Chance', color: 'bg-green-500/20 border-green-500/40 text-green-400' }
        } else if (score >= 40) {
            return { tier: 'medium', label: 'Moderate Chance', color: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400' }
        } else {
            return { tier: 'low', label: 'Competitive', color: 'bg-red-500/20 border-red-500/40 text-red-400' }
        }
    }

    const reachUniversities = shortlist.filter(s => s.category === 'reach')
    const targetUniversities = shortlist.filter(s => s.category === 'target')
    const safetyUniversities = shortlist.filter(s => s.category === 'safety')

    const renderUniversityCard = (item: typeof shortlist[0]) => (
        <Card key={item.id} className="bg-[#0A0A0A] border-white/10 hover:border-white/30 transition-all duration-300 group">
            <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 bg-neutral-900 border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-300">
                        <GraduationCap size={24} />
                    </div>
                    <div className="flex gap-2">
                        <Badge variant="outline" className="text-[10px] font-mono border-white/20 text-neutral-400 bg-transparent">
                            RANK #{item.university?.ranking || '?'}
                        </Badge>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-neutral-500 hover:text-red-500"
                            onClick={() => removeFromShortlist(item.university_id)}
                        >
                            <Trash2 size={14} />
                        </Button>
                    </div>
                </div>

                <h3 className="font-bold text-xl mb-2 text-white line-clamp-2 min-h-[3.5rem]">{item.university?.name}</h3>

                <div className="flex items-center gap-2 text-sm text-neutral-400 mb-6 font-mono">
                    <MapPin size={14} />
                    <span className="truncate">{item.university?.city ? `${item.university.city}, ` : ''}{item.university?.country}</span>
                </div>

                <div className="border-t border-white/5 pt-4 mb-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-500 font-mono text-xs uppercase">Est. Tuition</span>
                        <div className="flex items-center gap-1 text-white font-medium">
                            <span>
                                ${item.university?.tuition_min?.toLocaleString()} - $
                                {item.university?.tuition_max?.toLocaleString()}/yr
                            </span>
                        </div>
                    </div>
                </div>

                {/* Cost & Acceptance Tiers */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {(() => {
                        const costTier = getCostTier(item.university?.tuition_min, item.university?.tuition_max)
                        return (
                            <div className={`p-2 border ${costTier.color}`}>
                                <p className="text-[9px] font-mono uppercase tracking-wider opacity-70">Cost</p>
                                <p className="text-xs font-medium">{costTier.label}</p>
                            </div>
                        )
                    })()}
                    {(() => {
                        const acceptTier = getAcceptanceTier(item.university?.ranking)
                        return (
                            <div className={`p-2 border ${acceptTier.color}`}>
                                <p className="text-[9px] font-mono uppercase tracking-wider opacity-70">Admission</p>
                                <p className="text-xs font-medium">{acceptTier.label}</p>
                            </div>
                        )
                    })()}
                </div>

                {/* Category Selector */}
                <div className="flex gap-2 mb-4">
                    <Button
                        variant={item.category === 'reach' ? 'secondary' : 'outline'}
                        size="sm"
                        className={`flex-1 text-[10px] uppercase tracking-wider font-mono ${item.category === 'reach'
                            ? 'bg-white text-black hover:bg-neutral-200'
                            : 'border-white/10 hover:bg-neutral-900 hover:text-white hover:border-white/30 text-neutral-400'
                            }`}
                        onClick={() => updateCategory(item.university_id, 'reach')}
                        disabled={item.is_locked}
                    >
                        Reach
                    </Button>
                    <Button
                        variant={item.category === 'target' ? 'secondary' : 'outline'}
                        size="sm"
                        className={`flex-1 text-[10px] uppercase tracking-wider font-mono ${item.category === 'target'
                            ? 'bg-white text-black hover:bg-neutral-200'
                            : 'border-white/10 hover:bg-neutral-900 hover:text-white hover:border-white/30 text-neutral-400'
                            }`}
                        onClick={() => updateCategory(item.university_id, 'target')}
                        disabled={item.is_locked}
                    >
                        Target
                    </Button>
                    <Button
                        variant={item.category === 'safety' ? 'secondary' : 'outline'}
                        size="sm"
                        className={`flex-1 text-[10px] uppercase tracking-wider font-mono ${item.category === 'safety'
                            ? 'bg-white text-black hover:bg-neutral-200'
                            : 'border-white/10 hover:bg-neutral-900 hover:text-white hover:border-white/30 text-neutral-400'
                            }`}
                        onClick={() => updateCategory(item.university_id, 'safety')}
                        disabled={item.is_locked}
                    >
                        Safety
                    </Button>
                </div>

                {/* Lock/Unlock Button */}
                {unlockConfirm === item.university_id ? (
                    <div className="bg-red-500/10 border border-red-500/30 p-3">
                        <div className="flex items-center gap-2 text-red-400 text-xs mb-2">
                            <AlertTriangle size={14} />
                            <span>Unlocking will reset your application guidance.</span>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 text-xs border-white/10 hover:bg-neutral-900"
                                onClick={() => setUnlockConfirm(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="sharp"
                                size="sm"
                                className="flex-1 text-xs bg-red-500 hover:bg-red-600"
                                onClick={() => {
                                    unlockUniversity(item.university_id)
                                    setUnlockConfirm(null)
                                }}
                            >
                                Confirm Unlock
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Button
                        variant={item.is_locked ? 'outline' : 'sharp'}
                        size="sm"
                        className={`w-full text-xs uppercase font-mono tracking-wider ${item.is_locked
                            ? 'border-green-500/30 text-green-400 hover:bg-green-500/10 hover:border-green-500/50'
                            : 'bg-white text-black hover:bg-neutral-200'
                            }`}
                        onClick={() => {
                            if (item.is_locked) {
                                setUnlockConfirm(item.university_id)
                            } else {
                                lockUniversity(item.university_id)
                            }
                        }}
                    >
                        {item.is_locked ? (
                            <><Lock size={14} className="mr-2" /> Locked for Application</>
                        ) : (
                            <><Unlock size={14} className="mr-2" /> Lock University</>
                        )}
                    </Button>
                )}
            </CardContent>
        </Card>
    )

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 pt-20 sm:pt-24 pb-12 sm:pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 border-b border-white/10 pb-6 sm:pb-8">
                    <div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2 sm:mb-4 text-white tracking-tight">Your Shortlist</h1>
                        <p className="text-neutral-400 text-sm sm:text-lg">
                            {shortlist.length} universities shortlisted for your applications.
                        </p>
                    </div>
                    <Button variant="sharp" asChild className="h-12 px-8 w-full md:w-auto">
                        <Link to="/discover">
                            ADD MORE <ArrowRight size={18} className="ml-2" />
                        </Link>
                    </Button>
                </div>

                {shortlist.length === 0 ? (
                    <Card className="py-32 bg-[#0A0A0A] border-white/10 border-dashed">
                        <CardContent className="text-center">
                            <Target size={48} className="mx-auto mb-6 text-neutral-700" />
                            <h3 className="text-2xl font-bold mb-4 text-white">No universities shortlisted</h3>
                            <p className="text-neutral-500 mb-8 max-w-md mx-auto">
                                Start discovering universities and categorize them as Reach, Target, or Safety to build your list.
                            </p>
                            <Button variant="sharp" asChild className="h-12 px-8">
                                <Link to="/discover">
                                    DISCOVER UNIVERSITIES <ArrowRight size={18} className="ml-2" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-16">
                        {/* Reach Universities */}
                        {reachUniversities.length > 0 && (
                            <section>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
                                    <div className="px-4 py-2 bg-neutral-900 border border-white/10 text-white font-mono text-sm uppercase tracking-wider w-fit">
                                        REACH
                                    </div>
                                    <span className="text-neutral-500 text-sm">
                                        {reachUniversities.length} universities • Higher admission difficulty
                                    </span>
                                </div>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {reachUniversities.map(renderUniversityCard)}
                                </div>
                            </section>
                        )}

                        {/* Target Universities */}
                        {targetUniversities.length > 0 && (
                            <section>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
                                    <div className="px-4 py-2 bg-neutral-900 border border-white/10 text-white font-mono text-sm uppercase tracking-wider w-fit">
                                        TARGET
                                    </div>
                                    <span className="text-neutral-500 text-sm">
                                        {targetUniversities.length} universities • Good fit for your profile
                                    </span>
                                </div>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {targetUniversities.map(renderUniversityCard)}
                                </div>
                            </section>
                        )}

                        {/* Safety Universities */}
                        {safetyUniversities.length > 0 && (
                            <section>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
                                    <div className="px-4 py-2 bg-neutral-900 border border-white/10 text-white font-mono text-sm uppercase tracking-wider w-fit">
                                        SAFETY
                                    </div>
                                    <span className="text-neutral-500 text-sm">
                                        {safetyUniversities.length} universities • Higher admission likelihood
                                    </span>
                                </div>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {safetyUniversities.map(renderUniversityCard)}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}
