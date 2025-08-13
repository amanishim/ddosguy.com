let kvInstance: any | null = null
let kvReady = false

async function getKV() {
  if (kvReady) return kvInstance
  kvReady = true
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const { Redis } = await import("@upstash/redis")
      kvInstance = new (Redis as any)({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN })
    } else {
      kvInstance = undefined
    }
  } catch {
    kvInstance = undefined
  }
  return kvInstance
}

const memCounts = new Map<string, number>() // YYYY-MM-DD -> count
let memTotal = 0

function dayKey(date = new Date()): string {
  const d = new Date(date)
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, "0")
  const dd = String(d.getUTCDate()).padStart(2, "0")
  return `${y}-${m}-${dd}`
}

function lastNDays(n: number): string[] {
  const keys: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setUTCDate(d.getUTCDate() - i)
    keys.push(dayKey(d))
  }
  return keys
}

export async function incrementScanCount() {
  const key = `scan_count:${dayKey()}`
  const kv = await getKV()
  if (kv) {
    try {
      await kv.incr(key)
      await kv.expire(key, 8 * 24 * 60 * 60) // keep a rolling week
      await kv.incr("scan_total")
      return
    } catch {
      // fall back to memory
    }
  }
  memCounts.set(dayKey(), (memCounts.get(dayKey()) || 0) + 1)
  memTotal += 1
}

export async function getWeeklyBreakdown() {
  const kv = await getKV()
  const days = lastNDays(7)
  const byDay = []
  for (const d of days) {
    let count = 0
    if (kv) {
      try {
        const v = await kv.get<number>(`scan_count:${d}`)
        count = typeof v === "number" ? v : 0
      } catch {
        count = 0
      }
    } else {
      count = memCounts.get(d) || 0
    }
    byDay.push({ date: d, count })
  }
  const total = byDay.reduce((s, x) => s + x.count, 0)
  return { total, byDay }
}

export async function getTotalCount() {
  const kv = await getKV()
  if (kv) {
    try {
      const v = await kv.get<number>("scan_total")
      return typeof v === "number" ? v : 0
    } catch {
      // ignore
    }
  }
  return memTotal
}
