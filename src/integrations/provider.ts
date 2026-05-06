/**
 * ProviderAdapter — abstract adapter interface all source connectors must implement.
 *
 * Defines the contract between ingestion code and external data sources.
 * Each provider (Amadeus, etc.) implements this interface.
 */

/** Parameters a provider needs to search for fares */
export type ProviderSearchParams = {
  /** IATA departure airport code, e.g. "PVG" */
  origin: string
  /** IATA arrival airport code, e.g. "NRT" */
  destination: string
  /** Departure date in YYYY-MM-DD format */
  departureDate: string
  /** Return date in YYYY-MM-DD format (omitted = one-way) */
  returnDate?: string
  /** Number of adult passengers (default 1) */
  adults?: number
  /** ISO 4217 currency code (default "CNY") */
  currency?: string
}

/** A single fare result returned by a provider, still in raw provider format */
export type ProviderFareResult = {
  /** Unique identifier within the provider's response */
  providerId: string
  /** The raw JSON payload from the provider for this fare */
  rawPayload: Record<string, unknown>
}

/** Result of a provider search operation */
export type ProviderSearchResult = {
  /** Name of the provider that produced these results */
  providerName: string
  /** Array of fare results from this provider */
  fares: ProviderFareResult[]
  /** The search parameters that produced this result */
  searchParams: ProviderSearchParams
  /** ISO 8601 timestamp of when the data was collected */
  collectedAt: string
  /** UUID for this collection run */
  runId: string
}

/** Interface all source adapters must implement */
export interface ProviderAdapter {
  /** Provider name, e.g. "amadeus" */
  readonly name: string

  /** Check if this provider is configured (credentials present) */
  isConfigured(): boolean

  /** Search for fares matching the given parameters */
  search(params: ProviderSearchParams): Promise<ProviderSearchResult>

  /** Validate that the provider adapter can connect (used for health check) */
  healthCheck(): Promise<{ ok: boolean; message?: string }>
}
