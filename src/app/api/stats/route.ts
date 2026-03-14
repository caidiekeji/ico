export const runtime = 'edge'

interface KVNamespace {
  get(key: string, type?: 'text' | 'json' | 'arrayBuffer' | 'stream' | { type: 'text' | 'json' | 'arrayBuffer' | 'stream' }): Promise<string | null | any | ArrayBuffer | ReadableStream<Uint8Array>>
  put(key: string, value: string | ArrayBuffer | ArrayBufferView | ReadableStream<Uint8Array> | FormData, options?: { expiration?: number, expirationTtl?: number }): Promise<void>
  delete(key: string): Promise<void>
  list(options?: { prefix?: string, limit?: number, cursor?: string }): Promise<{ keys: Array<{ name: string, expiration?: number, metadata?: any }>, list_complete: boolean, cursor?: string }>
}

declare global {
  interface Env {
    STATS_KV?: KVNamespace
  }
}

let memoryCounter = 0

export async function GET(request: Request) {
  const env = (request as any).env as Env
  let count = 0
  
  if (env.STATS_KV) {
    try {
      const stored = await env.STATS_KV.get('request_count', 'json') as number | null
      count = stored || 0
    } catch {
      count = memoryCounter
    }
  } else {
    count = memoryCounter
  }
  
  return new Response(JSON.stringify({ count }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=60',
    }
  })
}