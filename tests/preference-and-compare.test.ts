import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('preference-and-compare', () => {
  it('homepage wires preference panel and compare panel', () => {
    const content = readFileSync(resolve('src/app/page.tsx'), 'utf-8')
    expect(content).toContain('DiscoveryPreferences')
    expect(content).toContain('CompareAndSavePanel')
  })

  it('compare panel enforces max 3 candidates and local favorites key', () => {
    const content = readFileSync(resolve('src/components/deals/CompareAndSavePanel.tsx'), 'utf-8')
    expect(content).toContain('prev.length >= 3')
    expect(content).toContain('flight-deals:favorites')
  })

  it('preference API writes preferredDepartureCity cookie', () => {
    const content = readFileSync(resolve('src/app/api/preferences/departure/route.ts'), 'utf-8')
    expect(content).toContain('preferredDepartureCity')
    expect(content).toContain('cookieStore.set')
  })
})
