import type { CollectionConfig } from 'payload'

export const PendingRawPayloadsCollection: CollectionConfig = {
  slug: 'pending-raw-payloads',
  labels: {
    singular: 'Raw Payload',
    plural: 'Raw Payloads'
  },
  admin: {
    useAsTitle: 'id'
  },
  fields: [
    // -- Identification --
    { name: 'sourceId', type: 'text', required: true },
    { name: 'collectionRunId', type: 'text', required: true },
    { name: 'providerFareId', type: 'text', required: true },

    // -- Raw payload (stored as JSON text column in SQLite per D-07) --
    { name: 'rawPayload', type: 'json', required: true },

    // -- Timestamps --
    { name: 'collectedAt', type: 'date', required: true },
    {
      name: 'expiresAt',
      type: 'date',
      required: true
    },

    // -- Provenance --
    { name: 'canonicalFareRef', type: 'text' }
  ]
}
