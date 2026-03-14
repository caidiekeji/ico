'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [iconUrl, setIconUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [iconSize, setIconSize] = useState(64)
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/stats').then(res => res.json()).then(data => setStats(data.count)).catch(() => setStats(0))
  }, [])

  const fetchIcon = async () => {
    if (!url) { setError('请输入网站地址'); return }
    setLoading(true); setError(''); setIconUrl(''); setCopied(false)
    try {
      const domain = url.trim().replace(/^https?:\\/\\//, '')
      setIconUrl(`/api/icon?url=${encodeURIComponent(domain)}&size=${iconSize}`)
      if (stats !== null) setStats(prev => prev !== null ? prev + 1 : 1)
    } catch { setError('请输入有效的网站地址') }
    finally { setLoading(false) }
  }

  const copyApiUrl = async () => {
    if (!url) return
    const domain = url.trim().replace(/^https?:\\/\\//, '')
    await navigator.clipboard.writeText(`${window.location.origin}/api/icon?url=${encodeURIComponent(domain)}&size=${iconSize}`)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const downloadIcon = () => {
    if (!iconUrl) return
    const link = document.createElement('a')
    link.href = iconUrl; link.download = `icon-${url.replace(/^https?:\\/\\//, '')}-${iconSize}.png`; link.click()
  }

  const formatNumber = (num: number) => num >= 1000000 ? (num / 1000000).toFixed(1) + 'M' : num >= 1000 ? (num / 1000).toFixed(1) + 'K' : num.toString()

  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="relative z-10">
        <nav className="fixed top-4 left-4 right-4 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.5 2 5 4 4 7c-1.5 4.5 1 8 4 9.5.5.3 1 .5 1.5.5h.5c.3 0 .5.2.5.5v1c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5v-1c0-.3.2-.5.5-.5h.5c.5 0 1-.2 1.5-.5 3-1.5 5.5-5 4-9.5-1-3-4.5-5-8-5z"/></svg>
              </div>
              <span className="font-semibold">大鲸图标</span>
              <span className="px-2 py-0.5 text-xs bg-indigo-500/20 text-indigo-400 rounded-full">API</span>
            </div>
            <div className="flex items-center gap-4">
              {stats !== null && <div className="text-sm text-slate-400">已服务 <span className="text-white font-medium">{formatNumber(stats)}</span> 次</div>}
              <div className="flex items-center gap-2 text-sm text-slate-400"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />在线</div>
            </div>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-6 pt-28 pb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-slate-400 mb-6"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />高性能图标获取服务</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">网站图标 API</h1>
            <p className="text-slate-400 max-w-lg mx-auto">一行代码获取任意网站的 favicon，支持多种尺寸，全球 CDN 加速</p>
          </div>
          <div className="relative group mb-8">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-20 group-hover:opacity-40 blur transition-opacity" />
            <div className="relative bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1"><label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">域名</label><input type="text" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchIcon()} placeholder="github.com" className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all" /></div>
                <div className="w-full md:w-28"><label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">尺寸</label><select value={iconSize} onChange={(e) => setIconSize(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:border-indigo-500/50 outline-none appearance-none cursor-pointer">{[16, 32, 48, 64, 128, 256].map(s => <option key={s} value={s}>{s}px</option>)}</select></div>
                <div className="w-full md:w-auto self-end"><button onClick={fetchIcon} disabled={loading} className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-medium hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2">{loading ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>获取中</> : '获取'}</button></div>
              </div>
              {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
            </div>
          </div>
          {iconUrl && (
            <div className="relative group mb-12">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl opacity-20 blur" />
              <div className="relative bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4"><span className="text-sm text-slate-400">预览</span><span className="text-xs px-2 py-1 bg-white/5 rounded text-slate-500">{iconSize}×{iconSize}</span></div>
                <div className="flex items-center justify-center p-8 bg-slate-800/50 rounded-xl mb-4"><img src={iconUrl} alt="Icon" className="max-w-[128px] max-h-[128px] object-contain" onError={() => setError('无法加载图标')} /></div>
                <div className="flex gap-3">
                  <button onClick={copyApiUrl} className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2">{copied ? <><svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>已复制</> : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>复制 URL</>}</button>
                  <button onClick={downloadIcon} className="flex-1 px-4 py-2.5 bg-indigo-600 rounded-lg text-sm hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>下载</button>
                </div>
              </div>
            </div>
          )}
          <div id="docs" className="pt-8 border-t border-white/5">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3"><div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center"><svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>API 文档</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">{[{ label: 'Endpoint', value: 'GET /api/icon' }, { label: '格式', value: 'PNG / ICO / SVG' }, { label: '缓存', value: '24 小时' }].map(item => (<div key={item.label} className="bg-white/[0.02] border border-white/10 rounded-xl p-4"><div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{item.label}</div><div className="text-indigo-400 font-mono text-sm">{item.value}</div></div>))}</div>
            <div className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden mb-6">
              <div className="px-4 py-2 border-b border-white/5 text-xs text-slate-500 uppercase tracking-wider">参数</div>
              <table className="w-full text-sm"><thead><tr className="border-b border-white/5"><th className="text-left py-2 px-4 text-slate-400 font-medium">名称</th><th className="text-left py-2 px-4 text-slate-400 font-medium">类型</th><th className="text-left py-2 px-4 text-slate-400 font-medium">必填</th><th className="text-left py-2 px-4 text-slate-400 font-medium">描述</th></tr></thead><tbody><tr className="border-b border-white/5 hover:bg-white/[0.02]"><td className="py-2 px-4 font-mono text-indigo-400">url</td><td className="py-2 px-4 text-slate-400">string</td><td className="py-2 px-4"><span className="px-1.5 py-0.5 bg-rose-500/20 text-rose-400 text-xs rounded">必填</span></td><td className="py-2 px-4 text-slate-400">网站域名</td></tr><tr className="hover:bg-white/[0.02]"><td className="py-2 px-4 font-mono text-indigo-400">size</td><td className="py-2 px-4 text-slate-400">number</td><td className="py-2 px-4"><span className="px-1.5 py-0.5 bg-slate-500/20 text-slate-400 text-xs rounded">可选</span></td><td className="py-2 px-4 text-slate-400">图标尺寸 (16-256)</td></tr></tbody></table>
            </div>
            <div className="space-y-3">
              <div className="text-xs text-slate-500 uppercase tracking-wider">示例</div>
              {[{ tag: 'GET', code: '/api/icon?url=github.com&size=128' }, { tag: 'HTML', code: '<img src="/api/icon?url=github.com" />' }, { tag: 'JS', code: 'const url = `/api/icon?url=${domain}`;' }].map(item => (<div key={item.tag} className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden"><div className="flex items-center gap-2 px-4 py-2 border-b border-white/5"><span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs rounded font-medium">{item.tag}</span></div><pre className="p-4 font-mono text-sm overflow-x-auto text-slate-300">{item.code}</pre></div>))}</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/5">
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-4 text-center"><div className="text-2xl font-bold text-white mb-1">{stats !== null ? formatNumber(stats) : '-'}</div><div className="text-xs text-slate-400">服务次数</div></div>
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 text-center"><div className="text-2xl font-bold text-white mb-1">6</div><div className="text-xs text-slate-500">支持尺寸</div></div>
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 text-center"><div className="text-2xl font-bold text-white mb-1">5+</div><div className="text-xs text-slate-500">数据源</div></div>
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 text-center"><div className="text-2xl font-bold text-white mb-1">CDN</div><div className="text-xs text-slate-500">全球加速</div></div>
          </div>
        </div>
        <footer className="border-t border-white/5 py-6"><div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-sm text-slate-500"><span>大鲸图标</span><span>Powered by Cloudflare</span></div></footer>
      </div>
    </main>
  )
}