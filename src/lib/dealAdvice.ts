type DealAdviceInput = {
  departureCity?: string
  destination?: string
  headlinePrice?: number
  referenceTotalPrice?: number
  valueScore?: number
  stopSummary?: string
}

const SAFE_FALLBACK = '该票信息待补充，先核对行李退改与中转时间，再决定是否下单。'

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
    return '深圳飞香港这班性价比高、人少，适合短途出行，行程确定建议尽快下单。'
  }

  const reference = deal.referenceTotalPrice
  let pricePart = '当前价优势一般'
  if (hasValidNumber(reference) && reference > 0) {
    const ratio = headlinePrice / reference
    if (ratio <= 0.75) {
      pricePart = '当前价明显低于常见水平'
    } else if (ratio <= 0.9) {
      pricePart = '当前价有一定优势'
    }
  }

  const stopSummary = deal.stopSummary ?? ''
  const stopPart = stopSummary.includes('直飞') ? '直飞节省体力' : '经停方案需留意中转时长'
  const actionPart = hasValidNumber(valueScore) && valueScore >= 75 ? '建议尽快下单锁定' : '可再观察再决定'

  return `${pricePart}，${stopPart}，${actionPart}。`
}
