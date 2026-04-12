'use client'

import { useState } from 'react'

type DiscoveryPreferencesProps = {
  departureOptions: string[]
  currentDepartureCity?: string
}

export function DiscoveryPreferences({ departureOptions, currentDepartureCity }: DiscoveryPreferencesProps) {
  const [value, setValue] = useState(currentDepartureCity ?? '')
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  async function savePreference() {
    setStatus('saving')
    await fetch('/api/preferences/departure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ departureCity: value })
    })
    setStatus('saved')
    window.location.reload()
  }

  return (
    <section className="preference-panel" aria-label="偏好设置">
      <h2>我的默认出发地</h2>
      <p>设置后会自动带入发现筛选，减少重复操作。</p>
      <div className="preference-controls">
        <label>
          出发城市
          <select value={value} onChange={(event) => setValue(event.target.value)}>
            <option value="">不设默认</option>
            {departureOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={savePreference} disabled={status === 'saving'}>
          {status === 'saving' ? '保存中...' : '保存偏好'}
        </button>
      </div>
      {currentDepartureCity ? <p className="preference-current">当前默认：{currentDepartureCity}</p> : null}
    </section>
  )
}
