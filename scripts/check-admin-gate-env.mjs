const required = ['ADMIN_GATE_USERNAME', 'ADMIN_GATE_PASSWORD']

const missing = required.filter((name) => !process.env[name] || process.env[name].trim().length === 0)

if (missing.length > 0) {
  console.error(`[admin-gate] Missing required environment variables: ${missing.join(', ')}`)
  process.exit(1)
}

console.log('[admin-gate] Environment variables are configured')
