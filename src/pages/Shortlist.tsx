import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useUser } from '@/context/UserContext'
import {
    GraduationCap,
    MapPin,
    Trash2,
    ArrowRight,
    Target,
    Lock,
    Unlock,
    AlertTriangle,
} from 'lucide-react'

export default function Shortlist() {
    const { profile } = useAuth()
    const { shortlist, removeFromShortlist, updateCategory, lockUniversity, unlockUniversity } = useUser()
    const [unlockConfirm, setUnlockConfirm] = useState<string | null>(null)

    const getCostTier = (tuitionMin?: number, tuitionMax?: number): { tier: 'low' | 'medium' | 'high', label: string, color: string } => {
        const userBudget = profile?.budget_max || 100000
        const tuition = tuitionMin || tuitionMax || 30000
        const ratio = tuition / userBudget

        if (ratio <= 0.6) {
            return { tier: 'low', label: 'Affordable', color: 'bg-green-100 text-green-600' }
        } else if (ratio <= 1.0) {
            return { tier: 'medium', label: 'Within Budget', color: 'bg-yellow-100 text-yellow-600' }
        } else {
            return { tier: 'high', label: 'Above Budget', color: 'bg-red-100 text-red-600' }
        }
    }

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
            return { tier: 'high', label: 'High Chance', color: 'bg-green-100 text-green-600' }
        } else if (score >= 40) {
            return { tier: 'medium', label: 'Moderate', color: 'bg-yellow-100 text-yellow-600' }
        } else {
            return { tier: 'low', label: 'Competitive', color: 'bg-red-100 text-red-600' }
        }
    }

    const reachUniversities = shortlist.filter(s => s.category === 'reach')
    const targetUniversities = shortlist.filter(s => s.category === 'target')
    const safetyUniversities = shortlist.filter(s => s.category === 'safety')

    const renderUniversityCard = (item: typeof shortlist[0]) => {
        const costTier = getCostTier(item.university?.tuition_min, item.university?.tuition_max)
        const acceptTier = getAcceptanceTier(item.university?.ranking)

        return (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <GraduationCap size={20} className="text-gray-500" />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-400">#{item.university?.ranking || '?'}</span>
                        <button
                            onClick={() => removeFromShortlist(item.university_id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">{item.university?.name}</h3>

                <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
                    <MapPin size={14} />
                    <span className="truncate">{item.university?.city ? `${item.university.city}, ` : ''}{item.university?.country}</span>
                </div>

                <div className="border-t border-gray-100 pt-4 mb-4">
                    <div className="flex items-center justify-between text-sm mb-3">
                        <span className="text-gray-400">Tuition</span>
                        <span className="font-medium text-gray-900">
                            ${item.university?.tuition_min?.toLocaleString()} - ${item.university?.tuition_max?.toLocaleString()}/yr
                        </span>
                    </div>

                    {/* Tiers */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className={`p-2 rounded-lg text-center ${costTier.color}`}>
                            <p className="text-[10px] uppercase font-medium opacity-70">Cost</p>
                            <p className="text-xs font-medium">{costTier.label}</p>
                        </div>
                        <div className={`p-2 rounded-lg text-center ${acceptTier.color}`}>
                            <p className="text-[10px] uppercase font-medium opacity-70">Admission</p>
                            <p className="text-xs font-medium">{acceptTier.label}</p>
                        </div>
                    </div>

                    {/* Category Selector */}
                    <div className="flex gap-2 mb-4">
                        {['reach', 'target', 'safety'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => updateCategory(item.university_id, cat as 'reach' | 'target' | 'safety')}
                                disabled={item.is_locked}
                                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${item.category === cat
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    } ${item.is_locked ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Lock/Unlock Button */}
                    {unlockConfirm === item.university_id ? (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                            <div className="flex items-center gap-2 text-red-600 text-xs mb-2">
                                <AlertTriangle size={14} />
                                <span>Unlocking will reset guidance.</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setUnlockConfirm(null)}
                                    className="flex-1 py-2 text-xs font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        unlockUniversity(item.university_id)
                                        setUnlockConfirm(null)
                                    }}
                                    className="flex-1 py-2 text-xs font-medium bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                if (item.is_locked) {
                                    setUnlockConfirm(item.university_id)
                                } else {
                                    lockUniversity(item.university_id)
                                }
                            }}
                            className={`w-full py-2.5 text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-colors ${item.is_locked
                                    ? 'bg-green-50 border border-green-200 text-green-600 hover:bg-green-100'
                                    : 'bg-gray-900 text-white hover:bg-gray-800'
                                }`}
                        >
                            {item.is_locked ? (
                                <><Lock size={14} /> Locked</>
                            ) : (
                                <><Unlock size={14} /> Lock University</>
                            )}
                        </button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Your Shortlist</h1>
                    <p className="text-gray-500 text-sm">{shortlist.length} universities shortlisted</p>
                </div>
                <Link
                    to="/discover"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                >
                    Add More <ArrowRight size={16} />
                </Link>
            </div>

            {shortlist.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
                    <Target size={40} className="mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No universities shortlisted</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        Start discovering universities and categorize them as Reach, Target, or Safety.
                    </p>
                    <Link
                        to="/discover"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                    >
                        Discover Universities <ArrowRight size={16} />
                    </Link>
                </div>
            ) : (
                <div className="space-y-10">
                    {/* Reach Universities */}
                    {reachUniversities.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-5">
                                <span className="px-3 py-1.5 bg-purple-100 text-purple-600 text-xs font-medium rounded-lg">
                                    DREAM
                                </span>
                                <span className="text-gray-400 text-sm">
                                    {reachUniversities.length} universities • Higher admission difficulty
                                </span>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {reachUniversities.map(renderUniversityCard)}
                            </div>
                        </section>
                    )}

                    {/* Target Universities */}
                    {targetUniversities.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-5">
                                <span className="px-3 py-1.5 bg-blue-100 text-blue-600 text-xs font-medium rounded-lg">
                                    TARGET
                                </span>
                                <span className="text-gray-400 text-sm">
                                    {targetUniversities.length} universities • Good fit for your profile
                                </span>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {targetUniversities.map(renderUniversityCard)}
                            </div>
                        </section>
                    )}

                    {/* Safety Universities */}
                    {safetyUniversities.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-5">
                                <span className="px-3 py-1.5 bg-green-100 text-green-600 text-xs font-medium rounded-lg">
                                    SAFE
                                </span>
                                <span className="text-gray-400 text-sm">
                                    {safetyUniversities.length} universities • Higher admission likelihood
                                </span>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {safetyUniversities.map(renderUniversityCard)}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    )
}
