export const dealStatusOptions = ['draft', 'published', 'expired'] as const

export type DealStatus = (typeof dealStatusOptions)[number]

export const dealFieldNames = [
  'title',
  'departureCity',
  'destination',
  'headlinePrice',
  'currency',
  'tripType',
  'travelStartDate',
  'travelEndDate',
  'travelWindowLabel',
  'airline',
  'isDirect',
  'baggageInfo',
  'refundChangeSummary',
  'sourceLink',
  'publishedAt',
  'updatedAt',
  'expiresAt',
  'recommendationCopy',
  'valueTags',
  'referenceTotalPrice'
] as const

type DealInput = Record<string, unknown>

export function validateDealInput(input: DealInput) {
  const required = ['title', 'departureCity', 'destination', 'headlinePrice', 'expiresAt']
  const errors: string[] = []

  for (const field of required) {
    const value = input[field]
    const missing = value === undefined || value === null || value === ''
    if (missing) errors.push(field)
  }

  if (input.status && !dealStatusOptions.includes(input.status as DealStatus)) {
    errors.push('status')
  }

  return {
    ok: errors.length === 0,
    errors
  }
}
