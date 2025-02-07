// * AIRPORTS DATA TYPES *
export interface AirportsData {
    status: boolean;
    timestamp: number;
    data?: (AirportData)[] | null;
}
export interface AirportData {
    skyId: string;
    entityId: string;
    presentation: Presentation;
    navigation: Navigation;
}
export interface Presentation {
    title: string;
    suggestionTitle: string;
    subtitle: string;
}
export interface Navigation {
    entityId: string;
    entityType: string;
    localizedName: string;
    relevantFlightParams: RelevantFlightParams;
    relevantHotelParams: RelevantHotelParams;
}
export interface RelevantFlightParams {
    skyId: string;
    entityId: string;
    flightPlaceType: string;
    localizedName: string;
}
export interface RelevantHotelParams {
    entityId: string;
    entityType: string;
    localizedName: string;
}
// * AIRPORTS DATA TYPES *



// * FLIGHTS DATA TYPES *
export interface FlightsData {
    status: boolean;
    timestamp: number;
    sessionId: string;
    data: FlightData;
}

export interface FlightData {
    context: Context;
    itineraries?: (ItinerariesEntity)[] | null;
    messages?: (null)[] | null;
    filterStats: FilterStats;
    flightsSessionId: string;
    destinationImageUrl: string;
}

export interface Context {
    status: string;
    sessionId: string;
    totalResults: number;
}

export interface ItinerariesEntity {
    id: string;
    price?: Price;
    legs?: (LegsEntity)[] | null;
    isSelfTransfer?: boolean;
    isProtectedSelfTransfer?: boolean;
    farePolicy?: FarePolicy;
    fareAttributes?: FareAttributes;
    tags?: (string)[] | null;
    isMashUp?: boolean;
    hasFlexibleOptions?: boolean;
    score?: number;
}

export interface Price {
    raw: number;
    formatted: string;
    pricingOptionId: string;
}

export interface LegsEntity {
    id: string;
    origin: LegStop;
    destination: LegStop;
    durationInMinutes: number;
    stopCount: number;
    isSmallestStops: boolean;
    departure: string;
    arrival: string;
    timeDeltaInDays: number;
    carriers: Carriers;
    segments?: (SegmentsEntity)[] | null;
}

export interface LegStop {
    id: string;
    entityId: string;
    name: string;
    displayCode: string;
    city: string;
    country: string;
    isHighlighted: boolean;
}

export interface Carriers {
    marketing?: (CarrierEntity)[] | null;
    operating?: (CarrierEntity)[] | null;
    operationType: string;
}

export interface SegmentsEntity {
    id: string;
    origin: SegmentStop;
    destination: SegmentStop;
    departure: string;
    arrival: string;
    durationInMinutes: number;
    flightNumber: string;
    marketingCarrier: CarrierEntity;
    operatingCarrier: CarrierEntity;
}

export interface SegmentStop {
    flightPlaceId: string;
    displayCode: string;
    parent: Parent;
    name: string;
    type: string;
    country: string;
}

export interface Parent {
    flightPlaceId: string;
    displayCode: string;
    name: string;
    type: string;
}

export interface CarrierEntity {
    id: number;
    name: string;
    alternateId: string;
    allianceId?: number;
    displayCode?: string;
    logoUrl?: string;
}

export interface FarePolicy {
    isChangeAllowed: boolean;
    isPartiallyChangeable: boolean;
    isCancellationAllowed: boolean;
    isPartiallyRefundable: boolean;
}

export interface FareAttributes {
}

export interface FilterStats {
    duration: Duration;
    airports?: (Airports)[] | null;
    carriers?: (CarrierEntity)[] | null;
    stopPrices: StopPrices;
}

export interface Duration {
    min: number;
    max: number;
    multiCityMin: number;
    multiCityMax: number;
}

export interface Airports {
    city: string;
    airports?: (AirportsEntity)[] | null;
}

export interface AirportsEntity {
    id: string;
    entityId: string;
    name: string;
}

export interface StopPrices {
    direct: StopPrice;
    one: StopPrice;
    twoOrMore: StopPrice;
}

export interface StopPrice {
    isPresent: boolean;
    formattedPrice?: string;
}

export const SAMPLE_RESULT = {
    "status": true,
    "timestamp": 1738758108691,
    "sessionId": "60a9a2d8-89cd-4e01-9dbd-254e4791cdb3",
    "data": {
        "context": {
            "status": "incomplete",
            "sessionId": "Cl0IARJZCk4KJDYwYTlhMmQ4LTg5Y2QtNGUwMS05ZGJkLTI1NGU0NzkxY2RiMxACGiRjYTEyYjYwYy03OWY3LTRmMzYtOWEwOC04MDZkMmZhMGMzMTUQ1Oq8sM0yGAESKHVzc19iNjUwNWRiZi1hZjYyLTRlZWQtODg0OS0xNDc5ZTc3MmE1NDkiAlVT",
            "totalResults": 1
        },
        "itineraries": [
            {
                "id": "11182-2502060945--32348,-31661-2-12475-2502072345|12475-2502121357--31661,-32348-1-11182-2502131910",
                "price": {
                    "raw": 2372.8,
                    "formatted": "$2,373",
                    "pricingOptionId": "n18CroHCkYn_"
                },
                "legs": [
                    {
                        "id": "11182-2502060945--32348,-31661-2-12475-2502072345",
                        "origin": {
                            "id": "DXB",
                            "entityId": "95673506",
                            "name": "Dubai",
                            "displayCode": "DXB",
                            "city": "Dubai",
                            "country": "United Arab Emirates",
                            "isHighlighted": false
                        },
                        "destination": {
                            "id": "ILG",
                            "entityId": "95673449",
                            "name": "Greater Wilmington",
                            "displayCode": "ILG",
                            "city": "Wilmington",
                            "country": "United States",
                            "isHighlighted": false
                        },
                        "durationInMinutes": 2820,
                        "stopCount": 2,
                        "isSmallestStops": false,
                        "departure": "2025-02-06T09:45:00",
                        "arrival": "2025-02-07T23:45:00",
                        "timeDeltaInDays": 1,
                        "carriers": {
                            "marketing": [
                                {
                                    "id": -32348,
                                    "alternateId": "EK",
                                    "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/EK.png",
                                    "name": "Emirates"
                                },
                                {
                                    "id": -31661,
                                    "alternateId": "X1",
                                    "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/X1.png",
                                    "name": "Avelo Airlines"
                                }
                            ],
                            "operating": [
                                {
                                    "id": -31722,
                                    "alternateId": "UA",
                                    "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/UA.png",
                                    "name": "United"
                                },
                                {
                                    "id": -31661,
                                    "alternateId": "X1",
                                    "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/X1.png",
                                    "name": "Avelo Airlines"
                                }
                            ],
                            "operationType": "partially_operated"
                        },
                        "segments": [
                            {
                                "id": "11182-12389-2502060945-2502061620--32348",
                                "origin": {
                                    "flightPlaceId": "DXB",
                                    "displayCode": "DXB",
                                    "parent": {
                                        "flightPlaceId": "DXBA",
                                        "displayCode": "DXB",
                                        "name": "Dubai",
                                        "type": "City"
                                    },
                                    "name": "Dubai",
                                    "type": "Airport",
                                    "country": "United Arab Emirates"
                                },
                                "destination": {
                                    "flightPlaceId": "IAH",
                                    "displayCode": "IAH",
                                    "parent": {
                                        "flightPlaceId": "HOUA",
                                        "displayCode": "HOU",
                                        "name": "Houston",
                                        "type": "City"
                                    },
                                    "name": "Houston George Bush Intercntl.",
                                    "type": "Airport",
                                    "country": "United States"
                                },
                                "departure": "2025-02-06T09:45:00",
                                "arrival": "2025-02-06T16:20:00",
                                "durationInMinutes": 995,
                                "flightNumber": "211",
                                "marketingCarrier": {
                                    "id": -32348,
                                    "name": "Emirates",
                                    "alternateId": "EK",
                                    "allianceId": 0,
                                    "displayCode": ""
                                },
                                "operatingCarrier": {
                                    "id": -32348,
                                    "name": "Emirates",
                                    "alternateId": "EK",
                                    "allianceId": 0,
                                    "displayCode": ""
                                }
                            },
                            {
                                "id": "12389-13933-2502061835-2502062200--32348",
                                "origin": {
                                    "flightPlaceId": "IAH",
                                    "displayCode": "IAH",
                                    "parent": {
                                        "flightPlaceId": "HOUA",
                                        "displayCode": "HOU",
                                        "name": "Houston",
                                        "type": "City"
                                    },
                                    "name": "Houston George Bush Intercntl.",
                                    "type": "Airport",
                                    "country": "United States"
                                },
                                "destination": {
                                    "flightPlaceId": "MCO",
                                    "displayCode": "MCO",
                                    "parent": {
                                        "flightPlaceId": "ORLB",
                                        "displayCode": "ORL",
                                        "name": "Orlando",
                                        "type": "City"
                                    },
                                    "name": "Orlando International",
                                    "type": "Airport",
                                    "country": "United States"
                                },
                                "departure": "2025-02-06T18:35:00",
                                "arrival": "2025-02-06T22:00:00",
                                "durationInMinutes": 145,
                                "flightNumber": "6130",
                                "marketingCarrier": {
                                    "id": -32348,
                                    "name": "Emirates",
                                    "alternateId": "EK",
                                    "allianceId": 0,
                                    "displayCode": ""
                                },
                                "operatingCarrier": {
                                    "id": -31722,
                                    "name": "United",
                                    "alternateId": "UA",
                                    "allianceId": 0,
                                    "displayCode": ""
                                }
                            },
                            {
                                "id": "13933-12475-2502072123-2502072345--31661",
                                "origin": {
                                    "flightPlaceId": "MCO",
                                    "displayCode": "MCO",
                                    "parent": {
                                        "flightPlaceId": "ORLB",
                                        "displayCode": "ORL",
                                        "name": "Orlando",
                                        "type": "City"
                                    },
                                    "name": "Orlando International",
                                    "type": "Airport",
                                    "country": "United States"
                                },
                                "destination": {
                                    "flightPlaceId": "ILG",
                                    "displayCode": "ILG",
                                    "parent": {
                                        "flightPlaceId": "ILGA",
                                        "displayCode": "ILG",
                                        "name": "Wilmington",
                                        "type": "City"
                                    },
                                    "name": "Greater Wilmington",
                                    "type": "Airport",
                                    "country": "United States"
                                },
                                "departure": "2025-02-07T21:23:00",
                                "arrival": "2025-02-07T23:45:00",
                                "durationInMinutes": 142,
                                "flightNumber": "560",
                                "marketingCarrier": {
                                    "id": -31661,
                                    "name": "Avelo Airlines",
                                    "alternateId": "X1",
                                    "allianceId": 0,
                                    "displayCode": ""
                                },
                                "operatingCarrier": {
                                    "id": -31661,
                                    "name": "Avelo Airlines",
                                    "alternateId": "X1",
                                    "allianceId": 0,
                                    "displayCode": ""
                                }
                            }
                        ]
                    },
                    {
                        "id": "12475-2502121357--31661,-32348-1-11182-2502131910",
                        "origin": {
                            "id": "ILG",
                            "entityId": "95673449",
                            "name": "Greater Wilmington",
                            "displayCode": "ILG",
                            "city": "Wilmington",
                            "country": "United States",
                            "isHighlighted": false
                        },
                        "destination": {
                            "id": "DXB",
                            "entityId": "95673506",
                            "name": "Dubai",
                            "displayCode": "DXB",
                            "city": "Dubai",
                            "country": "United Arab Emirates",
                            "isHighlighted": false
                        },
                        "durationInMinutes": 1213,
                        "stopCount": 1,
                        "isSmallestStops": false,
                        "departure": "2025-02-12T13:57:00",
                        "arrival": "2025-02-13T19:10:00",
                        "timeDeltaInDays": 1,
                        "carriers": {
                            "marketing": [
                                {
                                    "id": -31661,
                                    "alternateId": "X1",
                                    "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/X1.png",
                                    "name": "Avelo Airlines"
                                },
                                {
                                    "id": -32348,
                                    "alternateId": "EK",
                                    "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/EK.png",
                                    "name": "Emirates"
                                }
                            ],
                            "operationType": "fully_operated"
                        },
                        "segments": [
                            {
                                "id": "12475-13933-2502121357-2502121636--31661",
                                "origin": {
                                    "flightPlaceId": "ILG",
                                    "displayCode": "ILG",
                                    "parent": {
                                        "flightPlaceId": "ILGA",
                                        "displayCode": "ILG",
                                        "name": "Wilmington",
                                        "type": "City"
                                    },
                                    "name": "Greater Wilmington",
                                    "type": "Airport",
                                    "country": "United States"
                                },
                                "destination": {
                                    "flightPlaceId": "MCO",
                                    "displayCode": "MCO",
                                    "parent": {
                                        "flightPlaceId": "ORLB",
                                        "displayCode": "ORL",
                                        "name": "Orlando",
                                        "type": "City"
                                    },
                                    "name": "Orlando International",
                                    "type": "Airport",
                                    "country": "United States"
                                },
                                "departure": "2025-02-12T13:57:00",
                                "arrival": "2025-02-12T16:36:00",
                                "durationInMinutes": 159,
                                "flightNumber": "561",
                                "marketingCarrier": {
                                    "id": -31661,
                                    "name": "Avelo Airlines",
                                    "alternateId": "X1",
                                    "allianceId": 0,
                                    "displayCode": ""
                                },
                                "operatingCarrier": {
                                    "id": -31661,
                                    "name": "Avelo Airlines",
                                    "alternateId": "X1",
                                    "allianceId": 0,
                                    "displayCode": ""
                                }
                            },
                            {
                                "id": "13933-11182-2502122020-2502131910--32348",
                                "origin": {
                                    "flightPlaceId": "MCO",
                                    "displayCode": "MCO",
                                    "parent": {
                                        "flightPlaceId": "ORLB",
                                        "displayCode": "ORL",
                                        "name": "Orlando",
                                        "type": "City"
                                    },
                                    "name": "Orlando International",
                                    "type": "Airport",
                                    "country": "United States"
                                },
                                "destination": {
                                    "flightPlaceId": "DXB",
                                    "displayCode": "DXB",
                                    "parent": {
                                        "flightPlaceId": "DXBA",
                                        "displayCode": "DXB",
                                        "name": "Dubai",
                                        "type": "City"
                                    },
                                    "name": "Dubai",
                                    "type": "Airport",
                                    "country": "United Arab Emirates"
                                },
                                "departure": "2025-02-12T20:20:00",
                                "arrival": "2025-02-13T19:10:00",
                                "durationInMinutes": 830,
                                "flightNumber": "220",
                                "marketingCarrier": {
                                    "id": -32348,
                                    "name": "Emirates",
                                    "alternateId": "EK",
                                    "allianceId": 0,
                                    "displayCode": ""
                                },
                                "operatingCarrier": {
                                    "id": -32348,
                                    "name": "Emirates",
                                    "alternateId": "EK",
                                    "allianceId": 0,
                                    "displayCode": ""
                                }
                            }
                        ]
                    }
                ] as LegsEntity[],
                "isSelfTransfer": false,
                "isProtectedSelfTransfer": true,
                "farePolicy": {
                    "isChangeAllowed": false,
                    "isPartiallyChangeable": false,
                    "isCancellationAllowed": false,
                    "isPartiallyRefundable": false
                },
                "fareAttributes": {},
                "tags": [
                    "cheapest",
                    "shortest"
                ],
                "isMashUp": false,
                "hasFlexibleOptions": false,
                "score": 0.909
            }
        ],
        "messages": [],
        "filterStats": {
            "duration": {
                "min": 2820,
                "max": 2820,
                "multiCityMin": 4033,
                "multiCityMax": 4033
            },
            "airports": [
                {
                    "city": "Dubai",
                    "airports": [
                        {
                            "id": "DXB",
                            "entityId": "95673506",
                            "name": "Dubai"
                        }
                    ]
                },
                {
                    "city": "Wilmington",
                    "airports": [
                        {
                            "id": "ILG",
                            "entityId": "95673449",
                            "name": "Greater Wilmington"
                        }
                    ]
                }
            ],
            "carriers": [
                {
                    "id": -31661,
                    "alternateId": "X1",
                    "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/X1.png",
                    "name": "Avelo Airlines"
                },
                {
                    "id": -32348,
                    "alternateId": "EK",
                    "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/EK.png",
                    "name": "Emirates"
                }
            ],
            "stopPrices": {
                "direct": {
                    "isPresent": false
                },
                "one": {
                    "isPresent": false
                },
                "twoOrMore": {
                    "isPresent": true,
                    "formattedPrice": "$2,373"
                }
            }
        },
        "flightsSessionId": "60a9a2d8-89cd-4e01-9dbd-254e4791cdb3",
        "destinationImageUrl": "https://content.skyscnr.com/m/3719e8f4a5daf43d/original/Flights-Placeholder.jpg"
    }
} as FlightsData
// * END OF FLIGHTS DATA *
