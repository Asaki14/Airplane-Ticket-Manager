import type { CollectionConfig } from 'payload'

const cabinOptions = ['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST'] as const

export type CabinClass = (typeof cabinOptions)[number]

type CanonicalFareInput = Record<string, unknown>

const IATA_CODE_RE = /^[A-Z]{3}$/
const ISO_CURRENCY_RE = /^[A-Z]{3}$/

export function validateCanonicalFareInput(input: CanonicalFareInput) {
  const errors: string[] = []

  const requiredFields = [
    'sourceId',
    'airline',
    'departureAirport',
    'arrivalAirport',
    'departureTime',
    'arrivalTime',
    'cabin',
    'baggageFacts',
    'priceAmount',
    'collectedAt',
    'expiresAt',
    'rawPayloadRef'
  ]

  for (const field of requiredFields) {
    const value = input[field]
    if (value === undefined || value === null || value === '') {
      errors.push(`${field} is required`)
    }
  }

  const depAirport = input.departureAirport as string | undefined
  if (depAirport && !IATA_CODE_RE.test(depAirport)) {
    errors.push('departureAirport must be 3 uppercase letters (IATA code)')
  }

  const arrAirport = input.arrivalAirport as string | undefined
  if (arrAirport && !IATA_CODE_RE.test(arrAirport)) {
    errors.push('arrivalAirport must be 3 uppercase letters (IATA code)')
  }

  const price = input.priceAmount as number | undefined
  if (price !== undefined && price !== null && (typeof price !== 'number' || price <= 0)) {
    errors.push('priceAmount must be a positive number')
  }

  const currency = input.currency as string | undefined
  if (currency && !ISO_CURRENCY_RE.test(currency)) {
    errors.push('currency must be 3 uppercase letters (ISO 4217)')
  }

  const depTime = input.departureTime as string | undefined
  const arrTime = input.arrivalTime as string | undefined
  if (depTime && arrTime) {
    const dep = new Date(depTime)
    const arr = new Date(arrTime)
    if (!isNaN(dep.getTime()) && !isNaN(arr.getTime()) && dep >= arr) {
      errors.push('departureTime must be before arrivalTime')
    }
  }

  const cabin = input.cabin as string | undefined
  if (cabin && !(cabinOptions as readonly string[]).includes(cabin)) {
    errors.push(`cabin must be one of: ${cabinOptions.join(', ')}`)
  }

  return {
    ok: errors.length === 0,
    errors
  }
}

export const CanonicalFaresCollection: CollectionConfig = {
  slug: 'canonical-fares',
  labels: {
    singular: 'Canonical Fare',
    plural: 'Canonical Fares'
  },
  admin: {
    useAsTitle: 'id'
  },
  fields: [
    // -- Required fields (per D-04) --
    { name: 'sourceId', type: 'text', required: true },
    { name: 'collectionRunId', type: 'text', required: true },
    { name: 'airline', type: 'text', required: true },
    {
      name: 'flightNumbers',
      type: 'json',
      required: true
    },
    { name: 'departureAirport', type: 'text', required: true },
    { name: 'arrivalAirport', type: 'text', required: true },
    { name: 'departureTime', type: 'date', required: true },
    { name: 'arrivalTime', type: 'date', required: true },
    {
      name: 'cabin',
      type: 'select',
      required: true,
      options: cabinOptions.map((c) => ({ label: c, value: c }))
    },
    { name: 'baggageFacts', type: 'textarea', required: true },
    { name: 'priceAmount', type: 'number', required: true },
    { name: 'currency', type: 'text', required: true, defaultValue: 'CNY' },
    { name: 'deepLink', type: 'text' },
    { name: 'collectedAt', type: 'date', required: true },
    { name: 'expiresAt', type: 'date', required: true },
    { name: 'rawPayloadRef', type: 'text', required: true },

    // -- Optional fields --
    { name: 'returnDepartureAirport', type: 'text' },
    { name: 'returnArrivalAirport', type: 'text' },
    { name: 'returnDepartureTime', type: 'date' },
    { name: 'returnArrivalTime', type: 'date' },
    { name: 'stopCount', type: 'number', min: 0 },
    {
      name: 'stopAirports',
      type: 'json'
    },
    { name: 'refundChangePolicy', type: 'textarea' },
    { name: 'bookingRestrictions', type: 'textarea' },
    { name: 'taxAmount', type: 'number', min: 0 },
    { name: 'fareClass', type: 'text' }
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data || typeof data !== 'object') {
          return data
        }

        const result = validateCanonicalFareInput(data as Record<string, unknown>)
        if (!result.ok) {
          throw new Error(`Invalid canonical fare input: ${result.errors.join(', ')}`)
        }
        return data
      }
    ]
  }
}
