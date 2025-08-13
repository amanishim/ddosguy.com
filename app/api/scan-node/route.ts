import { NextResponse } from "next/server"
import { incrementScanCount } from "@/lib/metrics"

function normalize(input: string): { host: string; fullUrl: string } | null {
  const raw = input.trim()
  if (!raw) return null
  try {
    const asUrl = new URL(raw.match(/^https?:\/\//i) ? raw : `https://${raw}`)
    const host = asUrl.hostname
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(host)) return null
    return { host: host.toLowerCase(), fullUrl: `https://${host}` }
  } catch {
    if (/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(raw)) {
      const host = raw.toLowerCase()
      return { host, fullUrl: `https://${host}` }
    }
    return null
  }
}

async function withTimeout<T>(p: Promise<T>, ms: number, label = "request"): Promise<T> {
  return await Promise.race([
    p,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error(`${label} timed out`)), ms)),
  ])
}

type DnsAnswer = { name: string; type: number; TTL: number; data: string }
type DnsResponse = { Status: number; Answer?: DnsAnswer[] }

/**
 * Minimal A-record lookup using DNS-over-HTTPS (Google).
 * Returns first IPv4 address string or null.
 */
async function lookupARecord(host: string): Promise<string | null> {
  const url = `https://dns.google/resolve?name=${encodeURIComponent(host)}&type=A`
  try {
    const res = await withTimeout(fetch(url, { headers: { accept: "application/dns-json" } }), 6000, "DNS A")
    if (!res.ok) return null
    const j = (await res.json()) as DnsResponse
    const firstA = (j.Answer || []).find(a => a.type === 1)?.data
    return firstA || null
  } catch {
    return null
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const urlParam = searchParams.get("url")
  if (!urlParam) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
  }

  const parsed = normalize(urlParam)
  if (!parsed) {
    return NextResponse.json({ error: "Please provide a valid domain like example.com" }, { status: 400 })
  }

  const { host, fullUrl } = parsed
  await incrementScanCount()

  try {
    // Check 1: Direct IP Exposure (DoH-based lookup)
    const address = await lookupARecord(host)
    const isIpExposed = Boolean(address)

    // Check 2: Exposed Server Header (HTTP HEAD)
    let serverHeader = ""
    let cfRay = ""
    let sucuriId = ""
    try {
      const headRes = await fetch(fullUrl, {
        method: "HEAD",
        redirect: "follow",
        // @ts-expect-error AbortSignal.timeout is available in Node 18+
        signal: AbortSignal.timeout?.(6000),
      })
      serverHeader = headRes.headers.get("server") || ""
      cfRay = headRes.headers.get("cf-ray") || ""
      sucuriId = headRes.headers.get("x-sucuri-id") || ""
    } catch {
      // leave as empty if HEAD fails
    }
    const isServerHeaderExposed = Boolean(serverHeader)

    // Check 3: Missing WAF (simple header heuristic)
    const isWafMissing = !cfRay && !sucuriId

    const results = {
      ip_exposed: {
        vulnerable: isIpExposed,
        details: isIpExposed
          ? `Server IP appears to be ${address}. A direct IP makes network-level (L3/L4) attacks like UDP floods much easier.`
          : "We couldn't resolve a direct IPv4 address via DNS lookup here.",
      },
      server_header: {
        vulnerable: isServerHeaderExposed,
        details: isServerHeaderExposed
          ? `Server is publicly announcing its software: "${serverHeader}". This helps attackers find known exploits.`
          : "Server software is hidden. Good job!",
      },
      waf: {
        vulnerable: isWafMissing,
        details: isWafMissing
          ? "Could not detect a common Web Application Firewall (WAF) via headers. This may leave you open to application-level (L7) attacks."
          : "A WAF header fingerprint was detected. This is a great first line of defense!",
      },
    }

    return NextResponse.json(results, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to scan URL. It might be offline or invalid." },
      { status: 500 }
    )
  }
}
