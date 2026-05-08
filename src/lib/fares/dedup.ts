import type { CanonicalFare } from '../../types/canonical-fare'

export type DedupConfig = {
  /** Fields used to build the dedup key. Order-sensitive. */
  keyFields: ('airline' | 'flightNumbers' | 'departureTime' | 'priceAmount' | 'cabin')[]
}

/** Default dedup config: airline + flightNumbers sorted + departureTime + priceAmount */
export const DEFAULT_DEDUP_CONFIG: DedupConfig = {
  keyFields: ['airline', 'flightNumbers', 'departureTime', 'priceAmount', 'cabin']
}

/**
 * Build a deterministic dedup key string from a CanonicalFare's relevant fields.
 *
 * flightNumbers are sorted before concatenation so semantically identical
 * itineraries produce the same key regardless of array order.
 */
export function dedupKey(
  fare: Partial<CanonicalFare>,
  config: DedupConfig = DEFAULT_DEDUP_CONFIG
): string {
  return config.keyFields.map((field) => {
    const value = fare[field]

    if (field === 'flightNumbers') {
      // Sort flight numbers for deterministic ordering
      const numbers = Array.isArray(value) ? [...value].sort() : []
      return numbers.join(',')
    }

    return value != null ? String(value) : ''
  }).join('|')
}

/**
 * Check if a new fare is a duplicate of an existing set, using the dedup key.
 */
export function isDuplicate(
  fare: Partial<CanonicalFare>,
  existingKeys: Set<string>,
  config?: DedupConfig
): boolean {
  const key = dedupKey(fare, config)
  return existingKeys.has(key)
}
