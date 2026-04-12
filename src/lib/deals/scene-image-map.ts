export const sceneImageMap = {
  seoul: '/images/atmosphere/seoul-palace-blur.avif',
  bangkok: '/images/atmosphere/bangkok-market-blur.avif',
  hongkong: '/images/atmosphere/hongkong-harbor-blur.avif',
  osaka: '/images/atmosphere/osaka-castle-blur.avif',
  fallback: '/images/atmosphere/sakura-blur.avif'
} as const

type DealSceneInput = {
  id?: string | null
  title?: string | null
  destination?: string | null
}

const destinationMatchers: Array<{ match: RegExp; image: string }> = [
  { match: /(首尔|seoul)/i, image: sceneImageMap.seoul },
  { match: /(曼谷|bangkok)/i, image: sceneImageMap.bangkok },
  { match: /(香港|hong\s?kong)/i, image: sceneImageMap.hongkong },
  { match: /(大阪|osaka)/i, image: sceneImageMap.osaka }
]

export function pickSceneImageByDeal(deal: DealSceneInput): string {
  const context = `${deal.destination ?? ''} ${deal.title ?? ''} ${deal.id ?? ''}`

  const matched = destinationMatchers.find(({ match }) => match.test(context))
  return matched?.image ?? sceneImageMap.fallback
}
