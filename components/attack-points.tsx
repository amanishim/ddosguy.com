"use client"

type CheckResult = { vulnerable: boolean; details: string }
type ScanMeta = {
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

type Props = {
  result: {
    waf: CheckResult
    ip_exposed: CheckResult
    server_header: CheckResult
    meta?: ScanMeta
  }
}

function point(status: "good" | "warn" | "bad", title: string, desc: string) {
  const color =
    status === "good" ? "text-green-700" : status === "bad" ? "text-red-700" : "text-amber-700"
  const badge =
    status === "good" ? "✅" : status === "bad" ? "❗️" : "⚠️"
  return { color, badge, title, desc }
}

export default function AttackPoints({ result }: Props) {
  const m = result.meta || {}
  const headers = Object.fromEntries(
    Object.entries(m.headers || {}).map(([k, v]) => [k.toLowerCase(), v])
  )

  // 1) Edge/WAF coverage
  const hasEdge = (m.edgeProviders && m.edgeProviders.length > 0) || Boolean(headers["x-vercel-id"])
  const edgePoint =
    hasEdge
      ? point("good", "Edge/WAF", `Protective edge detected${m.edgeProviders?.length ? ` (${m.edgeProviders.join(", ")})` : ""}.`)
      : point("bad", "Edge/WAF missing", "No protective edge found in DNS/headers. Put a WAF/CDN in front of your origin to absorb floods.")

  // 2) Origin IP exposure
  const ipPoint =
    result.ip_exposed.vulnerable
      ? point("bad", "Origin IP visible", "Public DNS appears to point directly at your origin. Hide it behind an edge or Secure DNS.")
      : point("good", "Origin IP hidden", "We didn’t see a direct origin IP in public DNS.")

  // 3) IPv6 exposure (if not behind edge)
  const ipv6Point =
    m.ipv6 && !hasEdge
      ? point("warn", "IPv6 exposed", "AAAA records present without a protective edge. Ensure IPv6 goes through your edge/WAF too.")
      : point("good", "IPv6 posture", m.ipv6 ? "IPv6 present and likely safe behind your edge." : "No IPv6 records detected.")

  // 4) DNSSEC
  const dnssecPoint =
    m.dnssecValidated
      ? point("good", "DNSSEC", "DNSSEC appears validated at the resolver. Good integrity signal.")
      : point("warn", "DNSSEC not validated", "We didn’t see a DNSSEC validation flag. Consider enabling DNSSEC for integrity.")

  // 5) HTTPS posture (redirect + HSTS)
  const hasHttpsRedirect = m.httpsRedirect === true
  const hasHsts = !!m.hsts
  const httpsPoint =
    hasHttpsRedirect && hasHsts
      ? point("good", "HTTPS posture", "HTTP redirects to HTTPS and HSTS is present.")
      : !hasHttpsRedirect
        ? point("bad", "No HTTPS redirect", "HTTP didn’t redirect to HTTPS. Enforce HTTPS and add HSTS.")
        : point("warn", "No HSTS", "We didn’t see HSTS. Add Strict-Transport-Security to harden HTTPS.")

  // 6) CDN cache hints (helps with L7 absorption)
  const cacheHeaders = [
    headers["cf-cache-status"],
    headers["x-cache"],
    headers["x-cache-status"],
    headers["age"],
    headers["x-amz-cf-pop"],
  ].filter(Boolean)
  const cachePoint =
    hasEdge && cacheHeaders.length > 0
      ? point("good", "Caching hints", "CDN/cache headers detected. This helps absorb and smooth traffic spikes.")
      : point("warn", "Missing cache hints", "We didn’t see cache headers. Enable caching for static assets at your edge.")

  // 7) Rate‑limiting hints (best‑effort heuristic)
  const rateHeaders = Object.keys(headers).some(k => k.startsWith("x-ratelimit-")) || headers["retry-after"]
  const ratePoint =
    rateHeaders
      ? point("good", "Rate limiting signals", "Rate‑limit headers present (best‑effort).")
      : point("warn", "No rate‑limit signals", "We didn’t see rate‑limit headers. Add basic throttling for dynamic paths/APIs.")

  // 8) HTTP/3/QUIC hints (helps performance under stress)
  const altSvc = headers["alt-svc"] || ""
  const h3 = /\bh3\b/i.test(altSvc)
  const h3Point =
    h3
      ? point("good", "HTTP/3 hints", "Alt‑Svc indicates HTTP/3 support is available.")
      : point("warn", "No HTTP/3 hint", "We didn’t see HTTP/3 advertised. Consider enabling it at your edge.")

  const cards = [edgePoint, ipPoint, ipv6Point, dnssecPoint, httpsPoint, cachePoint, ratePoint, h3Point]

  return (
    <section aria-label="DDoS attack points" className="mt-8">
      <h3 className="font-heading text-3xl sm:text-4xl mb-4">{"Attack Points"}</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((c, i) => (
          <article key={i} className="doodle-border bg-white p-4">
            <div className={`text-lg font-semibold ${c.color}`}>{c.badge} {c.title}</div>
            <p className="mt-2 text-[color:var(--ink)]/80">{c.desc}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 doodle-border bg-[#FFFDF7] p-4">
        <p className="text-sm">
          {"Looking to hide your origin fast? Our Secure DNS partner "}
          <a href="https://callitdns.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold">
            {"callitdns.com"}
          </a>
          {" is launching soon. Use the “Use Secure DNS (Coming Soon)” button above to get notified."}
        </p>
      </div>

      <div className="mt-4 text-right">
        <a href="/guide/ddos-protection" className="doodle-btn bg-white">
          {"Open DDoS Protection Guide"}
        </a>
      </div>
    </section>
  )
}
