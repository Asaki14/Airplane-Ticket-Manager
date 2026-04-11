import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { DealsCollection } from './collections/Deals'

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
  collections: [DealsCollection]
})
