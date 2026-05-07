import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params
    const payload = await getPayload({ config: configPromise })
    const result = await payload.findByID({
      collection: 'deals',
      id,
    })
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: '获取 deal 失败', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params
    const body = await request.json()
    const payload = await getPayload({ config: configPromise })
    const updated = await payload.update({
      collection: 'deals',
      id,
      data: body,
    })
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json(
      { error: '更新 deal 失败', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params
    const payload = await getPayload({ config: configPromise })
    await payload.delete({
      collection: 'deals',
      id,
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: '删除 deal 失败', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
