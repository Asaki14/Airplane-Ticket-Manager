import { describe, expect, it } from 'vitest'
import { dealFieldNames, dealStatusOptions, validateDealInput } from '../src/lib/deals/validation'

describe('deal-schema', () => {
  it('rejects missing required structured fields', () => {
    const result = validateDealInput({
      title: '',
      departureCity: '',
      destination: '',
      headlinePrice: null,
      expiresAt: ''
    })

    expect(result.ok).toBe(false)
    expect(result.errors).toContain('title')
    expect(result.errors).toContain('departureCity')
    expect(result.errors).toContain('destination')
    expect(result.errors).toContain('headlinePrice')
    expect(result.errors).toContain('expiresAt')
  })

  it('allows only draft/published/expired statuses', () => {
    expect(dealStatusOptions).toEqual(['draft', 'published', 'expired'])
  })

  it('supports both headlinePrice and referenceTotalPrice', () => {
    expect(dealFieldNames).toContain('headlinePrice')
    expect(dealFieldNames).toContain('referenceTotalPrice')
  })

  it('supports travel structured dates and travelWindowLabel', () => {
    expect(dealFieldNames).toContain('travelStartDate')
    expect(dealFieldNames).toContain('travelEndDate')
    expect(dealFieldNames).toContain('travelWindowLabel')
  })
})
