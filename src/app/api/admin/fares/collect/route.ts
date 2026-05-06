import { NextRequest, NextResponse } from 'next/server'
import { createAmadeusOrMockAdapter } from '@/integrations/providers/amadeus'
import { runCollectionPipeline, type PipelineResult } from '@/integrations/pipeline'
import type { ProviderSearchParams } from '@/integrations/provider'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Parse request body
  const body: ProviderSearchParams = await request.json().catch(() => ({} as ProviderSearchParams))

  // Validate required fields
  if (!body.origin || !body.destination || !body.departureDate) {
    return NextResponse.json(
      { error: 'Missing required fields: origin, destination, departureDate' },
      { status: 400 }
    )
  }

  // Initialize Payload and adapter
  const payload = await getPayload({ config: configPromise })
  const adapter = createAmadeusOrMockAdapter()

  if (!adapter.isConfigured()) {
    return NextResponse.json(
      { error: 'No data source configured. Set AMADEUS_CLIENT_ID or enable mock mode.' },
      { status: 503 }
    )
  }

  // Create collection run tracking record
  const runRecord = await payload.create({
    collection: 'collection-runs',
    data: {
      sourceId: adapter.name,
      status: 'running',
      startedAt: new Date().toISOString(),
      searchParams: body as Record<string, unknown>
    }
  })

  try {
    // Load existing dedup keys from recent runs (last 7 days)
    const recentFares = await payload.find({
      collection: 'canonical-fares',
      where: {
        collectedAt: {
          greater_than: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      },
      limit: 1000
    })

    const existingKeys = new Set<string>()
    for (const fare of recentFares.docs) {
      // Build dedup keys similar to dedup.ts
      const flightNums = (fare.flightNumbers ?? []) as Array<{ flightNumber: string }>
      const key = [fare.airline, flightNums.map((f: { flightNumber: string }) => f.flightNumber).sort().join(','), fare.departureTime, fare.priceAmount]
        .filter(Boolean)
        .join('|')
      if (key) existingKeys.add(key)
    }

    // Run the pipeline
    const pipelineResult: PipelineResult = await runCollectionPipeline(
      adapter,
      body,
      {
        create: async (collection: string, data: Record<string, unknown>) => {
          return payload.create({ collection, data }) as Promise<{ id: string }>
        }
      },
      existingKeys
    )

    // Store raw payloads for provenance
    const rawSearchResult = await adapter.search(body)
    for (const fare of rawSearchResult.fares) {
      await payload.create({
        collection: 'pending-raw-payloads',
        data: {
          sourceId: adapter.name,
          collectionRunId: pipelineResult.runId,
          providerFareId: fare.providerId,
          rawPayload: fare.rawPayload,
          collectedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      })
      // The mapping between raw payload and canonical fare is maintained
      // via runId + providerId correlation in the pipeline
    }

    // Update run record with completion data
    await payload.update({
      collection: 'collection-runs',
      id: runRecord.id,
      data: {
        status: pipelineResult.errors.length > 0 && pipelineResult.persisted > 0
          ? 'partial'
          : pipelineResult.persisted > 0
            ? 'success'
            : 'failed',
        completedAt: new Date().toISOString(),
        totalFaresCollected: pipelineResult.totalRaw,
        totalValidationPassed: pipelineResult.validationPassed,
        totalValidationFailed: pipelineResult.validationFailed,
        totalDuplicatesSkipped: pipelineResult.duplicatesSkipped,
        totalPersisted: pipelineResult.persisted,
        persistedFareIds: pipelineResult.persistedFareIds.map(id => ({ fareId: id })),
        errorMessages: pipelineResult.errors.map(e => ({ message: `[${e.stage}] ${e.message}` }))
      }
    })

    return NextResponse.json({
      runId: runRecord.id,
      result: pipelineResult
    })

  } catch (error) {
    // Mark run as failed
    await payload.update({
      collection: 'collection-runs',
      id: runRecord.id,
      data: {
        status: 'failed',
        completedAt: new Date().toISOString(),
        errorMessages: [{
          message: error instanceof Error ? error.message : String(error)
        }]
      }
    })

    return NextResponse.json(
      { error: 'Collection run failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
