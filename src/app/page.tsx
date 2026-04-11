export default function HomePage() {
  return (
    <main className="public-shell" style={{ backgroundColor: 'var(--color-dominant)' }}>
      <section className="public-hero" aria-label="travel-hero">
        <p className="eyebrow">特价机票发现平台</p>
        <h1>更快判断这张机票值不值得买</h1>
        <p>从分散票价中快速看到核心信息：价格、时效、规则和下一步。</p>
      </section>

      <nav className="public-nav" aria-label="主导航" style={{ borderColor: 'var(--color-secondary)' }}>
        <a href="/">公开首页</a>
        <a href="/admin">运营后台</a>
        <a href="/admin/deals">Deal 管理</a>
      </nav>
    </main>
  )
}
