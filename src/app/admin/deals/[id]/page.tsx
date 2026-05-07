import { getPayload } from 'payload'
import configPromise from '@payload-config'

type DealEditPageProps = {
  params: Promise<{ id: string }>
}

export default async function DealEditPage({ params }: DealEditPageProps) {
  const { id } = await params
  const isNew = id === 'new'

  let deal: Record<string, unknown> = {}
  if (!isNew) {
    try {
      const payload = await getPayload({ config: configPromise })
      deal = await payload.findByID({ collection: 'deals', id }) as unknown as Record<string, unknown>
    } catch {
      // deal not found — show empty form
    }
  }

  const apiPath = isNew ? '/api/admin/deals' : `/api/admin/deals/${id}`
  const formAction = isNew ? 'POST' : 'PATCH'

  return (
    <main className="admin-shell">
      <header>
        <h1>{isNew ? '新建 Deal' : `编辑 Deal：${id}`}</h1>
        <p>单条管理：保存、发布、归档。</p>
      </header>

      <form
        className="deal-form"
        aria-label="deal edit form"
        action={apiPath}
        method={formAction === 'POST' ? 'POST' : 'POST'}
        encType="application/x-www-form-urlencoded"
      >
        <section className="deal-form__section">
          <h2>fare basics</h2>
          <label>
            标题
            <input name="title" defaultValue={String(deal.title ?? '')} required />
          </label>
          <label>
            出发城市
            <input name="departureCity" defaultValue={String(deal.departureCity ?? '')} required />
          </label>
          <label>
            目的地
            <input name="destination" defaultValue={String(deal.destination ?? '')} required />
          </label>
          <label>
            headlinePrice
            <input name="headlinePrice" type="number" defaultValue={Number(deal.headlinePrice) || ''} required />
          </label>
          <label>
            referenceTotalPrice
            <input name="referenceTotalPrice" type="number" defaultValue={Number(deal.referenceTotalPrice) || ''} />
          </label>
          <label>
            航司
            <input name="airline" defaultValue={String(deal.airline ?? '')} />
          </label>
          <label>
            直飞
            <input name="isDirect" type="checkbox" defaultChecked={!!deal.isDirect} />
          </label>
        </section>

        <section className="deal-form__section">
          <h2>travel timing</h2>
          <label>
            travelStartDate
            <input name="travelStartDate" type="date" defaultValue={String(deal.travelStartDate ?? '').slice(0, 10)} />
          </label>
          <label>
            travelEndDate
            <input name="travelEndDate" type="date" defaultValue={String(deal.travelEndDate ?? '').slice(0, 10)} />
          </label>
          <label>
            travelWindowLabel
            <input name="travelWindowLabel" defaultValue={String(deal.travelWindowLabel ?? '')} />
          </label>
        </section>

        <section className="deal-form__section deal-form__section--full">
          <h2>rule summary</h2>
          <textarea name="refundChangeSummary" defaultValue={String(deal.refundChangeSummary ?? '')} />
        </section>

        <section className="deal-form__section">
          <h2>source+freshness</h2>
          <input name="sourceLink" defaultValue={String(deal.sourceLink ?? '')} placeholder="预订链接" />
          <input name="expiresAt" type="date" defaultValue={String(deal.expiresAt ?? '').slice(0, 10)} />
        </section>

        <section className="deal-form__section deal-form__section--full">
          <h2>recommendation</h2>
          <textarea name="recommendationCopy" defaultValue={String(deal.recommendationCopy ?? '')} />
        </section>

        <div className="deal-actions">
          <button type="submit">保存</button>
          <button type="submit" formMethod="POST" formAction={`${apiPath}?status=published`}>发布</button>
        </div>
      </form>
    </main>
  )
}
