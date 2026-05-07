/**
 * city-map.ts — Chinese city name ↔ IATA code resolution.
 *
 * Maps common Chinese city names (and airport aliases) to metro/airport IATA codes.
 * Metro codes (BJS, TYO, NYC, LON, PAR, SEL) are used for multi-airport cities
 * so search can match any airport in that city.
 *
 * Exports:
 *   - resolveCityToIata(name) — exact + alias match
 *   - fuzzyResolveCity(query) — substring match across names and aliases
 *   - allCityNames() — sorted list of all city names (for UI autocomplete)
 *   - popularRoutes() — top route suggestions for empty state
 */

export type CityEntry = {
  /** Display name in Chinese */
  name: string
  /** IATA metro/airport code */
  iata: string
  /** Alternative names, airport names, or abbreviations */
  aliases?: string[]
}

export const CITY_MAP: CityEntry[] = [
  // --- Domestic (use primary airport IATA codes for Ignav compatibility) ---
  { name: '上海', iata: 'SHA', aliases: ['上海浦东', 'PVG', '上海虹桥'] },
  { name: '北京', iata: 'PEK', aliases: ['北京首都', '北京大兴', 'PKX', 'BJS'] },
  { name: '广州', iata: 'CAN' },
  { name: '深圳', iata: 'SZX' },
  { name: '成都', iata: 'CTU', aliases: ['成都天府', 'TFU'] },
  { name: '重庆', iata: 'CKG' },
  { name: '杭州', iata: 'HGH' },
  { name: '南京', iata: 'NKG' },
  { name: '昆明', iata: 'KMG' },
  { name: '西安', iata: 'XIY' },
  { name: '武汉', iata: 'WUH' },
  { name: '长沙', iata: 'CSX' },
  { name: '厦门', iata: 'XMN' },
  { name: '青岛', iata: 'TAO' },
  { name: '大连', iata: 'DLC' },
  { name: '三亚', iata: 'SYX' },

  // --- International (use primary airport IATA codes) ---
  { name: '东京', iata: 'NRT', aliases: ['成田', '羽田', 'HND', 'TYO'] },
  { name: '大阪', iata: 'KIX', aliases: ['关西', '伊丹', 'ITM'] },
  { name: '首尔', iata: 'ICN', aliases: ['仁川', '金浦', 'GMP', 'SEL'] },
  { name: '曼谷', iata: 'BKK' },
  { name: '新加坡', iata: 'SIN' },
  { name: '香港', iata: 'HKG' },
  { name: '台北', iata: 'TPE', aliases: ['桃园', '松山', 'TSA'] },
  { name: '纽约', iata: 'JFK', aliases: ['肯尼迪', '拉瓜迪亚', 'LGA', 'NYC'] },
  { name: '洛杉矶', iata: 'LAX' },
  { name: '旧金山', iata: 'SFO' },
  { name: '伦敦', iata: 'LHR', aliases: ['希思罗', '盖特威克', 'LGW', 'LON'] },
  { name: '巴黎', iata: 'CDG', aliases: ['戴高乐', '奥利', 'ORY', 'PAR'] },
]

/**
 * Exact match against city name or aliases.
 * Case-insensitive. Returns the metro/airport IATA code.
 */
export function resolveCityToIata(name: string): string | undefined {
  if (!name) return undefined
  const normalized = name.trim().toLowerCase()
  if (!normalized) return undefined

  for (const entry of CITY_MAP) {
    if (entry.name.toLowerCase() === normalized) return entry.iata
    if (entry.aliases?.some(a => a.toLowerCase() === normalized)) return entry.iata
  }
  return undefined
}

/**
 * Fuzzy match — returns all IATA codes where the city name or any alias
 * contains the query substring. Case-insensitive.
 */
export function fuzzyResolveCity(query: string): string[] {
  if (!query) return []
  const normalized = query.trim().toLowerCase()
  if (!normalized) return []

  const results = new Set<string>()

  for (const entry of CITY_MAP) {
    if (entry.name.toLowerCase().includes(normalized)) {
      results.add(entry.iata)
    }
    if (entry.aliases?.some(a => a.toLowerCase().includes(normalized))) {
      results.add(entry.iata)
    }
  }

  return [...results]
}

/** Returns sorted list of all city display names (for UI autocomplete). */
export function allCityNames(): string[] {
  return CITY_MAP.map(e => e.name).sort()
}

/** Returns top 8 popular route suggestions for empty search state. */
export function popularRoutes(): Array<{ from: string; to: string; label: string }> {
  return [
    { from: 'SHA', to: 'CAN', label: '上海 → 广州' },
    { from: 'SHA', to: 'SZX', label: '上海 → 深圳' },
    { from: 'PEK', to: 'SHA', label: '北京 → 上海' },
    { from: 'SHA', to: 'TYO', label: '上海 → 东京' },
    { from: 'SHA', to: 'SIN', label: '上海 → 新加坡' },
    { from: 'SHA', to: 'HKG', label: '上海 → 香港' },
    { from: 'SHA', to: 'BKK', label: '上海 → 曼谷' },
    { from: 'SHA', to: 'NYC', label: '上海 → 纽约' },
  ]
}
