import { pickSceneImageByDeal } from '@/lib/deals/scene-image-map'

type DealCardProps = {
  id: string
  title: string
  departureCity: string
  destination: string
  travelWindowLabel: string
  airline: string
  headlinePrice: number
  referenceTotalPrice: number
  valueScore: number
  publishedAt: string | null
  updatedAt: string | null
  expiresAt: string
}

function toDateLabel(value: string | null) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('zh-CN', { hour12: false })
}

export function DealCard({
  id,
  title,
  departureCity,
  destination,
  travelWindowLabel,
  airline,
  headlinePrice,
  referenceTotalPrice,
  valueScore,
  publishedAt,
  updatedAt,
  expiresAt
}: DealCardProps) {
  const sceneImageUrl = pickSceneImageByDeal({ id, destination, title })

  return (
    <article className="group relative flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden deal-card--atmosphere deal-card--scenic">
      <span className="deal-card__atmosphere-layer" aria-hidden="true" />
      <span className="deal-card__scene-layer h-24 w-full overflow-hidden absolute inset-x-0 top-0 opacity-10 pointer-events-none" aria-hidden="true" role="presentation">
        <img src={sceneImageUrl} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white"></div>
      </span>
      <span className="deal-card__scene-overlay" aria-hidden="true" role="presentation" />
      
      <div className="p-5 md:p-6 flex flex-col flex-1 relative z-10">
        <header className="mb-4">
          <div className="flex justify-between items-start mb-3">
            <p className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">特价 #{id}</p>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              价值分 {valueScore}
            </div>
          </div>
          
          <h2 className="text-lg font-bold text-slate-800 line-clamp-2 leading-tight mb-4">
            <a href={`/deals/${id}`} className="hover:text-blue-600 transition-colors before:absolute before:inset-0">{title}</a>
          </h2>
          
          <div className="flex items-center justify-between bg-slate-50 rounded-lg p-3 border border-slate-100">
            <div className="text-center w-1/3">
              <p className="text-base md:text-lg font-bold text-slate-700 truncate">{departureCity}</p>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center px-2">
              <span className="text-[10px] text-slate-400 mb-1 truncate max-w-full uppercase">{airline}</span>
              <div className="w-full relative flex items-center justify-center">
                <div className="h-px bg-slate-300 w-full absolute top-1/2 -translate-y-1/2"></div>
                <svg className="w-3 h-3 text-slate-400 bg-slate-50 z-10 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
            </div>
            <div className="text-center w-1/3">
              <p className="text-base md:text-lg font-bold text-slate-700 truncate">{destination}</p>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col justify-end mt-2">
          <p className="text-sm text-slate-600 flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="line-clamp-1">{travelWindowLabel}</span>
          </p>

          <div className="flex items-end justify-between mt-auto pt-4 border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-500 mb-1">参考总价 ¥{referenceTotalPrice}</p>
              <div className="flex items-baseline gap-1 text-orange-600">
                <span className="text-sm font-bold">¥</span>
                <span className="text-3xl font-black leading-none">{headlinePrice}</span>
                <span className="text-xs text-slate-500 ml-1 font-normal">起</span>
              </div>
            </div>
            <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700 group-hover:translate-x-1 transition-transform">详情 &rarr;</span>
          </div>
        </div>

        <ul className="mt-5 pt-3 border-t border-slate-50 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-400">
          <li>发布 {toDateLabel(publishedAt)}</li>
          <li>更新 {toDateLabel(updatedAt)}</li>
          <li>失效 {toDateLabel(expiresAt)}</li>
        </ul>
      </div>
    </article>
  )
}
