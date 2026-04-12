import { describe, expect, it } from 'vitest'
import { mockDeals } from '../src/lib/deals/mock-data'
import { pickSceneImageByDeal } from '../src/lib/deals/scene-image-map'

describe('deal-scenic-map', () => {
  it('首尔 deal 命中 seoul-palace-blur.avif', () => {
    const deal = mockDeals.find((item) => item.destination === '首尔')
    expect(deal).toBeTruthy()
    expect(pickSceneImageByDeal(deal!)).toContain('/images/atmosphere/seoul-palace-blur.avif')
  })

  it('曼谷 deal 命中 bangkok-market-blur.avif', () => {
    const deal = mockDeals.find((item) => item.destination === '曼谷')
    expect(deal).toBeTruthy()
    expect(pickSceneImageByDeal(deal!)).toContain('/images/atmosphere/bangkok-market-blur.avif')
  })

  it('香港 deal 命中 hongkong-harbor-blur.avif', () => {
    const deal = mockDeals.find((item) => item.destination === '香港')
    expect(deal).toBeTruthy()
    expect(pickSceneImageByDeal(deal!)).toContain('/images/atmosphere/hongkong-harbor-blur.avif')
  })

  it('大阪 deal 命中 osaka-castle-blur.avif', () => {
    const deal = mockDeals.find((item) => item.destination === '大阪')
    expect(deal).toBeTruthy()
    expect(pickSceneImageByDeal(deal!)).toContain('/images/atmosphere/osaka-castle-blur.avif')
  })

  it('未知目的地回退到默认春日场景图', () => {
    const fallback = pickSceneImageByDeal({
      id: 'custom-deal',
      title: '杭州-三亚晚班往返',
      destination: '三亚'
    })

    expect(fallback).toContain('/images/atmosphere/sakura-blur.avif')
    expect(fallback).not.toBe('')
  })
})
