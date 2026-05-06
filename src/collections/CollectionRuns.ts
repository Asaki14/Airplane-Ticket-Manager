import type { CollectionConfig } from 'payload'

export const CollectionRunsCollection: CollectionConfig = {
  slug: 'collection-runs',
  labels: {
    singular: 'Collection Run',
    plural: 'Collection Runs'
  },
  admin: {
    useAsTitle: 'id'
  },
  fields: [
    // -- Identification --
    { name: 'sourceId', type: 'text', required: true },

    // -- Status tracking --
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Running', value: 'running' },
        { label: 'Success', value: 'success' },
        { label: 'Partial', value: 'partial' },
        { label: 'Failed', value: 'failed' }
      ]
    },
    { name: 'startedAt', type: 'date', required: true },
    { name: 'completedAt', type: 'date' },

    // -- Search parameters provenance --
    { name: 'searchParams', type: 'json', required: true },

    // -- Result counts --
    { name: 'totalFaresCollected', type: 'number', defaultValue: 0 },
    { name: 'totalValidationPassed', type: 'number', defaultValue: 0 },
    { name: 'totalValidationFailed', type: 'number', defaultValue: 0 },
    { name: 'totalDuplicatesSkipped', type: 'number', defaultValue: 0 },
    { name: 'totalPersisted', type: 'number', defaultValue: 0 },

    // -- Traceability --
    {
      name: 'persistedFareIds',
      type: 'array',
      fields: [
        { name: 'fareId', type: 'text' }
      ]
    },
    {
      name: 'errorMessages',
      type: 'array',
      fields: [
        { name: 'message', type: 'text' }
      ]
    }
  ]
}
