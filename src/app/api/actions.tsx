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
    returnDate?: string
}

async function getFlightsData(search: GetFlightsArgs) {
    const API_PATH = '/api/v2/flights/searchFlights?'

    const params = new URLSearchParams({
        originSkyId: search.originSkyId,
        originEntityId: search.originEntityId,
        destinationSkyId: search.destinationSkyId,
        destinationEntityId: search.destinationEntityId,
        date: search.date,
        returnDate: search.returnDate || ''
    })
    const url = `${process.env.API_URL}${API_PATH}${params.toString()}`
    try {
        return fetch(url, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': process.env.API_HOST || '',
                'x-rapidapi-key': process.env.API_KEY || ''
            },
            credentials: 'omit'
        })
            .then((res) => res.json())
            .then((data) => {
                return data.data as FlightData
            })
    }
    catch {
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
        return fetch(url, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': process.env.API_HOST || '',
                'x-rapidapi-key': process.env.API_KEY || ''
            },
            credentials: 'omit'
        })
            .then((res) => res.json())
            .then((data) => data.data as AirportData[])
    }
    catch (_error) {
        // console.error('ERROR FETCH FAILED', error)
        throw new Error('Error fetching airport')
    }
}

export async function getFlights(query: QuerySchemaType) {
    const originQuery = getAirport(query.origin)
    const destinationQuery = getAirport(query.destination)

    const [originData, destinationData] = await Promise.all([originQuery, destinationQuery])

    if (!originData || !destinationData || originData.length === 0 || destinationData.length === 0)
        throw new Error('No airports found')
    try {
        let flights: FlightData | null = null


        // NOTE: To save on API costs, we only fetch the first airport in each list
        for (let originAirportIndex = 0; originAirportIndex < 1; originAirportIndex++) {
            if (!originData[originAirportIndex]) continue

            for (let destinationAirportIndex = 0; destinationAirportIndex < 1; destinationAirportIndex++) {
                if (!destinationData[destinationAirportIndex]) continue

                const flightsData = await getFlightsData({
                    originSkyId: originData[originAirportIndex].skyId,
                    originEntityId: originData[originAirportIndex].entityId,
                    destinationSkyId: destinationData[destinationAirportIndex].skyId,
                    destinationEntityId: destinationData[destinationAirportIndex].entityId,
                    date: query.dateRange.from,
                    returnDate: query.dateRange.to || undefined,
                }).then((data) => {
                    if (!data) throw new Error('No flights found')
                    return data as FlightData
                })

                flights = flightsData
            }
        }

        // Return the data to the client
        return {
            origin: originData,
            destination: destinationData,
            flights,
        }
    }
    catch (error) {
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