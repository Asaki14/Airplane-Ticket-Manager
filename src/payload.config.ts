import { buildConfig } from 'payload'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { CanonicalFaresCollection } from './collections/CanonicalFares'
import { CollectionRunsCollection } from './collections/CollectionRuns'
import { DealsCollection } from './collections/Deals'
import { PendingRawPayloadsCollection } from './collections/PendingRawPayloads'

const payloadSecret = process.env.PAYLOAD_SECRET ?? 'dev-only-payload-secret'
const databaseURL = process.env.DATABASE_URL ?? 'file:./payload.db'

async function getDatabaseAdapter() {
  if (process.env.CLOUDFLARE_DEPLOY === '1') {
    const cloudflare = await getCloudflareContext({ async: true })

    return sqliteD1Adapter({
      binding: (cloudflare.env as { D1: never }).D1
    })
  }

  const runtimeImport = new Function('specifier', 'return import(specifier)') as (
    specifier: string
  ) => Promise<typeof import('@payloadcms/db-sqlite')>
  const { sqliteAdapter } = await runtimeImport('@payloadcms/db-sqlite')

  return sqliteAdapter({
    client: {
      url: databaseURL
    }
  })
}

export default buildConfig({
  secret: payloadSecret,
  blocks: [],
  db: await getDatabaseAdapter(),
  collections: [DealsCollection, CanonicalFaresCollection, CollectionRunsCollection, PendingRawPayloadsCollection]
})
