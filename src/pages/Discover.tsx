import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useUser } from '@/context/UserContext'
import { Input } from '@/components/ui/input'
import {
    Search,
    Filter,
    GraduationCap,
    MapPin,
    DollarSign,
    Plus,
    Check,
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
    }, [profile?.target_countries])

    const loadUniversities = async () => {
        setLoading(true)
        try {
            let results: University[]
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

    const getAISuggestion = (university: University): { category: 'reach' | 'target' | 'safety', reason: string } => {
        const userGPA = profile?.gpa || 0
        const userBudget = profile?.budget_max || 100000
        const ranking = university.ranking || 500
        const tuition = university.tuitionMin || university.tuitionMax || 30000

        if (ranking <= 50 || tuition > userBudget * 1.2 || (userGPA < 3.5 && ranking <= 100)) {
            return {
                category: 'reach',
                reason: ranking <= 50 ? 'Highly competitive' : tuition > userBudget ? 'Above budget' : 'GPA challenge'
            }
        }

        if (ranking > 200 && tuition <= userBudget && userGPA >= 3.0) {
            return { category: 'safety', reason: 'Good fit for your profile' }
        }

        return { category: 'target', reason: 'Matches your profile' }
    }

    const getCostTier = (university: University): { tier: 'low' | 'medium' | 'high', label: string, color: string } => {
        const userBudget = profile?.budget_max || 100000
        const tuition = university.tuitionMin || university.tuitionMax || 30000
        const ratio = tuition / userBudget

        if (ratio <= 0.6) {
            return { tier: 'low', label: 'Affordable', color: 'bg-green-100 text-green-600' }
        } else if (ratio <= 1.0) {
            return { tier: 'medium', label: 'Within Budget', color: 'bg-yellow-100 text-yellow-600' }
        } else {
            return { tier: 'high', label: 'Above Budget', color: 'bg-red-100 text-red-600' }
        }
    }

    const getAcceptanceTier = (university: University): { tier: 'low' | 'medium' | 'high', label: string, color: string } => {
        const userGPA = profile?.gpa || 0
        const hasEnglishTest = !!(profile?.ielts || profile?.toefl)
        const hasGradTest = !!(profile?.gre || profile?.gmat)
        const ranking = university.ranking || 500

        let score = 0
        if (userGPA >= 3.8) score += 40
        else if (userGPA >= 3.5) score += 30
        else if (userGPA >= 3.0) score += 20
        else score += 10

        if (hasEnglishTest) score += 15
        if (hasGradTest) score += 15
        if (ranking > 200) score += 30
        else if (ranking > 100) score += 20
        else if (ranking > 50) score += 10

        if (score >= 70) {
            return { tier: 'high', label: 'High Chance', color: 'bg-green-100 text-green-600' }
        } else if (score >= 40) {
            return { tier: 'medium', label: 'Moderate', color: 'bg-yellow-100 text-yellow-600' }
        } else {
            return { tier: 'low', label: 'Competitive', color: 'bg-red-100 text-red-600' }
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
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Discover Universities</h1>
                <p className="text-gray-500 text-sm">Find universities that match your profile</p>
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm mb-6">
                <div className="flex flex-col md:flex-row gap-4 mb-5">
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Search universities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-300 h-11 rounded-xl"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1 sm:flex-none">
                            <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input
                                type="number"
                                placeholder="Max Budget"
                                value={budgetFilter}
                                onChange={(e) => setBudgetFilter(e.target.value)}
                                className="pl-9 w-full sm:w-36 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-300 h-11 rounded-xl"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="px-5 h-11 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                        >
                            <Filter size={16} /> Filter
                        </button>
                    </div>
                </div>

                {/* Country Filters */}
                <div>
                    <p className="text-xs font-medium text-gray-500 mb-3">Filter by Country</p>
                    <div className="flex flex-wrap gap-2">
                        {COUNTRIES.map((country) => (
                            <button
                                key={country}
                                onClick={() => handleCountryFilter(country)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedCountry === country
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {country}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={32} className="animate-spin text-gray-400" />
                </div>
            ) : filteredUniversities.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                    <GraduationCap size={40} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No universities found matching your criteria.</p>
                    <button
                        onClick={() => { setSearchQuery(''); setSelectedCountry(''); setBudgetFilter(''); handleSearch(); }}
                        className="text-gray-900 font-medium text-sm mt-2 hover:underline"
                    >
                        Clear all filters
                    </button>
                </div>
            ) : (
                <>
                    <p className="text-sm text-gray-400 mb-4">{filteredUniversities.length} universities found</p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredUniversities.map((university) => {
                            const suggestion = getAISuggestion(university)
                            const costTier = getCostTier(university)
                            const acceptTier = getAcceptanceTier(university)
                            const categoryColors = {
                                reach: 'bg-purple-100 text-purple-600',
                                target: 'bg-blue-100 text-blue-600',
                                safety: 'bg-green-100 text-green-600'
                            }
                            const categoryLabels = { reach: 'Dream', target: 'Target', safety: 'Safe' }

                            return (
                                <div
                                    key={university.id}
                                    className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                                            <GraduationCap size={20} className="text-gray-500" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-400">#{university.ranking}</span>
                                    </div>

                                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
                                        {university.name}
                                    </h3>

                                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
                                        <MapPin size={14} />
                                        <span className="truncate">{university.state ? `${university.state}, ` : ''}{university.country}</span>
                                    </div>

                                    <div className="border-t border-gray-100 pt-4 mb-4">
                                        <div className="flex items-center justify-between text-sm mb-3">
                                            <span className="text-gray-400">Tuition</span>
                                            <span className="font-medium text-gray-900">
                                                ${university.tuitionMin?.toLocaleString()} - ${university.tuitionMax?.toLocaleString()}/yr
                                            </span>
                                        </div>

                                        {/* AI Suggestion */}
                                        <div className={`flex items-center justify-between p-2.5 rounded-xl mb-3 ${categoryColors[suggestion.category]}`}>
                                            <span className="text-xs font-medium">{categoryLabels[suggestion.category]}</span>
                                            <span className="text-xs opacity-70">{suggestion.reason}</span>
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
                                    </div>

                                    {isInShortlist(university.id) ? (
                                        <button className="w-full py-2.5 bg-gray-100 text-gray-500 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                                            <Check size={16} /> Shortlisted
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleAddToShortlist(university, suggestion.category)}
                                            disabled={addingId === university.id}
                                            className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                        >
                                            {addingId === university.id ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : (
                                                <>
                                                    <Plus size={16} /> Add as {categoryLabels[suggestion.category]}
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </>
            )}
        </div>
    )
}
