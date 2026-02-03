// University API service using HIPOLABS University Domains List (Raw JSON via HTTPS)
// https://github.com/Hipo/university-domains-list

// We fetch the full list from GitHub (HTTPS) to avoid Mixed Content errors on Vercel
// and to enable fast client-side filtering.
const DATA_URL = 'https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json'

export interface UniversityAPI {
    name: string
    country: string
    alpha_two_code: string
    'state-province': string | null
    domains: string[]
    web_pages: string[]
}

export interface University {
    id: string
    name: string
    country: string
    state?: string
    website?: string
    domain?: string
    // Extended fields (we'll estimate these)
    ranking?: number
    tuitionMin?: number
    tuitionMax?: number
    acceptanceRate?: number
}

// Estimated tuition ranges by country (USD/year)
const TUITION_RANGES: Record<string, { min: number; max: number }> = {
    'United States': { min: 25000, max: 60000 },
    'United Kingdom': { min: 18000, max: 45000 },
    'Canada': { min: 15000, max: 40000 },
    'Australia': { min: 20000, max: 45000 },
    'Germany': { min: 500, max: 20000 },
    'France': { min: 3000, max: 25000 },
    'Netherlands': { min: 10000, max: 25000 },
    'Ireland': { min: 12000, max: 30000 },
    'New Zealand': { min: 18000, max: 35000 },
    'Singapore': { min: 15000, max: 40000 },
}

// Generate a pseudo-random but consistent ranking based on university name
const generateRanking = (name: string): number => {
    let hash = 0
    for (let i = 0; i < name.length; i++) {
        hash = ((hash << 5) - hash) + name.charCodeAt(i)
        hash = hash & hash
    }
    // Known top universities get better rankings
    const topUniversities = [
        'Harvard', 'MIT', 'Stanford', 'Oxford', 'Cambridge', 'Caltech',
        'Princeton', 'Yale', 'Columbia', 'Chicago', 'Imperial', 'ETH',
        'Toronto', 'Berkeley', 'UCLA'
    ]
    const isTop = topUniversities.some(top => name.toLowerCase().includes(top.toLowerCase()))
    if (isTop) {
        return Math.abs(hash % 50) + 1
    }
    return Math.abs(hash % 500) + 50
}

// Transform API response to our University type
const transformUniversity = (uni: UniversityAPI): University => {
    const tuition = TUITION_RANGES[uni.country] || { min: 10000, max: 30000 }

    return {
        id: btoa(encodeURIComponent(`${uni.name}-${uni.country}`)).replace(/=/g, ''),
        name: uni.name,
        country: uni.country,
        state: uni['state-province'] || undefined,
        website: uni.web_pages[0] || undefined,
        domain: uni.domains[0] || undefined,
        ranking: generateRanking(uni.name),
        tuitionMin: tuition.min,
        tuitionMax: tuition.max,
        acceptanceRate: 10 + Math.random() * 60, // Random 10-70%
    }
}

// Cache for the full list
let cachedUniversities: UniversityAPI[] | null = null

async function fetchAllUniversities(): Promise<UniversityAPI[]> {
    if (cachedUniversities) return cachedUniversities

    try {
        const response = await fetch(DATA_URL)
        if (!response.ok) throw new Error('Failed to fetch university data')
        const data = await response.json()
        cachedUniversities = data
        return data
    } catch (error) {
        console.error('Error loading university data:', error)
        return []
    }
}

export async function searchUniversities(
    country?: string,
    name?: string
): Promise<University[]> {
    try {
        const allUniversities = await fetchAllUniversities()

        let filtered = allUniversities

        if (country) {
            // Case-insensitive exact match for country
            filtered = filtered.filter(u => u.country.toLowerCase() === country.toLowerCase())
        }

        if (name) {
            const lowerName = name.toLowerCase()
            filtered = filtered.filter(u => u.name.toLowerCase().includes(lowerName))
        }

        // If no filters, limit default to US for relevance (or just top ranked globally)
        if (!country && !name) {
            filtered = filtered.filter(u => u.country === 'United States')
        }

        // Transform and sort
        const results = filtered
            .map(transformUniversity)
            .sort((a, b) => (a.ranking || 999) - (b.ranking || 999))

        // Slice for pagination/performance
        return results.slice(0, 50)

    } catch (error) {
        console.error('Error searching universities:', error)
        return []
    }
}

export async function getUniversitiesByCountries(
    countries: string[]
): Promise<University[]> {
    try {
        const allUniversities = await fetchAllUniversities()

        const lowerCountries = countries.map(c => c.toLowerCase())

        const filtered = allUniversities.filter(u =>
            lowerCountries.includes(u.country.toLowerCase())
        )

        return filtered
            .map(transformUniversity)
            .sort((a, b) => (a.ranking || 999) - (b.ranking || 999))
            .slice(0, 50)

    } catch (error) {
        console.error('Error fetching universities by country:', error)
        return []
    }
}

export async function searchUniversityByName(name: string): Promise<University[]> {
    return searchUniversities(undefined, name)
}
