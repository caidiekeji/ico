export const runtime = 'edge'

declare global { interface Env { STATS_KV?: KVNamespace } }

let memoryCounter = 0

async function incrementCounter(env: Env): Promise<number> {
  if (env.STATS_KV) {
    try {
      const count = await env.STATS_KV.get('request_count', 'json') as number | null
      const newCount = (count || 0) + 1
      await env.STATS_KV.put('request_count', JSON.stringify(newCount))
      return newCount
    } catch { memoryCounter++; return memoryCounter }
  }
  memoryCounter++; return memoryCounter
}

interface IconSource { url: string; priority: number }

async function fetchIcon(url: string): Promise<Response | null> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Accept': 'image/*,*/*;q=0.8' },
      redirect: 'follow',
    })
    clearTimeout(timeoutId)
    if (response.ok) {
      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('image') || contentType.includes('octet-stream')) return response
    }
    return null
  } catch { return null }
}

function getIconSources(domain: string, size: number): IconSource[] {
  return [
    { url: `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`, priority: 1 },
    { url: `https://favicon.im/${domain}?larger=true`, priority: 2 },
    { url: `https://icons.duckduckgo.com/ip3/${domain}.ico`, priority: 3 },
    { url: `https://icon.horse/icon/${domain}`, priority: 4 },
    { url: `https://${domain}/favicon.ico`, priority: 5 },
  ].sort((a, b) => a.priority - b.priority)
}

async function fetchWithFallback(sources: IconSource[]): Promise<Response | null> {
  for (const source of sources) {
    const response = await fetchIcon(source.url)
    if (response) return response
  }
  return null
}

function generateDefaultIcon(size: number): ArrayBuffer {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="#6366f1" rx="${size * 0.15}"/><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" fill="white" font-family="Arial" font-size="${size * 0.5}" font-weight="bold">?</text></svg>`
  return new TextEncoder().encode(svg).buffer
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const domain = url.searchParams.get('url')
  const sizeParam = url.searchParams.get('size')
  const size = Math.min(Math.max(parseInt(sizeParam || '64', 10), 16), 512)
  const env = (request as any).env as Env
  
  if (!domain) return new Response(JSON.stringify({ error: '缺少 url 参数' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
  
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].trim()
  if (!cleanDomain || !/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/.test(cleanDomain)) {
    return new Response(JSON.stringify({ error: '无效的域名' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
  }
  
  incrementCounter(env)
  const sources = getIconSources(cleanDomain, size)
  const response = await fetchWithFallback(sources)
  
  if (response) {
    const imageData = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/png'
    return new Response(imageData, { status: 200, headers: { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=86400', 'Access-Control-Allow-Origin': '*' } })
  }
  
  return new Response(generateDefaultIcon(size), { status: 200, headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=3600', 'Access-Control-Allow-Origin': '*' } })
}