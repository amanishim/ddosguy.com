export interface ScanResult {
  waf: {
    vulnerable: boolean
    details: string
  }
  ip_exposed: {
    vulnerable: boolean
    details: string
  }
  server_header: {
    vulnerable: boolean
    details: string
  }
  meta: {
    host: string
    ipv6: boolean
    edgeProviders: string[]
    dnssecValidated: boolean
    headers: Record<string, string>
    subdomains: string[]
    asnHints: string[]
    httpsRedirect: boolean
    hsts: string
  }
}

export interface CachedScan {
  id: string
  host: string
  result: ScanResult
  timestamp: number
}

// Simple in-memory cache (in production, use a database)
const scanCache = new Map<string, CachedScan>()
const scanById = new Map<string, CachedScan>()
const rateLimitCache = new Map<string, { count: number; resetTime: number }>()

export async function getByHost(host: string): Promise<CachedScan | null> {
  const cached = scanCache.get(host)
  if (!cached) return null

  // Cache for 1 hour
  if (Date.now() - cached.timestamp > 3600000) {
    scanCache.delete(host)
    scanById.delete(cached.id)
    return null
  }

  return cached
}

export async function getById(id: string): Promise<CachedScan | null> {
  const cached = scanById.get(id)
  if (!cached) return null

  // Cache for 1 hour
  if (Date.now() - cached.timestamp > 3600000) {
    scanCache.delete(cached.host)
    scanById.delete(id)
    return null
  }

  return cached
}

export async function saveResult(host: string, result: ScanResult): Promise<CachedScan> {
  const cached: CachedScan = {
    id: `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    host,
    result,
    timestamp: Date.now(),
  }

  scanCache.set(host, cached)
  scanById.set(cached.id, cached)
  return cached
}

export async function rateLimit(ip: string): Promise<{ allowed: boolean; retryAfterMs?: number }> {
  const now = Date.now()
  const key = ip
  const limit = rateLimitCache.get(key)

  if (!limit || now > limit.resetTime) {
    // Reset or create new limit (10 requests per hour)
    rateLimitCache.set(key, { count: 1, resetTime: now + 3600000 })
    return { allowed: true }
  }

  if (limit.count >= 10) {
    return { allowed: false, retryAfterMs: limit.resetTime - now }
  }

  limit.count++
  return { allowed: true }
}
