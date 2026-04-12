import { describe, expect, it } from 'vitest'

import { buildDealAdvice } from '../src/lib/dealAdvice'

describe('buildDealAdvice', () => {
  it('为深圳到香港低价航线返回定制建议', () => {
    const advice = buildDealAdvice({
      id: 'shenz-hk-1',
      title: '深圳-香港周末闪促',
      departureCity: '深圳',
      destination: '香港',
      headlinePrice: 320,
      referenceTotalPrice: 680,
      valueScore: 90,
      baggageInfo: '含随身行李',
      refundChangeSummary: '不可退改',
      stopSummary: '直飞'
    })

    expect(advice).toContain('性价比高')
    expect(advice).toContain('人少')
    expect(advice).toContain('短途出行')
    expect(advice.length).toBeGreaterThanOrEqual(28)
    expect(advice.length).toBeLessThanOrEqual(50)
  })

  it('其他航线返回通用建议文案', () => {
    const advice = buildDealAdvice({
      id: 'sha-bkk-1',
      title: '上海-曼谷春季促销',
      departureCity: '上海',
      destination: '曼谷',
      headlinePrice: 1299,
      referenceTotalPrice: 1699,
      valueScore: 68,
      baggageInfo: '含20kg托运',
      refundChangeSummary: '改签收费',
      stopSummary: '经停1次'
    })

    expect(advice).toMatch(/价格|当前价/)
    expect(advice).toMatch(/建议尽快下单|可再观察/)
    expect(advice.length).toBeGreaterThanOrEqual(28)
    expect(advice.length).toBeLessThanOrEqual(50)
  })

  it('关键字段缺失或异常值时返回安全兜底文案且不抛错', () => {
    expect(() =>
      buildDealAdvice({
        id: 'broken-1',
        title: '异常数据样本',
        departureCity: '',
        destination: '',
        headlinePrice: Number.NaN,
        referenceTotalPrice: Number.NaN,
        valueScore: Number.NaN,
        baggageInfo: '',
        refundChangeSummary: '',
        stopSummary: ''
      })
    ).not.toThrow()

    const advice = buildDealAdvice({
      id: 'broken-2',
      title: '异常数据样本2',
      departureCity: '',
      destination: '',
      headlinePrice: -1,
      referenceTotalPrice: 0,
      valueScore: -10,
      baggageInfo: '',
      refundChangeSummary: '',
      stopSummary: ''
    })

    expect(advice).toContain('信息待补充')
    expect(advice).toContain('再决定')
    expect(advice.length).toBeGreaterThanOrEqual(28)
    expect(advice.length).toBeLessThanOrEqual(50)
  })
})
