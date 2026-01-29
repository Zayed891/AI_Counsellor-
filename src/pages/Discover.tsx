import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useUser } from '@/context/UserContext'
import Navbar from '@/components/Navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Search,
    Filter,
    GraduationCap,
    MapPin,
    DollarSign,
    Trophy,
    Plus,
    Check,
    ExternalLink,
    Loader2,
} from 'lucide-react'
import { searchUniversities, getUniversitiesByCountries } from '@/lib/universityApi'
import type { University } from '@/lib/universityApi'

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

export default function Discover() {
    const { profile } = useAuth()
    const { shortlist, addToShortlist } = useUser()
    const [universities, setUniversities] = useState<University[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCountry, setSelectedCountry] = useState<string>('')
    const [budgetFilter, setBudgetFilter] = useState<string>('')
    const [addingId, setAddingId] = useState<string | null>(null)

    useEffect(() => {
        loadUniversities()
    }, [])

    const loadUniversities = async () => {
        setLoading(true)
        try {
            let results: University[]

            // Use user's target countries if available
            if (profile?.target_countries && profile.target_countries.length > 0) {
                results = await getUniversitiesByCountries(profile.target_countries)
            } else {
                results = await searchUniversities('United States')
            }

            setUniversities(results)
        } catch (error) {
            console.error('Error loading universities:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async () => {
        setLoading(true)
        try {
            let results: University[]

            if (searchQuery) {
                results = await searchUniversities(selectedCountry || undefined, searchQuery)
            } else if (selectedCountry) {
                results = await searchUniversities(selectedCountry)
            } else {
                results = await searchUniversities('United States')
            }

            setUniversities(results)
        } catch (error) {
            console.error('Error searching universities:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCountryFilter = async (country: string) => {
        setSelectedCountry(country === selectedCountry ? '' : country)
        setLoading(true)
        try {
            if (country === selectedCountry) {
                // Deselect - load default
                const results = await searchUniversities('United States')
                setUniversities(results)
            } else {
                const results = await searchUniversities(country)
                setUniversities(results)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleAddToShortlist = async (university: University, category: 'reach' | 'target' | 'safety') => {
        setAddingId(university.id)
        try {
            await addToShortlist({
                id: university.id,
                name: university.name,
                country: university.country,
                city: university.state,
                ranking: university.ranking,
                tuition_min: university.tuitionMin,
                tuition_max: university.tuitionMax,
                website: university.website,
            }, category)
        } finally {
            setAddingId(null)
        }
    }

    const isInShortlist = (universityId: string) => {
        return shortlist.some(s => s.university_id === universityId)
    }

    // AI-driven categorization based on profile
    const getAISuggestion = (university: University): { category: 'reach' | 'target' | 'safety', reason: string } => {
        const userGPA = profile?.gpa || 0
        const userBudget = profile?.budget_max || 100000
        const hasExams = !!(profile?.ielts || profile?.toefl)

        // Higher ranking = more competitive (lower number = higher rank)
        const ranking = university.ranking || 500
        const tuition = university.tuitionMin || university.tuitionMax || 30000

        // Dream: Top 50 ranking OR significantly above budget OR GPA < 3.5
        if (ranking <= 50 || tuition > userBudget * 1.2 || (userGPA < 3.5 && ranking <= 100)) {
            return {
                category: 'reach',
                reason: ranking <= 50 ? 'Highly competitive' : tuition > userBudget ? 'Above budget' : 'GPA challenge'
            }
        }

        // Safety: Ranking > 200 AND within budget AND GPA >= 3.0
        if (ranking > 200 && tuition <= userBudget && userGPA >= 3.0) {
            return {
                category: 'safety',
                reason: 'Good fit for your profile'
            }
        }

        // Target: Everything in between
        return {
            category: 'target',
            reason: 'Matches your profile'
        }
    }

    // Cost affordability tier based on user's budget
    const getCostTier = (university: University): { tier: 'low' | 'medium' | 'high', label: string, color: string } => {
        const userBudget = profile?.budget_max || 100000
        const tuition = university.tuitionMin || university.tuitionMax || 30000
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
    const getAcceptanceTier = (university: University): { tier: 'low' | 'medium' | 'high', label: string, color: string } => {
        const userGPA = profile?.gpa || 0
        const hasEnglishTest = !!(profile?.ielts || profile?.toefl)
        const hasGradTest = !!(profile?.gre || profile?.gmat)
        const ranking = university.ranking || 500

        // Calculate a simple score
        let score = 0

        // GPA contribution (0-40 points)
        if (userGPA >= 3.8) score += 40
        else if (userGPA >= 3.5) score += 30
        else if (userGPA >= 3.0) score += 20
        else score += 10

        // Test contribution (0-30 points)
        if (hasEnglishTest) score += 15
        if (hasGradTest) score += 15

        // Ranking adjustment (0-30 points) - easier to get into lower ranked schools
        if (ranking > 200) score += 30
        else if (ranking > 100) score += 20
        else if (ranking > 50) score += 10

        if (score >= 70) {
            return { tier: 'high', label: 'High Chance', color: 'bg-green-500/20 border-green-500/40 text-green-400' }
        } else if (score >= 40) {
            return { tier: 'medium', label: 'Moderate Chance', color: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400' }
        } else {
            return { tier: 'low', label: 'Competitive', color: 'bg-red-500/20 border-red-500/40 text-red-400' }
        }
    }

    const filteredUniversities = universities.filter(uni => {
        if (budgetFilter) {
            const maxBudget = parseInt(budgetFilter)
            if (uni.tuitionMin && uni.tuitionMin > maxBudget) return false
        }
        return true
    })

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 pt-24 pb-20">
                {/* Header */}
                <div className="mb-10 border-b border-white/10 pb-8">
                    <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 text-white tracking-tight">Discover Universities</h1>
                    <p className="text-neutral-400 text-lg max-w-2xl">
                        Find and shortlist universities that match your profile using our AI-powered database.
                    </p>
                </div>

                {/* Search & Filters */}
                <Card className="mb-10 bg-[#0A0A0A] border-white/10 p-0 overflow-hidden">
                    <CardContent className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row gap-6 mb-6">
                            <div className="flex-1 relative">
                                <Search
                                    size={20}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
                                />
                                <Input
                                    placeholder="Search universities..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="pl-12 bg-neutral-900 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/30 h-12"
                                />
                            </div>
                            <div className="flex gap-3">
                                <div className="relative">
                                    <DollarSign
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Budget Limit"
                                        value={budgetFilter}
                                        onChange={(e) => setBudgetFilter(e.target.value)}
                                        className="pl-11 w-48 bg-neutral-900 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/30 h-12"
                                    />
                                </div>
                                <Button variant="sharp" onClick={handleSearch} className="h-12 px-8">
                                    <Filter size={18} className="mr-2" /> FILTER
                                </Button>
                            </div>
                        </div>

                        {/* Country Filters */}
                        <div>
                            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-3">Filter by Country</p>
                            <div className="flex flex-wrap gap-2">
                                {COUNTRIES.map((country) => (
                                    <Badge
                                        key={country}
                                        variant={selectedCountry === country ? 'secondary' : 'outline'}
                                        className={`cursor-pointer px-4 py-2 border-white/10 ${selectedCountry === country
                                            ? 'bg-white text-black hover:bg-neutral-200'
                                            : 'text-neutral-400 hover:text-white hover:border-white/30 hover:bg-neutral-900'
                                            }`}
                                        onClick={() => handleCountryFilter(country)}
                                    >
                                        {country}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results */}
                {loading ? (
                    <div className="flex items-center justify-center py-32">
                        <Loader2 size={48} className="animate-spin text-white" />
                    </div>
                ) : filteredUniversities.length === 0 ? (
                    <div className="text-center py-32 border border-dashed border-white/10 rounded-lg">
                        <GraduationCap size={48} className="mx-auto mb-4 text-neutral-700" />
                        <p className="text-neutral-500 text-lg">No universities found matching your criteria.</p>
                        <Button variant="link" className="text-white mt-2" onClick={() => {
                            setSearchQuery('');
                            setSelectedCountry('');
                            setBudgetFilter('');
                            handleSearch();
                        }}>
                            Clear all filters
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm font-mono text-neutral-500">
                                SHOWING {filteredUniversities.length} UNIVERSITIES
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredUniversities.map((university) => (
                                <Card
                                    key={university.id}
                                    className="bg-[#0A0A0A] border-white/10 hover:border-white/30 transition-all duration-300 group"
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="w-12 h-12 bg-neutral-900 border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-300">
                                                <GraduationCap size={24} />
                                            </div>
                                            <Badge variant="outline" className="text-[10px] font-mono border-white/20 text-neutral-400 bg-transparent">
                                                RANK #{university.ranking}
                                            </Badge>
                                        </div>

                                        <h3 className="font-bold text-xl mb-2 text-white line-clamp-2 min-h-[3.5rem]">
                                            {university.name}
                                        </h3>

                                        <div className="flex items-center gap-2 text-sm text-neutral-400 mb-6 font-mono">
                                            <MapPin size={14} />
                                            <span className="truncate">{university.state ? `${university.state}, ` : ''}{university.country}</span>
                                        </div>

                                        <div className="border-t border-white/5 pt-4 mb-4">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-neutral-500 font-mono text-xs uppercase">Est. Tuition</span>
                                                <div className="flex items-center gap-1 text-white font-medium">
                                                    <span>
                                                        ${university.tuitionMin?.toLocaleString()} - ${university.tuitionMax?.toLocaleString()}/yr
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* AI Suggestion Badge */}
                                        {(() => {
                                            const suggestion = getAISuggestion(university)
                                            const categoryColors = {
                                                reach: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
                                                target: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
                                                safety: 'bg-green-500/10 border-green-500/30 text-green-400'
                                            }
                                            const categoryLabels = { reach: 'DREAM', target: 'TARGET', safety: 'SAFE' }
                                            return (
                                                <div className={`flex items-center justify-between p-3 border mb-3 ${categoryColors[suggestion.category]}`}>
                                                    <div>
                                                        <p className="text-[10px] font-mono uppercase tracking-wider opacity-70">AI Suggestion</p>
                                                        <p className="text-sm font-medium">{categoryLabels[suggestion.category]}</p>
                                                    </div>
                                                    <p className="text-xs opacity-70">{suggestion.reason}</p>
                                                </div>
                                            )
                                        })()}

                                        {/* Cost & Acceptance Tiers */}
                                        <div className="grid grid-cols-2 gap-2 mb-4">
                                            {(() => {
                                                const costTier = getCostTier(university)
                                                return (
                                                    <div className={`p-2 border ${costTier.color}`}>
                                                        <p className="text-[9px] font-mono uppercase tracking-wider opacity-70">Cost</p>
                                                        <p className="text-xs font-medium">{costTier.label}</p>
                                                    </div>
                                                )
                                            })()}
                                            {(() => {
                                                const acceptTier = getAcceptanceTier(university)
                                                return (
                                                    <div className={`p-2 border ${acceptTier.color}`}>
                                                        <p className="text-[9px] font-mono uppercase tracking-wider opacity-70">Admission</p>
                                                        <p className="text-xs font-medium">{acceptTier.label}</p>
                                                    </div>
                                                )
                                            })()}
                                        </div>

                                        {isInShortlist(university.id) ? (
                                            <Button variant="outline" className="w-full border-white/20 text-neutral-300 bg-neutral-900/50 cursor-default hover:bg-neutral-900/50">
                                                <Check size={16} className="mr-2" /> SHORTLISTED
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="sharp"
                                                className="w-full text-[10px] sm:text-xs font-mono uppercase tracking-wider bg-white text-black hover:bg-neutral-200 h-10 cursor-pointer"
                                                onClick={() => handleAddToShortlist(university, getAISuggestion(university).category)}
                                                disabled={addingId === university.id}
                                            >
                                                {addingId === university.id ? (
                                                    <Loader2 size={16} className="animate-spin" />
                                                ) : (
                                                    <>
                                                        <Plus size={16} className="mr-2" /> ADD AS {getAISuggestion(university).category === 'reach' ? 'DREAM' : getAISuggestion(university).category === 'target' ? 'TARGET' : 'SAFE'}
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}
