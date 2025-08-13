import { insertScan } from "./db"
// Optional Upstash KV for cache; falls back to in-memory
let kv: any = null
async function getKV() {
  if (kv !== null) return kv
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const { Redis } = await import("@upstash/redis")
      kv = new (Redis as any)({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
      })
    } else {
      kv = undefined
    }
  } catch {
    kv = undefined
  }
  return kv
}

type CheckResult = { vulnerable: boolean; details: string }
export type ScanResult = {
  waf: CheckResult
  ip_exposed: CheckResult
  server_header: CheckResult
  meta?: {
    host: string
    ipv6?: boolean
    edgeProviders?: string[]
    dnssecValidated?: boolean
    headers?: Record<string, string>
    subdomains?: string[]
    asnHints?: string[]
    httpsRedirect?: boolean
    hsts?: string
  }
}

type Entry = { id: string; host: string; result: ScanResult; createdAt: number; ttlMs: number }

const memByHost = new Map<string, Entry>()
const memById = new Map<string, Entry>()
const RATE = new Map<string, { tokens: number; resetAt: number }>() // in-memory fallback

const now = () => Date.now()
const TTL_MS = 5 * 60 * 1000

export async function saveResult(host: string, result: ScanResult, id?: string, ttlMs = TTL_MS) {
  const uid = id || crypto.randomUUID()
  const entry: Entry = { id: uid, host, result, createdAt: now(), ttlMs }
  memByHost.set(host, entry)
  memById.set(uid, entry)

  // Persist (best-effort)
  insertScan(uid, host, result).catch(() => {})
  const k = await getKV()
  if (k) {
    try {
      await k.set(`scanid:${uid}`, entry, { ex: Math.ceil(ttlMs / 1000) })
      await k.set(`scanhost:${host}`, entry, { ex: Math.ceil(ttlMs / 1000) })
    } catch {}
  }
  return entry
}

export async function getByHost(host: string): Promise<Entry | null> {
  const k = await getKV()
  if (k) {
    try {
      const e = (await k.get(`scanhost:${host}`)) as Entry | null
      if (e) return e
    } catch {}
  }
  const e = memByHost.get(host)
  if (!e) return null
  if (now() - e.createdAt > e.ttlMs) {
    memByHost.delete(host); memById.delete(e.id); return null
  }
  return e
}

export async function getById(id: string): Promise<Entry | null> {
  const k = await getKV()
  if (k) {
    try {
      const e = (await k.get(`scanid:${id}`)) as Entry | null
      if (e) return e
    } catch {}
  }
  const e = memById.get(id)
  if (!e) return null
  if (now() - e.createdAt > e.ttlMs) {
    memByHost.delete(e.host); memById.delete(id); return null
  }
  return e
}

export async function rateLimit(ip: string, limit = 20, windowMs = 10 * 60 * 1000) {
  const k = await getKV()
  const key = `rate:${ip}:${Math.floor(now() / windowMs)}`
  if (k) {
    try {
      const current = (await k.get<number>(key)) || 0
      if (current >= limit) return { allowed: false, remaining: 0, retryAfterMs: windowMs - (now() % windowMs) }
      await k.set(key, current + 1, { ex: Math.ceil(windowMs / 1000) })
      return { allowed: true, remaining: Math.max(0, limit - current - 1) }
    } catch {
      // fall through to memory
    }
  }
  const bucket = RATE.get(key)
  if (!bucket) {
    RATE.set(key, { tokens: limit - 1, resetAt: now() + windowMs })
    return { allowed: true, remaining: limit - 1 }
  }
  if (bucket.tokens <= 0) return { allowed: false, remaining: 0, retryAfterMs: bucket.resetAt - now() }
  bucket.tokens -= 1
  return { allowed: true, remaining: bucket.tokens }
}
