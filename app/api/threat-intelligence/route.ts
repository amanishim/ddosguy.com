import { NextResponse } from "next/server"
import { runThreatIntelligenceCheck } from "@/lib/threat-intelligence"
import { rateLimit } from "@/lib/scanner-store"

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const domainParam = searchParams.get("domain")
  const industry = searchParams.get("industry") || "general"

  if (!domainParam) {
    return NextResponse.json({ error: "Missing domain parameter" }, { status: 400 })
  }

  const domain = normalizeHost(domainParam)
  if (!domain) {
    return NextResponse.json({ error: "Please provide a valid domain like example.com" }, { status: 400 })
  }

  // Rate limit
  const ip = (request.headers.get("x-forwarded-for") || "local").split(",")[0].trim()
  const rl = await rateLimit(ip, 5, 10 * 60 * 1000) // 5 requests per 10 minutes for threat intelligence
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Threat intelligence checks are limited to 5 per 10 minutes." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.retryAfterMs || 60000) / 1000)) } },
    )
  }

  try {
    const threatIntelligence = await runThreatIntelligenceCheck(domain, industry)
    return NextResponse.json(threatIntelligence)
  } catch (error: any) {
    console.error("Threat intelligence check failed:", error)
    return NextResponse.json({ error: error?.message || "Threat intelligence check failed" }, { status: 500 })
  }
}
