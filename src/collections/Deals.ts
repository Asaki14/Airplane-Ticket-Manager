import { dealStatusOptions, validateDealInput } from '../lib/deals/validation'

export const DealsCollection = {
  slug: 'deals',
  labels: {
    singular: 'Deal',
    plural: 'Deals'
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'departureCity', type: 'text', required: true },
    { name: 'destination', type: 'text', required: true },
    { name: 'headlinePrice', type: 'number', required: true },
    { name: 'referenceTotalPrice', type: 'number' },
    { name: 'currency', type: 'text', defaultValue: 'CNY' },
    { name: 'tripType', type: 'select', options: ['one-way', 'round-trip'] },
    { name: 'travelStartDate', type: 'date' },
    { name: 'travelEndDate', type: 'date' },
    { name: 'travelWindowLabel', type: 'text' },
    { name: 'airline', type: 'text' },
    { name: 'isDirect', type: 'checkbox' },
    { name: 'baggageInfo', type: 'textarea' },
    { name: 'refundChangeSummary', type: 'textarea' },
    { name: 'sourceLink', type: 'text' },
    { name: 'publishedAt', type: 'date' },
    { name: 'updatedAt', type: 'date' },
    { name: 'expiresAt', type: 'date', required: true },
    { name: 'recommendationCopy', type: 'textarea' },
    { name: 'valueTags', type: 'array' },
    { name: 'status', type: 'select', options: [...dealStatusOptions], defaultValue: 'draft' }
  ],
  hooks: {
    beforeValidate: [
      ({ data }: { data: Record<string, unknown> }) => {
        const result = validateDealInput(data)
        if (!result.ok) {
          throw new Error(`Invalid deal input: ${result.errors.join(',')}`)
        }
        return data
      }
    ]
  }
}
