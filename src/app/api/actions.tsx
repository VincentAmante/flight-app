'use server'
import { FlightData, SAMPLE_RESULT, AirportData } from "../../../utils/airscrapper-types"
import { QuerySchema, QuerySchemaType } from "../../../utils/airscrapper-schemas"
import MOCK_RESULT from "../../../utils/mock-result.json"

interface GetFlightsArgs {
    originSkyId: string
    originEntityId: string
    destinationSkyId: string
    destinationEntityId: string
    date: string
    returnDate: string
    cabinClass?: string
    adults?: string
    childrens?: string
    infants?: string
    sortBy?: string
    limit?: string
    carriersIds?: string
    currency?: string
}

async function getFlightsData(search: GetFlightsArgs) {
    const API_PATH = '/api/v2/flights/searchFlights?'

    const searchFiltered = {
        originSkyId: search.originSkyId,
        originEntityId: search.originEntityId,
        destinationSkyId: search.destinationSkyId,
        destinationEntityId: search.destinationEntityId,
        date: search.date,
        returnDate: search.returnDate,
        adults: search.adults,
        childrens: search.childrens,
        infants: search.infants,
        carriersIds: search.carriersIds,
        // currency: search.currency || 'USD',
        limit: search.limit || '10',
    } satisfies GetFlightsArgs

    const searchParsed = Object.fromEntries(
        Object.entries(searchFiltered).filter(
            ([_, value]) => value !== '' && value !== '0'
        )
    )
    const params = new URLSearchParams({ ...searchParsed as unknown as GetFlightsArgs})
    const url = `${process.env.API_URL}${API_PATH}${params.toString()}`
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': process.env.API_HOST || '',
                'x-rapidapi-key': process.env.API_KEY || ''
            },
            credentials: 'omit'
        })
        if (!response.ok) {
            console.warn(`Failed to fetch flights: ${response.statusText}`)
            return null
        }
        const data = await response.json()
        return data.data as FlightData
    } catch (error) {
        console.error('Error fetching flights:', error)
        throw new Error('Failed to fetch flights')
    }
}

async function getAirport(location: string): Promise<AirportData[]> {
    const API_PATH = '/api/v1/flights/searchAirport?'

    const params = new URLSearchParams({
        query: location,
    })
    const url = `${process.env.API_URL}${API_PATH}${params.toString()}`
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': process.env.API_HOST || '',
                'x-rapidapi-key': process.env.API_KEY || ''
            },
            credentials: 'omit'
        })
        if (!response.ok) {
            console.warn(`Failed to fetch airport: ${response.statusText}`)
            return []
        }
        const data = await response.json()
        return data.data as AirportData[]
    } catch (error) {
        console.error('Error fetching airport:', error)
        throw new Error('Error fetching airport')
    }
}

export async function getFlights(query: QuerySchemaType): Promise<FlightsData> {
    try {
        const originQuery = getAirport(query.origin)
        const destinationQuery = getAirport(query.destination)
        const [originData, destinationData] = await Promise.all([originQuery, destinationQuery])

        if (!originData || !destinationData || originData.length === 0 || destinationData.length === 0) {
            return {
                origin: [],
                destination: [],
                flights: undefined
            }
        }

        let flights: FlightData | undefined = undefined

        // NOTE: To save on API costs, we only fetch the first airport in each list
        for (let originAirportIndex = 0; originAirportIndex < 1; originAirportIndex++) {
            if (!originData[originAirportIndex]) continue

            for (let destinationAirportIndex = 0; destinationAirportIndex < 1; destinationAirportIndex++) {
                if (!destinationData[destinationAirportIndex]) continue

                const flightsData = await getFlightsData({
                    ...query,
                    originSkyId: originData[originAirportIndex].skyId,
                    originEntityId: originData[originAirportIndex].entityId,
                    destinationSkyId: destinationData[destinationAirportIndex].skyId,
                    destinationEntityId: destinationData[destinationAirportIndex].entityId,
                    date: query.dateRange.from,
                    returnDate: query.dateRange.to,
                })

                if (!flightsData) continue
                flights = flightsData
            }
        }


        // Return the data to the client
        return {
            origin: originData,
            destination: destinationData,
            flights,
        }
    } catch (error) {
        console.error(error)
        throw new Error('Error fetching flight data')
    }
}

interface FlightsData {
    origin: AirportData[]
    destination: AirportData[]
    flights?: FlightData
}
export async function getFlightsMock(query: QuerySchemaType): Promise<FlightsData> {
    await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 2000)))
    return MOCK_RESULT satisfies FlightsData
}
