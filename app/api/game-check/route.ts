import { NextResponse } from "next/server"
import { incrementScanCount } from "@/lib/metrics"
import { saveGameResult, type GameResult } from "@/lib/game-store"
import { rateLimit } from "@/lib/scanner-store"

type DnsAnswer = { name: string; type: number; TTL: number; data: string }
type DnsResponse = { Status: number; Answer?: DnsAnswer[]; Authority?: DnsAnswer[]; AD?: boolean }

function normalizeHost(input: string): string | null {
  const raw = input.trim()
  if (!raw) return null
  try {
    const asUrl = new URL(raw.match(/^https?:\/\//) ? raw : `https://${raw}`)
    const host = asUrl.hostname
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(host)) return null
    return host.toLowerCase()
  } catch {
    if (/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(raw)) return raw.toLowerCase()
    return null
  }
}

async function withTimeout<T>(p: Promise<T>, ms: number, label = "request"): Promise<T> {
  return await Promise.race([
    p,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error(`${label} timed out`)), ms)),
  ])
}

async function fetchDNS(name: string, type: "NS" | "A" | "AAAA" | "CNAME" | "SRV"): Promise<DnsResponse> {
  const url = `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`
  const res = await withTimeout(fetch(url, { headers: { accept: "application/dns-json" } }), 6000, `DNS ${type}`)
  if (!res.ok) throw new Error(`DNS ${type} error ${res.status}`)
  return (await res.json()) as DnsResponse
}

function detectEdgeProvidersFromNS(ns: string[]): string[] {
  const catalog: { match: RegExp; label: string }[] = [
    { match: /cloudflare\.com\.?$/i, label: "Cloudflare" },
    { match: /sucuri\.net\.?$/i, label: "Sucuri" },
    { match: /incapdns\.net\.?$/i, label: "Imperva" },
    { match: /akam\.net\.?$/i, label: "Akamai" },
    { match: /fastly(dns)?\.net\.?$/i, label: "Fastly" },
    { match: /stackpath(dns)?\.com\.?$/i, label: "StackPath" },
    { match: /ddos-guard\.net\.?$/i, label: "DDoS-Guard" },
    { match: /vercel-dns\.com\.?$/i, label: "Vercel" },
  ]
  const found = new Set<string>()
  for (const nsName of ns) {
    for (const { match, label } of catalog) if (match.test(nsName)) found.add(label)
  }
  return Array.from(found)
}

function detectEdgeProvidersFromCNAME(targets: string[]): string[] {
  const catalog: { match: RegExp; label: string }[] = [
    { match: /cloudfront\.net\.?$/i, label: "Amazon CloudFront" },
    { match: /fastly\.net\.?$/i, label: "Fastly" },
    { match: /cdn\.cloudflare\.net\.?$/i, label: "Cloudflare CDN" },
    { match: /edgekey\.net\.?$/i, label: "Akamai" },
    { match: /edgesuite\.net\.?$/i, label: "Akamai" },
    { match: /impervadns\.net\.?$/i, label: "Imperva" },
    { match: /secureserver\.net\.?$/i, label: "GoDaddy CDN/WAF" },
    { match: /vercel-dns\.com\.?$/i, label: "Vercel" },
  ]
  const found = new Set<string>()
  for (const t of targets) for (const { match, label } of catalog) if (match.test(t)) found.add(label)
  return Array.from(found)
}

function parseSrvTxt(s: string) {
  const parts = s.trim().split(/\s+/)
  if (parts.length < 4) return null
  const [priority, weight, portStr, ...rest] = parts
  const target = rest.join(" ").replace(/\.$/, "")
  const port = parseInt(portStr, 10)
  return { priority: Number(priority), weight: Number(weight), port, target }
}

function defaultPortForService(service?: string | null, proto?: string | null) {
  const s = (service || "").toLowerCase()
  if (s === "minecraft") return 25565
  if (s === "valheim") return 2456
  if (s === "cs" || s === "csgo" || s === "cs2") return 27015
  if (s === "rust") return 28015
  return proto === "udp" ? 27015 : 25565
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const hostParam = searchParams.get("host")
  const service = (searchParams.get("service") || "").trim() || null
  const proto = ((searchParams.get("proto") || "tcp").toLowerCase() === "udp" ? "udp" : "tcp") as "tcp" | "udp"
  const portInput = searchParams.get("port")

  if (!hostParam) return NextResponse.json({ error: "Missing host" }, { status: 400 })
  const host = normalizeHost(hostParam)
  if (!host) return NextResponse.json({ error: "Please provide a valid domain like example.com" }, { status: 400 })

  // rate limit
  const ip = (request.headers.get("x-forwarded-for") || "local").split(",")[0].trim()
  const rl = await rateLimit(ip)
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429, headers: { "Retry-After": String(Math.ceil((rl.retryAfterMs || 60000) / 1000)) } })
  }

  await incrementScanCount()

  try {
    const nsResp = await fetchDNS(host, "NS")
    const nsRecords = (nsResp.Answer || []).map(a => a.data.replace(/\.$/, ""))
    const dnssecValidated = Boolean((nsResp as any).AD)

    const [aResp, aaaaResp] = await Promise.all([
      fetchDNS(host, "A").catch(() => ({ Answer: [] } as DnsResponse)),
      fetchDNS(host, "AAAA").catch(() => ({ Answer: [] } as DnsResponse)),
    ])
    const A = (aResp.Answer || []).filter(a => a.type === 1).map(a => a.data)
    const AAAA = (aaaaResp.Answer || []).filter(a => a.type === 28).map(a => a.data)
    const ipv6 = AAAA.length > 0

    let endpoints: { target: string; port: number; priority?: number; weight?: number }[] = []
    if (service) {
      const srvName = `_${service}._${proto}.${host}`
      const srvResp = await fetchDNS(srvName, "SRV").catch(() => ({ Answer: [] } as DnsResponse))
      const srv = (srvResp.Answer || [])
        .filter(a => a.type === 33)
        .map(a => parseSrvTxt(a.data))
        .filter(Boolean) as { target: string; port: number; priority?: number; weight?: number }[]
      endpoints = srv
    }
    const port = portInput ? Math.max(1, Math.min(65535, parseInt(portInput, 10) || 0)) : defaultPortForService(service, proto)
    if (!endpoints.length) {
      endpoints = [{ target: host, port }]
    }

    const edgeFromNS = detectEdgeProvidersFromNS(nsRecords)
    const cnameTargets = await Promise.all(
      Array.from(new Set(endpoints.map(e => e.target))).map(async (t) => {
        const c = await fetchDNS(t, "CNAME").catch(() => ({ Answer: [] } as DnsResponse))
        return (c.Answer || []).filter(a => a.type === 5).map(a => a.data.replace(/\.$/, ""))
      })
    )
    const edgeFromCNAME = detectEdgeProvidersFromCNAME(cnameTargets.flat())
    const edgeProviders = Array.from(new Set([...edgeFromNS, ...edgeFromCNAME]))
    const hasEdge = edgeProviders.length > 0

    const edge = hasEdge
      ? { ok: true, note: `Protective edge detected${edgeProviders.length ? ` (${edgeProviders.join(", ")})` : ""}.` }
      : { ok: false, note: "No edge/scrubbing detected in DNS. Consider a provider in front of your game entry nodes." }

    const originIp = hasEdge
      ? { ok: true, note: "DNS suggests traffic terminates at an edge. Keep origin IPs private and only reachable from scrubbing networks." }
      : A.length > 0
        ? { ok: false, note: `Public A record(s) found (e.g., ${A.slice(0, 3).join(", ")}). Avoid advertising origin IPs directly.` }
        : { ok: true, note: "We didn’t find obvious direct A records. If SRV targets are provider hostnames, you may be hidden." }

    const ipv6Point = ipv6
      ? hasEdge
        ? { ok: true, note: "IPv6 present and likely terminated at the edge. Ensure provider filtering covers IPv6." }
        : { ok: false, note: "AAAA records present without an edge. Ensure IPv6 is filtered or routed via your scrubbing provider." }
      : { ok: true, note: "No AAAA records detected. If you enable IPv6, route it through your edge." }

    const dnssec = dnssecValidated
      ? { ok: true, note: "Resolver indicated DNSSEC validation (AD). Good integrity signal." }
      : { ok: false, note: "No DNSSEC validation flag observed. Consider enabling DNSSEC for tamper‑resistance." }

    const caching = hasEdge
      ? { ok: true, note: "Enable caching for launcher/patcher assets at the edge to smooth spikes." }
      : { ok: false, note: "No edge detected. Caching at origin won’t absorb L7 spikes—use an edge/CDN for static assets." }

    const ratelimit = { ok: false, note: "Turn on basic rate limits for login, matchmaking, APIs, and admin endpoints." }
    const h3 = { ok: hasEdge, note: hasEdge ? "Consider enabling HTTP/3 for web/launcher endpoints to improve resilience." : "HTTP/3 applies to web/launcher endpoints behind an edge." }

    const result: GameResult = {
      meta: {
        host,
        service,
        proto,
        ipv6,
        dnssecValidated,
        endpoints,
        ns: nsRecords,
        edgeProviders,
      },
      points: { edge, originIp, ipv6: ipv6Point, dnssec, caching, ratelimit, h3 },
      notes: [
        "Don’t publish origin IPs; advertise only edge/scrubbing addresses.",
        "Allowlist traffic to game nodes from scrubbing/edge networks only.",
        "Keep an incident checklist ready (rate limits, temporary queues, degrade non‑essential features).",
      ],
    }

    const saved = await saveGameResult(host, result)
    return NextResponse.json({ id: saved.id, result }, { headers: { "cache-control": "no-store" } })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Game check failed" }, { status: 500 })
  }
}
