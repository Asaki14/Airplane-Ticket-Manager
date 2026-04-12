const mockDeals = [
  {
    id: 'deal-001',
    title: '上海-曼谷 国庆前后往返',
    status: 'draft',
    headlinePrice: 1299,
    departureCity: '上海',
    destination: '曼谷'
  },
  {
    id: 'deal-002',
    title: '广州-大阪 樱花季直飞',
    status: 'published',
    headlinePrice: 1680,
    departureCity: '广州',
    destination: '大阪'
  }
]

export default function AdminDealsPage() {
  return (
    <main className="admin-shell">
      <header>
        <h1>Deal 列表</h1>
        <a href="/admin/deals/new">新建特价</a>
      </header>

      <section className="mobile-card-list" aria-label="mobile card list">
        {mockDeals.map((deal) => (
          <article key={deal.id} className="deal-card-mobile">
            <header className="deal-card-mobile__header">
              <h2>{deal.title}</h2>
              <p className="deal-card-mobile__status">状态：{deal.status}</p>
            </header>
            <div className="deal-card-mobile__body">
              <p>
                {deal.departureCity} → {deal.destination}
              </p>
              <p>¥{deal.headlinePrice}</p>
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
            {mockDeals.map((deal) => (
              <tr key={deal.id}>
                <td>{deal.title}</td>
                <td>
                  {deal.departureCity} → {deal.destination}
                </td>
                <td>¥{deal.headlinePrice}</td>
                <td>{deal.status}</td>
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
