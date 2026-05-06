import { getPayload } from 'payload'
import configPromise from '@payload-config'

export type RetentionResult = {
  totalExpired: number
  purged: number
  errors: string[]
}

/**
 * Compute the expiry date for a raw payload: collectedAt + 30 days.
 * Pure function extracted for testability without hitting the database.
 */
export function computeExpiryDate(collectedAt: Date): Date {
  const expiry = new Date(collectedAt)
  expiry.setDate(expiry.getDate() + 30)
  return expiry
}

/**
 * Purge raw payloads that have exceeded the 30-day retention period.
 * Can be called from:
 * - A periodic cron job
 * - Manual admin trigger
 * - Before each new collection run (pre-cleanup)
 */
export async function purgeExpiredRawPayloads(): Promise<RetentionResult> {
  const result: RetentionResult = { totalExpired: 0, purged: 0, errors: [] }

  try {
    const payload = await getPayload({ config: configPromise })
    const now = new Date().toISOString()

    // Find all expired raw payloads
    const expired = await payload.find({
      collection: 'pending-raw-payloads',
      where: {
        expiresAt: {
          less_than: now
        }
      },
      limit: 500  // Batch limit to avoid timeouts
    })

    result.totalExpired = expired.docs.length

    // Delete each expired record
    for (const record of expired.docs) {
      try {
        await payload.delete({
          collection: 'pending-raw-payloads',
          id: record.id
        })
        result.purged++
      } catch (error) {
        result.errors.push(
          `Failed to purge ${record.id}: ${error instanceof Error ? error.message : String(error)}`
        )
      }
    }
  } catch (error) {
    result.errors.push(
      `Retention check failed: ${error instanceof Error ? error.message : String(error)}`
    )
  }

  return result
}
