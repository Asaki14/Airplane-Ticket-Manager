import nextEnv from '@next/env'

const { loadEnvConfig } = nextEnv

loadEnvConfig(process.cwd())

const required = ['ADMIN_GATE_USERNAME', 'ADMIN_GATE_PASSWORD']

const missing = required.filter((name) => !process.env[name] || process.env[name].trim().length === 0)

if (missing.length > 0) {
  console.error(`[admin-gate] Missing required environment variables: ${missing.join(', ')}`)
  process.exit(1)
}

console.log('[admin-gate] Environment variables are configured')

// Amadeus API credentials (optional — mock mode works without them)
if (process.env.AMADEUS_CLIENT_ID && !process.env.AMADEUS_CLIENT_SECRET) {
  console.error('  WARNING: AMADEUS_CLIENT_ID set but AMADEUS_CLIENT_SECRET missing')
}
if (!process.env.AMADEUS_CLIENT_ID) {
  console.log('  INFO: AMADEUS_CLIENT_ID not set — will use mock adapter')
}
