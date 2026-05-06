import { describe, expect, it } from 'vitest'
import { resolveCityToIata, fuzzyResolveCity, popularRoutes } from '../src/lib/fares/city-map'

describe('resolveCityToIata', () => {
  it('resolves 上海 to SHA', () => {
    expect(resolveCityToIata('上海')).toBe('SHA')
  })

  it('resolves 北京 to BJS (legacy multi-airport metro code)', () => {
    expect(resolveCityToIata('北京')).toBe('BJS')
  })

  it('resolves 东京 to TYO (multi-airport metro code)', () => {
    expect(resolveCityToIata('东京')).toBe('TYO')
  })

  it('resolves 纽约 to NYC (metro code)', () => {
    expect(resolveCityToIata('纽约')).toBe('NYC')
  })

  it('returns undefined for unknown city', () => {
    expect(resolveCityToIata('UnknownCity')).toBeUndefined()
  })

  it('returns undefined for empty string', () => {
    expect(resolveCityToIata('')).toBeUndefined()
  })
})

describe('fuzzyResolveCity', () => {
  it('partial match 广 returns [CAN]', () => {
    const result = fuzzyResolveCity('广')
    expect(result).toEqual(['CAN'])
  })

  it('partial match 东 returns matches with 东 in name/alias [TYO]', () => {
    const result = fuzzyResolveCity('东')
    expect(result).toContain('TYO')  // 东京
    expect(result).toContain('SHA')  // via alias 上海浦东
    expect(result).not.toContain('DLC')  // 大连不含"东"
  })

  it('fuzzy match 上海 returns [SHA]', () => {
    const result = fuzzyResolveCity('上海')
    expect(result).toEqual(['SHA'])
  })

  it('fuzzy match 京 returns multiple cities (北京、南京、东京)', () => {
    const result = fuzzyResolveCity('京')
    expect(result).toContain('BJS')  // 北京
    expect(result).toContain('NKG')  // 南京
    expect(result).toContain('TYO')  // 东京
    expect(result.length).toBeGreaterThanOrEqual(3)
  })

  it('returns empty array for empty query', () => {
    expect(fuzzyResolveCity('')).toEqual([])
  })
})

describe('popularRoutes', () => {
  it('returns 8 popular route suggestions', () => {
    expect(popularRoutes().length).toBe(8)
  })

  it('each route has from, to, and label fields', () => {
    for (const route of popularRoutes()) {
      expect(route).toHaveProperty('from')
      expect(route).toHaveProperty('to')
      expect(route).toHaveProperty('label')
    }
  })
})
