import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as { departureCity?: string }
  const cookieStore = await cookies()

  if (payload.departureCity && payload.departureCity.trim()) {
    cookieStore.set('preferredDepartureCity', payload.departureCity.trim(), {
      maxAge: 60 * 60 * 24 * 180,
      path: '/',
      sameSite: 'lax'
    })
  } else {
    cookieStore.delete('preferredDepartureCity')
  }

  return Response.json({ ok: true })
}
