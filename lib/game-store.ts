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

export type GameResult = {
  meta: {
    host: string
    service?: string | null
    proto?: "tcp" | "udp"
    ipv6?: boolean
    dnssecValidated?: boolean
    endpoints: { target: string; port: number; priority?: number; weight?: number }[]
    ns?: string[]
    edgeProviders?: string[]
  }
  points: {
    edge: { ok: boolean; note: string }
    originIp: { ok: boolean; note: string }
    ipv6: { ok: boolean; note: string }
    dnssec: { ok: boolean; note: string }
    caching: { ok: boolean; note: string }
    ratelimit: { ok: boolean; note: string }
    h3: { ok: boolean; note: string }
  }
  notes?: string[]
}

type GameEntry = { id: string; host: string; result: GameResult; createdAt: number; ttlMs: number }

const memByHost = new Map<string, GameEntry>()
const memById = new Map<string, GameEntry>()

const now = () => Date.now()
const TTL_MS = 5 * 60 * 1000

export async function saveGameResult(host: string, result: GameResult, id?: string, ttlMs = TTL_MS) {
  const uid = id || crypto.randomUUID()
  const entry: GameEntry = { id: uid, host, result, createdAt: now(), ttlMs }
  memByHost.set(host, entry)
  memById.set(uid, entry)

  // Persist (best-effort)
  insertScan(uid, host, result).catch(() => {})
  const k = await getKV()
  if (k) {
    try {
      await k.set(`gamehost:${host}`, entry, { ex: Math.ceil(ttlMs / 1000) })
      await k.set(`gameid:${uid}`, entry, { ex: Math.ceil(ttlMs / 1000) })
    } catch {}
  }
  return entry
}

export async function getGameByHost(host: string): Promise<GameEntry | null> {
  const k = await getKV()
  if (k) {
    try {
      const e = (await k.get(`gamehost:${host}`)) as GameEntry | null
      if (e) return e
    } catch {}
  }
  const e = memByHost.get(host)
  if (!e) return null
  if (now() - e.createdAt > e.ttlMs) {
    memByHost.delete(host)
    memById.delete(e.id)
    return null
  }
  return e
}

export async function getGameById(id: string): Promise<GameEntry | null> {
  const k = await getKV()
  if (k) {
    try {
      const e = (await k.get(`gameid:${id}`)) as GameEntry | null
      if (e) return e
    } catch {}
  }
  const e = memById.get(id)
  if (!e) return null
  if (now() - e.createdAt > e.ttlMs) {
    memByHost.delete(e.host)
    memById.delete(id)
    return null
  }
  return e
}
