import { type NextRequest, NextResponse } from "next/server"
import { getByHost, saveResult, rateLimit } from "@/lib/scanner-store"
import { incrementScanCount } from "@/lib/metrics"

export async function POST(request: NextRequest) {
  try {
    const { host } = await request.json()

    if (!host) {
      return NextResponse.json({ error: "Host is required" }, { status: 400 })
    }

    // Get client IP for rate limiting
    const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1"

    // Check rate limit
    const rateLimitResult = await rateLimit(clientIP)
    if (!rateLimitResult.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 })
    }

    // Clean the host
    const cleanHost = host.replace(/^https?:\/\//, "").replace(/\/$/, "")

    // Check cache first
    const cached = await getByHost(cleanHost)
    if (cached) {
      return NextResponse.json({
        id: cached.id,
        host: cached.host,
        result: cached.result,
        cached: true,
        success: true,
      })
    }

    // Simulate scanning process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock scan results
    const mockResult = {
      waf: {
        vulnerable: Math.random() > 0.7,
        details:
          Math.random() > 0.7
            ? "No Web Application Firewall detected. Consider using Cloudflare or AWS WAF."
            : "WAF protection detected and properly configured.",
      },
      ip_exposed: {
        vulnerable: Math.random() > 0.6,
        details:
          Math.random() > 0.6
            ? "Origin server IP may be exposed. Use a CDN to hide your real server IP."
            : "Origin IP is properly hidden behind CDN protection.",
      },
      server_header: {
        vulnerable: Math.random() > 0.8,
        details:
          Math.random() > 0.8
            ? "Server information is exposed in headers. Consider hiding server details."
            : "Server information is properly hidden from headers.",
      },
      meta: {
        host: cleanHost,
        ipv6: Math.random() > 0.5,
        edgeProviders: Math.random() > 0.4 ? ["Cloudflare"] : [],
        dnssecValidated: Math.random() > 0.3,
        headers: {
          server: Math.random() > 0.8 ? "nginx/1.18.0" : "hidden",
          "x-powered-by": Math.random() > 0.9 ? "PHP/7.4.0" : "hidden",
        },
        subdomains: ["www", "api", "cdn"].filter(() => Math.random() > 0.6),
        asnHints: ["AS13335 Cloudflare"],
        httpsRedirect: Math.random() > 0.2,
        hsts: Math.random() > 0.4 ? "max-age=31536000" : "",
      },
    }

    // Save result and increment counter
    const saved = await saveResult(cleanHost, mockResult)
    incrementScanCount()

    return NextResponse.json({
      id: saved.id,
      host: saved.host,
      result: saved.result,
      cached: false,
      success: true,
    })
  } catch (error) {
    console.error("Scan error:", error)
    return NextResponse.json({ error: "Failed to perform scan" }, { status: 500 })
  }
}
