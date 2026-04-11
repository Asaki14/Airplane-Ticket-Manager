import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('admin-gate', () => {
  it('middleware matches /admin path and checks ADMIN_GATE env vars', () => {
    const content = readFileSync(resolve('src/middleware.ts'), 'utf-8')

    expect(content).toContain("matcher: ['/admin/:path*']")
    expect(content).toContain('ADMIN_GATE_USERNAME')
    expect(content).toContain('ADMIN_GATE_PASSWORD')
  })

  it('admin page explicitly labels MVP internal entry', () => {
    const content = readFileSync(resolve('src/app/admin/page.tsx'), 'utf-8')
    expect(content).toContain('内部运营入口（MVP）')
  })
})
