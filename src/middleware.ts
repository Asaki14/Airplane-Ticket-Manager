import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

function unauthorizedResponse(misconfigured = false) {
  const headers: Record<string, string> = {
    'WWW-Authenticate': 'Basic realm="Admin Gate"'
  }

  if (misconfigured) {
    headers['x-admin-gate-misconfigured'] = 'true'
  }

  return new NextResponse(misconfigured ? 'Unauthorized (admin gate misconfigured)' : 'Unauthorized', {
    status: 401,
    headers
  })
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const adminUser = process.env.ADMIN_GATE_USERNAME
  const adminPass = process.env.ADMIN_GATE_PASSWORD

  if (!adminUser || !adminPass) {
    return unauthorizedResponse(true)
  }

  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return unauthorizedResponse()
  }

  const encoded = authHeader.slice('Basic '.length)
  const decoded = Buffer.from(encoded, 'base64').toString('utf-8')
  const [username, password] = decoded.split(':')

  if (username !== adminUser || password !== adminPass) {
    return unauthorizedResponse()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
