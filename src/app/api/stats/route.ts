export const runtime = 'edge'

declare global { interface Env { STATS_KV?: KVNamespace } }

let memoryCounter = 0

export async function GET(request: Request) {
  const env = (request as any).env as Env
  let count = 0
  if (env.STATS_KV) {
    try {
      const stored = await env.STATS_KV.get('request_count', 'json') as number | null
      count = stored || 0
    } catch { count = memoryCounter }
  } else { count = memoryCounter }
  return new Response(JSON.stringify({ count }), { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=60' } })
}