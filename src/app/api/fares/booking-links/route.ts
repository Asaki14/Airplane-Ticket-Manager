import { NextRequest, NextResponse } from 'next/server'

const IGNAV_BASE = 'https://ignav.com/api'

export async function POST(request: NextRequest): Promise<NextResponse> {
  const apiKey = process.env.IGNAV_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'IGNAV API 未配置' },
      { status: 503 }
    )
  }

  const body = await request.json().catch(() => ({}))
  const { ignav_id, displayed_price, currency: priceCurrency, cabin } = body

  if (!ignav_id || typeof ignav_id !== 'string') {
    return NextResponse.json(
      { error: '缺少必填参数: ignav_id' },
      { status: 400 }
    )
  }

  try {
    const res = await fetch(`${IGNAV_BASE}/fares/booking-links`, {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ignav_id,
        ...(displayed_price != null && { displayed_price }),
        ...(priceCurrency && { currency: priceCurrency }),
        ...(cabin && { cabin }),
      }),
    })

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}))
      return NextResponse.json(
        { error: errBody?.error?.message ?? `Ignav API error: HTTP ${res.status}` },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: '获取预订链接失败', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
