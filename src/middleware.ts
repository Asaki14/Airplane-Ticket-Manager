import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const ADMIN_USER = process.env.ADMIN_GATE_USERNAME
const ADMIN_PASS = process.env.ADMIN_GATE_PASSWORD

function unauthorizedResponse() {
  return new NextResponse('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin Gate"'
    }
  })
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  if (!ADMIN_USER || !ADMIN_PASS) {
    return new NextResponse('Admin gate is not configured', { status: 503 })
  }

  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return unauthorizedResponse()
  }

  const encoded = authHeader.slice('Basic '.length)
  const decoded = Buffer.from(encoded, 'base64').toString('utf-8')
  const [username, password] = decoded.split(':')

  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    return unauthorizedResponse()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
