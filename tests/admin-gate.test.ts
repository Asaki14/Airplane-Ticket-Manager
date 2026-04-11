import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { NextRequest } from 'next/server'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

type AdminEnv = {
  ADMIN_GATE_USERNAME?: string
  ADMIN_GATE_PASSWORD?: string
}

const originalEnv = {
  ADMIN_GATE_USERNAME: process.env.ADMIN_GATE_USERNAME,
  ADMIN_GATE_PASSWORD: process.env.ADMIN_GATE_PASSWORD
}

function applyAdminEnv(env: AdminEnv) {
  if (env.ADMIN_GATE_USERNAME === undefined) {
    delete process.env.ADMIN_GATE_USERNAME
  } else {
    process.env.ADMIN_GATE_USERNAME = env.ADMIN_GATE_USERNAME
  }

  if (env.ADMIN_GATE_PASSWORD === undefined) {
    delete process.env.ADMIN_GATE_PASSWORD
  } else {
    process.env.ADMIN_GATE_PASSWORD = env.ADMIN_GATE_PASSWORD
  }
}

beforeEach(() => {
  applyAdminEnv({
    ADMIN_GATE_USERNAME: originalEnv.ADMIN_GATE_USERNAME,
    ADMIN_GATE_PASSWORD: originalEnv.ADMIN_GATE_PASSWORD
  })
})

afterEach(() => {
  applyAdminEnv({
    ADMIN_GATE_USERNAME: originalEnv.ADMIN_GATE_USERNAME,
    ADMIN_GATE_PASSWORD: originalEnv.ADMIN_GATE_PASSWORD
  })
})

async function loadMiddleware() {
  const mod = await import('../src/middleware')
  return mod.middleware
}

describe('admin-gate', () => {
  it('middleware matches /admin path and checks ADMIN_GATE env vars', () => {
    const content = readFileSync(resolve('src/middleware.ts'), 'utf-8')

    expect(content).toContain("matcher: ['/admin/:path*']")
    expect(content).toContain('ADMIN_GATE_USERNAME')
    expect(content).toContain('ADMIN_GATE_PASSWORD')
  })

  it('returns 401 challenge for /admin without authorization header', async () => {
    applyAdminEnv({ ADMIN_GATE_USERNAME: 'uat', ADMIN_GATE_PASSWORD: 'secret' })
    const middleware = await loadMiddleware()
    const request = new NextRequest('http://localhost/admin/deals')

    const response = middleware(request)

    expect(response.status).toBe(401)
    expect(response.headers.get('WWW-Authenticate')).toContain('Basic realm="Admin Gate"')
  })

  it('keeps 401 challenge when admin gate env is missing and exposes misconfigured marker', async () => {
    applyAdminEnv({ ADMIN_GATE_USERNAME: '', ADMIN_GATE_PASSWORD: '' })
    const middleware = await loadMiddleware()
    const request = new NextRequest('http://localhost/admin/deals')

    const response = middleware(request)

    expect(response.status).toBe(401)
    expect(response.headers.get('WWW-Authenticate')).toContain('Basic realm="Admin Gate"')
    expect(response.headers.get('x-admin-gate-misconfigured')).toBe('true')
  })

  it('admin page explicitly labels MVP internal entry', () => {
    const content = readFileSync(resolve('src/app/admin/page.tsx'), 'utf-8')
    expect(content).toContain('内部运营入口（MVP）')
  })
})
