/**
 * Minimal type declarations for the `amadeus` npm package.
 *
 * The official SDK (amadeus v9.x) ships without built-in TypeScript declarations.
 * This file provides just enough typing for the adapter layer.
 */

declare module 'amadeus' {
  interface AmadeusClientOptions {
    clientId: string
    clientSecret: string
    hostname?: string
  }

  interface AmadeusResponse {
    data: unknown
    [key: string]: unknown
  }

  interface FlightOffersSearch {
    get(params: Record<string, unknown>): Promise<AmadeusResponse>
  }

  interface Locations {
    get(params: Record<string, unknown>): Promise<AmadeusResponse>
  }

  interface ReferenceData {
    locations: Locations
  }

  interface Shopping {
    flightOffersSearch: FlightOffersSearch
  }

  class Amadeus {
    static location: {
      airport: string
    }
    static direction: {
      arrivals: string
      departures: string
    }

    shopping: Shopping
    referenceData: ReferenceData

    constructor(options: AmadeusClientOptions)
  }

  export default Amadeus
}
