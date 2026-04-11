export default function AdminHomePage() {
  return (
    <main className="admin-shell">
      <header>
        <p className="eyebrow">admin</p>
        <h1>Admin 运营首页</h1>
        <p>内部运营入口（MVP）：用于创建、维护、发布和归档特价 deal。</p>
      </header>

      <section className="admin-actions">
        <a href="/admin/deals">进入 Deal 管理</a>
      </section>
    </main>
  )
}
