import type { CanonicalFare } from '../../types/canonical-fare'

export type ValidationResult = { ok: true } | { ok: false; errors: ValidationError[] }

export type ValidationError = {
  field: string
  reason: string
  value?: unknown
}

/**
 * Validate a partial CanonicalFare against hard rules (D-06).
 *
 * Rules:
 * 1. Required fields must be present and non-empty
 * 2. priceAmount must be > 0 and <= 999999
 * 3. departureTime must be before arrivalTime
 * 4. Airport codes must be 3 uppercase letters (/^[A-Z]{3}$/)
 * 5. flightNumbers must be a non-empty array
 * 6. currency must match /^[A-Z]{3}$/ if present
 */
export function validateCanonicalFare(fare: Partial<CanonicalFare>): ValidationResult {
  const errors: ValidationError[] = []

  // Rules 1 & 5: Required field completeness
  const requiredFields: { key: keyof CanonicalFare; label: string; type: 'string' | 'number' | 'array' }[] = [
    { key: 'airline', label: 'airline', type: 'string' },
    { key: 'departureAirport', label: 'departureAirport', type: 'string' },
    { key: 'arrivalAirport', label: 'arrivalAirport', type: 'string' },
    { key: 'departureTime', label: 'departureTime', type: 'string' },
    { key: 'arrivalTime', label: 'arrivalTime', type: 'string' },
    { key: 'priceAmount', label: 'priceAmount', type: 'number' },
    { key: 'currency', label: 'currency', type: 'string' },
    { key: 'collectedAt', label: 'collectedAt', type: 'string' },
    { key: 'expiresAt', label: 'expiresAt', type: 'string' },
    { key: 'flightNumbers', label: 'flightNumbers', type: 'array' }
  ]

  for (const field of requiredFields) {
    const value = fare[field.key]

    if (field.type === 'string') {
      if (value === undefined || value === null || value === '') {
        errors.push({ field: field.label, reason: 'Required field is missing or empty', value })
      }
    } else if (field.type === 'number') {
      if (value === undefined || value === null || typeof value !== 'number') {
        errors.push({ field: field.label, reason: 'Required field is missing or not a number', value })
      }
    } else if (field.type === 'array') {
      if (!Array.isArray(value) || value.length === 0) {
        errors.push({ field: field.label, reason: 'Required field must be a non-empty array', value })
      }
    }
  }

  // Rule 2: Sane price bounds
  if (typeof fare.priceAmount === 'number') {
    if (fare.priceAmount <= 0) {
      errors.push({ field: 'priceAmount', reason: 'Price must be greater than 0', value: fare.priceAmount })
    } else if (fare.priceAmount > 999999) {
      errors.push({ field: 'priceAmount', reason: 'Price exceeds maximum allowed value (999999)', value: fare.priceAmount })
    }
  }

  // Rule 3: Sane date/time ordering
  if (fare.departureTime && fare.arrivalTime) {
    if (fare.departureTime >= fare.arrivalTime) {
      errors.push({
        field: 'departureTime',
        reason: 'Departure time must be before arrival time',
        value: { departureTime: fare.departureTime, arrivalTime: fare.arrivalTime }
      })
    }
  }

  // Rule 4: Airport code format (/^[A-Z]{3}$/)
  const IATA_REGEX = /^[A-Z]{3}$/
  if (fare.departureAirport && !IATA_REGEX.test(fare.departureAirport)) {
    errors.push({
      field: 'departureAirport',
      reason: 'Airport code must be 3 uppercase letters (IATA format)',
      value: fare.departureAirport
    })
  }
  if (fare.arrivalAirport && !IATA_REGEX.test(fare.arrivalAirport)) {
    errors.push({
      field: 'arrivalAirport',
      reason: 'Airport code must be 3 uppercase letters (IATA format)',
      value: fare.arrivalAirport
    })
  }

  // Rule 6: Currency format
  if (fare.currency !== undefined && fare.currency !== null && fare.currency !== '') {
    const CURRENCY_REGEX = /^[A-Z]{3}$/
    if (!CURRENCY_REGEX.test(fare.currency)) {
      errors.push({
        field: 'currency',
        reason: 'Currency must be a 3-letter ISO 4217 code',
        value: fare.currency
      })
    }
  }

  return errors.length === 0
    ? { ok: true }
    : { ok: false, errors }
}
