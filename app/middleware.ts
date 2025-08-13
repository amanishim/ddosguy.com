import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // 1) Strict Transport Security (enforce HTTPS for 2 years)
  // Note: Only effective over HTTPS. 'preload' opts you into the Chrome preload list (submit separately).
  res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")

  // 2) Content Security Policy (balanced for Next.js + styled-jsx)
  // Adjust if you add external resources. This version keeps things working without nonces.
  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "font-src 'self' data:",
    "img-src 'self' data: blob: https:",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "connect-src 'self' https://dns.google https://ip-api.com",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ")
  res.headers.set("Content-Security-Policy", csp)

  // 3) Additional hardening
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  res.headers.set("X-Frame-Options", "DENY") // legacy header; CSP frame-ancestors supersedes but keep for older UAs
  res.headers.set("X-Content-Type-Options", "nosniff")
  res.headers.set("X-DNS-Prefetch-Control", "off")
  res.headers.set("Cross-Origin-Opener-Policy", "same-origin")
  res.headers.set(
    "Permissions-Policy",
    // Disallow powerful features we don't use. Add others as needed.
    "accelerometer=(), autoplay=(), camera=(), encrypted-media=(), fullscreen=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), usb=()"
  )

  return res
}

// Apply to the whole app (pages, API, static)
export const config = {
  matcher: "/:path*",
}
