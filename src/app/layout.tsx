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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DotGothic16&family=Space+Mono:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
