import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { CanonicalFaresCollection } from './collections/CanonicalFares'
import { CollectionRunsCollection } from './collections/CollectionRuns'
import { DealsCollection } from './collections/Deals'
import { PendingRawPayloadsCollection } from './collections/PendingRawPayloads'

const payloadSecret = process.env.PAYLOAD_SECRET ?? 'dev-only-payload-secret'
const databaseURL = process.env.DATABASE_URL ?? 'file:./payload.db'

export default buildConfig({
  secret: payloadSecret,
  blocks: [],
  db: sqliteAdapter({
    client: {
      url: databaseURL
    }
  }),
  collections: [DealsCollection, CanonicalFaresCollection, CollectionRunsCollection, PendingRawPayloadsCollection]
})
