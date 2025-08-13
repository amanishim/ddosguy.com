import { NextResponse } from "next/server"
import { getByHost, saveResult, rateLimit, type ScanResult } from "@/lib/scanner-store"
import { incrementScanCount } from "@/lib/metrics"

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

async function fetchDNS(name: string, type: "NS" | "A" | "AAAA" | "CNAME"): Promise<DnsResponse> {
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
    for (const { match, label } of catalog) {
      if (match.test(nsName)) found.add(label)
    }
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
  for (const t of targets) {
    for (const { match, label } of catalog) {
      if (match.test(t)) found.add(label)
    }
  }
  return Array.from(found)
}

async function resolveCNAMEChain(host: string, maxDepth = 5): Promise<string[]> {
  const targets: string[] = []
  let current = host
  for (let i = 0; i < maxDepth; i++) {
    const res = await fetchDNS(current, "CNAME")
    const cname = (res.Answer || []).find(a => a.type === 5)?.data?.replace(/\.$/, "")
    if (!cname) break
    targets.push(cname)
    current = cname
  }
  return targets
}

function formatIpList(ips: string[], limit = 3) {
  const shown = ips.slice(0, limit).join(", ")
  const extra = ips.length > limit ? ` (+${ips.length - limit} more)` : ""
  return shown + extra
}

function isKnownProviderIp(ips: string[]): boolean {
  const known = new Set<string>([
    "76.76.21.21", // Vercel apex A
  ])
  return ips.length > 0 && ips.every(ip => known.has(ip))
}

async function enrichASN(ips: string[]): Promise<string[]> {
  const hints = new Set<string>()
  const sample = ips.slice(0, 4)
  for (const ip of sample) {
    try {
      const r = await withTimeout(fetch(`http://ip-api.com/json/${ip}?fields=as,org,query,status`), 5000, "ASN")
      if (!r.ok) continue
      const j = await r.json() as { status: string; as?: string; org?: string }
      if (j.status === "success" && (j.as || j.org)) {
        const s = [j.as, j.org].filter(Boolean).join(" ")
        if (s) hints.add(s)
      }
    } catch {}
  }
  return Array.from(hints)
}

async function checkHeaders(host: string) {
  const headersOut: Record<string, string> = {}
  let serverHeader = ""
  let powered = ""
  let hsts = ""
  let csp = ""
  let refpol = ""
  let altsvc = ""
  let httpsRedirect = false
  try {
    // HTTPS first
    const https = await withTimeout(fetch(`https://${host}`, { method: "HEAD", redirect: "follow" }), 6000, "HTTPS HEAD")
    serverHeader = https.headers.get("server") || ""
    powered = https.headers.get("x-powered-by") || ""
    hsts = https.headers.get("strict-transport-security") || ""
    csp = https.headers.get("content-security-policy") || ""
    refpol = https.headers.get("referrer-policy") || ""
    altsvc = https.headers.get("alt-svc") || ""
    https.headers.forEach((v, k) => { headersOut[k] = v })
  } catch {}
  try {
    // Check if HTTP redirects to HTTPS (don’t follow)
    const http = await withTimeout(fetch(`http://${host}`, { method: "HEAD", redirect: "manual" }), 6000, "HTTP HEAD")
    const loc = http.headers.get("location") || ""
    httpsRedirect = loc.startsWith("https://")
  } catch {}
  // Version leak heuristic
  const versionLeak = /\/\d|[0-9]+\.[0-9]+/.test(serverHeader) || /[0-9]+\.[0-9]+/.test(powered)
  const vulnerable = versionLeak
  const bits: string[] = []
  if (serverHeader) bits.push(`Server: "${serverHeader}"`)
  if (powered) bits.push(`X-Powered-By: "${powered}"`)
  if (hsts) bits.push("HSTS enabled" + (/\bpreload\b/i.test(hsts) ? " (preload)" : ""))
  if (csp) bits.push("CSP present")
  if (refpol) bits.push(`Referrer-Policy: "${refpol}"`)
  if (altsvc) bits.push("HTTP/2 or HTTP/3 hints present")
  if (!bits.length) bits.push("No conspicuous server headers observed.")
  return { vulnerable, details: bits.join(" • "), headersOut, httpsRedirect, hsts }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const urlParam = searchParams.get("url")
  if (!urlParam) return NextResponse.json({ error: "Missing url parameter" }, { status: 400 })
  const host = normalizeHost(urlParam)
  if (!host) return NextResponse.json({ error: "Please provide a valid domain like example.com" }, { status: 400 })

  // rate limit
  const ip = (request.headers.get("x-forwarded-for") || "local").split(",")[0].trim()
  const rl = await rateLimit(ip)
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429, headers: { "Retry-After": String(Math.ceil((rl.retryAfterMs || 60000) / 1000)) } })
  }
  await incrementScanCount()

  // cache
  const cached = await getByHost(host)
  if (cached) {
    return NextResponse.json({ id: cached.id, result: cached.result })
  }

  try {
    // DNS across common subdomains
    const subdomains = ["@", "www", "app", "api", "admin", "origin"]
    const fqdn = (label: string) => (label === "@" ? host : `${label}.${host}`)

    const dnsPromises = subdomains.map(async (label) => {
      const name = fqdn(label)
      const [nsResp, aResp, aaaaResp, cnameResp] = await Promise.allSettled([
        label === "@"
          ? fetchDNS(host, "NS")
          : Promise.resolve({ status: 200, Answer: [] } as any),
        fetchDNS(name, "A"),
        fetchDNS(name, "AAAA"),
        fetchDNS(name, "CNAME"),
      ])
      const nsRecords =
        label === "@" && nsResp.status === "fulfilled" ? (nsResp.value.Answer || []).map(a => a.data.replace(/\.$/, "")) : []
      const A =
        aResp.status === "fulfilled" ? (aResp.value.Answer || []).filter(a => a.type === 1).map(a => a.data) : []
      const AAAA =
        aaaaResp.status === "fulfilled" ? (aaaaResp.value.Answer || []).filter(a => a.type === 28).map(a => a.data) : []
      const cnameTargets: string[] =
        cnameResp.status === "fulfilled" ? (cnameResp.value.Answer || []).filter(a => a.type === 5).map(a => a.data.replace(/\.$/, "")) : []
      const cnameChain = await resolveCNAMEChain(name)
      const edges = Array.from(new Set([
        ...detectEdgeProvidersFromNS(nsRecords),
        ...detectEdgeProvidersFromCNAME([...cnameTargets, ...cnameChain]),
      ]))
      return { label, name, nsRecords, A, AAAA, edges }
    })

    const dnsAll = await Promise.all(dnsPromises)
    const allNs = dnsAll.find(d => d.label === "@")?.nsRecords || []
    const allA = Array.from(new Set(dnsAll.flatMap(d => d.A)))
    const allAAAA = Array.from(new Set(dnsAll.flatMap(d => d.AAAA)))
    const ipv6 = allAAAA.length > 0
    const edges = Array.from(new Set(dnsAll.flatMap(d => d.edges)))

    const knownProvider = isKnownProviderIp(allA)
    const hasEdge = edges.length > 0

    // DNSSEC hint from apex NS query
    let dnssecValidated = false
    try {
      const nsResp = await fetchDNS(host, "NS")
      dnssecValidated = Boolean((nsResp as any).AD)
    } catch {}

    // ASN enrichment
    const asnHints = await enrichASN(allA)

    // Compute checks
    let waf = hasEdge
      ? {
          vulnerable: false,
          details: edges.length === 1
            ? `We detected a protective edge via DNS: ${edges[0]}.`
            : `We detected protective edge providers: ${edges.join(", ")}.`,
        }
      : {
          vulnerable: true,
          details: allNs.length
            ? "We didn't detect a protective edge (WAF/CDN) in DNS. Consider adding one in front of your origin."
            : "We couldn't read your nameservers. If you're not using a WAF/CDN, consider adding one.",
        }

    let ip_exposed = !hasEdge
      ? allA.length > 0
        ? {
            vulnerable: !knownProvider,
            details: !knownProvider
              ? `Your DNS points directly to ${allA.length} public IPv4${allA.length > 1 ? "s" : ""} (e.g., ${formatIpList(allA)}). ${asnHints.length ? `ASN hints: ${asnHints.join(", ")}.` : ""} This can make you a direct target for floods.${ipv6 ? " IPv6 records also present." : ""}`
              : `Your DNS points to a provider edge. The visible IP${allA.length > 1 ? "s are" : " is"} managed by your hosting platform, not your origin server.`,
          }
        : {
            vulnerable: false,
            details: `We didn't find direct A records on common hostnames. If you use a provider CNAME, your origin may be hidden.${ipv6 ? " IPv6 present via AAAA." : ""}`,
          }
      : {
          vulnerable: false,
          details: `You're using a protective edge. Public DNS is less likely to expose your origin.${ipv6 ? " IPv6 present via provider." : ""}`,
      }

    // HTTP headers + TLS posture (apex)
    const headerCheck = await checkHeaders(host)
    const hasEdgeHeader = Boolean((headerCheck.headersOut || {})["x-vercel-id"])
    if (hasEdgeHeader && waf.vulnerable) {
      waf = {
        vulnerable: false,
        details: "We detected a protective edge via response headers.",
      }
    }
    if (hasEdgeHeader && ip_exposed.vulnerable) {
      ip_exposed = {
        vulnerable: false,
        details: "Your site appears to be served through a provider edge; the origin IP is not directly exposed in public DNS.",
      }
    }

    const server_header = {
      vulnerable: headerCheck.vulnerable,
      details:
        (headerCheck.details || "No noteworthy server headers observed.") +
        (typeof headerCheck.httpsRedirect === "boolean" ? (headerCheck.httpsRedirect ? " • HTTP redirects to HTTPS." : " • HTTP does not automatically redirect to HTTPS.") : "") +
        (headerCheck.hsts ? "" : " • No HSTS seen."),
    }

    const result: ScanResult = {
      waf,
      ip_exposed,
      server_header,
      meta: {
        host,
        ipv6,
        edgeProviders: edges,
        dnssecValidated,
        headers: headerCheck.headersOut,
        subdomains: dnsAll.map(d => d.label),
        asnHints,
        httpsRedirect: headerCheck.httpsRedirect,
        hsts: headerCheck.hsts,
      },
    }

    const saved = await saveResult(host, result)
    return NextResponse.json({ id: saved.id, result })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Scan failed" }, { status: 500 })
  }
}
