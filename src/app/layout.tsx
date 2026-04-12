import '../styles/tokens.css'
import '../styles/globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: '航易-找航班，很容易',
  description: '特价机票发现平台，快速判断机票值不值得买',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg'
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
