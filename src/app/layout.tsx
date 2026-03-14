import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '大鲸图标 - 网站图标获取工具',
  description: '获取任意网站的 favicon 图标，提供 API 接口服务',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-CN"><body>{children}</body></html>
}