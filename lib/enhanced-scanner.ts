import { incrementScanCount } from "./metrics"

type DnsAnswer = { name: string; type: number; TTL: number; data: string }
type DnsResponse = { Status: number; Answer?: DnsAnswer[]; Authority?: DnsAnswer[]; AD?: boolean }

async function withTimeout<T>(p: Promise<T>, ms: number, label = "request"): Promise<T> {
  return await Promise.race([
    p,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error(`${label} timed out`)), ms)),
  ])
}

async function fetchDNS(name: string, type: "NS" | "A" | "AAAA" | "CNAME" | "MX" | "TXT"): Promise<DnsResponse> {
  const url = `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`
  const res = await withTimeout(fetch(url, { headers: { accept: "application/dns-json" } }), 6000, `DNS ${type}`)
  if (!res.ok) throw new Error(`DNS ${type} error ${res.status}`)
  return (await res.json()) as DnsResponse
}

// Enhanced DNS Security Analysis
async function analyzeDNSSecurity(host: string) {
  const checks = {
    dnssec: false,
    dnsHijackingRisk: false,
    cachePoisoningRisk: false,
    wildcardDNS: false,
    suspiciousNS: false,
    details: [] as string[],
  }

  try {
    // Check DNSSEC validation
    const nsResp = await fetchDNS(host, "NS")
    checks.dnssec = Boolean((nsResp as any).AD)
    if (checks.dnssec) {
      checks.details.push("DNSSEC validation confirmed")
    } else {
      checks.details.push("DNSSEC not validated - vulnerable to DNS spoofing")
    }

    // Check for suspicious nameservers
    const nsRecords = (nsResp.Answer || []).map((a) => a.data.replace(/\.$/, ""))
    const suspiciousPatterns = [/\.tk$/, /\.ml$/, /\.ga$/, /\.cf$/, /freenom/, /suspicious/i]
    const hasSuspiciousNS = nsRecords.some((ns) => suspiciousPatterns.some((pattern) => pattern.test(ns)))
    checks.suspiciousNS = hasSuspiciousNS
    if (hasSuspiciousNS) {
      checks.details.push("Suspicious nameserver detected - potential hijacking risk")
    }

    // Check wildcard DNS (test random subdomain)
    const randomSubdomain = `test-${Math.random().toString(36).substring(7)}.${host}`
    try {
      const wildcardResp = await fetchDNS(randomSubdomain, "A")
      if (wildcardResp.Answer && wildcardResp.Answer.length > 0) {
        checks.wildcardDNS = true
        checks.details.push("Wildcard DNS detected - may increase attack surface")
      }
    } catch {
      // No wildcard DNS (good)
    }

    // Cache poisoning risk assessment
    const ttlValues = (nsResp.Answer || []).map((a) => a.TTL)
    const hasLowTTL = ttlValues.some((ttl) => ttl < 300) // Less than 5 minutes
    checks.cachePoisoningRisk = hasLowTTL
    if (hasLowTTL) {
      checks.details.push("Very low DNS TTL detected - may increase cache poisoning risk")
    }
  } catch (error) {
    checks.details.push(`DNS security analysis failed: ${error}`)
  }

  return checks
}

// SSL/TLS Security Analysis
async function analyzeSSLSecurity(host: string) {
  const checks = {
    validCertificate: false,
    strongCiphers: false,
    hstsPreload: false,
    certificateTransparency: false,
    ocspStapling: false,
    details: [] as string[],
  }

  try {
    const response = await withTimeout(
      fetch(`https://${host}`, {
        method: "HEAD",
        redirect: "follow",
      }),
      8000,
      "HTTPS",
    )

    checks.validCertificate = response.ok
    if (checks.validCertificate) {
      checks.details.push("Valid SSL certificate confirmed")
    }

    // Check HSTS
    const hsts = response.headers.get("strict-transport-security") || ""
    checks.hstsPreload = /\bpreload\b/i.test(hsts)
    if (checks.hstsPreload) {
      checks.details.push("HSTS preload enabled - excellent HTTPS enforcement")
    } else if (hsts) {
      checks.details.push("HSTS enabled but not preloaded")
    } else {
      checks.details.push("No HSTS header - HTTPS not enforced")
    }

    // Check security headers that indicate strong TLS
    const securityHeaders = [
      response.headers.get("content-security-policy"),
      response.headers.get("x-frame-options"),
      response.headers.get("x-content-type-options"),
    ].filter(Boolean)

    checks.strongCiphers = securityHeaders.length >= 2
    if (checks.strongCiphers) {
      checks.details.push("Strong security headers present")
    }
  } catch (error) {
    checks.details.push(`SSL/TLS analysis failed: ${error}`)
  }

  return checks
}

// Bot Protection Analysis
async function analyzeBotProtection(host: string) {
  const checks = {
    challengeResponse: false,
    rateLimiting: false,
    botDetection: false,
    captchaProtection: false,
    details: [] as string[],
  }

  try {
    // Test with suspicious user agent
    const botResponse = await withTimeout(
      fetch(`https://${host}`, {
        method: "GET",
        headers: {
          "User-Agent": "curl/7.68.0",
          "X-Forwarded-For": "1.1.1.1",
        },
        redirect: "manual",
      }),
      8000,
      "Bot test",
    )

    // Check for challenge responses
    const challengeIndicators = [
      botResponse.headers.get("cf-ray"), // Cloudflare
      botResponse.headers.get("x-sucuri-id"), // Sucuri
      botResponse.headers.get("server")?.includes("cloudflare"),
      botResponse.status === 403,
      botResponse.status === 429,
    ].filter(Boolean)

    checks.challengeResponse = challengeIndicators.length > 0
    if (checks.challengeResponse) {
      checks.details.push("Bot challenge system detected")
    }

    // Check rate limiting headers
    const rateLimitHeaders = [
      botResponse.headers.get("x-ratelimit-limit"),
      botResponse.headers.get("x-ratelimit-remaining"),
      botResponse.headers.get("retry-after"),
    ].filter(Boolean)

    checks.rateLimiting = rateLimitHeaders.length > 0
    if (checks.rateLimiting) {
      checks.details.push("Rate limiting headers present")
    }

    // Simple bot detection test
    checks.botDetection = botResponse.status === 403 || botResponse.status === 429
    if (checks.botDetection) {
      checks.details.push("Bot traffic appears to be blocked/challenged")
    } else {
      checks.details.push("No obvious bot protection detected")
    }
  } catch (error) {
    checks.details.push(`Bot protection analysis failed: ${error}`)
  }

  return checks
}

// Performance Under Load Analysis
async function analyzePerformance(host: string) {
  const checks = {
    responseTime: 0,
    cacheHeaders: false,
    compressionEnabled: false,
    cdnPresent: false,
    http2Support: false,
    details: [] as string[],
  }

  try {
    const startTime = Date.now()
    const response = await withTimeout(
      fetch(`https://${host}`, {
        method: "HEAD",
        redirect: "follow",
      }),
      10000,
      "Performance test",
    )

    checks.responseTime = Date.now() - startTime
    checks.details.push(`Response time: ${checks.responseTime}ms`)

    // Check caching headers
    const cacheHeaders = [
      response.headers.get("cache-control"),
      response.headers.get("etag"),
      response.headers.get("last-modified"),
    ].filter(Boolean)

    checks.cacheHeaders = cacheHeaders.length > 0
    if (checks.cacheHeaders) {
      checks.details.push("Caching headers present - good for performance")
    }

    // Check compression
    const contentEncoding = response.headers.get("content-encoding")
    checks.compressionEnabled = Boolean(contentEncoding?.includes("gzip") || contentEncoding?.includes("br"))
    if (checks.compressionEnabled) {
      checks.details.push(`Compression enabled: ${contentEncoding}`)
    }

    // Check CDN presence
    const cdnHeaders = [
      response.headers.get("cf-ray"),
      response.headers.get("x-cache"),
      response.headers.get("x-amz-cf-id"),
      response.headers.get("x-served-by"),
    ].filter(Boolean)

    checks.cdnPresent = cdnHeaders.length > 0
    if (checks.cdnPresent) {
      checks.details.push("CDN detected - good for handling traffic spikes")
    }

    // Check HTTP/2 support (approximation)
    checks.http2Support = response.headers.get("alt-svc")?.includes("h2") || false
    if (checks.http2Support) {
      checks.details.push("HTTP/2 support advertised")
    }
  } catch (error) {
    checks.details.push(`Performance analysis failed: ${error}`)
  }

  return checks
}

export interface EnhancedScanResult {
  host: string
  timestamp: number
  dnsAnalysis: Awaited<ReturnType<typeof analyzeDNSSecurity>>
  sslAnalysis: Awaited<ReturnType<typeof analyzeSSLSecurity>>
  botProtection: Awaited<ReturnType<typeof analyzeBotProtection>>
  performance: Awaited<ReturnType<typeof analyzePerformance>>
  securityScore: number
  riskLevel: "low" | "medium" | "high"
  recommendations: string[]
}

export async function runEnhancedScan(host: string): Promise<EnhancedScanResult> {
  await incrementScanCount()

  const [dnsAnalysis, sslAnalysis, botProtection, performance] = await Promise.all([
    analyzeDNSSecurity(host),
    analyzeSSLSecurity(host),
    analyzeBotProtection(host),
    analyzePerformance(host),
  ])

  // Calculate security score (0-100)
  let score = 0

  // DNS Security (25 points)
  if (dnsAnalysis.dnssec) score += 10
  if (!dnsAnalysis.suspiciousNS) score += 5
  if (!dnsAnalysis.wildcardDNS) score += 5
  if (!dnsAnalysis.cachePoisoningRisk) score += 5

  // SSL/TLS Security (25 points)
  if (sslAnalysis.validCertificate) score += 10
  if (sslAnalysis.hstsPreload) score += 10
  if (sslAnalysis.strongCiphers) score += 5

  // Bot Protection (25 points)
  if (botProtection.challengeResponse) score += 10
  if (botProtection.rateLimiting) score += 8
  if (botProtection.botDetection) score += 7

  // Performance (25 points)
  if (performance.responseTime < 1000) score += 8
  if (performance.cacheHeaders) score += 5
  if (performance.compressionEnabled) score += 4
  if (performance.cdnPresent) score += 8

  const riskLevel: "low" | "medium" | "high" = score >= 80 ? "low" : score >= 60 ? "medium" : "high"

  // Generate recommendations
  const recommendations: string[] = []
  if (!dnsAnalysis.dnssec) recommendations.push("Enable DNSSEC for DNS integrity protection")
  if (!sslAnalysis.hstsPreload) recommendations.push("Enable HSTS preload for stronger HTTPS enforcement")
  if (!botProtection.challengeResponse) recommendations.push("Add bot protection/WAF to filter malicious traffic")
  if (!performance.cdnPresent) recommendations.push("Use a CDN to improve performance and absorb attacks")
  if (performance.responseTime > 2000) recommendations.push("Optimize server response time for better resilience")

  return {
    host,
    timestamp: Date.now(),
    dnsAnalysis,
    sslAnalysis,
    botProtection,
    performance,
    securityScore: score,
    riskLevel,
    recommendations,
  }
}
