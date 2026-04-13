type DealAdviceInput = {
  departureCity?: string
  destination?: string
  headlinePrice?: number
  referenceTotalPrice?: number
  valueScore?: number
  stopSummary?: string
}

const SAFE_FALLBACK = '该票信息待补充，建议先核对行李额度、退改政策和经停时长，评估后再决定是否下单。'

function hasValidNumber(value: number | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function inLowPriceBand(price: number, reference?: number): boolean {
  if (hasValidNumber(reference) && reference > 0) {
    return price / reference <= 0.7
  }
  return price <= 450
}

function normalizeCityName(city?: string): string {
  return (city ?? '').replace(/市/g, '').trim()
}

export function buildDealAdvice(deal: DealAdviceInput): string {
  const departure = normalizeCityName(deal.departureCity)
  const destination = normalizeCityName(deal.destination)
  const headlinePrice = deal.headlinePrice
  const valueScore = deal.valueScore

  if (!departure || !destination || !hasValidNumber(headlinePrice) || headlinePrice <= 0) {
    return SAFE_FALLBACK
  }

  const shenzhenToHongKong = departure === '深圳' && destination === '香港'
  const highValue = hasValidNumber(valueScore) && valueScore >= 80

  if (shenzhenToHongKong && inLowPriceBand(headlinePrice, deal.referenceTotalPrice) && highValue) {
    return '深圳飞香港性价比高、航班密集，人少且适合说走就走的短途出行，行程确定建议尽快锁定。'
  }

  const reference = deal.referenceTotalPrice
  let pricePart = '当前价格处于常规区间'
  if (hasValidNumber(reference) && reference > 0) {
    const ratio = headlinePrice / reference
    if (ratio <= 0.75) {
      pricePart = '当前价明显低于常见水平，性价比突出'
    } else if (ratio <= 0.9) {
      pricePart = '当前价有一定优势，比常规价格更划算'
    }
  }

  const stopSummary = deal.stopSummary ?? ''
  const stopPart = stopSummary.includes('直飞')
    ? '直飞省心省力'
    : '需留意中转时长与间隔'
  const actionPart = hasValidNumber(valueScore) && valueScore >= 75 ? '库存有限建议尽快下单' : '价格尚可建议可再观察'

  return `${pricePart}，${stopPart}，${actionPart}。`
}