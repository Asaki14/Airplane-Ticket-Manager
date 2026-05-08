import type { ProviderAdapter, ProviderSearchParams, ProviderSearchResult } from './provider'
import { normalizeIgnavFare } from './normalize/ignav'
import { validateCanonicalFare } from '../lib/fares/validation'
import { dedupKey } from '../lib/fares/dedup'
import type { CanonicalFare } from '../types/canonical-fare'

export type PipelineResult = {
  runId: string
  sourceId: string
  totalRaw: number
  normalized: number
  validationPassed: number
  validationFailed: number
  duplicatesSkipped: number
  persisted: number
  errors: PipelineError[]
  /** CanonicalFare IDs that were created */
  persistedFareIds: string[]
  /** Normalized fares (available even if persist fails, e.g. SQLite in serverless) */
  normalizedFares: Array<Record<string, unknown>>
}

export type PipelineError = {
  stage: 'normalize' | 'validate' | 'persist'
  providerId?: string
  message: string
}

/**
 * Run the full collection pipeline:
 * 1. Fetch raw fares from the provider
 * 2. Normalize each fare to CanonicalFare shape
 * 3. Validate each normalized fare
 * 4. Check for duplicates against existing keys
 * 5. Persist valid non-duplicate fares to Payload
 */
export async function runCollectionPipeline(
  adapter: ProviderAdapter,
  params: ProviderSearchParams,
  payload: { create: (collection: string, data: Record<string, unknown>) => Promise<{ id: string }> },
  existingKeys?: Set<string>
): Promise<PipelineResult> {
  const result: PipelineResult = {
    runId: '',
    sourceId: adapter.name,
    totalRaw: 0,
    normalized: 0,
    validationPassed: 0,
    validationFailed: 0,
    duplicatesSkipped: 0,
    persisted: 0,
    errors: [],
    persistedFareIds: [],
    normalizedFares: []
  }

  // Step 1: Fetch
  let searchResult: ProviderSearchResult
  try {
    searchResult = await adapter.search(params)
  } catch (error) {
    result.errors.push({
      stage: 'normalize',
      message: `Provider search failed: ${error instanceof Error ? error.message : String(error)}`
    })
    return result
  }

  result.runId = searchResult.runId
  result.totalRaw = searchResult.fares.length
  const seenKeys = existingKeys ?? new Set<string>()

  // Step 2-5: Process each fare
  for (const rawFare of searchResult.fares) {
    // Step 2: Normalize
    let normalized: Partial<CanonicalFare>
    try {
      normalized = normalizeIgnavFare(rawFare, searchResult.runId)
    } catch (error) {
      result.errors.push({
        stage: 'normalize',
        providerId: rawFare.providerId,
        message: error instanceof Error ? error.message : String(error)
      })
      continue
    }
    result.normalized++

    // Step 3: Validate
    const validation = validateCanonicalFare(normalized)
    if (!validation.ok) {
      result.validationFailed++
      result.errors.push({
        stage: 'validate',
        providerId: rawFare.providerId,
        message: `Validation failed: ${validation.errors.map(e => `${e.field}: ${e.reason}`).join('; ')}`
      })
      continue
    }
    result.validationPassed++

    // Step 4: Dedup
    const key = dedupKey(normalized)
    if (seenKeys.has(key)) {
      result.duplicatesSkipped++
      continue
    }
    seenKeys.add(key)

    // Collect normalized fare data (available even if persist fails)
    result.normalizedFares.push(normalized as Record<string, unknown>)

    // Step 5: Persist
    try {
      const created = await payload.create('canonical-fares', {
        ...normalized,
        // Ensure required fields are present
        sourceId: normalized.sourceId ?? adapter.name,
        collectionRunId: searchResult.runId,
        collectedAt: normalized.collectedAt ?? new Date().toISOString()
      })
      result.persistedFareIds.push(created.id)
      result.persisted++
    } catch (error) {
      result.errors.push({
        stage: 'persist',
        providerId: rawFare.providerId,
        message: `Persist failed: ${error instanceof Error ? error.message : String(error)}`
      })
    }
  }

  return result
}
