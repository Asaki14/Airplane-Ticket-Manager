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

async function loadMiddleware() {
  const mod = await import('../src/middleware')
  return mod.middleware
}

function buildAuth(username: string, password: string) {
  return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
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

describe('admin-gate-auth-success', () => {
  it('allows /admin/deals with correct basic credentials', async () => {
    applyAdminEnv({ ADMIN_GATE_USERNAME: 'uat', ADMIN_GATE_PASSWORD: 'secret' })
    const middleware = await loadMiddleware()
    const request = new NextRequest('http://localhost/admin/deals', {
      headers: {
        authorization: buildAuth('uat', 'secret')
      }
    })

    const response = middleware(request)
    expect(response.status).toBe(200)
    expect(response.headers.get('x-middleware-next')).toBe('1')
  })

  it('allows /admin/deals/{id} with correct basic credentials', async () => {
    applyAdminEnv({ ADMIN_GATE_USERNAME: 'uat', ADMIN_GATE_PASSWORD: 'secret' })
    const middleware = await loadMiddleware()
    const request = new NextRequest('http://localhost/admin/deals/abc123', {
      headers: {
        authorization: buildAuth('uat', 'secret')
      }
    })

    const response = middleware(request)
    expect(response.status).toBe(200)
    expect(response.headers.get('x-middleware-next')).toBe('1')
  })
})
