import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(): Promise<NextResponse> {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'deals',
      sort: '-createdAt',
      limit: 100,
    })
    return NextResponse.json({ docs: result.docs })
  } catch (error) {
    return NextResponse.json(
      { error: '获取 deal 列表失败', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json()
    const payload = await getPayload({ config: configPromise })
    const created = await payload.create({
      collection: 'deals',
      data: body,
    })
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: '创建 deal 失败', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
