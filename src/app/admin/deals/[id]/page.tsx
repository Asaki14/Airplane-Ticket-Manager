type DealEditPageProps = {
  params: Promise<{ id: string }>
}

export default async function DealEditPage({ params }: DealEditPageProps) {
  const { id } = await params

  return (
    <main className="admin-shell">
      <header>
        <h1>编辑 Deal：{id}</h1>
        <p>单条管理：保存、发布、归档。</p>
      </header>

      <form className="deal-form" aria-label="deal edit form">
        <section className="deal-form__section">
          <h2>fare basics</h2>
          <label>
            标题
            <input name="title" defaultValue="示例特价" />
          </label>
          <label>
            headlinePrice
            <input name="headlinePrice" type="number" defaultValue={999} />
          </label>
          <label>
            referenceTotalPrice
            <input name="referenceTotalPrice" type="number" defaultValue={1220} />
          </label>
        </section>

        <section className="deal-form__section">
          <h2>travel timing</h2>
          <label>
            travelStartDate
            <input name="travelStartDate" type="date" />
          </label>
          <label>
            travelEndDate
            <input name="travelEndDate" type="date" />
          </label>
          <label>
            travelWindowLabel
            <input name="travelWindowLabel" defaultValue="五一前后" />
          </label>
        </section>

        <section className="deal-form__section deal-form__section--full">
          <h2>rule summary</h2>
          <textarea name="refundChangeSummary" defaultValue="改签收取手续费" />
        </section>

        <section className="deal-form__section">
          <h2>source+freshness</h2>
          <input name="sourceLink" defaultValue="https://example.com/deal" />
          <input name="expiresAt" type="datetime-local" />
        </section>

        <section className="deal-form__section deal-form__section--full">
          <h2>recommendation</h2>
          <textarea name="recommendationCopy" defaultValue="适合周末短途休假" />
        </section>

        <div className="deal-actions">
          <button type="button">保存</button>
          <button type="button">发布</button>
          <button type="button">归档</button>
        </div>
      </form>
    </main>
  )
}
