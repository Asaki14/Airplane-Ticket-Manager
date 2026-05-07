import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

export default async function AdminDealsPage() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'deals',
    sort: '-createdAt',
    limit: 100,
  })
  const deals = result.docs as unknown as Record<string, unknown>[]

  return (
    <main className="admin-shell">
      <header>
        <h1>Deal 列表</h1>
        <a href="/admin/deals/new">新建特价</a>
      </header>

      <section className="mobile-card-list" aria-label="mobile card list">
        {deals.map((deal) => (
          <article key={String(deal.id)} className="deal-card-mobile">
            <header className="deal-card-mobile__header">
              <h2>{String(deal.title ?? '')}</h2>
              <p className="deal-card-mobile__status">状态：{String(deal.status ?? '')}</p>
            </header>
            <div className="deal-card-mobile__body">
              <p>
                {String(deal.departureCity ?? '')} → {String(deal.destination ?? '')}
              </p>
              <p>¥{String(deal.headlinePrice ?? '')}</p>
            </div>
            <footer className="deal-card-mobile__footer">
              <a href={`/admin/deals/${deal.id}`}>编辑</a>
            </footer>
          </article>
        ))}
      </section>

      <section className="desktop-table" aria-label="desktop table">
        <table>
          <thead>
            <tr>
              <th>标题</th>
              <th>航线</th>
              <th>主价格</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => (
              <tr key={String(deal.id)}>
                <td>{String(deal.title ?? '')}</td>
                <td>
                  {String(deal.departureCity ?? '')} → {String(deal.destination ?? '')}
                </td>
                <td>¥{String(deal.headlinePrice ?? '')}</td>
                <td>{String(deal.status ?? '')}</td>
                <td>
                  <a href={`/admin/deals/${deal.id}`}>编辑</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  )
}
