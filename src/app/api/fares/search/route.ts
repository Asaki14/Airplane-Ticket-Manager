/**
 * GET /api/fares/search — Public search endpoint.
 *
 * Accepts Chinese city names and dates, returns cache-or-live fare results.
 *
 * Query params:
 *   - from (required) — departure city name (Chinese)
 *   - to (required) — destination city name (Chinese)
 *   - date (required) — departure date YYYY-MM-DD
 *   - returnDate (optional) — return date YYYY-MM-DD for round trips
 */

import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { searchFares } from '@/lib/fares/search'
import type { SearchFareResponse } from '@/lib/fares/search'

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const url = new URL(request.url)
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')
    const date = url.searchParams.get('date')
    const returnDate = url.searchParams.get('returnDate')

    // Validate required params
    if (!from || !to || !date) {
      return NextResponse.json(
        { error: '缺少必填参数: from, to, date' },
        { status: 400 }
      )
    }

    // Validate date format
    if (!DATE_REGEX.test(date)) {
      return NextResponse.json(
        { error: '日期格式无效，请使用 YYYY-MM-DD' },
        { status: 400 }
      )
    }

    if (returnDate && !DATE_REGEX.test(returnDate)) {
      return NextResponse.json(
        { error: '返程日期格式无效，请使用 YYYY-MM-DD' },
        { status: 400 }
      )
    }

    // Initialize Payload
    const payload = await getPayload({ config: configPromise })

    // Execute search
    const result: SearchFareResponse = await searchFares(
      {
        originCity: from,
        destinationCity: to,
        departureDate: date,
        returnDate: returnDate || undefined
      },
      { payload }
    )

    return NextResponse.json(result)

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: '搜索失败', details: message },
      { status: 500 }
    )
  }
}
