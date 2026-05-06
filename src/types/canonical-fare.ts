/**
 * CanonicalFare — the normalized fare snapshot type used across all
 * ingestion, validation, and display code.
 *
 * Per D-04: every record captures source provenance, itinerary,
 * pricing, cabin, baggage, and collection timestamps.
 */
export type CanonicalFare = {
  /** Payload record ID */
  id: string
  /** Identifies the connector (e.g. "amadeus") */
  sourceId: string
  /** Links back to the collection run that produced this fare */
  collectionRunId: string
  /** Airline name or code */
  airline: string
  /** Flight numbers, e.g. ["MU1234"] */
  flightNumbers: string[]
  /** Departure airport IATA code, e.g. "PVG" */
  departureAirport: string
  /** Arrival airport IATA code, e.g. "NRT" */
  arrivalAirport: string
  /** ISO 8601 departure timestamp */
  departureTime: string
  /** ISO 8601 arrival timestamp */
  arrivalTime: string
  /** Cabin class, e.g. "ECONOMY" */
  cabin: string
  /** Plain-text summary of baggage allowance */
  baggageFacts: string
  /** Numeric price value */
  priceAmount: number
  /** ISO 4217 currency code, e.g. "CNY" */
  currency: string
  /** URL to book on source platform */
  deepLink: string
  /** ISO 8601 timestamp of collection */
  collectedAt: string
  /** ISO 8601 timestamp when this snapshot is considered stale */
  expiresAt: string
  /** ID linking to the raw payload record (provenance) */
  rawPayloadRef: string

  // -- Optional fields --

  /** Return leg departure airport (for round trip) */
  returnDepartureAirport?: string
  /** Return leg arrival airport */
  returnArrivalAirport?: string
  /** Return leg departure time */
  returnDepartureTime?: string
  /** Return leg arrival time */
  returnArrivalTime?: string
  /** Number of stops (0 = direct) */
  stopCount?: number
  /** IATA codes of intermediate stops */
  stopAirports?: string[]
  /** Plain-text refund/change summary */
  refundChangePolicy?: string
  /** Plain-text booking caveats */
  bookingRestrictions?: string
  /** Tax component if separated from fare */
  taxAmount?: number
  /** Booking class / fare basis code */
  fareClass?: string
}

/**
 * CanonicalFareCollectionRun — metadata for a single collection
 * execution, tracking its lifecycle and outcome.
 */
export type CanonicalFareCollectionRun = {
  /** Payload record ID */
  id: string
  /** Identifies the connector that executed this run */
  sourceId: string
  /** Current run status */
  status: 'running' | 'success' | 'partial' | 'failed'
  /** ISO 8601 start timestamp */
  startedAt: string
  /** ISO 8601 completion timestamp */
  completedAt?: string
  /** Total fares collected in this run */
  totalFaresCollected: number
  /** Number of records that passed validation */
  totalValidationPassed: number
  /** Number of records that failed validation */
  totalValidationFailed: number
  /** Number of duplicate records skipped */
  totalDuplicatesSkipped: number
  /** Error message if the run failed or was partial */
  errorMessage?: string
}
