// University API service using HIPOLABS Universities API
// https://github.com/Hipo/university-domains-list-api

const API_BASE = 'http://universities.hipolabs.com'

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
        id: btoa(`${uni.name}-${uni.country}`).replace(/=/g, ''),
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

export async function searchUniversities(
    country?: string,
    name?: string
): Promise<University[]> {
    try {
        let url = `${API_BASE}/search?`
        const params: string[] = []

        if (country) {
            params.push(`country=${encodeURIComponent(country)}`)
        }
        if (name) {
            params.push(`name=${encodeURIComponent(name)}`)
        }

        if (params.length === 0) {
            // Default search - get US universities
            params.push('country=United States')
        }

        url += params.join('&')

        const response = await fetch(url)
        if (!response.ok) {
            throw new Error('Failed to fetch universities')
        }

        const data: UniversityAPI[] = await response.json()

        // Transform and limit results
        return data
            .slice(0, 100)
            .map(transformUniversity)
            .sort((a, b) => (a.ranking || 999) - (b.ranking || 999))
    } catch (error) {
        console.error('Error fetching universities:', error)
        return []
    }
}

export async function getUniversitiesByCountries(
    countries: string[]
): Promise<University[]> {
    try {
        const promises = countries.map(country => searchUniversities(country))
        const results = await Promise.all(promises)

        // Flatten and sort by ranking
        return results
            .flat()
            .sort((a, b) => (a.ranking || 999) - (b.ranking || 999))
            .slice(0, 100)
    } catch (error) {
        console.error('Error fetching universities:', error)
        return []
    }
}

export async function searchUniversityByName(name: string): Promise<University[]> {
    return searchUniversities(undefined, name)
}
